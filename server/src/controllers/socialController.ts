import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import User from '../models/User';
import StudyProject from '../models/StudyProject';
import { sendEmail } from '../utils/sendEmail';


// @desc    Get Global Leaderboard (Top 10 by XP)
// @route   GET /api/social/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req: Request, res: Response) => {
  const topUsers = await User.find({})
    .sort({ xp: -1 })
    .limit(10)
    .select('name avatar xp level currentStreak'); 

  res.json(topUsers);
});

// @desc    Invite a user by Email (General Platform Invite)
// @route   POST /api/social/invite
// @access  Private
export const inviteUser = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email address is required', 400);
  }

  const message = `
    Hi there!

    ${req.user.name} has invited you to join Kairon AI, the ultimate AI-powered study assistant.

    Join us to create personalized study plans, generate quizzes, and master your subjects.

    Sign up here: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
  `;

  try {
    await sendEmail({
      email: email,
      subject: 'You have been invited to Kairon AI',
      message: message,
    });

    res.status(200).json({ success: true, message: 'Invitation email sent successfully' });
  } catch (err: any) {
    console.error("Email send error:", err);
    throw new AppError('Email could not be sent. Please try again later.', 500);
  }
});

// @desc    Share a project with another user by Email
// @route   POST /api/social/projects/:id/share
// @access  Private
export const shareProject = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const projectId = req.params.id;

  const project = await StudyProject.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', 404);
  }

  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  if (project.owner.toString() !== req.user.id) {
    throw new AppError('Not authorized to share this project', 401);
  }

  const userToShare = await User.findOne({ email });

  if (!userToShare) {
    throw new AppError('User with this email not found', 404);
  }

  // Ensure sharedWith is initialized
  if (!project.sharedWith) {
      project.sharedWith = [];
  }

  // Check if already shared
  // Note: We use .toString() for reliable ID comparison
  const isAlreadyShared = project.sharedWith.some(
    (id) => id.toString() === userToShare._id.toString()
  );

  if (isAlreadyShared) {
    throw new AppError('Project already shared with this user', 400);
  }

  project.sharedWith.push(userToShare._id);
  await project.save();

  res.json({ message: `Project shared with ${userToShare.name}` });
});