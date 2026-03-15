import express from 'express';
import * as postController from './post.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create-post', authenticate, postController.createPost);
router.patch('/edit-post/:postId', authenticate, postController.editPost);
router.get('/get-posts', authenticate, postController.getPost);
router.delete('/delete-post/:postId', authenticate, postController.deletePost);

export default router;
