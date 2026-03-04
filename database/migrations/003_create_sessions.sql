CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS sessions(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    device_token TEXT NOT NULL,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    logout_time TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_id ON sessions (id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_device_token ON sessions (device_token);
CREATE INDEX IF NOT EXISTS idx_sessions_login_time ON sessions (login_time);
CREATE INDEX IF NOT EXISTS idx_sessions_logout_time ON sessions (logout_time);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions (created_at);
CREATE INDEX IF NOT EXISTS idx_sessions_updated_at ON sessions (updated_at);