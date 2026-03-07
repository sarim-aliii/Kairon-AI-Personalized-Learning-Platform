import dotenv from 'dotenv';
dotenv.config();
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import { createServer } from 'http'; 
import { Server } from 'socket.io';
import { setupQuizSocket } from './sockets/quizSocket';

// Added NextFunction to imports
import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/db';
import path from 'path';

// Import routes
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import bedrockRoutes from './routes/bedrockRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import socialRoutes from './routes/socialRoutes';
import githubRoutes from './routes/githubRoutes';

import { errorHandler } from './middleware/errorMiddleware';
import { AppError } from './utils/AppError';

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:5173'
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Setup Game Logic
setupQuizSocket(io);

// Body parser middleware
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(helmet());

// Global Limiter (General API protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', globalLimiter);

const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, 
    message: { message: 'AI generation limit reached. Please wait a few minutes.' }
});
app.use('/api/amazon', aiLimiter);

app.use(hpp());

app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:5173' 
    ], 
    credentials: true
}));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/amazon', bedrockRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/github', githubRoutes);

// Handle Unhandled API Routes
app.all('/api/*', (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../build')));

    app.get('*', (req: Request, res: Response) => 
        res.sendFile(path.resolve(__dirname, '../../build', 'index.html'))
    );
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
console.log(PORT)

httpServer.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));