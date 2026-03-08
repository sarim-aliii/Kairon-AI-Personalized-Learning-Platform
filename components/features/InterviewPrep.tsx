import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { getTutorResponse } from '../../services/amazonService';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Difficulty, Category, Tab } from '../../types';
import {
    dsaTop150,
    dsaBlind75,
    dsaLeetCode75
} from '../constants/dsaQuestions';
import {
    webQuestions,
    webFundamentals,
    webAdvancedFrontend,
    webSystemAndArchitecture
} from '../constants/webQuestions';
import {
    mobileQuestions,
    mobileFundamentals,
    mobileAdvanced,
    mobileSystemAndArchitecture
} from '../constants/mobileQuestions';
import {
    cnQuestions,
    cnFundamentals,
    cnAdvanced,
    cnSystemAndArchitecture
} from '../constants/cnQuestions';
import {
    oodQuestions,
    oodFundamentals,
    oodAdvanced,
    oodSystemAndArchitecture
} from '../constants/oodQuestions';
import {
    sysQuestions,
    sysFundamentals,
    sysAdvanced,
    sysDeepDiveAndArchitecture,
} from "../constants/sysQuestions";
import {
    genaiQuestions,
    genaiFundamentals,
    genaiAdvanced,
    genaiSystemAndArchitecture
} from '../constants/genaiQuestions';
import {
    cloudQuestions,
    cloudFundamentals,
    cloudAdvanced,
    cloudSystemAndArchitecture
} from '../constants/cloudQuestions';
import {
    securityQuestions,
    securityFundamentals,
    securityAdvanced,
    securitySystemAndArchitecture
} from '../constants/securityQuestions';
import {
    hrQuestions,
    hrFundamentals,
    hrBehavioral,
    hrLeadershipAndCritical
} from '../constants/hrQuestions';
import {
    dbmsQuestions,
    dbmsFundamentals,
    dbmsAdvanced,
    dbmsSystemAndArchitecture
} from '../constants/dbmsQuestions';
import {
    osQuestions,
    osFundamentals,
    osAdvanced,
    osSystemAndArchitecture
} from '../constants/osQuestions';


import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { MockInterview } from './MockInterview';

// --- DATA STRUCTURES (INTERVIEW_DATA array remains the same) ---
const INTERVIEW_DATA: Category[] = [
    {
        id: 'dsa',
        title: 'Data Structures & Algo',
        description: 'Top 100 Questions: Arrays, Trees, Graphs & DP.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
            </svg>
        ),
        questions: dsaTop150
    },
    {
        id: 'web',
        title: 'Web Development',
        description: 'React, Node.js, CSS, and System Architecture.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
            </svg>
        ),
        questions: webQuestions
    },
    {
        id: 'mobile',
        title: 'Mobile App Dev',
        description: 'React Native, Flutter, iOS, and Android concepts.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
            </svg>
        ),
        questions: mobileQuestions
    },
    {
        id: 'networks',
        title: 'Computer Networks',
        description: 'OSI Model, TCP/IP, Protocols, and Security.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
            </svg>
        ),
        questions: cnQuestions
    },
    {
        id: 'ood',
        title: 'Object-Oriented Design',
        description: 'Design Patterns, SOLID Principles, and UML.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        ),
        questions: oodQuestions
    },
    {
        id: 'system',
        title: 'System Design',
        description: 'Scalability, Load Balancing, Databases, and CAP Theorem.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
            </svg>
        ),
        questions: sysQuestions
    },
    {
        id: 'genai',
        title: 'Generative AI & LLMs',
        description: 'Transformers, RAG, Prompt Engineering.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                />
            </svg>
        ),
        questions: genaiQuestions
    },
    {
        id: 'cloud',
        title: 'Cloud & DevOps',
        description: 'AWS, Docker, Kubernetes, CI/CD.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
            </svg>
        ),
        questions: cloudQuestions
    },
    {
        id: 'dbms',
        title: 'Database Management Systems',
        description: 'SQL, Normalization, Transactions, Indexing & Query Optimization.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6v10a2 2 0 002 2h12a2 2 0 002-2V6m-16 0a6 6 0 006 6h4a6 6 0 006-6M4 6a6 6 0 016-6h4a6 6 0 016 6"
                />
            </svg>
        ),
        questions: dbmsQuestions
    },
    {
        id: 'os',
        title: 'Operating Systems',
        description: 'Processes, Threads, Scheduling, Memory, File Systems, Concurrency.',
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L8 21l4-1.75L16 21l-1.75-4M12 3v10m9 4a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        ),
        questions: osQuestions
    },
    {
        id: 'security',
        title: 'Cybersecurity',
        description: 'OWASP Top 10, Cryptography, Auth.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
            </svg>
        ),
        questions: securityQuestions
    },
    {
        id: 'hr',
        title: 'Behavioral & HR',
        description: 'STAR Method, Soft Skills, Leadership.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0zM7 10a2 2 0 11-4 0 2 2 0z"
                />
            </svg>
        ),
        questions: hrQuestions
    }
];

