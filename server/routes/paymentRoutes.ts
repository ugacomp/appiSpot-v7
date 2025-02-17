import { Router } from 'express';
import { protect } from '../middleware/auth';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController';

const router = Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/webhook', handleWebhook);

export default router;