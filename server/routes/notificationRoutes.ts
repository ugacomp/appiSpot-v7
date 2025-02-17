import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getUserNotifications,
  markAsRead,
  deleteNotification
} from '../controllers/notificationController';

const router = Router();

router.use(protect);

router.get('/', getUserNotifications);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;