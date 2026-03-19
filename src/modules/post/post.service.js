import { pool } from '../../config/database.js';
import { ApiError } from '../../utils/appError.js';

export async function createPost(userId, data) {
  const { title, description } = data;
  const result = await pool.query(
    'INSERT INTO posts (posted_by_user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, description]
  );
  if(result.rowCount === 0){
    throw ApiError.notFound('Failed to create post');
  }
  return result.rows[0];
}
export async function editPost(userId,postId,data){
    const {title,description} = data;
    const result = await pool.query(
        `UPDATE posts SET title = $1, description = $2 WHERE id = $3 AND posted_by_user_id = $4 RETURNING *`,
        [title,description,postId,userId]
    );
    if(result.rowCount === 0){
        throw ApiError.notFound('Failed to edit post');
    }
    return result.rows[0];
}
export async function getPostsByUser(userId, lastCursor) {
    const limit = 10;

    let query = `
        SELECT * FROM posts
        WHERE posted_by_user_id = $1
    `;

    const values = [userId];

    if (lastCursor) {
        query += `
            AND created_at < $2
        `;
        values.push(new Date(lastCursor));
    }

    query += `
        ORDER BY created_at DESC
        LIMIT $${values.length + 1}
    `;

    values.push(limit + 1); // fetch extra to check hasMore

    const result = await pool.query(query, values);

    const hasMore = result.rows.length > limit;

    const posts = hasMore ? result.rows.slice(0, limit) : result.rows;

    return {
        posts,
        hasMore,
        nextCursor: posts.length ? posts[posts.length - 1].created_at : null
    };
}
export async function deletePost(userId,postId){
    const result = await pool.query(
        `DELETE FROM posts WHERE id = $1 AND posted_by_user_id = $2 RETURNING *`,
        [postId,userId]
    );
    if(result.rowCount === 0){
        throw ApiError.notFound('Failed to delete post');
    }
    return { success: true };
}
export async function getAllPosts(lastCursor) {
    const limit = 10;

    let query = `SELECT * FROM posts`;
    const values = [];

    if (lastCursor) {
        query += ` WHERE created_at < $1`;
        values.push(new Date(lastCursor));
    }

    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1}`;
    values.push(limit + 1);

    const result = await pool.query(query, values);

    const hasMore = result.rows.length > limit;

    const posts = hasMore ? result.rows.slice(0, limit) : result.rows;

    return {
        posts,
        hasMore,
        nextCursor: posts.length
            ? posts[posts.length - 1].created_at
            : null
    };
}