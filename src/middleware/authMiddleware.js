import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { ApiError } from '../utils/appError.js';

function extractBearerToken(authHeader) {
  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token.trim();
}

export async function authenticate(req, res, next) {
  try {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      throw new ApiError(401, 'Authentication required. Provide a valid Bearer token.');
    }

    if (!process.env.JWT_SECRET) {
      throw new ApiError(500, 'JWT secret is not configured.');
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) {
      throw new ApiError(401, 'Invalid token payload.');
    }

    const userResult = await pool.query(
      `SELECT id, email, name, is_active, is_verified
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [payload.id]
    );

    if (!userResult.rows.length) {
      throw new ApiError(401, 'Token is valid but user no longer exists.');
    }

    const user = userResult.rows[0];
    if (!user.is_active) {
      throw new ApiError(403, 'Your account is disabled.');
    }

    req.user = user;
    req.auth = payload;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Session expired. Please log in again.'));
    }

    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid authentication token.'));
    }

    return next(error);
  }
}
