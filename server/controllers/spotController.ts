import { Request, Response, NextFunction } from 'express';
import { Spot } from '../models/Spot';
import { AppError } from '../middleware/errorHandler';

export const createSpot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spot = await Spot.create({
      ...req.body,
      hostId: req.user.id
    });

    res.status(201).json(spot);
  } catch (error) {
    next(error);
  }
};

export const getSpots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spots = await Spot.find({ status: 'active' })
      .sort('-createdAt')
      .populate('hostId', 'fullName email');

    res.json(spots);
  } catch (error) {
    next(error);
  }
};

export const getSpot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spot = await Spot.findById(req.params.id)
      .populate('hostId', 'fullName email');

    if (!spot) {
      throw new AppError('Spot not found', 404);
    }

    res.json(spot);
  } catch (error) {
    next(error);
  }
};

export const updateSpot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spot = await Spot.findOneAndUpdate(
      { _id: req.params.id, hostId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!spot) {
      throw new AppError('Spot not found or unauthorized', 404);
    }

    res.json(spot);
  } catch (error) {
    next(error);
  }
};

export const deleteSpot = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spot = await Spot.findOneAndDelete({
      _id: req.params.id,
      hostId: req.user.id
    });

    if (!spot) {
      throw new AppError('Spot not found or unauthorized', 404);
    }

    res.json({ message: 'Spot deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getHostSpots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const spots = await Spot.find({ hostId: req.user.id })
      .sort('-createdAt');

    res.json(spots);
  } catch (error) {
    next(error);
  }
};