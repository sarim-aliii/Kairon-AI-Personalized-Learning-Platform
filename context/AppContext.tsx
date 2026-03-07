import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
    Tab,
    Notification,
    NotificationType,
    User,
    StudyProject,
    ChatMessage,
    Flashcard,
    LessonPlan,
    StudyPlan,
    ConceptMapData,
    LoginCredentials,
    SignupCredentials,
    Todo
} from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import * as api from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../firebase';
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { updateTodos as apiUpdateTodos } from '../services/api';


interface AppContextType {
    // Auth
    isAuthenticated: boolean;
    currentUser: User | null;
    loading: boolean; 
    login: (credentials: LoginCredentials) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithGithub: () => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
    updateUserAvatar: (avatar: string) => Promise<void>;
    updateUserName: (name: string) => Promise<void>;
    updateProgress: (xp: number, category?: string) => Promise<void>;
    updateUserTodos: (todos: Todo[]) => Promise<void>;

    // Projects
    projects: StudyProject[];
    activeProjectId: string | null;
    activeProject: StudyProject | null;
    ingestedText: string;
    loadProject: (id: string) => void;
    startNewStudy: () => Promise<void>;
    renameProject: (id: string, newName: string) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    updateActiveProjectData: (data: Partial<StudyProject>) => Promise<void>;
    updateProjectData: (id: string, data: Partial<StudyProject>) => Promise<void>;
    ingestText: (name: string, text: string, shouldRedirect?: boolean) => Promise<StudyProject | null>;

    // UI State
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    theme: 'dark' | 'light';
    toggleTheme: () => void;

    // AI Generation State & Functions
    llm: string;
    setLlm: (model: string) => void;
    language: string;
    setLanguage: (lang: string) => void;

    isGeneratingSummary: boolean;
    generateSummaryForActiveProject: () => Promise<void>;

    isGeneratingFlashcards: boolean;
    generateFlashcardsForActiveProject: () => Promise<void>;

    isTutorResponding: boolean;
    sendTutorMessage: (message: string) => Promise<string | undefined>;

    isGeneratingConceptMap: boolean;
    generateConceptMapForActiveProject: () => Promise<void>;

    isGeneratingLessonPlan: boolean;
    generateLessonPlanForActiveProject: (topic: string) => Promise<void>;

    isGeneratingStudyPlan: boolean;
    generateStudyPlanForActiveProject: (days: number) => Promise<void>;

    // Notifications
    notifications: Notification[];
    addNotification: (message: string, type?: NotificationType) => void;
    removeNotification: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useLocalStorage<string | null>('authToken', null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useLocalStorage<Tab>('activeTab', Tab.Ingest);

    const [projects, setProjects] = useState<StudyProject[]>([]);
    const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const [llm, setLlm] = useLocalStorage('llm', 'amazon.nova-pro-v1:0');
    const [language, setLanguage] = useLocalStorage('language', 'English');
    const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');

    // Loading states for AI features
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
    const [isTutorResponding, setIsTutorResponding] = useState(false);
    const [isGeneratingConceptMap, setIsGeneratingConceptMap] = useState(false);
    const [isGeneratingLessonPlan, setIsGeneratingLessonPlan] = useState(false);
    const [isGeneratingStudyPlan, setIsGeneratingStudyPlan] = useState(false);

    const isAuthenticated = !!userToken && !!currentUser;

    const activeProject = projects.find(p => p._id === activeProjectId) || null;
    const ingestedText = activeProject?.ingestedText || '';

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    // Notifications
    const addNotification = useCallback((message: string, type: NotificationType = 'error') => {
        const newNotification = { id: Date.now(), message, type };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, 5000);
    }, []);

    const removeNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const updateUserName = async (name: string) => {
        if (!currentUser) return;
        try {
            const updatedUser = await api.updateProfile({ name });
            setCurrentUser(updatedUser);
            addNotification("Username updated!", "success");
        } catch (error: any) {
            addNotification(error.message || "Failed to update username");
        }
    };

