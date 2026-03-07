import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { getLeaderboard, inviteUser, shareProject } from '../controllers/socialController';


const router = express.Router();

router.get('/leaderboard', protect, getLeaderboard);
router.post('/invite', protect, inviteUser);
router.post('/projects/:id/share', protect, shareProject);

export default router;