import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

const UPLOAD_PATH = process.env.UPLOAD_PATH || 'uploads';

// Ensure upload directory exists
const ensureUploadDir = async () => {
  try {
    await fs.access(UPLOAD_PATH);
  } catch {
    await fs.mkdir(UPLOAD_PATH, { recursive: true });
  }
};

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    await ensureUploadDir();

    const filename = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(UPLOAD_PATH, filename);
    
    await fs.writeFile(filePath, req.file.buffer);
    
    const url = `/uploads/${filename}`;
    
    res.json({
      url,
      key: filename
    });
  } catch (error) {
    next(error);
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { key } = req.params;
    const filePath = path.join(UPLOAD_PATH, key);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      throw new AppError('Image not found', 404);
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};