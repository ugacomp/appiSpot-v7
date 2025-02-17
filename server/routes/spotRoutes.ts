import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth';
import {
  createSpot,
  getSpots,
  getSpot,
  updateSpot,
  deleteSpot,
  getHostSpots
} from '../controllers/spotController';

const router = Router();

router.get('/', getSpots);
router.get('/:id', getSpot);

router.use(protect);

router.post('/', restrictTo('host'), createSpot);
router.get('/host/spots', restrictTo('host'), getHostSpots);
router.patch('/:id', restrictTo('host'), updateSpot);
router.delete('/:id', restrictTo('host'), deleteSpot);

export default router;