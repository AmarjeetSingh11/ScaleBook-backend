import express from 'express';
import * as profileController from './profile.controller.js';
import { authenticate } from '../../middleware/authMiddleware.js';
const router = express.Router();

router.get('/get-profile', authenticate, profileController.getProfile);
router.patch('/update-profile', authenticate, profileController.updateProfile);
router.patch('/update-bio-skills', authenticate, profileController.updateBioSkills);

export default router;