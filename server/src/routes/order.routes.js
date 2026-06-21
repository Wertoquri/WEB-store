import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/order.controller.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
