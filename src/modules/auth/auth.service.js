import { pool } from '../../config/database.js';
import { ApiError } from '../../utils/appError.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export async function registerUser(userData, deviceToken) {
  const { email, name, phone, password } = userData;
  const device_token = deviceToken;
  if (!device_token) {
    throw ApiError.badRequest('Device token is required');
  }
  
  const existingUser = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw ApiError.conflict('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const newUser = await client.query(
      `INSERT INTO users (email, password_hash, name, phone)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name`,
      [email, hashedPassword, name, phone]
    );
  
    const accessToken = jwt.sign(
      { sub: newUser.rows[0].id, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { sub: newUser.rows[0].id },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: '7d' }
    );
  
    await client.query('INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)', [newUser.rows[0].id, refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]);
    
    await client.query('INSERT INTO sessions (user_id, device_token, login_time) VALUES ($1, $2, $3)', [newUser.rows[0].id, device_token, new Date()]);

    await client.query('COMMIT');
  
    return {
      user: newUser.rows[0],
      accessToken,
      refreshToken,
    }

  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      throw ApiError.conflict('Duplicate entry');
    }
  
    console.error(error);
    throw ApiError.internal('Something went wrong.');
  } finally {
    client.release();
  }
}

export async function loginUser(userData, deviceToken) {
  const { email, password } = userData;
  const device_token = deviceToken;
  if (!device_token) {
    throw ApiError.badRequest('Device token is required');
  }

  const userResult = await pool.query(
    'SELECT id, email, name, password_hash FROM users WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const user = userResult.rows[0];

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 🔥 Delete only session for this device
    await client.query(
      'DELETE FROM sessions WHERE user_id = $1 AND device_token = $2',
      [user.id, device_token]
    );

    // 🔥 Delete only refresh token for this device (if you store device_token in refresh_tokens)
    await client.query(
      'DELETE FROM refresh_tokens WHERE user_id = $1 AND device_token = $2',
      [user.id, device_token]
    );

    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET_REFRESH,
      { expiresIn: '7d' }
    );

    await client.query(
      `INSERT INTO refresh_tokens (user_id, token, device_token, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [user.id, refreshToken, device_token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
    );

    await client.query(
      `INSERT INTO sessions (user_id, device_token, login_time)
       VALUES ($1, $2, $3)`,
      [user.id, device_token, new Date()]
    );

    await client.query('COMMIT');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    
  
    console.error(error);
    throw ApiError.internal('Something went wrong.');
  } finally {
    client.release();
  }
}
export async function logoutUser(deviceToken) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const sessionResult = await client.query(
      'SELECT id FROM sessions WHERE device_token = $1',
      [deviceToken]
    );

    if (sessionResult.rows.length === 0) {
      throw ApiError.notFound('Session not found');
    }

    await client.query(
      'DELETE FROM sessions WHERE device_token = $1',
      [deviceToken]
    );

    await client.query(
      'DELETE FROM refresh_tokens WHERE device_token = $1',
      [deviceToken]
    );

    await client.query('COMMIT');

    return { success: true };

  } catch (error) {
    await client.query('ROLLBACK');

    console.error('Logout error:', error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw ApiError.internal('Something went wrong.');
  } finally {
    client.release();
  }
}
export async function refreshToken(refreshToken){
  if (!refreshToken) {
    throw ApiError.badRequest('Refresh token is required');
  }

  let payload;

  try {
    payload = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const tokenResult = await pool.query(
    'SELECT id, user_id FROM refresh_tokens WHERE token = $1',
    [refreshToken]
  );

  if (tokenResult.rows.length === 0) {
    throw ApiError.unauthorized('Refresh token not recognized');
  }

  const userResult = await pool.query(
    'SELECT id, email, name FROM users WHERE id = $1',
    [payload.sub]
  );

  if (userResult.rows.length === 0) {
    throw ApiError.unauthorized('User not found');
  }

  const user = userResult.rows[0];

  const accessToken = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const newRefreshToken = jwt.sign(
    { sub: user.id },
    process.env.JWT_SECRET_REFRESH,
    { expiresIn: '7d' }
  );

  await pool.query(
    'DELETE FROM refresh_tokens WHERE token = $1',
    [refreshToken]
  );

  await pool.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1,$2,$3)',
    [user.id, newRefreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  );

  return {
    accessToken,
    newRefreshToken
  };
}

