CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by_user_id UUID NOT NULL REFERENCES users(id),
  post_image_url Text,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_posts_title ON posts (title);
CREATE INDEX IF NOT EXISTS idx_posts_description ON posts (description);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at);
CREATE INDEX IF NOT EXISTS idx_posts_updated_at ON posts (updated_at);