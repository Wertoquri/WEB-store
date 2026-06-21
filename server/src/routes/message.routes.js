import express from 'express';
import { getMessages, markAsRead } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', getMessages);
router.put('/:id/read', markAsRead);

export default router;
