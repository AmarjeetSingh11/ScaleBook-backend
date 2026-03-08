import * as profileservice from '../../modules/profile/profile.service.js'
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';


export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const profile = await profileservice.getProfile(userId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Profile fetched successfully', profile));
});

export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    const updatedProfile = await profileservice.updateProfile(userId, req.body);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Profile updated successfully', updatedProfile));
});
export const updateBioSkills = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { bio, skills } = req.body;
    const updatedBioSkills = await profileservice.updateBioSkills(userId, { bio, skills });
    return res
        .status(200)
        .json(new ApiResponse(200, 'Bio and skills updated successfully', updatedBioSkills));
});