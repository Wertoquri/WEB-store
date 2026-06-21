import express from 'express';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItem 
} from '../controllers/cart.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getCart);
router.post('/add', addToCart);
router.delete('/remove/:productId', removeFromCart);
router.put('/update/:productId', updateCartItem);

export default router;
