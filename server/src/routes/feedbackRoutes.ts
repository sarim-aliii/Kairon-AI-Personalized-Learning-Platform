import express from 'express';
import { submitFeedback } from '../controllers/feedbackController';
import { protect } from '../middleware/authMiddleware';


const router = express.Router();
router.post('/', protect, submitFeedback);


export default router;