import express from 'express';
import authRoutes from '../../modules/auth/auth.routes.js';
import profileRoutes from '../../modules/profile/profile.routes.js';
import postRoutes from '../../modules/post/post.routes.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/post', postRoutes);

export default router;
