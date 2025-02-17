import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AppError } from './errorHandler';
import { logger } from '../utils/logger';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) Check if token exists
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Please log in to access this resource', 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new AppError('JWT_SECRET is not defined', 500);
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string };
    
    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    // 4) Grant access
    req.user = user;
    next();
  } catch (error: any) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please log in again', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Your token has expired. Please log in again', 401));
    } else {
      next(error);
    }
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  };
};