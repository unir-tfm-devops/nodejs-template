import request from 'supertest';
import express from 'express';
import { healthRouter } from '../routes/health';

// Create a test app without database initialization
const testApp = express();
testApp.use(express.json());
testApp.use('/api/health', healthRouter);

describe('Health Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(testApp)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'API is healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('GET /api/health/ready', () => {
    it('should return ready status', async () => {
      const response = await request(testApp)
        .get('/api/health/ready')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'API is ready to serve requests');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 