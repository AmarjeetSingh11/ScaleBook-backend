-- Migration: Create users table
-- Run with: npm run migrate

CREATE TABLE IF NOT EXISTS users (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
