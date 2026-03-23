import { pool } from '../../config/database.js';
import { ApiError } from '../../utils/appError.js';

export async function getListofUsersToFollow(userId, lastCursor) {
    let values = [userId];
    let query = `
        SELECT id, name, profile_picture 
        FROM users 
        WHERE id != $1
        AND id NOT IN (
            SELECT following_id FROM follows WHERE follower_id = $1
        )
        AND id NOT IN (
            SELECT follower_id FROM follows WHERE following_id = $1
        )
    `;

    if (lastCursor) {
        values.push(new Date(lastCursor));
        query += ` AND created_at < $${values.length}`;
    }

    // Add limit
    values.push(10);
    query += ` ORDER BY created_at DESC LIMIT $${values.length}`;

    const result = await pool.query(query, values);
    const hasMore = result.rows.length > 10;
    if (result.rows.length === 0) {
        throw ApiError.notFound('No users to follow');
    }

    return {
        users: result.rows,
        hasMore,
        nextCursor: result.rows.length ? result.rows[result.rows.length - 1].created_at : null
    };
}
export async function sendRequestToFollow(followerId,followingId){
    const existingRequest = await pool.query(
        `
        SELECT id FROM follows WHERE follower_id = $1 AND following_id = $2 AND status = 'pending'
        `,
        [followerId,followingId]
    );
    if(existingRequest.rowCount > 0){
        throw ApiError.conflict('Request already sent');
    }
    const request = await pool.query(
        `
        INSERT INTO follows (follower_id, following_id,status) VALUES ($1, $2,'pending')
        RETURNING id
        `,
        [followerId,followingId]
    );
    if(request.rowCount === 0){
        throw ApiError.notFound('Failed to send request to follow');
    }
    return {
        success: true,
    };
}