import prisma from '../db.js';
import { deleteMedia, normalizeExternalMediaUrl, uploadMedia } from '../services/mediaStorage.js';
import { syncProductReviewStats } from '../utils/productReviewStats.js';

const reviewUserInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true
    }
  }
};

const parseJsonArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch {
      return value.trim() ? [value.trim()] : [];
    }
  }

  return [];
};

const parsePositiveInteger = (value) => {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && /^\d+$/.test(value.trim())
      ? Number(value.trim())
      : Number.NaN;

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const parseRating = (value) => {
  const rating = parsePositiveInteger(value);
  return rating && rating <= 5 ? rating : null;
};

const parseExternalMediaUrls = (value) => parseJsonArray(value)
  .map((url) => normalizeExternalMediaUrl(url));

const getUploadedReviewFiles = (req) => [
  ...(req.files?.images || []),
  ...(req.files?.video || [])
];

const getStoredReviewMediaAssets = (review) => parseJsonArray(review.mediaAssets)
  .filter((asset) => asset && typeof asset === 'object')
  .map((asset) => ({
    publicId: asset.publicId,
    resourceType: asset.resourceType
  }));

const toStoredMediaAsset = (asset) => ({
  publicId: asset.publicId,
  resourceType: asset.resourceType
});

const userHasDeliveredProduct = (userId, productId) => prisma.orderItem.findFirst({
  where: {
    productId,
    order: {
      is: {
        userId,
        status: 'delivered'
      }
    }
  },
  select: { id: true }
});

const cleanupStoredReviewMedia = async (review) => {
  await Promise.allSettled(getStoredReviewMediaAssets(review).map(deleteMedia));
};

export const createReview = async (req, res) => {
  const uploadedFiles = getUploadedReviewFiles(req);
  let reviewCreated = false;
  let uploadedAssets = [];

  try {
    const userId = req.user.userId;
    const { productId, rating, comment, images, video } = req.body;
    const productIdValue = parsePositiveInteger(productId);
    const ratingValue = parseRating(rating);

    if (!productIdValue || !ratingValue) {
      return res.status(400).json({ error: 'Product ID and a rating from 1 to 5 are required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productIdValue }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existingReview = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: productIdValue
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const deliveredOrderItem = await userHasDeliveredProduct(userId, productIdValue);
    if (!deliveredOrderItem) {
      return res.status(403).json({ error: 'Only customers with a delivered order can review this product' });
    }

    const uploadedImageAssets = await Promise.all(
      (req.files?.images || []).map((file) => uploadMedia(file, 'webstore/reviews'))
    );
    const uploadedVideoAsset = req.files?.video?.[0]
      ? await uploadMedia(req.files.video[0], 'webstore/reviews')
      : null;
    uploadedAssets = [...uploadedImageAssets, ...(uploadedVideoAsset ? [uploadedVideoAsset] : [])];
    const reviewImages = uploadedImageAssets.length > 0
      ? uploadedImageAssets.map((asset) => asset.secureUrl)
      : parseExternalMediaUrls(images);
    const reviewVideo = uploadedVideoAsset?.secureUrl || (
      typeof video === 'string' && video.trim() ? normalizeExternalMediaUrl(video) : null
    );

    const review = await prisma.$transaction(async (tx) => {
      const createdReview = await tx.review.create({
        data: {
          userId,
          productId: productIdValue,
          rating: ratingValue,
          comment: comment || null,
          images: reviewImages.length > 0 ? JSON.stringify(reviewImages) : null,
          video: reviewVideo,
          mediaAssets: uploadedAssets.length > 0
            ? JSON.stringify(uploadedAssets.map(toStoredMediaAsset))
            : null
        },
        include: reviewUserInclude
      });

      await syncProductReviewStats(tx, productIdValue);
      return createdReview;
    });
    reviewCreated = true;

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error.message);
    if (!reviewCreated && uploadedAssets.length > 0) {
      await Promise.allSettled(uploadedAssets.map(deleteMedia));
      console.warn('Review media was removed because the review could not be created.');
    } else if (!reviewCreated && uploadedFiles.length > 0) {
      console.warn('Review media was not attached because the review could not be created.');
    }
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to create review'
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const nextRating = rating === undefined ? review.rating : parseRating(rating);
    if (!nextRating) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    const updatedReview = await prisma.$transaction(async (tx) => {
      const nextReview = await tx.review.update({
        where: { id: parseInt(id) },
        data: {
          rating: nextRating,
          comment: comment !== undefined ? comment : review.comment
        },
        include: reviewUserInclude
      });

      await syncProductReviewStats(tx, review.productId);
      return nextReview;
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to update review'
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const productId = review.productId;

    await prisma.$transaction(async (tx) => {
      await tx.review.delete({
        where: { id: parseInt(id) }
      });
      await syncProductReviewStats(tx, productId);
    });

    await cleanupStoredReviewMedia(review);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to delete review'
    });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const reply = req.body.reply?.trim();

    if (!reply) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const now = new Date();

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        reply,
        replyCreatedAt: review.replyCreatedAt || now,
        replyUpdatedAt: now
      },
      include: reviewUserInclude
    });

    res.json({
      message: 'Reply saved successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({ error: 'Failed to save reply' });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      include: reviewUserInclude,
      orderBy: { createdAt: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};
