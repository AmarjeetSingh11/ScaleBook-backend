import { ApiError } from '../utils/appError.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err); // log full error internally

  // Handle known operational errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  }

  // Handle PostgreSQL duplicate key
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Resource already exists',
    });
  }

  // Handle other DB errors
  if (err.code && err.code.startsWith('23')) {
    return res.status(400).json({
      success: false,
      message: 'Database constraint error',
    });
  }

  // Unknown / programming error
  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};