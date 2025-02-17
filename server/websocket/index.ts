import { Server } from 'socket.io';
import { logger } from '../utils/logger';

export const setupWebSocket = (io: Server) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      logger.info(`Client ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      logger.info(`Client ${socket.id} left room ${roomId}`);
    });

    socket.on('booking-update', (data) => {
      io.to(data.spotId).emit('booking-updated', data);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });
};