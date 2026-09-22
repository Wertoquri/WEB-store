import prisma from '../db.js';

const MAX_DATABASE_INTEGER = 2147483647;

class CheckoutError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

const parsePositiveDatabaseInteger = (value) => {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && /^\d+$/.test(value.trim())
      ? Number(value.trim())
      : Number.NaN;

  return Number.isSafeInteger(parsed) && parsed > 0 && parsed <= MAX_DATABASE_INTEGER
    ? parsed
    : null;
};

const normalizeOrderItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutError(400, 'Order items are required');
  }

  const quantitiesByProduct = new Map();
  for (const item of items) {
    const productId = parsePositiveDatabaseInteger(item?.productId);
    const quantity = parsePositiveDatabaseInteger(item?.quantity);
    if (!productId || !quantity) {
      throw new CheckoutError(400, 'Each order item needs a positive integer product ID and quantity');
    }

    const combinedQuantity = (quantitiesByProduct.get(productId) || 0) + quantity;
    if (combinedQuantity > MAX_DATABASE_INTEGER) {
      throw new CheckoutError(400, 'Requested quantity is too large');
    }
    quantitiesByProduct.set(productId, combinedQuantity);
  }

  return [...quantitiesByProduct.entries()]
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((left, right) => left.productId - right.productId);
};

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items } = req.body;
    const normalizedItems = normalizeOrderItems(items);

    const order = await prisma.$transaction(async (tx) => {
      let total = 0;
      const orderItemsData = [];

      for (const item of normalizedItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new CheckoutError(404, `Product ${item.productId} not found`);
        }

        // The conditional update makes the stock check and reservation one
        // database operation, so duplicate lines and concurrent checkouts
        // cannot oversell or increase inventory with a negative quantity.
        const reservation = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.quantity }
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        if (reservation.count !== 1) {
          throw new CheckoutError(
            400,
            `Недостатньо товару "${product.title}" на складі. Доступно: ${product.stock} шт.`
          );
        }

        total += product.price * item.quantity;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          userId,
          total,
          items: {
            create: orderItemsData
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId
          }
        }
      });

      return createdOrder;
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(error.statusCode || 500).json({
      error: error.statusCode ? error.message : 'Failed to create order'
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