    const updateUserAvatar = async (avatar: string) => {
        if (!currentUser) return;
        setCurrentUser({ ...currentUser, avatar });
        try {
            await api.updateProfile({ avatar });
            addNotification("Avatar updated!", "success");
        } catch (e: any) {
            addNotification("Failed to save avatar", "error");
        }
    };

    // --- GAMIFICATION---
    const updateProgress = async (xpGained: number, category?: string) => {
        if (!currentUser) return;
        try {
            // Get local timezone offset in minutes (e.g., -330 for India)
            const timezoneOffset = new Date().getTimezoneOffset();
            const updatedUser = await api.updateUserProgress(xpGained, category, timezoneOffset);
            
            if (updatedUser.level > (currentUser.level || 1)) {
                addNotification(`🎉 Level Up! You are now Level ${updatedUser.level}!`, 'success');
            }
            
            setCurrentUser(updatedUser);
        } catch (error: any) {
            console.error("Failed to update progress", error);
        }
    };

    // --- TODO LOGIC ---
    const updateUserTodos = async (todos: Todo[]) => {
        if (!currentUser) return;

        setCurrentUser(prev => prev ? ({ ...prev, todos }) : null);

        try {
            await apiUpdateTodos(todos);
        } catch (error: any) {
            console.error("Failed to save todos", error);
        }
    };


    // Projects Fetcher Logic
    const fetchProjects = useCallback(async () => {
        const token = userToken;
        if (token) {
            try {
                const fetchedProjects = await api.getProjects();
                setProjects(fetchedProjects);
            }
            catch (error: any) {
                console.error("Failed to fetch projects", error);
            }
        }
    }, [userToken]);

    // --- LOGOUT ---
    const logout = useCallback(() => {
        setUserToken(null);
        setCurrentUser(null);
        setProjects([]);
        setActiveProjectId(null);
        api.setAuthToken(null);
        setActiveTab(Tab.Ingest);
    }, [setUserToken, setActiveProjectId, setActiveTab]);


    // --- INITIAL AUTH CHECK ---
    // This effect runs on mount to check if the token in local storage is valid
    useEffect(() => {
        const initAuth = async () => {
            setLoading(true);
            if (userToken) {
                api.setAuthToken(userToken);
                try {
                    const user = await api.getProfile();
                    setCurrentUser(user);
                    // Only fetch projects if profile fetch succeeded
                    const projectsData = await api.getProjects();
                    setProjects(projectsData);
                } catch (error) {
                    console.error("Profile check failed", error);
                    logout(); // Token was invalid or expired
                }
            }
            setLoading(false); // Done loading regardless of success/fail
        };

        initAuth();
    }, []); // Run once on mount


