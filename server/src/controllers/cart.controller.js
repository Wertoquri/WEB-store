import prisma from '../db.js';

export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    const total = cart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      ...cart,
      total
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity, color } = req.body;

    if (!productId || quantity < 1) {
      return res.status(400).json({ error: 'Product ID and valid quantity are required' });
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId) }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId }
      });
      cart.items = [];
    }

    const existingItem = cart.items.find(item => item.productId === parseInt(productId));

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { 
          quantity: existingItem.quantity + quantity,
          color: color || existingItem.color
        }
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          quantity,
          color: color || null
        }
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total
    });
  } catch (error) {
    console.error('Add to cart error:', error.message);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        productId: parseInt(productId)
      }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1' });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId }
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId)
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity }
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const total = updatedCart.items.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.json({
      ...updatedCart,
      total
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};
