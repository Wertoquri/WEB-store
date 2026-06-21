import prisma from '../db.js';
import { deleteMedia, uploadMedia } from '../services/mediaStorage.js';

const reviewUserInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true
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

const getUploadedReviewFiles = (req) => [
  ...(req.files?.images || []),
  ...(req.files?.video || [])
];

const getStoredReviewMediaUrls = (review) => {
  const storedImages = parseJsonArray(review.images);
  const storedVideo = typeof review.video === 'string' ? review.video.trim() : '';
  return [...storedImages, storedVideo].filter(Boolean);
};

const cleanupStoredReviewMedia = async (review) => {
  await Promise.allSettled(getStoredReviewMediaUrls(review).map(deleteMedia));
};

export const createReview = async (req, res) => {
  const uploadedFiles = getUploadedReviewFiles(req);
  let reviewCreated = false;

  try {
    const userId = req.user.userId;
    const { productId, rating, comment, images, video } = req.body;
    const productIdValue = Number.parseInt(productId, 10);
    const ratingValue = Number.parseInt(rating, 10);

    if (!productIdValue || !ratingValue) {
      return res.status(400).json({ error: 'Product ID and rating are required' });
    }

    if (ratingValue < 1 || ratingValue > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
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

    const uploadedImageUrls = await Promise.all(
      (req.files?.images || []).map((file) => uploadMedia(file, 'webstore/reviews'))
    );
    const uploadedVideoUrl = req.files?.video?.[0]
      ? await uploadMedia(req.files.video[0], 'webstore/reviews')
      : null;
    const reviewImages = uploadedImageUrls.length > 0 ? uploadedImageUrls : parseJsonArray(images);
    const reviewVideo = uploadedVideoUrl || (typeof video === 'string' && video.trim() ? video.trim() : null);

    const review = await prisma.review.create({
      data: {
        userId,
        productId: productIdValue,
        rating: ratingValue,
        comment: comment || null,
        images: reviewImages.length > 0 ? JSON.stringify(reviewImages) : null,
        video: reviewVideo
      },
      include: reviewUserInclude
    });
    reviewCreated = true;

    const allReviews = await prisma.review.findMany({
      where: { productId: productIdValue }
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: productIdValue },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviews: allReviews.length
      }
    });

    res.status(201).json({
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error.message);
    if (!reviewCreated && uploadedFiles.length > 0) {
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

    const updatedReview = await prisma.review.update({
      where: { id: parseInt(id) },
      data: {
        rating: rating !== undefined ? rating : review.rating,
        comment: comment !== undefined ? comment : review.comment
      },
      include: reviewUserInclude
    });

    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId }
    });

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviews: allReviews.length
      }
    });

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Failed to update review' });
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

    await prisma.review.delete({
      where: { id: parseInt(id) }
    });

    await cleanupStoredReviewMedia(review);

    const allReviews = await prisma.review.findMany({
      where: { productId }
    });

    if (allReviews.length > 0) {
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          reviews: allReviews.length
        }
      });
    } else {
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: 0,
          reviews: 0
        }
      });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Failed to delete review' });
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
