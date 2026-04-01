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
// Function to get a paginated list of pending follow requests
export async function getListOfRequestsToFollow(userId, lastCursor) {
    // 1️⃣ Define an array to hold query parameters dynamically
    const values = [userId]; 

    // 2️⃣ Base SQL query: select users who sent a pending follow request
    let query = `
       SELECT f.id AS follow_id, u.name, u.profile_picture, f.created_at
        FROM follows f
        JOIN users u ON u.id = f.follower_id
        WHERE f.following_id = $1 AND f.status = 'pending'
        
    `;

    // 3️⃣ Add cursor condition if lastCursor is provided
    if (lastCursor) {
        values.push(new Date(lastCursor)); // Add the cursor value to the parameters array
        query += ` AND created_at < $${values.length}`; // Use parameterized query ($2, $3, etc.)
    }

    // 4️⃣ Set a fixed limit for pagination
    const limit = 10;
    values.push(limit + 1); // +1 to check if there is a next page
    query += ` ORDER BY created_at DESC LIMIT $${values.length}`; // Always order by created_at

    // 5️⃣ Execute the query with the parameters
    const result = await pool.query(query, values);

  

    // 6️⃣ Determine if there are more results (for pagination)
    const hasMore = result.rows.length > limit;

    // 7️⃣ Trim the extra row if it exists
    const requests = hasMore ? result.rows.slice(0, limit) : result.rows;

    // 8️⃣ Get the cursor for the next page
    const nextCursor = requests.length ? requests[requests.length - 1].created_at : null;

    // 9️⃣ Return paginated data
    return {
        requests,
        hasMore,
        nextCursor
    };
}
export async function updateFollowRequestStatus(requestId,data){
    
    const {status} = data;
    const updateRequest = await pool.query(
        `
        UPDATE follows SET status = $1 where id = $2
        RETURNING *
        `,[status,requestId]
    );

    if(updateRequest.rowCount === 0){
        throw ApiError.notFound('Failed to update follow request status');
    }
    return {
        success: true,
    };
}