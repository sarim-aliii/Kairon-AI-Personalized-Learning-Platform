import axios from 'axios';
import {
  LoginCredentials,
  SignupCredentials,
  StudyProject,
  Flashcard,
  CodeAnalysisResult,
  PodcastSegment
} from '../types';
import axiosInstance from './axiosInstance';



// ---------------------------------------
export interface SearchResult {
  text: string;
  score: number;
  projectName?: string;
  projectId?: string;
}

export interface LeaderboardUser {
  _id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  currentStreak: number;
}

export interface SlideData {
  title: string;
  bullets: string[];
  speakerNotes: string;
}


const API_URL = '/api';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

// --- Auth ---
export const login = async (credentials: LoginCredentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const signup = async (credentials: SignupCredentials) => {
  const { data } = await api.post('/auth/register', credentials);
  return data;
};

export const googleLogin = async (idToken: string) => {
  const { data } = await api.post('/auth/google', { idToken });
  return data;
};

export const githubLogin = async (idToken: string) => {
  const { data } = await api.post('/auth/github', { idToken });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/profile');
  return data;
};

export const updateProfile = async (userData: { name?: string; avatar?: string }) => {
  const { data } = await api.put('/auth/profile', userData);
  return data;
};

export const verifyEmail = async (token: string) => {
  const { data } = await api.post('/auth/verify-email', { token });
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPassword = async (data: { email: string; otp: string; password: string }) => {
  const response = await api.post('/auth/reset-password', data);
  return response.data;
};

export const updateUserProgress = async (xpGained: number, category?: string, timezoneOffset?: number) => {
  const { data } = await api.put('/auth/progress', { xpGained, category, timezoneOffset });
  return data;
};

// --- Feedback ---
export const sendFeedback = async (type: string, message: string) => {
  const { data } = await api.post('/feedback', { type, message });
  return data;
};


// --- Projects ---
export const getProjects = async (): Promise<StudyProject[]> => {
  const { data } = await api.get('/projects');
  return data;
};

export const createProject = async (projectData: { name: string, ingestedText: string }): Promise<StudyProject> => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

export const updateProject = async (id: string, projectData: Partial<StudyProject>): Promise<StudyProject> => {
  const { data } = await api.put(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id: string) => {
  await api.delete(`/projects/${id}`);
};

// --- amazon AI ---
export const generateContent = async (
  projectId: string,
  feature: 'summary' | 'flashcards' | 'tutor' | 'concept-map' | 'lesson-plan' | 'study-plan',
  options: any
) => {
  const { data } = await api.post(`/amazon/${feature}`, { projectId, ...options });
  return data;
};

export const extractTextFromFile = async (llm: string, base64Data: string, fileType: string): Promise<string> => {
  const { data } = await api.post('/amazon/extract-text', { llm, base64Data, fileType });
  return data;
};

export const generateMCQs = async (llm: string, text: string, language: string, difficulty: string, numQuestions: number): Promise<any[]> => {
  const { data } = await api.post('/amazon/generate-mcqs', { llm, text, language, difficulty, numQuestions });
  return data;
};

export const generatePersonalizedStudyGuide = async (llm: string, text: string, incorrectMCQs: any[], language: string): Promise<string> => {
  const { data } = await api.post('/amazon/generate-study-guide', { llm, text, incorrectMCQs, language });
  return data;
};

export const fetchTopicInfo = async (llm: string, topic: string, language: string): Promise<string> => {
  const { data } = await api.post('/amazon/topic-info', { llm, topic, language });
  return data;
};

export const transcribeAudio = async (llm: string, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('llm', llm);
  formData.append('fileType', file.type);

  const { data } = await api.post('/amazon/transcribe', formData);
  return data;
};

export const generateSummary = async (llm: string, text: string, language: string): Promise<string> => {
  const { data } = await api.post('/amazon/summary-from-text', { llm, text, language });
  return data;
};

export const generateFlashcards = async (llm: string, text: string, language: string): Promise<Flashcard[]> => {
  const { data } = await api.post('/amazon/flashcards-from-text', { llm, text, language });
  return data as Flashcard[];
};

export const generateAnswer = async (llm: string, text: string, question: string, language: string): Promise<string> => {
  const { data } = await api.post('/amazon/answer-from-text', { llm, text, question, language });
  return data;
};

export const performSemanticSearch = async (
  llm: string,
  text: string,
  query: string,
  topK: number,
  projectId?: string,
  global: boolean = false
): Promise<SearchResult[]> => { // Changed return type to array of objects
  const { data } = await api.post('/amazon/semantic-search', {
    text,
    query,
    topK,
    llm,
    projectId, // Pass specific project ID
    global     // Pass global flag
  });

  // Backwards compatibility: if API returns strings, wrap them
  if (data.length > 0 && typeof data[0] === 'string') {
    return data.map((str: string) => ({ text: str, score: 0 }));
  }

  return data as SearchResult[];
};

export const generateConceptMapFromText = async (llm: string, text: string, language: string) => {
  const { data } = await api.post('/amazon/concept-map-from-text', { llm, text, language });
  return data;
};

export const generateLessonPlanFromText = async (llm: string, text: string, topic: string, language: string) => {
  const { data } = await api.post('/amazon/lesson-plan-from-text', { llm, text, topic, language });
  return data;
};

export const generateStudyPlanFromText = async (llm: string, text: string, days: number, language: string) => {
  const { data } = await api.post('/amazon/study-plan-from-text', { llm, text, days, language });
  return data;
};

export const getTutorResponseFromText = async (llm: string, text: string, history: any[], message: string, language: string) => {
  const { data } = await api.post('/amazon/tutor-from-text', { llm, text, history, message, language });
  return data;
};

export const generateEssayOutlineFromText = async (llm: string, text: string, topic: string, language: string) => {
  const { data } = await api.post('/amazon/essay-outline-from-text', { llm, text, topic, language });
  return data;
};

export const generateEssayArgumentsFromText = async (llm: string, text: string, topic: string, language: string) => {
  const { data } = await api.post('/amazon/essay-arguments-from-text', { llm, text, topic, language });
  return data;
};

export const generateConceptMapForTopic = async (llm: string, topic: string, language: string) => {
  const { data } = await api.post('/amazon/concept-map-from-topic', { llm, topic, language });
  return data;
};

export const transcribeYoutube = async (llm: string, url: string): Promise<string> => {
  const { data } = await api.post('/amazon/transcribe-youtube', { llm, url });
  return data;
};

export const generateCodeAnalysis = async (llm: string, code: string, language: string): Promise<CodeAnalysisResult> => {
  const { data } = await api.post('/amazon/code-analysis/generate', { llm, code, language });
  return data as CodeAnalysisResult;
};

export const explainCodeAnalysis = async (llm: string, artifact: string, language: string, explanationType: string): Promise<string> => {
  const { data } = await api.post('/amazon/code-analysis/explain', { llm, artifact, language, explanationType });
  return data;
};

export const conductMockInterview = async (llm: string, topic: string, message: string, history: any[], language: string, difficulty: string) => {
  const { data } = await api.post('/amazon/mock-interview', { llm, topic, message, history, language, difficulty });
  return data;
};

export const updateTodos = async (todos: any[]) => {
  const { data } = await api.put('/auth/todos', { todos });
  return data;
};

export const generatePodcastScript = async (llm: string, projectId: string, language: string): Promise<PodcastSegment[]> => {
  const { data } = await api.post('/amazon/podcast-script', { llm, projectId, language });
  return data;
};

export const resendVerification = async (email: string) => {
  const response = await axiosInstance.post('/auth/resend-verification', { email });
  return response.data;
};

export const getLeaderboard = async (): Promise<LeaderboardUser[]> => {
  const response = await axiosInstance.get('/social/leaderboard');
  return response.data;
};

export const shareProjectWithUser = async (projectId: string, email: string) => {
  const response = await axiosInstance.post(`/projects/${projectId}/share`, { email });
  return response.data;
};

export const generateSlideContent = async (llm: string, projectId: string, topic: string, language: string): Promise<SlideData[]> => {
  const { data } = await api.post('/amazon/slides', { llm, projectId, topic, language });
  return data;
};

export const getDueFlashcards = async (): Promise<StudyProject[]> => {
  const { data } = await api.get('/projects/due-flashcards');
  return data;
};

export const scrapeWebPage = async (url: string): Promise<{ title: string, content: string }> => {
  const { data } = await api.post('/amazon/scrape-url', { url });
  return data;
};

export const exportUserData = async () => {
  const { data } = await api.get('/auth/export');
  return data;
};

export const transformText = async (llm: string, text: string, selection: string, instruction: string, language: string): Promise<string> => {
  const { data } = await api.post('/amazon/transform', { llm, text, selection, instruction, language });
  return data;
};

export const defineTerm = async (llm: string, term: string, context: string, language: string): Promise<string> => {
  const { data } = await api.post('/amazon/define', { llm, term, context, language });
  return data.definition;
};

export const analyzeGitHubRepo = async (llm: string, repoUrl: string, language: string) => {
    const { data } = await api.post('/github/scan', { llm, repoUrl, language });
    return data;
};


export default api;