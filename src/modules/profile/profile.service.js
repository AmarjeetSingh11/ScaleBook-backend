import { pool } from '../../config/database.js';
import { ApiError } from '../../utils/appError.js';


export async function getProfile(userId){

    const user = await pool.query(
        'SELECT id, email, name, phone, profile_picture FROM users WHERE id = $1',
        [userId]
    );
    if(user.rows.length === 0){
        throw ApiError.notFound('User not found');
    }
    return user.rows[0];
}
export async function updateProfile(userId, data){
    const { name, phone } = data;
    const updatedUser = await pool.query(
        'UPDATE users SET name = $1, phone = $2 WHERE id = $3',
        [name, phone, userId]
    );
     if(!updatedUser.rowCount){
        throw ApiError.notFound('Failed to update profile');
    }
    return { success: true };
}
export async function updateBioSkills(userId,data){
    const { bio, skills } = data;
    const updatedUser = await pool.query(
        'UPDATE users SET bio = $1, skills = $2 WHERE id = $3',
        [bio, skills, userId]
    );
    if(!updatedUser.rowCount){
        throw ApiError.notFound('Failed to update bio and skills');
    }
    return { success: true };
}