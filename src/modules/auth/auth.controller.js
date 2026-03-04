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
