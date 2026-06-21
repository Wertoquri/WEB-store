import prisma from '../db.js';
import { attachProductReviewStats } from '../utils/productReviewStats.js';

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    if (!wishlist) {
      return res.json({ products: [] });
    }

    const products = wishlist.products.map((wp) => wp.product);
    res.json({ products: await attachProductReviewStats(products) });
  } catch (error) {
    console.error('Get wishlist error:', error.message);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = parseInt(req.params.productId);

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { products: true }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { products: true }
      });
    }

    const existing = wishlist.products.find(wp => wp.productId === productId);

    if (existing) {
      return res.status(400).json({ error: 'Product already in wishlist' });
    }

    await prisma.wishlistProduct.create({
      data: {
        wishlistId: wishlist.id,
        productId
      }
    });

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    const products = updatedWishlist.products.map((wp) => wp.product);
    res.json({ products: await attachProductReviewStats(products) });
  } catch (error) {
    console.error('Add to wishlist error:', error.message);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId }
    });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    await prisma.wishlistProduct.deleteMany({
      where: {
        wishlistId: wishlist.id,
        productId: parseInt(productId)
      }
    });

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    const products = updatedWishlist ? updatedWishlist.products.map((wp) => wp.product) : [];
    res.json({ products: await attachProductReviewStats(products) });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
};

export const syncWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productIds } = req.body;

    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: 'productIds must be an array' });
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: { products: true }
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: { products: true }
      });
    }

    // Delete all existing wishlist items
    await prisma.wishlistProduct.deleteMany({
      where: { wishlistId: wishlist.id }
    });

    // Add new items
    const validProductIds = productIds.map(id => parseInt(id)).filter(id => !isNaN(id));

    if (validProductIds.length > 0) {
      await prisma.wishlistProduct.createMany({
        data: validProductIds.map(productId => ({
          wishlistId: wishlist.id,
          productId
        })),
        skipDuplicates: true
      });
    }

    const updatedWishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        products: {
          include: {
            product: true
          }
        }
      }
    });

    const products = updatedWishlist ? updatedWishlist.products.map((wp) => wp.product) : [];
    res.json({ products: await attachProductReviewStats(products) });
  } catch (error) {
    console.error('Sync wishlist error:', error);
    res.status(500).json({ error: 'Failed to sync wishlist' });
  }
};
