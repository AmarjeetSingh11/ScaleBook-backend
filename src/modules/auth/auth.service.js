import { pool } from '../../config/database.js';

/**
 * Auth service - business logic for authentication.
 * Add your auth logic here (e.g. login, register, validate token).
 */
export async function getUsers() {
  const result = await pool.query('SELECT id, email, created_at FROM users');
  return result.rows;
}