// --- COMPONENT ---
export const InterviewPrep: React.FC = () => {
    // 1. Added setActiveTab to context destructuring
    const { llm, language, addNotification, updateProgress, setActiveTab } = useAppContext();
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
    const [explanations, setExplanations] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isMockOpen, setIsMockOpen] = useState(false);

    // Persistent state for completed questions
    const [completedQuestions, setCompletedQuestions] = useLocalStorage<string[]>('kairon-interview-completed', []);
    const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
    const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All');

    // ... View states (dsaView, webView, etc.) remain unchanged ...
    const [dsaView, setDsaView] = useState<'menu' | 'top150' | 'blind75' | 'leetcode75'>('menu');
    const [webView, setWebView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [mobileView, setMobileView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [cloudView, setCloudView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [networksView, setNetworksView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [dbmsView, setDbmsView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [genaiView, setGenaiView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [oodView, setOodView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [hrView, setHrView] = useState<'menu' | 'fundamentals' | 'behavioral' | 'leadership'>('menu');
    const [securityView, setSecurityView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [osView, setOsView] = useState<'menu' | 'fundamentals' | 'advanced' | 'system'>('menu');
    const [sysView, setSysView] = useState<'menu' | 'fundamentals' | 'advanced' | 'deepDive'>('menu');


    const getDifficultyColor = (diff: Difficulty) => {
        switch (diff) {
            case 'Easy': return 'text-green-400 border-green-400/30 bg-green-400/10';
            case 'Medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
            case 'Hard': return 'text-red-400 border-red-400/30 bg-red-400/10';
            case 'Concept': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
        }
    };

    const getDifficultyWeight = (d: Difficulty) => {
        switch (d) {
            case 'Concept': return 0;
            case 'Easy': return 1;
            case 'Medium': return 2;
            case 'Hard': return 3;
            default: return 99;
        }
    };

    const toggleComplete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setCompletedQuestions(prev => {
            if (prev.includes(id)) {
                if (selectedCategory) updateProgress(-10, selectedCategory.title);
                return prev.filter(q => q !== id);
            } else {
                addNotification('Marked as complete!', 'success');
                if (selectedCategory) updateProgress(10, selectedCategory.title);
                return [...prev, id];
            }
        });
    };


    const currentQuestions = useMemo(() => {
        if (!selectedCategory) return [];

        if (selectedCategory.id === 'dsa') {
            if (dsaView === 'top150') return dsaTop150;
            if (dsaView === 'blind75') return dsaBlind75;
            if (dsaView === 'leetcode75') return dsaLeetCode75;
            return []; // DSA menu view
        }

        if (selectedCategory.id === 'web') {
            if (webView === 'fundamentals') return webFundamentals;
            if (webView === 'advanced') return webAdvancedFrontend;
            if (webView === 'system') return webSystemAndArchitecture;
            return []; // Web menu view
        }

        if (selectedCategory.id === 'mobile') {
            if (mobileView === 'fundamentals') return mobileFundamentals;
            if (mobileView === 'advanced') return mobileAdvanced;
            if (mobileView === 'system') return mobileSystemAndArchitecture;
            return []; // Mobile menu view
        }

        if (selectedCategory.id === 'cloud') {
            if (cloudView === 'fundamentals') return cloudFundamentals;
            if (cloudView === 'advanced') return cloudAdvanced;
            if (cloudView === 'system') return cloudSystemAndArchitecture;
            return []; // Cloud menu view
        }

        if (selectedCategory.id === 'networks') {
            if (networksView === 'fundamentals') return cnFundamentals;
            if (networksView === 'advanced') return cnAdvanced;
            if (networksView === 'system') return cnSystemAndArchitecture;
            return []; // Networks menu view
        }

        if (selectedCategory.id === 'dbms') {
            if (dbmsView === 'fundamentals') return dbmsFundamentals;
            if (dbmsView === 'advanced') return dbmsAdvanced;
            if (dbmsView === 'system') return dbmsSystemAndArchitecture;
            return []; // DBMS menu view
        }

        if (selectedCategory.id === 'genai') {
            if (genaiView === 'fundamentals') return genaiFundamentals;
            if (genaiView === 'advanced') return genaiAdvanced;
            if (genaiView === 'system') return genaiSystemAndArchitecture;
            return []; // GenAI menu view
        }

        if (selectedCategory.id === 'ood') {
            if (oodView === 'fundamentals') return oodFundamentals;
            if (oodView === 'advanced') return oodAdvanced;
            if (oodView === 'system') return oodSystemAndArchitecture;
            return []; // OOD menu view
        }

        if (selectedCategory.id === 'hr') {
            if (hrView === 'fundamentals') return hrFundamentals;
            if (hrView === 'behavioral') return hrBehavioral;
            if (hrView === 'leadership') return hrLeadershipAndCritical;
            return []; // HR menu view
        }

        if (selectedCategory.id === 'security') {
            if (securityView === 'fundamentals') return securityFundamentals;
            if (securityView === 'advanced') return securityAdvanced;
            if (securityView === 'system') return securitySystemAndArchitecture;
            return [];
        }

        if (selectedCategory.id === 'os') {
            if (osView === 'fundamentals') return osFundamentals;
            if (osView === 'advanced') return osAdvanced;
            if (osView === 'system') return osSystemAndArchitecture;
            return []; // OS Menu View
        }

        if (selectedCategory.id === 'system') {
            if (sysView === 'fundamentals') return sysFundamentals;
            if (sysView === 'advanced') return sysAdvanced;
            if (sysView === 'deepDive') return sysDeepDiveAndArchitecture;
            return []; // System Menu View
        }

        return selectedCategory.questions;
    }, [
        selectedCategory,
        dsaView,
        webView,
        mobileView,
        cloudView,
        networksView,
        dbmsView,
        genaiView,
        oodView,
        hrView,
        securityView,
        osView,
        sysView
    ]);

    const stats = useMemo(() => {
        if (!selectedCategory) return { completed: 0, total: 0, percentage: 0 };
        const total = currentQuestions.length;
        if (total === 0) return { completed: 0, total: 0, percentage: 0 };

        const completed = currentQuestions.filter(q => completedQuestions.includes(q.id)).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { completed, total, percentage };
    }, [selectedCategory, currentQuestions, completedQuestions]);

    const filteredQuestions = useMemo(() => {
        let questions = [...currentQuestions];

        if (filterDifficulty !== 'All') {
            questions = questions.filter(q => q.difficulty === filterDifficulty);
        }

        if (sortOrder === 'asc') {
            questions.sort((a, b) => getDifficultyWeight(a.difficulty) - getDifficultyWeight(b.difficulty));
        } else if (sortOrder === 'desc') {
            questions.sort((a, b) => getDifficultyWeight(b.difficulty) - getDifficultyWeight(a.difficulty));
        }

        return questions;
    }, [currentQuestions, sortOrder, filterDifficulty]);

    const handleExplain = async (question: string, id: string, category: string) => {
        setIsLoading(true);
        setExpandedQuestion(id);

        if (explanations[id]) {
            setIsLoading(false);
            return;
        }

        try {
            const isBehavioral =
                category.toLowerCase().includes('hr') ||
                category.toLowerCase().includes('behavioral');

            const prompt = isBehavioral
                ? `Act as a senior behavioral interviewer for ${category} roles. 
Provide a structured answer to the following question using the STAR method (Situation, Task, Action, Result).

Include:
1. A concise, high-quality sample answer in first person (as if I am speaking).
2. Clear STAR breakdown (Situation, Task, Action, Result).
3. Key competencies being evaluated (e.g., communication, ownership, teamwork, conflict resolution).
4. Common mistakes or red flags in answers.
5. 3–5 realistic follow-up questions the interviewer might ask.

Question: "${question}"

Respond in ${language}.`
                : `Act as a senior technical interviewer. Provide a comprehensive answer to the following interview question in the field of ${category}. 
Include: 
1. A concise direct answer.
2. Key concepts involved.
3. Code example (if applicable).
4. Complexity analysis (Time/Space) (if applicable).
5. Common pitfalls or follow-up questions.

Question: "${question}"

Respond in ${language}.`;

            const response = await getTutorResponse(
                llm,
                'General Interview Knowledge Base',
                [],
                prompt,
                language,
                undefined
            );

            setExplanations(prev => ({ ...prev, [id]: response }));
            if (updateProgress) updateProgress(10, category);
        } catch (e: any) {
            addNotification('Failed to generate explanation. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSort = () => {
        setSortOrder(prev => {
            if (prev === 'default') return 'asc';
            if (prev === 'asc') return 'desc';
            return 'default';
        });
    };

    // Back Button Logic
    const handleBack = () => {
        if (selectedCategory?.id === 'dsa' && dsaView !== 'menu') {
            setDsaView('menu');
        } else if (selectedCategory?.id === 'web' && webView !== 'menu') {
            setWebView('menu');
        } else if (selectedCategory?.id === 'mobile' && mobileView !== 'menu') {
            setMobileView('menu');
        } else if (selectedCategory?.id === 'cloud' && cloudView !== 'menu') {
            setCloudView('menu');
        } else if (selectedCategory?.id === 'networks' && networksView !== 'menu') {
            setNetworksView('menu');
        } else if (selectedCategory?.id === 'dbms' && dbmsView !== 'menu') {
            setDbmsView('menu');
        } else if (selectedCategory?.id === 'genai' && genaiView !== 'menu') {
            setGenaiView('menu');
        } else if (selectedCategory?.id === 'ood' && oodView !== 'menu') {
            setOodView('menu');
        } else if (selectedCategory?.id === 'hr' && hrView !== 'menu') {
            setHrView('menu');
        } else if (selectedCategory?.id === 'security' && hrView !== 'menu') {
            setSecurityView('menu');
        } else if (selectedCategory?.id === 'os' && osView !== 'menu') {
            setOsView('menu');
        } else if (selectedCategory?.id === 'system' && sysView !== 'menu') {
            setSysView('menu');
        } else {
            setSelectedCategory(null);
            setDsaView('menu');
            setWebView('menu');
            setMobileView('menu');
            setCloudView('menu');
            setNetworksView('menu');
            setDbmsView('menu');
            setGenaiView('menu');
            setOodView('menu');
            setHrView('menu');
            setSecurityView('menu');
            setOsView('menu');
            setSysView('menu');
        }
    };

    // If Mock Interview is open, show that component instead
    if (isMockOpen && selectedCategory) {
        return <MockInterview topic={selectedCategory.title} onClose={() => setIsMockOpen(false)} />;
    }

    return (
        <div className="space-y-6">
            {!selectedCategory ? (
                // --- MAIN CATEGORY SELECTION ---
                <div className="space-y-6 fade-in">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Interview Prep Hub</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                            Select a track to access curated questions, concepts, and AI-powered explanations to crack your next interview.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        {/* --- NEW: RESUME SCANNER CARD --- */}
                        <button
                            onClick={() => setActiveTab(Tab.ResumeScanner)}
                            className="flex flex-col items-start p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-md hover:border-blue-400 transition-all group text-left relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                            
                            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="w-full flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Resume Screener</h3>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">NEW</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Optimize your resume for ATS. Check match scores and get tailored improvement tips.
                            </p>
                            <div className="mt-4 text-xs font-semibold text-blue-500 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                Analyze Resume <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </div>
                        </button>

                        {/* --- EXISTING CARDS --- */}
                        {INTERVIEW_DATA.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setSortOrder('default');
                                    setFilterDifficulty('All');
                                    setDsaView('menu');
                                    setWebView('menu');
                                    setMobileView('menu');
                                    setCloudView('menu');
                                    setNetworksView('menu');
                                    setDbmsView('menu');
                                    setGenaiView('menu');
                                    setOodView('menu');
                                    setHrView('menu');
                                    setSecurityView('menu');
                                    setOsView('menu');
                                    setSysView('menu');
                                }}
                                className="flex flex-col items-start p-6 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group text-left shadow-sm relative overflow-hidden"
                            >
                                <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-red-500 mb-4 group-hover:scale-110 transition-transform">
                                    {cat.icon}
                                </div>
                                <div className="w-full flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{cat.title}</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
                                <div className="mt-4 text-xs font-semibold text-slate-400 dark:text-slate-500 group-hover:text-red-400 transition-colors">
                                    {cat.id === 'dsa' ? '300+ Resources Available' : `${cat.questions.length} Resources Available`} →
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                // --- CATEGORY SELECTED (Remaining UI code unchanged) ---
                <div className="fade-in space-y-6">
                    <div className="flex flex-col gap-4 mb-2">
                        <div className="flex items-center gap-4">
                            <Button
                                onClick={handleBack}
                                variant="secondary"
                                className="flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {selectedCategory.id === 'dsa' && dsaView !== 'menu'
                                    ? 'Back to DSA Menu'
                                    : selectedCategory.id === 'web' && webView !== 'menu'
                                        ? 'Back to Web Menu'
                                        : selectedCategory.id === 'mobile' && mobileView !== 'menu'
                                            ? 'Back to Mobile Menu'
                                            : selectedCategory.id === 'cloud' && cloudView !== 'menu'
                                                ? 'Back to Cloud Menu'
                                                : selectedCategory.id === 'networks' && networksView !== 'menu'
                                                    ? 'Back to Networks Menu'
                                                    : selectedCategory.id === 'dbms' && dbmsView !== 'menu'
                                                        ? 'Back to DBMS Menu'
                                                        : selectedCategory.id === 'genai' && genaiView !== 'menu'
                                                            ? 'Back to GenAI Menu'
                                                            : selectedCategory.id === 'ood' && oodView !== 'menu'
                                                                ? 'Back to OOD Menu'
                                                                : selectedCategory.id === 'hr' && hrView !== 'menu'
                                                                    ? 'Back to HR Menu'
                                                                    : selectedCategory.id === 'security' && securityView !== 'menu'
                                                                        ? 'Back to Security Menu'
                                                                        : selectedCategory.id === 'os' && osView !== 'menu'
                                                                            ? 'Back to OS Menu'
                                                                            : selectedCategory.id === 'system' && sysView !== 'menu'
                                                                                ? 'Back to System Menu'
                                                                                : 'Back to Tracks'}
                            </Button>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    {selectedCategory.title}
                                </h2>

                                {selectedCategory.id === 'dsa' && dsaView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {dsaView === 'top150'
                                            ? 'Top Interview 150'
                                            : dsaView === 'blind75'
                                                ? 'Blind 75'
                                                : 'LeetCode 75'}
                                    </p>
                                )}

                                {selectedCategory.id === 'web' && webView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {webView === 'fundamentals'
                                            ? 'Web Fundamentals'
                                            : webView === 'advanced'
                                                ? 'Advanced Frontend'
                                                : 'Web System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'mobile' && mobileView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {mobileView === 'fundamentals'
                                            ? 'Mobile Fundamentals'
                                            : mobileView === 'advanced'
                                                ? 'Advanced Mobile Development'
                                                : 'Mobile System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'cloud' && cloudView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {cloudView === 'fundamentals'
                                            ? 'Cloud & DevOps Fundamentals'
                                            : cloudView === 'advanced'
                                                ? 'Advanced Cloud & DevOps'
                                                : 'Cloud System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'networks' && networksView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {networksView === 'fundamentals'
                                            ? 'Networking Fundamentals'
                                            : networksView === 'advanced'
                                                ? 'Advanced Networking'
                                                : 'Networks System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'dbms' && dbmsView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {dbmsView === 'fundamentals'
                                            ? 'DBMS Fundamentals'
                                            : dbmsView === 'advanced'
                                                ? 'Advanced DBMS & SQL'
                                                : 'DBMS System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'genai' && genaiView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {genaiView === 'fundamentals'
                                            ? 'GenAI & LLM Fundamentals'
                                            : genaiView === 'advanced'
                                                ? 'Advanced GenAI & Modeling'
                                                : 'GenAI System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'ood' && oodView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {oodView === 'fundamentals'
                                            ? 'OOD Fundamentals'
                                            : oodView === 'advanced'
                                                ? 'Advanced OOD & Modeling'
                                                : 'OOD System & Architecture'}
                                    </p>
                                )}

                                {selectedCategory.id === 'hr' && hrView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {hrView === 'fundamentals'
                                            ? 'HR Fundamentals (Intro & Fit)'
                                            : hrView === 'behavioral'
                                                ? 'Behavioral / STAR Questions'
                                                : 'Leadership & Critical Situations'}
                                    </p>
                                )}

                                {selectedCategory.id === 'security' && securityView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {securityView === 'fundamentals'
                                            ? 'Security Fundamentals (Core Concepts)'
                                            : securityView === 'advanced'
                                                ? 'Security Deep Dive & Technical Attacks'
                                                : 'Security Architecture & Defense Strategies'}
                                    </p>
                                )}

                                {selectedCategory.id === 'os' && osView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {osView === 'fundamentals'
                                            ? 'Operating System Fundamentals (Basics & Concepts)'
                                            : osView === 'advanced'
                                                ? 'Advanced OS Internals & Kernel Concepts'
                                                : 'OS System Architecture & Deep Internals'}
                                    </p>
                                )}

                                {selectedCategory.id === 'system' && sysView !== 'menu' && (
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                                        {sysView === 'fundamentals'
                                            ? 'Fundamentals of System Design (Core Concepts)'
                                            : sysView === 'advanced'
                                                ? 'Advanced System Design & Scalable Patterns'
                                                : 'Deep-Dive & High Level Distributed Architecture'}
                                    </p>
                                )}

                            </div>
                        </div>

                        {/* --- DSA MENU VIEW --- */}
                        {selectedCategory.id === 'dsa' && dsaView === 'menu' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Top 150 Card */}
                                    <div
                                        onClick={() => setDsaView('top150')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-blue-500/30"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Top Interview 150
                                        </h3>
                                        <p className="text-blue-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Comprehensive list covering all major topics for technical interviews.
                                        </p>
                                        <button className="bg-white text-blue-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-blue-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Blind 75 Card */}
                                    <div
                                        onClick={() => setDsaView('blind75')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-600 to-purple-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-500/30"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Blind 75</h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Most frequently asked LeetCode questions for FAANG interviews.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Start Learning
                                        </button>
                                    </div>

                                    {/* LeetCode 75 Card */}
                                    <div
                                        onClick={() => setDsaView('leetcode75')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-500/30"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">LeetCode 75</h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Essential coding interview questions to master DSA patterns.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Start Learning
                                        </button>
                                    </div>
                                </div>

                                {/* Mock Interview Button */}
                                <div className="flex justify-center">
                                    <button
                                        onClick={() => setIsMockOpen(true)}
                                        className="flex items-center gap-4 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1 group w-full md:w-auto"
                                    >
                                        <div className="p-2.5 bg-red-500/20 rounded-lg text-red-400 group-hover:text-red-300 transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                                />
                                            </svg>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-bold">Take Mock Interview</div>
                                            <div className="text-xs text-slate-400 group-hover:text-slate-300">
                                                AI-powered simulation
                                            </div>
                                        </div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-slate-500 group-hover:text-white ml-2 transition-colors"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'web' && webView === 'menu' ? (
                            // --- WEB MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Web Fundamentals */}
                                    <div
                                        onClick={() => setWebView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-blue-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Web Fundamentals</h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Core JS, CSS, browser & HTTP concepts every frontend dev must know.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced Frontend */}
                                    <div
                                        onClick={() => setWebView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-500 to-indigo-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Advanced Frontend</h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            React ecosystem, performance, state management, a11y and storage.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Start Learning
                                        </button>
                                    </div>

                                    {/* Web System & Architecture */}
                                    <div
                                        onClick={() => setWebView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Web System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            SSR, caching, workers, micro-frontends, TypeScript, CI/CD & architecture.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'mobile' && mobileView === 'menu' ? (
                            // --- MOBILE MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Mobile Fundamentals */}
                                    <div
                                        onClick={() => setMobileView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-indigo-500 to-blue-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-indigo-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Mobile Fundamentals</h3>
                                        <p className="text-indigo-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Core Android, iOS, Flutter & React Native basics, lifecycles and navigation.
                                        </p>
                                        <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced Mobile Dev */}
                                    <div
                                        onClick={() => setMobileView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-fuchsia-500 to-rose-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-fuchsia-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced Mobile Dev
                                        </h3>
                                        <p className="text-fuchsia-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Performance, rendering, testing, animations, UX and platform APIs.
                                        </p>
                                        <button className="bg-white text-fuchsia-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-fuchsia-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* Mobile System & Architecture */}
                                    <div
                                        onClick={() => setMobileView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-cyan-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Mobile System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Security, backend, sync, feature flags, analytics and scalable architecture.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'cloud' && cloudView === 'menu' ? (
                            // --- CLOUD MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Cloud Fundamentals */}
                                    <div
                                        onClick={() => setCloudView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-cyan-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Cloud Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Docker, basics of AWS/GCP/Azure, storage, networking, CI/CD and monitoring.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced Cloud & DevOps */}
                                    <div
                                        onClick={() => setCloudView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-violet-500 to-indigo-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-violet-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced Cloud & DevOps
                                        </h3>
                                        <p className="text-violet-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Kubernetes, Terraform, GitOps, observability, SRE and security practices.
                                        </p>
                                        <button className="bg-white text-violet-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-violet-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* Cloud System & Architecture */}
                                    <div
                                        onClick={() => setCloudView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Cloud System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            HA/DR, multi-tenant SaaS, hybrid, zero trust and scalable microservices.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'networks' && networksView === 'menu' ? (
                            // --- NETWORKS MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Networking Fundamentals */}
                                    <div
                                        onClick={() => setNetworksView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-blue-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Networking Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            OSI, TCP/IP, IP addressing, DNS, HTTP and routing basics.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced Networking */}
                                    <div
                                        onClick={() => setNetworksView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-violet-500 to-indigo-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-violet-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced Networking
                                        </h3>
                                        <p className="text-violet-100 mb-6 relative z-10 max-w-xs font-medium">
                                            TLS, HTTP/2 & 3, proxies, load balancing, Wi-Fi and QoS concepts.
                                        </p>
                                        <button className="bg-white text-violet-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-violet-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* Networks System & Architecture */}
                                    <div
                                        onClick={() => setNetworksView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Networks System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            SDN, NFV, overlays, security, 5G, edge and large scale topologies.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'dbms' && dbmsView === 'menu' ? (
                            // --- DBMS MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* DBMS Fundamentals */}
                                    <div
                                        onClick={() => setDbmsView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-indigo-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            DBMS Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Keys, normalization, ER modeling, basic SQL & warehousing basics.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced DBMS & SQL */}
                                    <div
                                        onClick={() => setDbmsView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-500 to-fuchsia-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced DBMS & SQL
                                        </h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Indexing, query optimization, window functions, ETL and NoSQL basics.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* DBMS System & Architecture */}
                                    <div
                                        onClick={() => setDbmsView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            DBMS System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Distributed DBs, replication, consistency, caching, backups & scaling.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'genai' && genaiView === 'menu' ? (
                            // --- GenAI MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* GenAI Fundamentals */}
                                    <div
                                        onClick={() => setGenaiView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-indigo-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            GenAI Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Language models, attention, embeddings, tokenization & basic RAG.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced GenAI & Modeling */}
                                    <div
                                        onClick={() => setGenaiView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-500 to-fuchsia-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced GenAI & Modeling
                                        </h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            training, loss functions, RLHF, sampling, contrastive learning & vectors.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* GenAI System & Architecture */}
                                    <div
                                        onClick={() => setGenaiView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            GenAI System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            RAG systems, orchestration, agents, safety, evals and MLOps for LLMs.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'hr' && hrView === 'menu' ? (
                            // --- HR MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* HR Fundamentals */}
                                    <div
                                        onClick={() => setHrView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-indigo-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            HR Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Intro, motivation, culture-fit and basic personality questions.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Behavioral / STAR */}
                                    <div
                                        onClick={() => setHrView('behavioral')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-500 to-fuchsia-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Behavioral / STAR
                                        </h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Real-world scenarios to practice STAR-based answers.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Practice Stories
                                        </button>
                                    </div>

                                    {/* Leadership & Critical Situations */}
                                    <div
                                        onClick={() => setHrView('leadership')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Leadership & Critical
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            High-stakes leadership, conflict and decision-making cases.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'security' && securityView === 'menu' ? (
                            // --- SECURITY MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Security Fundamentals */}
                                    <div
                                        onClick={() => setSecurityView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start 
                bg-gradient-to-br from-red-500 to-rose-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-red-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Security Fundamentals
                                        </h3>
                                        <p className="text-red-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Core concepts: XSS, CSRF, HTTPS, cookies, basic web and auth security.
                                        </p>
                                        <button className="bg-white text-red-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-red-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced Security */}
                                    <div
                                        onClick={() => setSecurityView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start 
                bg-gradient-to-br from-amber-500 to-orange-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-amber-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced Security
                                        </h3>
                                        <p className="text-amber-100 mb-6 relative z-10 max-w-xs font-medium">
                                            OAuth2, JWT, hashing, OWASP Top 10, DDoS, access control & app hardening.
                                        </p>
                                        <button className="bg-white text-amber-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-amber-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* Security System & Architecture */}
                                    <div
                                        onClick={() => setSecurityView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start 
                bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Security Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Cloud & DevSecOps, IAM, SIEM, threat modeling, compliance & large-scale security.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'ood' && oodView === 'menu' ? (
                            // --- OOD MENU VIEW ---
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* OOD Fundamentals */}
                                    <div
                                        onClick={() => setOodView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-sky-500 to-indigo-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-sky-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            OOD Fundamentals
                                        </h3>
                                        <p className="text-sky-100 mb-6 relative z-10 max-w-xs font-medium">
                                            SOLID, basic patterns, UML, cohesion & coupling foundations.
                                        </p>
                                        <button className="bg-white text-sky-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-sky-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced OOD & Modeling */}
                                    <div
                                        onClick={() => setOodView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-purple-500 to-fuchsia-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-purple-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            Advanced OOD & Modeling
                                        </h3>
                                        <p className="text-purple-100 mb-6 relative z-10 max-w-xs font-medium">
                                            DDD, aggregates, CQRS, event sourcing and complex design patterns.
                                        </p>
                                        <button className="bg-white text-purple-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-purple-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* OOD System & Architecture */}
                                    <div
                                        onClick={() => setOodView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start bg-gradient-to-br from-emerald-500 to-teal-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-emerald-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">
                                            OOD System & Architecture
                                        </h3>
                                        <p className="text-emerald-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Hexagonal, modular monoliths, plugins, rule engines & large-scale OOD.
                                        </p>
                                        <button className="bg-white text-emerald-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory.id === 'system' && sysView === 'menu' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* System Design Fundamentals */}
                                    <div
                                        onClick={() => setSysView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-cyan-500 to-blue-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-cyan-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">System Fundamentals</h3>
                                        <p className="text-cyan-100 mb-6 relative z-10 max-w-xs font-medium">
                                            CAP, scaling, load balancing, caching, replication, queues & APIs.
                                        </p>
                                        <button className="bg-white text-cyan-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-cyan-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Start Learning
                                        </button>
                                    </div>

                                    {/* Advanced System Design */}
                                    <div
                                        onClick={() => setSysView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-yellow-500 to-amber-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-yellow-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Advanced System Design</h3>
                                        <p className="text-yellow-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Distributed caching, sharding, consensus, event-driven design.
                                        </p>
                                        <button className="bg-white text-yellow-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-yellow-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Go Advanced
                                        </button>
                                    </div>

                                    {/* System Deep Architecture */}
                                    <div
                                        onClick={() => setSysView('deepDive')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-lime-500 to-green-800 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-lime-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Deep Architecture</h3>
                                        <p className="text-lime-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Microservices, message buses, CRDT, observability, distributed infra.
                                        </p>
                                        <button className="bg-white text-lime-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-lime-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive Deep
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ) : selectedCategory.id === 'os' && osView === 'menu' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                    {/* OS Fundamentals */}
                                    <div
                                        onClick={() => setOsView('fundamentals')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-indigo-500 to-blue-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-indigo-400/40"
                                    >
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">OS Fundamentals</h3>
                                        <p className="text-indigo-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Processes, threads, interrupts, memory basics, file systems & kernel intro.
                                        </p>
                                        <button className="bg-white text-indigo-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-indigo-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Get Started
                                        </button>
                                    </div>

                                    {/* Advanced OS */}
                                    <div
                                        onClick={() => setOsView('advanced')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-fuchsia-500 to-purple-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-fuchsia-400/40"
                                    >
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">Advanced OS</h3>
                                        <p className="text-fuchsia-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Scheduling, virtual memory, paging, TLB, deadlocks, kernel internals.
                                        </p>
                                        <button className="bg-white text-fuchsia-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-fuchsia-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Level Up
                                        </button>
                                    </div>

                                    {/* OS System & Architecture */}
                                    <div
                                        onClick={() => setOsView('system')}
                                        className="relative overflow-hidden rounded-2xl p-8 h-64 flex flex-col justify-center items-start
                bg-gradient-to-br from-teal-500 to-green-700 shadow-xl group cursor-pointer transition-transform hover:scale-[1.02] border border-teal-400/40"
                                    >
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 -translate-x-1/2 blur-3xl group-hover:opacity-15 transition-opacity" />
                                        <h3 className="text-3xl font-bold text-white mb-2 relative z-10">OS Architecture</h3>
                                        <p className="text-teal-100 mb-6 relative z-10 max-w-xs font-medium">
                                            Drivers, boot process, file systems, virtualization, namespaces & cgroups.
                                        </p>
                                        <button className="bg-white text-teal-700 px-6 py-2.5 rounded-full font-bold shadow-lg hover:bg-teal-50 transition-colors relative z-10 text-sm tracking-wide">
                                            Dive In
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            // --- QUESTION LIST VIEW (unchanged) ---
                            <>
                                {/* DSA SUB-TABS */}
                                {selectedCategory.id === 'dsa' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setDsaView('top150')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dsaView === 'top150'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Top Interview 150
                                        </button>
                                        <button
                                            onClick={() => setDsaView('blind75')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dsaView === 'blind75'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Blind 75
                                        </button>
                                        <button
                                            onClick={() => setDsaView('leetcode75')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dsaView === 'leetcode75'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            LeetCode 75
                                        </button>
                                    </div>
                                )}

                                {/* WEB SUB-TABS */}
                                {selectedCategory.id === 'web' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setWebView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${webView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setWebView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${webView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced Frontend
                                        </button>
                                        <button
                                            onClick={() => setWebView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${webView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* MOBILE SUB-TABS */}
                                {selectedCategory.id === 'mobile' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setMobileView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mobileView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setMobileView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mobileView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setMobileView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mobileView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* CLOUD SUB-TABS */}
                                {selectedCategory.id === 'cloud' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setCloudView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${cloudView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setCloudView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${cloudView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setCloudView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${cloudView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* NETWORKS SUB-TABS */}
                                {selectedCategory.id === 'networks' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setNetworksView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${networksView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setNetworksView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${networksView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setNetworksView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${networksView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* DBMS SUB-TABS */}
                                {selectedCategory.id === 'dbms' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setDbmsView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dbmsView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setDbmsView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dbmsView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setDbmsView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${dbmsView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* GenAI SUB-TABS */}
                                {selectedCategory.id === 'genai' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setGenaiView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${genaiView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setGenaiView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${genaiView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setGenaiView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${genaiView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* HR SUB-TABS */}
                                {selectedCategory.id === 'hr' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setHrView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${hrView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setHrView('behavioral')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${hrView === 'behavioral'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Behavioral / STAR
                                        </button>
                                        <button
                                            onClick={() => setHrView('leadership')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${hrView === 'leadership'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Leadership & Critical
                                        </button>
                                    </div>
                                )}

                                {/* SECURITY SUB-TABS */}
                                {selectedCategory.id === 'security' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">

                                        <button
                                            onClick={() => setSecurityView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${securityView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>

                                        <button
                                            onClick={() => setSecurityView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${securityView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>

                                        <button
                                            onClick={() => setSecurityView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${securityView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>

                                    </div>
                                )}


                                {/* OOD SUB-TABS */}
                                {selectedCategory.id === 'ood' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">
                                        <button
                                            onClick={() => setOodView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${oodView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>
                                        <button
                                            onClick={() => setOodView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${oodView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>
                                        <button
                                            onClick={() => setOodView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${oodView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>
                                    </div>
                                )}

                                {/* System SUB-TABS */}
                                {selectedCategory.id === 'system' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">

                                        <button
                                            onClick={() => setSysView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${sysView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>

                                        <button
                                            onClick={() => setSysView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${sysView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>

                                        <button
                                            onClick={() => setSysView('deepDive')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${sysView === 'deepDive'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Deep Architecture
                                        </button>

                                    </div>
                                )}

                                {/* OS SUB-TABS */}
                                {selectedCategory.id === 'os' && (
                                    <div className="flex p-1 bg-slate-200 dark:bg-slate-800/50 rounded-lg w-full sm:w-auto self-start mb-4 overflow-x-auto">

                                        <button
                                            onClick={() => setOsView('fundamentals')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${osView === 'fundamentals'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Fundamentals
                                        </button>

                                        <button
                                            onClick={() => setOsView('advanced')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${osView === 'advanced'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            Advanced
                                        </button>

                                        <button
                                            onClick={() => setOsView('system')}
                                            className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${osView === 'system'
                                                ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm'
                                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                                }`}
                                        >
                                            System & Architecture
                                        </button>

                                    </div>
                                )}


                                {/* PROGRESS BAR */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-lg shadow-sm flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Track Progress
                                            </span>
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                {stats.percentage}% ({stats.completed}/{stats.total})
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-green-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                                                style={{ width: `${stats.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* FILTERS */}
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {(['All', 'Concept', 'Easy', 'Medium', 'Hard'] as const).map(diff => (
                                            <button
                                                key={diff}
                                                onClick={() => setFilterDifficulty(diff)}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filterDifficulty === diff
                                                    ? 'bg-red-600 text-white shadow-sm'
                                                    : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                                                    }`}
                                            >
                                                {diff}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={toggleSort}
                                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md hover:text-slate-900 dark:hover:text-slate-200 transition-colors shadow-sm ml-auto"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3 w-3"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                                            />
                                        </svg>
                                        {sortOrder === 'default'
                                            ? 'Sort'
                                            : sortOrder === 'asc'
                                                ? 'Low -> High'
                                                : 'High -> Low'}
                                    </button>
                                </div>

                                {/* LIST */}
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
                                    {filteredQuestions.length > 0 ? (
                                        filteredQuestions.map(q => {
                                            const isCompleted = completedQuestions.includes(q.id);
                                            return (
                                                <Card
                                                    key={q.id}
                                                    className={`!p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 transition-all ${isCompleted ? 'opacity-80' : ''
                                                        }`}
                                                >
                                                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <div
                                                            className="flex-1 flex items-start gap-3"
                                                            onClick={() => {
                                                                if (expandedQuestion === q.id) setExpandedQuestion(null);
                                                                else handleExplain(q.title, q.id, selectedCategory.title);
                                                            }}
                                                        >
                                                            {/* TOGGLE COMPLETE BUTTON */}
                                                            <button
                                                                onClick={e => toggleComplete(e, q.id)}
                                                                className={`p-1 rounded-full flex-shrink-0 mt-0.5 transition-all duration-200 focus:outline-none ${isCompleted
                                                                    ? 'text-green-500 hover:text-green-600 bg-green-100 dark:bg-green-900/30'
                                                                    : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 border border-slate-300 dark:border-slate-600 hover:border-slate-400'
                                                                    }`}
                                                                title={
                                                                    isCompleted
                                                                        ? 'Mark as incomplete'
                                                                        : 'Mark as complete'
                                                                }
                                                            >
                                                                {isCompleted ? (
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                ) : (
                                                                    <div className="w-5 h-5 rounded-full" />
                                                                )}
                                                            </button>

                                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                                                <span
                                                                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border self-start ${getDifficultyColor(
                                                                        q.difficulty
                                                                    )}`}
                                                                >
                                                                    {q.difficulty}
                                                                </span>
                                                                <span
                                                                    className={`font-medium text-lg transition-colors ${isCompleted
                                                                        ? 'text-slate-500 dark:text-slate-500 line-through decoration-slate-400/50'
                                                                        : 'text-slate-700 dark:text-slate-200'
                                                                        }`}
                                                                >
                                                                    {q.title}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 pl-9 sm:pl-0">
                                                            {/* LINK BUTTON */}
                                                            {q.link && (
                                                                <a
                                                                    href={q.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                                                    title="Open Resource"
                                                                    onClick={e => e.stopPropagation()}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="h-5 w-5"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                                        />
                                                                    </svg>
                                                                </a>
                                                            )}

                                                            <div
                                                                className="flex items-center gap-2"
                                                                onClick={() => {
                                                                    if (expandedQuestion === q.id) setExpandedQuestion(null);
                                                                    else handleExplain(q.title, q.id, selectedCategory.title);
                                                                }}
                                                            >
                                                                {expandedQuestion === q.id &&
                                                                    isLoading &&
                                                                    !explanations[q.id] ? (
                                                                    <span className="text-xs text-red-400 animate-pulse">
                                                                        Generating...
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-xs text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                                                                        {expandedQuestion === q.id
                                                                            ? 'Close'
                                                                            : 'Reveal Answer'}
                                                                    </span>
                                                                )}
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className={`h-5 w-5 text-slate-400 dark:text-slate-500 transition-transform ${expandedQuestion === q.id ? 'rotate-180' : ''
                                                                        }`}
                                                                    viewBox="0 0 20 20"
                                                                    fill="currentColor"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {expandedQuestion === q.id && (
                                                        <div className="px-6 pb-6 pt-2 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2">
                                                            {isLoading && !explanations[q.id] ? (
                                                                <div className="py-8 flex justify-center">
                                                                    <Loader />
                                                                </div>
                                                            ) : (
                                                                <div className="w-full overflow-hidden">
                                                                    <MarkdownRenderer content={explanations[q.id]} />

                                                                    <div className="mt-6 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                                                                        <Button
                                                                            onClick={() =>
                                                                                navigator.clipboard.writeText(
                                                                                    explanations[q.id]
                                                                                )
                                                                            }
                                                                            variant="secondary"
                                                                            className="text-xs"
                                                                        >
                                                                            Copy Full Explanation
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-12">
                                            <p className="text-slate-500 dark:text-slate-400">
                                                No questions found for this difficulty level.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};