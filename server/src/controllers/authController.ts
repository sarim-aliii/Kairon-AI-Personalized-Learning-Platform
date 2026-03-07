import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { firebaseAdmin } from '../config/firebaseAdmin';
import sendEmail from '../utils/sendEmail';
import StudyProject from '../models/StudyProject';


// Helper: Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new AppError('An account with this email already exists.', 400);
  }

  // Generate Verification Token (6-digit OTP)
  const verificationToken = crypto.randomInt(100000, 999999).toString();
  
  // Hash the token for database storage
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  const user = await User.create({
    email,
    password,
    name: email.split('@')[0],
    authMethod: 'email',
    verificationToken: verificationTokenHash,
    isVerified: false
  });

  if (user) {
    // Send Email
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email</h2>
        <p>Thanks for signing up for Kairon AI!</p>
        <p>Please use the following OTP to verify your account:</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
          <h1 style="color: #333; margin: 0; letter-spacing: 5px;">${verificationToken}</h1>
        </div>

        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Kairon AI - Verify Your Account',
        message,
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful. Please check your email for the verification code.',
        email: user.email
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Optional: Delete user if email fails so they can retry
      // await user.remove(); 
      throw new AppError('User registered, but failed to send verification email.', 500);
    }
  } else {
    throw new AppError('Invalid user data', 400);
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.authMethod !== 'email') {
    throw new AppError(`This account exists but was created with ${user.authMethod}. Please use that sign-in method.`, 401);
  }

  if (user && (await user.matchPassword(password))) {
    // Check if verified
    if (!user.isVerified) {
      throw new AppError('Please verify your email address before logging in.', 401);
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user.id.toString()),
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      todos: user.todos
    });
  } else {
    throw new AppError('Invalid email or password', 401);
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select('-password');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      xp: user.xp || 0,
      level: user.level || 1,
      currentStreak: user.currentStreak || 0,
      dailyStats: user.dailyStats || [],
      skillStats: user.skillStats || {},
      todos: user.todos || []
    });
  } else {
    throw new AppError('User not found', 404);
  }
});

// @desc    Update User Todos
// @route   PUT /api/auth/todos
// @access  Private
export const updateUserTodos = asyncHandler(async (req: Request, res: Response) => {
  const { todos } = req.body;

  // req.user is set by authMiddleware
  if (!req.user) throw new AppError('Not authorized', 401);

  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  user.todos = todos;
  const updatedUser = await user.save();

  res.json({
    message: 'Todos updated',
    todos: updatedUser.todos
  });
});

// Helper for Social Login
const socialLoginHandler = async (req: Request, res: Response, provider: 'google' | 'github') => {
  const { idToken } = req.body;

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    let { email, uid, picture, name } = decodedToken;

    if (!email) {
      console.warn(`[${provider}] Email missing for UID: ${uid}. Using placeholder.`);
      email = `${uid}@${provider}.placeholder.com`;
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.authMethod !== provider && user.authMethod !== 'email' && !user.email.includes('.placeholder.com')) {
        throw new AppError(`This email is already associated with a ${user.authMethod} account.`, 400);
      }

      user.authMethod = provider;
      if (!user.isVerified) user.isVerified = true;
      await user.save();

    } else {
      user = await User.create({
        email,
        name: name || email?.split('@')[0] || 'User',
        avatar: picture || 'avatar-1',
        authMethod: provider,
        isVerified: true 
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user.id.toString()),
      xp: user.xp,
      level: user.level,
      currentStreak: user.currentStreak,
      todos: user.todos
    });

  } catch (error: any) {
    console.error(`${provider} Auth Error:`, error);
    // If it's already an AppError, rethrow it
    if (error instanceof AppError) throw error;
    throw new AppError(`${provider} Sign-In failed. Invalid token.`, 401);
  }
};

// @desc    Auth user with Google
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  await socialLoginHandler(req, res, 'google');
});

// @desc    Auth user with GitHub
// @route   POST /api/auth/github
// @access  Public
export const githubLogin = asyncHandler(async (req: Request, res: Response) => {
  await socialLoginHandler(req, res, 'github');
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    });
  } else {
    throw new AppError('User not found', 404);
  }
});

// @desc    Verify User Email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const verificationTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    verificationToken: verificationTokenHash
  });

  if (!user) {
    throw new AppError('Invalid or expired verification token.', 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  res.status(200).json({
    message: "Email verified successfully",
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    token: generateToken(user.id.toString()),
    xp: user.xp,
    level: user.level,
    currentStreak: user.currentStreak,
    todos: user.todos
  });
});

// @desc    Forgot Password (Generate OTP & Send Email)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const cleanEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: cleanEmail });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.authMethod === 'google' || user.authMethod === 'github') {
    throw new AppError(`You registered with ${user.authMethod}. Please sign in with that.`, 400);
  }

  // 1. Generate 6-digit OTP
  const resetOTP = crypto.randomInt(100000, 999999).toString();

  // 2. Hash it for the DB
  user.resetPasswordToken = crypto.createHash('sha256').update(resetOTP).digest('hex');
  user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes
  await user.save();

  // 3. Send Email
  const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Reset Your Password</h2>
      <p>You requested a password reset for your Kairon AI account.</p>
      <p>Please use the following code to reset your password:</p>
      
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #333; margin: 0; letter-spacing: 5px;">${resetOTP}</h1>
      </div>

      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Kairon AI - Password Reset Code',
      message,
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (emailError) {
    console.error("Email send failed:", emailError);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    throw new AppError("Email could not be sent", 500);
  }
});

