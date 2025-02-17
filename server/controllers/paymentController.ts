import { Request, Response, NextFunction } from 'express';
import { stripe } from '../config/stripe';
import { Booking } from '../models/Booking';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export const createPaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      throw new AppError('Amount and booking ID are required', 400);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: { bookingId }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new AppError('Webhook signature missing', 400);
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handleSuccessfulPayment(paymentIntent);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handleFailedPayment(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

async function handleSuccessfulPayment(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata;

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'confirmed',
      paymentIntentId: paymentIntent.id
    },
    { new: true }
  );

  if (!booking) {
    logger.error('Error updating booking status: Booking not found');
    throw new AppError('Error updating booking status', 500);
  }
}

async function handleFailedPayment(paymentIntent: any) {
  const { bookingId } = paymentIntent.metadata;

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    {
      status: 'payment_failed',
      paymentIntentId: paymentIntent.id
    },
    { new: true }
  );

  if (!booking) {
    logger.error('Error updating booking status: Booking not found');
    throw new AppError('Error updating booking status', 500);
  }
}