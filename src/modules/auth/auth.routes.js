import express from 'express';
import * as authController from './auth.controller.js';

const router = express.Router();

router.get('/users', authController.getUsers);

export default router;
