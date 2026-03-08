import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);
router.post('/refresh-token', authController.refreshToken);

export default router;
