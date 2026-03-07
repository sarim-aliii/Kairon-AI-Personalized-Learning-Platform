import mongoose, { Document, Model, Schema } from 'mongoose';

interface Flashcard {
  question: string;
  answer: string;
}

interface SRFlashcard extends Flashcard {
  id: string;
  easeFactor: number;
  interval: number;
  dueDate: string;
}

interface IStudyProject {
  name: string;
  owner: mongoose.Types.ObjectId;
  ingestedText: string;
  status: 'processing' | 'ready' | 'error';
  summary?: string;
  srsFlashcards?: SRFlashcard[];
  
  // We use specific types where simple, 'any' or 'Object' for complex frontend types
  mcqAttempts?: any[];
  currentMcqs?: any[];
  semanticSearchHistory?: string[];
  aiTutorHistory?: any[];
  essayTopic?: string;
  essayOutline?: any;
  essayArguments?: string;
  conceptMapData?: any; // Avoiding d3 dependency here
  lessonPlan?: any;
  studyPlan?: any;
  codeSnippet?: string;
  codeAnalysis?: any;
  todos?: any[];
  chunks?: string[];
  embeddings?: number[][];
  
  // Social Features
  sharedWith: mongoose.Types.ObjectId[]; 
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// --- SCHEMA DEFINITION ---

const FlashcardSchema = new Schema({
    id: String,
    question: String,
    answer: String,
    easeFactor: Number,
    interval: Number,
    dueDate: Date
});

export interface IStudyProjectDocument extends IStudyProject, Document {}
interface IStudyProjectModel extends Model<IStudyProjectDocument> {}

const studyProjectSchema = new Schema<IStudyProjectDocument, IStudyProjectModel>({
  name: { type: String, required: true, trim: true },
  owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  ingestedText: { type: String, required: true },
  status: { type: String, enum: ['processing', 'ready', 'error'], default: 'ready' },
  summary: { type: String },
  srsFlashcards: [FlashcardSchema],
  
  // Use generic Object types for complex nested structures
  mcqAttempts: { type: [Object], default: [] },
  currentMcqs: { type: [Object], default: [] },
  semanticSearchHistory: { type: [String], default: [] },
  aiTutorHistory: { type: [Object], default: [] },
  essayTopic: { type: String },
  essayOutline: { type: Object },
  essayArguments: { type: String },
  conceptMapData: { type: Object },
  lessonPlan: { type: Object },
  studyPlan: { type: Object },
  codeSnippet: { type: String },
  codeAnalysis: { type: Object },
  todos: { type: [Object], default: [] },
  chunks: { type: [String], default: [] }, 
  embeddings: { type: [[Number]], default: [] },
  
  // Shared Users
  sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  
}, {
  timestamps: true,
});

const StudyProject = mongoose.model<IStudyProjectDocument, IStudyProjectModel>('StudyProject', studyProjectSchema);

export default StudyProject;