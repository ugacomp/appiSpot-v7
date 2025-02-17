import { Router } from 'express';
import { protect } from '../middleware/auth';
import { uploadImage, deleteImage } from '../controllers/uploadController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/', protect, upload.single('image'), uploadImage);
router.delete('/:key', protect, deleteImage);

export default router;