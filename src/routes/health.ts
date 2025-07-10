import { Router, Request, Response } from 'express';

const router = Router();

// GET /api/health
router.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /api/health/ready
router.get('/ready', (req: Request, res: Response) => {
  // Add any readiness checks here (database connection, external services, etc.)
  res.json({
    success: true,
    message: 'API is ready to serve requests',
    timestamp: new Date().toISOString()
  });
});

export const healthRouter = router; 