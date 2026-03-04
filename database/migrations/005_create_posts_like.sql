CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS posts_like(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id),
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_posts_like_id ON posts_like (id);
CREATE INDEX IF NOT EXISTS idx_posts_like_post_id ON posts_like (post_id);
CREATE INDEX IF NOT EXISTS idx_posts_like_user_id ON posts_like (user_id);
CREATE INDEX IF NOT EXISTS idx_posts_like_created_at ON posts_like (created_at);
CREATE INDEX IF NOT EXISTS idx_posts_like_updated_at ON posts_like (updated_at);
