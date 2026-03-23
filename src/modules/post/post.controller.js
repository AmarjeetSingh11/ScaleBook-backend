import * as postService from './post.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';

export const createPost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const data = req.body;
    const post = await postService.createPost(userId, data);
    return res
        .status(201)
        .json(new ApiResponse(201, 'Post created successfully', post));
});
export const editPost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const data = req.body;
    const post = await postService.editPost(userId, postId, data);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Post edited successfully', post));
});
export const getPost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const lastCursor = req.query.lastCursor;
    const posts = await postService.getPostsByUser(userId, lastCursor);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Posts fetched successfully', posts));
});
export const deletePost = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.postId;
    const result = await postService.deletePost(userId, postId);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Post deleted successfully', result));
});
export const getAllPosts = asyncHandler(async (req, res) => {
    const lastCursor = req.query.lastCursor;
    const posts = await postService.getAllPosts(lastCursor);
    return res
        .status(200)
        .json(new ApiResponse(200, 'Posts fetched successfully', posts));
});