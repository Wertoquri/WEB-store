import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  syncWishlist
} from '../controllers/wishlist.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getWishlist);
router.post('/sync', syncWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
