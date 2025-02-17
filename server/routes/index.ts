import { Express } from 'express';
import authRoutes from './authRoutes';
import spotRoutes from './spotRoutes';
import paymentRoutes from './paymentRoutes';
import uploadRoutes from './uploadRoutes';
import bookingRoutes from './bookingRoutes';
import notificationRoutes from './notificationRoutes';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/spots', spotRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/uploads', uploadRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/notifications', notificationRoutes);
};