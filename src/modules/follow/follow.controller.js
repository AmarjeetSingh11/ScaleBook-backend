import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import * as followService from './follow.service.js';

export const getListofUsersToFollow = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const lastCursor = req.query.lastCursor;
    const users = await followService.getListofUsersToFollow(userId, lastCursor);
    return res.status(200).json(new ApiResponse(200, 'Users fetched successfully', users));
});
export const sendRequestToFollow = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const followingId = req.params.followingId;
    const request = await followService.sendRequestToFollow(userId, followingId);
    return res.status(201).json(new ApiResponse(201, 'Request sent successfully', request));
});