    // Auth Functions
    const login = async (credentials: LoginCredentials) => {
        try {
            const data = await api.login(credentials);
            setUserToken(data.token);
            setCurrentUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                xp: data.xp,
                level: data.level,
                currentStreak: data.currentStreak,
                todos: data.todos || []
            });
            api.setAuthToken(data.token);
            await fetchProjects();
        } catch (error: any) {
            addNotification(error.message || 'Login failed.');
            throw error;
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        try {
            await api.signup(credentials);
            addNotification('Sign up successful! Please check your email for the verification code.', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Sign up failed.');
            throw error;
        }
    };

    const handleSocialLoginSuccess = async (data: any, providerName: string) => {
        setUserToken(data.token);
        setCurrentUser({
            _id: data._id,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            xp: data.xp,
            level: data.level,
            currentStreak: data.currentStreak
        });
        api.setAuthToken(data.token);
        await fetchProjects();
        addNotification(`Logged in with ${providerName}!`, 'success');
    };

    const loginWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const data = await api.googleLogin(idToken);
            await handleSocialLoginSuccess(data, 'Google');
        }
        catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') return;
            addNotification(error.message || 'Google login failed.');
            throw error;
        }
    };

    const loginWithGithub = async () => {
        try {
            const provider = new GithubAuthProvider();
            provider.addScope('user:email');
            provider.addScope('read:user');

            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();
            const data = await api.githubLogin(idToken);
            await handleSocialLoginSuccess(data, 'GitHub');
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') return;
            addNotification(error.message || 'GitHub login failed.');
            throw error;
        }
    };

    const verifyEmail = async (token: string) => {
        try {
            const data = await api.verifyEmail(token);
            setUserToken(data.token);
            setCurrentUser({
                _id: data._id,
                name: data.name,
                email: data.email,
                avatar: data.avatar,
                xp: data.xp,
                level: data.level,
                currentStreak: data.currentStreak,
                todos: data.todos || []
            });
            api.setAuthToken(data.token);
            await fetchProjects();
            addNotification('Email verified successfully! Logging you in...', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Email verification failed.');
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            await api.forgotPassword(email);
            addNotification('If an account exists, a reset email has been sent.', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Failed to request password reset.');
            throw error;
        }
    };

    const resetPassword = async (token: string, newPassword: string) => {
        try {
            await api.resetPassword(token, newPassword);
            addNotification('Password reset successfully! Please log in.', 'success');
        } catch (error: any) {
            addNotification(error.message || 'Password reset failed.');
            throw error;
        }
    };

    const loadProject = (id: string) => setActiveProjectId(id);

    const startNewStudy = async () => {
        setActiveProjectId(null);
        setActiveTab(Tab.Ingest);
    };

    const ingestText = async (name: string, text: string, shouldRedirect: boolean = true) => {
        try {
            const newProject = await api.createProject({ name, ingestedText: text });
            setProjects(prev => [newProject, ...prev]);
            setActiveProjectId(newProject._id);
            addNotification(`Study "${name}" created!`, 'success');
            
            if (shouldRedirect) {
                setActiveTab(Tab.Summary);
            }
            
            return newProject;
        } catch (error: any) {
            addNotification(error.message || "Failed to create study.");
            return null;
        }
    };

    const renameProject = async (id: string, newName: string) => {
        try {
            await api.updateProject(id, { name: newName });
            await fetchProjects();
        } catch (error: any) {
            addNotification(error.message || "Failed to rename study.");
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await api.deleteProject(id);
            const remainingProjects = projects.filter(p => p._id !== id);
            setProjects(remainingProjects);
            if (activeProjectId === id) {
                setActiveProjectId(null);
            }
        } catch (error: any) {
            addNotification(error.message || "Failed to delete study.");
        }
    };

    const updateProjectData = async (id: string, data: Partial<StudyProject>) => {
        try {
            setProjects(prev => prev.map(p => p._id === id ? { ...p, ...data } : p));
            await api.updateProject(id, data);
        } catch (error: any) {
            addNotification(error.message || "Failed to save changes.", 'error');
            await fetchProjects();
        }
    };

    const updateActiveProjectData = async (data: Partial<StudyProject>) => {
        if (activeProjectId) {
            await updateProjectData(activeProjectId, data);
        }
    };

    const generateSummaryForActiveProject = async () => {
        if (!activeProject) return;
        setIsGeneratingSummary(true);
        try {
            const summary = await api.generateContent(activeProject._id, 'summary', { llm, language });
            await updateActiveProjectData({ summary });
        } catch (e: any) { addNotification(e.message); }
        finally { setIsGeneratingSummary(false); }
    };

    const generateFlashcardsForActiveProject = async () => {
        if (!activeProject) return;
        setIsGeneratingFlashcards(true);
        try {
            const flashcards: Flashcard[] = await api.generateContent(activeProject._id, 'flashcards', { llm, language });
            const srsFlashcards = flashcards.map(fc => ({
                ...fc,
                id: uuidv4(),
                easeFactor: 2.5,
                interval: 0,
                dueDate: new Date().toISOString(),
            }));
            await updateActiveProjectData({ srsFlashcards });
        } catch (e: any) { addNotification(e.message); }
        finally { setIsGeneratingFlashcards(false); }
    };

    const sendTutorMessage = async (message: string) => {
        if (!activeProject) return;

        const newHistory: ChatMessage[] = [...(activeProject.aiTutorHistory || []), { role: 'user', content: message }];
        setProjects(prev => prev.map(p => p._id === activeProjectId ? { ...p, aiTutorHistory: newHistory } : p));

        setIsTutorResponding(true);

        try {
            const responseText = await api.generateContent(activeProject._id, 'tutor', { message, history: newHistory, llm, language });
            const updatedHistory: ChatMessage[] = [...newHistory, { role: 'model', content: responseText }];
            await updateActiveProjectData({ aiTutorHistory: updatedHistory });
            return responseText;
        } catch (e: any) {
            addNotification(e.message);
            const errorHistory: ChatMessage[] = [...newHistory, { role: 'model', content: "Sorry, I encountered an error." }];
            setProjects(prev => prev.map(p => p._id === activeProjectId ? { ...p, aiTutorHistory: errorHistory } : p));
        }
        finally { setIsTutorResponding(false); }
    };

    const generateConceptMapForActiveProject = async () => {
        if (!activeProject) return;
        setIsGeneratingConceptMap(true);
        try {
            const conceptMapData: ConceptMapData = await api.generateContent(activeProject._id, 'concept-map', { llm, language });
            await updateActiveProjectData({ conceptMapData });
        } catch (e: any) { addNotification(e.message); }
        finally { setIsGeneratingConceptMap(false); }
    };

    const generateLessonPlanForActiveProject = async (topic: string) => {
        if (!activeProject) return;
        setIsGeneratingLessonPlan(true);
        try {
            const lessonPlan: LessonPlan = await api.generateContent(activeProject._id, 'lesson-plan', { topic, llm, language });
            await updateActiveProjectData({ lessonPlan });
        } catch (e: any) { addNotification(e.message); }
        finally { setIsGeneratingLessonPlan(false); }
    };

    const generateStudyPlanForActiveProject = async (days: number) => {
        if (!activeProject) return;
        setIsGeneratingStudyPlan(true);
        try {
            const studyPlan: StudyPlan = await api.generateContent(activeProject._id, 'study-plan', { days, llm, language });
            await updateActiveProjectData({ studyPlan });
        } catch (e: any) { addNotification(e.message); }
        finally { setIsGeneratingStudyPlan(false); }
    };

    const value = {
        isAuthenticated,
        currentUser,
        loading, // <--- EXPOSED
        login,
        loginWithGoogle,
        loginWithGithub,
        signup,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        updateUserAvatar,
        projects,
        activeProjectId,
        activeProject,
        ingestedText,
        loadProject,
        startNewStudy,
        ingestText,
        renameProject,
        deleteProject,
        updateActiveProjectData,
        updateProjectData,
        updateUserName,
        updateUserTodos,
        activeTab,
        setActiveTab,
        isSidebarCollapsed,
        toggleSidebar: () => setIsSidebarCollapsed(prev => !prev),
        llm,
        setLlm,
        language,
        setLanguage,
        notifications,
        addNotification,
        removeNotification,
        isGeneratingSummary,
        generateSummaryForActiveProject,
        isGeneratingFlashcards,
        generateFlashcardsForActiveProject,
        isTutorResponding,
        sendTutorMessage,
        isGeneratingConceptMap,
        generateConceptMapForActiveProject,
        isGeneratingLessonPlan,
        generateLessonPlanForActiveProject,
        isGeneratingStudyPlan,
        generateStudyPlanForActiveProject,
        theme,
        toggleTheme,
        updateProgress,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};