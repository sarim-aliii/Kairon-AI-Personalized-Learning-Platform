import express from 'express';
import { analyzeRepo } from '../controllers/githubController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/scan', protect, analyzeRepo);

export default router;