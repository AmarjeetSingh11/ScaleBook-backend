import express from 'express';
import { authenticate } from '../../middleware/authMiddleware.js';
import * as followController from './follow.controller.js';
const router = express.Router();

router.get('/get-list-of-users-to-follow', authenticate, followController.getListofUsersToFollow);
router.post('/send-request/:followingId', authenticate, followController.sendRequestToFollow);

export default router;