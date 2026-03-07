import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDueFlashcards
} from '../controllers/projectController';
import { protect } from '../middleware/authMiddleware';
import { shareProject } from '../controllers/socialController';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.get('/due-flashcards', protect, getDueFlashcards);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

router.route('/:id/share').post(protect, shareProject);

export default router;
