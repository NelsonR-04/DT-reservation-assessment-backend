import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import morgan from 'morgan';
import config from './config/config';
import logger, { morganStream } from './config/logger';
import apiKeyAuth from './middleware/apiKeyAuth';
import placeRoutes from './routes/placeRoutes';
import reservationRoutes from './routes/reservationRoutes';
import spaceRoutes from './routes/spaceRoutes';

dotenv.config();

const app: Express = express();
const port = config.port;

export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging with Morgan
app.use(morgan('combined', { stream: morganStream }));

app.get('/health', async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (error) {
    logger.error('Database health check failed:', error);
  }

  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
    version: process.version,
  });
});

// Authentication middleware
app.use(apiKeyAuth);

// Routes
app.use('/espacios', spaceRoutes);
app.use('/lugares', placeRoutes);
app.use('/reservas', reservationRoutes);

// middleware
app.use((err: Error, req: Request, res: Response) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
  });
}

export default app;
