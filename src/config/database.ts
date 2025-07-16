import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig: PoolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'nodejs-template',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

export const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database tables using Liquibase
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Import here to avoid circular dependencies
    const { liquibaseService } = await import('../services/LiquibaseService');
    
    // Run Liquibase update to apply all pending migrations
    await liquibaseService.update();
    console.log('Database initialized successfully with Liquibase');
  } catch (error) {
    console.error('Error initializing database with Liquibase:', error);
    throw error;
  }
}; 