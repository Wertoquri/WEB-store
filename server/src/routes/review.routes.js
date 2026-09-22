import express from 'express';
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  replyToReview
} from '../controllers/review.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';
import { reviewMediaUpload } from '../middleware/reviewUpload.js';
import { reviewUploadConcurrencyLimiter } from '../middleware/security.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authMiddleware, reviewUploadConcurrencyLimiter, reviewMediaUpload, createReview);
router.put('/:id/reply', authMiddleware, adminMiddleware, replyToReview);
router.put('/:id', authMiddleware, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
