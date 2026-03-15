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
export async function getPost(userId){
    const result = await pool.query(
        `SELECT * FROM posts WHERE posted_by_user_id = $1`,
        [userId]
    );
    if(result.rowCount === 0){
        throw ApiError.notFound('No posts found');
    }
    return result.rows;
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