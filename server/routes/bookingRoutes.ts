import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  createBooking,
  getBooking,
  updateBooking,
  cancelBooking,
  getUserBookings
} from '../controllers/bookingController';

const router = Router();

router.use(protect);

router.post('/', createBooking);
router.get('/user', getUserBookings);
router.get('/:id', getBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', cancelBooking);

export default router;