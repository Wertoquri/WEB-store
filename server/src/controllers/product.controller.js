import prisma from '../db.js';
import {
  attachProductReviewStats,
  attachSingleProductReviewStats,
} from '../utils/productReviewStats.js';
import { deleteMedia, uploadMedia } from '../services/mediaStorage.js';

const normalizeString = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const resolveProductImage = async (req, body, fallbackImage = null) => {
  if (req.file) {
    return uploadMedia(req.file, 'webstore/products');
  }

  return body.imageUrl || body.image || fallbackImage || 'https://via.placeholder.com/300x300?text=No+Image';
};

const canManageProduct = (product, user) => {
  if (!user) {
    return false;
  }

  return user.role === 'admin' || product.ownerId === user.userId;
};

export const getAllProducts = async (req, res) => {
  try {
    const { page, limit, category, search, sort } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;

    const where = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy = { price: 'asc' };
          break;
        case 'price_desc':
          orderBy = { price: 'desc' };
          break;
        case 'rating':
          orderBy = { rating: 'desc' };
          break;
        case 'name_asc':
          orderBy = { title: 'asc' };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    const [rawProducts, total] = await Promise.all([
      prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum
      }),
      prisma.product.count({ where })
    ]);

    const products = await attachProductReviewStats(rawProducts);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getMyProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { ownerId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(await attachProductReviewStats(products));
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ error: 'Failed to fetch your products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(await attachSingleProductReviewStats(product));
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stock } = req.body;
    const normalizedTitle = normalizeString(title);
    const parsedPrice = Number.parseFloat(price);
    const parsedStock = stock !== undefined && stock !== '' ? Number.parseInt(stock, 10) : 0;

    if (!normalizedTitle || Number.isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative integer' });
    }

    const product = await prisma.product.create({
      data: {
        ownerId: req.user.userId,
        title: normalizedTitle,
        description: description || '',
        price: parsedPrice,
        image: await resolveProductImage(req, req.body),
        category: normalizeString(category),
        stock: parsedStock
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to create product'
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, stock } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!canManageProduct(existingProduct, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const parsedPrice = price !== undefined && price !== '' ? Number.parseFloat(price) : existingProduct.price;
    const parsedStock = stock !== undefined && stock !== '' ? Number.parseInt(stock, 10) : existingProduct.stock;

    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ error: 'Price must be a valid number' });
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return res.status(400).json({ error: 'Stock must be a non-negative integer' });
    }

    const nextImage = await resolveProductImage(req, req.body, existingProduct.image);
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        title: normalizeString(title) || existingProduct.title,
        description: description !== undefined ? description : existingProduct.description,
        price: parsedPrice,
        image: nextImage,
        category: category !== undefined ? normalizeString(category) : existingProduct.category,
        stock: parsedStock
      }
    });

    if (nextImage !== existingProduct.image) {
      await deleteMedia(existingProduct.image).catch((error) => {
        console.warn('Previous product image could not be removed:', error.message);
      });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to update product'
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!canManageProduct(existingProduct, req.user)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    await deleteMedia(existingProduct.image).catch((error) => {
      console.warn('Product image could not be removed:', error.message);
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
