import prisma from '../db.js';

const normalizeProduct = (product, statsMap) => {
  const stats = statsMap.get(product.id);

  if (!stats) {
    return {
      ...product,
      rating: product.rating || 0,
      reviews: product.reviews || 0,
    };
  }

  return {
    ...product,
    rating: Number(stats.averageRating || 0),
    reviews: stats.reviewsCount,
  };
};

export const attachProductReviewStats = async (products) => {
  if (!products || products.length === 0) {
    return products;
  }

  const productIds = [...new Set(products.map((product) => product.id).filter(Boolean))];

  if (productIds.length === 0) {
    return products;
  }

  const reviewStats = await prisma.review.groupBy({
    by: ['productId'],
    where: {
      productId: {
        in: productIds,
      },
    },
    _count: {
      _all: true,
    },
    _avg: {
      rating: true,
    },
  });

  const statsMap = new Map(
    reviewStats.map((stats) => [
      stats.productId,
      {
        reviewsCount: stats._count._all,
        averageRating: Math.round((stats._avg.rating || 0) * 10) / 10,
      },
    ])
  );

  return products.map((product) => normalizeProduct(product, statsMap));
};

export const attachSingleProductReviewStats = async (product) => {
  if (!product) {
    return product;
  }

  const [normalizedProduct] = await attachProductReviewStats([product]);
  return normalizedProduct;
};

export const syncProductReviewStats = async (db, productId) => {
  // Take the product-row lock before reading the aggregate. With PostgreSQL's
  // read-committed isolation, this serializes concurrent review mutations for
  // one product and prevents a stale aggregate from being written last.
  await db.product.update({
    where: { id: productId },
    data: { reviews: { increment: 0 } },
  });

  const stats = await db.review.aggregate({
    where: { productId },
    _count: { _all: true },
    _avg: { rating: true },
  });

  return db.product.update({
    where: { id: productId },
    data: {
      rating: Math.round((stats._avg.rating || 0) * 10) / 10,
      reviews: stats._count._all,
    },
  });
};
