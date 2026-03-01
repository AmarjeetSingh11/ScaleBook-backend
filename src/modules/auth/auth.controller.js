import * as authService from './auth.service.js';

/**
 * Auth controller - handles HTTP request/response.
 */
export async function getUsers(req, res) {
  try {
    const users = await authService.getUsers();
    res.json({ users });
  } catch (err) {
    console.error('getUsers error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}
