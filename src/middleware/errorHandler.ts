import { Request, Response } from 'express';
import { ValidationError } from '../utils/validation';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError | ValidationError,
  req: Request,
  res: Response,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle ValidationError
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Log error for debugging
  console.error(`Error ${statusCode}: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}; 