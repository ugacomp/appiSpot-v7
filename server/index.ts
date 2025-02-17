import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import { setupRoutes } from './routes/index.js';
import { setupWebSocket } from './websocket/index.js';
import { logger, stream } from './utils/logger.js';
import { connectDB } from './config/mongodb.js';
import fs from 'fs/promises';

// Load environment variables first
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const createLogsDirectory = async () => {
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    await fs.access(logsDir).catch(() => fs.mkdir(logsDir, { recursive: true }));
    return logsDir;
  } catch (error) {
    console.error('Error creating logs directory:', error);
    throw error;
  }
};

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Configure CORS before creating Socket.IO instance
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
};

app.use(cors(corsOptions));

const io = new Server(httpServer, {
  cors: corsOptions
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Logging middleware
app.use(morgan('combined', { stream }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiter to all routes
app.use(limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
const uploadsPath = path.join(process.cwd(), process.env.UPLOAD_PATH || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Set up WebSocket
setupWebSocket(io);

// Set up routes
setupRoutes(app);

// Error handling must be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

// Start server function
const startServer = async () => {
  try {
    // Create logs directory
    const logsDir = await createLogsDirectory();
    logger.info(`Logs directory created/verified at ${logsDir}`);

    // Connect to MongoDB
    await connectDB();
    logger.info('MongoDB connected successfully');

    // Start server
    httpServer.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  logger.error('UNHANDLED REJECTION:', error);
  process.exit(1);
});

// Start the server
startServer().catch((error) => {
  logger.error('Server startup failed:', error);
  process.exit(1);
});

export { app, io };