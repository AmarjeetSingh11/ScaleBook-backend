import * as authService from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/apiResponse.js';


export const registerUser = asyncHandler(async (req, res) => {
  const deviceToken = req.get('deviceToken');
  const result = await authService.registerUser(req.body, deviceToken);

  return res
    .status(201)
    .json(new ApiResponse(201, 'User registered successfully', result));
});
export const loginUser = asyncHandler(async (req, res) => {
  const deviceToken = req.get('deviceToken');
  const user = await authService.loginUser(req.body, deviceToken);
  return res
    .status(200)
    .json(new ApiResponse(200, 'User logged in successfully', user));
});
export const logoutUser = asyncHandler(async (req, res) => {
  const deviceToken = req.get('deviceToken');
  const result = await authService.logoutUser(deviceToken);
  if(!result){
    return res
      .status(400)
      .json(new ApiResponse(400, 'Something went wrong.', null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, 'User logged out successfully', null));
});

export const refreshToken = asyncHandler(async (req, res) => {

  const refreshToken = req.get('refreshToken');
  const result = await authService.refreshToken(refreshToken);
  if(!result){
    return res
      .status(400)
      .json(new ApiResponse(400, 'Failed to refresh token.', null));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, 'Token refreshed successfully', result));
  
});
