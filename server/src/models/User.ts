import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Todo } from '../../../types';

interface IUser {
  email: string;
  password?: string; 
  name?: string;
  avatar?: string;
  authMethod?: 'email' | 'google' | 'github';
  isVerified?: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  // Gamification Fields
  xp: number;
  level: number;
  currentStreak: number;
  lastStudyDate?: Date;
  // NEW: Analytics Fields
  dailyStats: { date: string; xp: number }[];
  skillStats: Map<string, number>; 
  // Global Todos
  todos: Todo[]; 
}

interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserDocument extends IUser, IUserMethods, Document {}

interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    default: 'avatar-1',
  },
  name: {
    type: String,
    default: 'Kairon User', 
  },
  authMethod: {
    type: String,
    enum: ['email', 'google', 'github'],
    default: 'email',
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Gamification Defaults
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  currentStreak: { type: Number, default: 0 },
  lastStudyDate: { type: Date, default: null },

  // NEW: Analytics
  dailyStats: [{ 
    date: String, // Format: YYYY-MM-DD
    xp: Number 
  }],
  skillStats: {
    type: Map,
    of: Number,
    default: {}
  },
  
  // Global Todos
  todos: { type: [Object], default: [] } 
}, {
  timestamps: true,
});

userSchema.pre<IUserDocument>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;