// @desc    Reset Password (Verify OTP & Set New Password)
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  // 1. Hash the incoming OTP
  const resetPasswordTokenHash = crypto.createHash('sha256').update(otp).digest('hex');

  // 2. Find user
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
    resetPasswordToken: resetPasswordTokenHash,
    resetPasswordExpire: { $gt: new Date() }
  });

  if (!user) {
    throw new AppError("Invalid Code or Expired", 400);
  }

  // 3. Update Password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });
});

// @desc    Update User Progress (XP, Streak, & Stats)
// @route   PUT /api/auth/progress
// @access  Private
export const updateUserProgress = asyncHandler(async (req: Request, res: Response) => {
  const { xpGained, category, timezoneOffset } = req.body; //

  if (!req.user) throw new AppError('Not authorized', 401);

  const user = await User.findById(req.user.id);
  if (!user) throw new AppError('User not found', 404);

  // --- STREAK LOGIC START ---
  
  // Helper: Normalize a date to User's Local Midnight (represented in UTC)
  const getUserMidnight = (date: Date, offsetMinutes: number) => {
    if (!date) return null;
    // Adjust UTC time by the offset to get "Local Time"
    // offsetMinutes is positive for West (behind UTC) and negative for East (ahead UTC).
    // JS Date logic: Local = UTC - offset.
    // So we subtract the offset to shift the timestamp to "User's Local Time".
    const localTime = new Date(date.getTime() - (offsetMinutes * 60 * 1000));
    
    // Set to midnight (00:00:00)
    localTime.setUTCHours(0, 0, 0, 0);
    return localTime;
  };

  // Use provided offset or default to 0 (UTC)
  const offset = typeof timezoneOffset === 'number' ? timezoneOffset : 0;

  const today = new Date();
  const todayMidnight = getUserMidnight(today, offset);

  // Normalize the stored Last Study Date using the SAME offset
  const lastStudy = user.lastStudyDate ? new Date(user.lastStudyDate) : null;
  const lastStudyMidnight = lastStudy ? getUserMidnight(lastStudy, offset) : null;

  if (!lastStudyMidnight || !todayMidnight) {
    user.currentStreak = 1;
  } else if (lastStudyMidnight.getTime() !== todayMidnight.getTime()) {
    // Calculate difference in days between the two Midnights
    const diffTime = Math.abs(todayMidnight.getTime() - lastStudyMidnight.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); // Use round for safety

    if (diffDays === 1) {
      // Exactly 1 day difference (Consecutive)
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else {
      // More than 1 day difference (Missed a day)
      user.currentStreak = 1;
    }
  }
  // If dates are equal (Same Day), do nothing to streak.

  user.lastStudyDate = new Date(); // Save current server time for next reference
  // --- STREAK LOGIC END ---

  // XP & Level Logic (Existing Code)
  user.xp = (user.xp || 0) + xpGained;
  user.level = Math.floor(user.xp / 100) + 1;

  // Analytics Logic (Existing Code)
  // Use the Local Date String for stats so the graph matches user's timezone
  const dateString = new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];

  if (!user.dailyStats) user.dailyStats = [];
  const todayStatIndex = user.dailyStats.findIndex(s => s.date === dateString);
  if (todayStatIndex >= 0) {
    user.dailyStats[todayStatIndex].xp += xpGained;
  } else {
    if (user.dailyStats.length > 30) user.dailyStats.shift();
    user.dailyStats.push({ date: dateString, xp: xpGained });
  }

  if (category) {
    if (!user.skillStats) user.skillStats = new Map();
    const currentSkillXp = user.skillStats.get(category) || 0;
    user.skillStats.set(category, currentSkillXp + xpGained);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    avatar: updatedUser.avatar,
    xp: updatedUser.xp,
    level: updatedUser.level,
    currentStreak: updatedUser.currentStreak,
    dailyStats: updatedUser.dailyStats,
    skillStats: updatedUser.skillStats,
    todos: updatedUser.todos
  });
});


// @desc    Resend Verification Email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.isVerified) {
    throw new AppError("This account is already verified.", 400);
  }

  // Generate NEW Token
  const verificationToken = crypto.randomInt(100000, 999999).toString();
  const verificationTokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

  // Update User
  user.verificationToken = verificationTokenHash;
  await user.save();

  // Send Email
  const message = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Verify Your Email</h2>
      <p>You requested a new verification code for Kairon AI.</p>
      <p>Please use the following OTP to verify your account:</p>
      
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
        <h1 style="color: #333; margin: 0; letter-spacing: 5px;">${verificationToken}</h1>
      </div>

      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Kairon AI - New Verification Code',
    message,
  });

  res.status(200).json({ message: "Verification code sent" });
});


// @desc    Export all user data
// @route   GET /api/auth/export
// @access  Private
export const exportUserData = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError('Not authorized', 401);

    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw new AppError('User not found', 404);

    const projects = await StudyProject.find({ owner: req.user.id });

    const exportData = {
        user,
        projects,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };

    res.json(exportData);
});