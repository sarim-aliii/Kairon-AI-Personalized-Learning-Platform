import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { generateMCQs, generatePersonalizedStudyGuide } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { MCQ as MCQType, MCQAttempt } from '../../types';
import { EmptyState } from '../ui/EmptyState';
import { Slider } from '../ui/Slider';
import { generateMCQPdf } from '../../utils/pdfGenerator';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

// --- MCQItem Component ---
interface MCQItemProps {
    mcq: MCQType;
    index: number;
    onAnswer: (option: string) => void;
    userAnswer: string | null;
    showResult: boolean; // Controls whether to show correct/incorrect feedback
}

const MCQItem: React.FC<MCQItemProps> = ({ mcq, index, onAnswer, userAnswer, showResult }) => {
    const isAnswered = userAnswer !== null;

    const handleOptionSelect = (option: string) => {
        // Allow changing answers in Exam Mode if needed, but typically standard quizzes lock it.
        // For this implementation, we allow changing answers ONLY in Exam Mode (before submit), 
        // but lock it in Practice Mode (instant feedback).
        if (!showResult) {
             onAnswer(option);
        } else if (!isAnswered) {
             onAnswer(option);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-800 dark:text-slate-300 mb-3">{`Q${index + 1}. ${mcq.question}`}</p>
            <div className="space-y-2">
                {mcq.options.map((option, i) => {
                    const isSelected = userAnswer === option;
                    const isCorrect = option === mcq.correctAnswer;
                    
                    let optionClass = "bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-transparent";
                    
                    if (showResult && isAnswered) {
                        if (isCorrect) {
                           optionClass = "bg-green-100 dark:bg-green-800/70 border-green-200 dark:border-transparent";
                        } else if (isSelected) {
                           optionClass = "bg-red-100 dark:bg-red-800/70 border-red-200 dark:border-transparent";
                        } else {
                           optionClass = "bg-gray-100 dark:bg-slate-700 opacity-50";
                        }
                    } else if (isSelected) {
                        // Exam Mode Selected State (Neutral Blue)
                        optionClass = "bg-blue-100 dark:bg-blue-900/40 border-blue-300 dark:border-blue-700 shadow-sm";
                    }

                    return (
                        <div key={i} onClick={() => handleOptionSelect(option)}
                            className={`flex items-center p-3 rounded-md transition-all duration-200 cursor-pointer ${optionClass}`}>
                            <div className={`w-5 h-5 mr-3 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                isSelected 
                                    ? (showResult ? (isCorrect ? 'border-green-500' : 'border-red-500') : 'border-blue-500') 
                                    : 'border-slate-400'
                            }`}>
                                {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${
                                    showResult ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-blue-500'
                                }`}></div>}
                            </div>
                            <span className="text-slate-800 dark:text-slate-300">{option}</span>
                        </div>
                    );
                })}
            </div>
            
            {/* Explanation only shown in Result Mode */}
            {showResult && isAnswered && (
                <div className={`mt-4 p-3 rounded-md text-sm fade-in border ${userAnswer === mcq.correctAnswer ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700/50' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/50'}`}>
                    <p className={`font-bold ${userAnswer === mcq.correctAnswer ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {userAnswer === mcq.correctAnswer ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{mcq.explanation}</p>
                </div>
            )}
        </div>
    );
};

// --- Main MCQ Component ---
export const MCQ: React.FC = () => {
    const { ingestedText, addNotification, language, llm, activeProject, updateActiveProjectData, updateProgress } = useAppContext();
    
    const [mcqs, setMcqs] = useState<MCQType[]>(activeProject?.currentMcqs || []);
    const [history, setHistory] = useState<MCQAttempt[]>(activeProject?.mcqAttempts || []);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [numQuestions, setNumQuestions] = useState<number>(5);
    const [personalizedGuide, setPersonalizedGuide] = useState<string | null>(null);
    const [loadedProjectId, setLoadedProjectId] = useState<string | null>(activeProject?._id || null);

    // --- EXAM MODE STATE ---
    const [isExamMode, setIsExamMode] = useState(false);
    const [examTimeLeft, setExamTimeLeft] = useState(0);
    const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // --- API HOOKS ---
    const { execute: generateQuiz, loading: isGeneratingQuiz } = useApi(generateMCQs); 
    const { execute: generateGuide, loading: isGeneratingGuide } = useApi(generatePersonalizedStudyGuide);

    // Sync Project Data
    useEffect(() => {
        if (activeProject) {
            setMcqs(activeProject.currentMcqs || []);
            setHistory(activeProject.mcqAttempts || []);
            if (activeProject._id !== loadedProjectId) {
                setUserAnswers({});
                setPersonalizedGuide(null);
                setLoadedProjectId(activeProject._id);
                // Ensure we exit exam mode if project switches
                if (isExamMode) handleEndExam(false); 
            }
        }
    }, [activeProject, loadedProjectId]);

    // --- EXAM LOGIC ---

    // 1. Fullscreen Helper
    const toggleFullscreen = (enable: boolean) => {
        if (enable) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.error(err));
            }
        }
    };

    // 2. Anti-Cheat: Visibility Change (Tab Switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (isExamMode && document.hidden) {
                setTabSwitchWarnings(prev => {
                    const newCount = prev + 1;
                    addNotification(`⚠️ Warning ${newCount}/3: Tab switching is not allowed!`, 'error');
                    
                    if (newCount >= 3) {
                        handleEndExam(true); // Force Submit
                    }
                    return newCount;
                });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isExamMode, addNotification]);

    // 3. Timer Logic
    useEffect(() => {
        if (isExamMode && examTimeLeft > 0) {
            timerRef.current = setInterval(() => {
                setExamTimeLeft(prev => {
                    if (prev <= 1) {
                        handleEndExam(false); // Time's up submit
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (!isExamMode && timerRef.current) {
            clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isExamMode, examTimeLeft]);

    const handleStartExam = () => {
        if (mcqs.length === 0) {
            addNotification('Generate questions first.', 'info');
            return;
        }
        setUserAnswers({});
        setPersonalizedGuide(null);
        setTabSwitchWarnings(0);
        // 1 Minute per question
        setExamTimeLeft(mcqs.length * 60); 
        setIsExamMode(true);
        toggleFullscreen(true);
        addNotification("Exam Started! Fullscreen enforced. Do not switch tabs.", "success");
    };

    const handleEndExam = async (forced = false) => {
        setIsExamMode(false);
        toggleFullscreen(false);
        if (timerRef.current) clearInterval(timerRef.current);

        if (forced) {
            addNotification("Exam terminated automatically due to suspicious activity.", "error");
        } else if (examTimeLeft === 0) {
            addNotification("Time's up! Exam submitted.", "info");
        } else {
            addNotification("Exam submitted successfully.", "success");
        }

        // Calculate and Save Results
        await saveResults();
    };

    const saveResults = async () => {
        const currentScore = mcqs.reduce((acc, mcq, index) => {
            return userAnswers[index] === mcq.correctAnswer ? acc + 1 : acc;
        }, 0);

        const finalIncorrectMCQs = mcqs.filter((mcq, index) => userAnswers[index] !== mcq.correctAnswer);

        const newAttempt: MCQAttempt = {
            date: new Date().toISOString(),
            score: currentScore,
            total: mcqs.length,
            incorrectQuestions: finalIncorrectMCQs.map(mcq => mcq.question),
        };

        const newHistory = [newAttempt, ...history].slice(0, 20);
        setHistory(newHistory);
        
        // XP Reward based on Exam Performance
        const percentage = (currentScore / mcqs.length) * 100;
        const xpReward = percentage >= 80 ? 100 : percentage >= 50 ? 50 : 20;
        updateProgress(xpReward);

        await updateActiveProjectData({ mcqAttempts: newHistory });
    };

    // --- STANDARD QUIZ LOGIC ---

    const isQuizFinished = useMemo(() => !isExamMode && mcqs.length > 0 && Object.keys(userAnswers).length === mcqs.length, [mcqs, userAnswers, isExamMode]);
    
    const score = useMemo(() => {
        return mcqs.reduce((correctCount, mcq, index) => {
            if (userAnswers[index] === mcq.correctAnswer) return correctCount + 1;
            return correctCount;
        }, 0);
    }, [mcqs, userAnswers]);

    const incorrectMCQs = useMemo(() => {
        // Only show incorrect after exam or quiz is finished
        if (isExamMode || (!isExamMode && !isQuizFinished)) return [];
        return mcqs.filter((mcq, index) => userAnswers[index] !== mcq.correctAnswer);
    }, [mcqs, userAnswers, isQuizFinished, isExamMode]);

    const handleGenerateMCQs = useCallback(async () => {
        if (!ingestedText) {
            addNotification('Please ingest some text first.', 'info');
            return;
        }
        setUserAnswers({});
        setPersonalizedGuide(null);
        setMcqs([]); 
        const result = await generateQuiz(llm, ingestedText, language, difficulty, numQuestions);
        if (result) {
            setMcqs(result);
            try { await updateActiveProjectData({ currentMcqs: result }); } catch (e) {}
        }
    }, [ingestedText, addNotification, language, difficulty, numQuestions, llm, updateActiveProjectData, generateQuiz]);

    const handleAnswer = async (questionIndex: number, answer: string) => {
        const newAnswers = { ...userAnswers, [questionIndex]: answer };
        setUserAnswers(newAnswers);

        // Auto-save logic only for Practice Mode (Instant Feedback)
        // In Exam Mode, we save only on Submit
        if (!isExamMode && mcqs.length > 0 && Object.keys(newAnswers).length === mcqs.length) {
            const finalScore = mcqs.reduce((acc, mcq, idx) => newAnswers[idx] === mcq.correctAnswer ? acc + 1 : acc, 0);
            const finalIncorrect = mcqs.filter((mcq, idx) => newAnswers[idx] !== mcq.correctAnswer);
            
            const newAttempt: MCQAttempt = {
                date: new Date().toISOString(),
                score: finalScore,
                total: mcqs.length,
                incorrectQuestions: finalIncorrect.map(q => q.question),
            };
            const newHistory = [newAttempt, ...history].slice(0, 20);
            setHistory(newHistory);
            updateProgress(50);
            addNotification(`Quiz Complete! +50 XP`, 'success');
            await updateActiveProjectData({ mcqAttempts: newHistory });
        }
    };

    const handleClearHistory = async () => {
        setHistory([]);
        await updateActiveProjectData({ mcqAttempts: [] });
    };

    const handleGeneratePersonalizedGuide = useCallback(async () => {
        if (!ingestedText || incorrectMCQs.length === 0) return;
        setPersonalizedGuide(null);
        const guide = await generateGuide(llm, ingestedText, incorrectMCQs, language);
        if (guide) setPersonalizedGuide(guide);
    }, [ingestedText, incorrectMCQs, language, llm, generateGuide]);

    const handleDownloadPdf = () => {
        if (mcqs.length > 0) {
            generateMCQPdf(mcqs, activeProject?.name || 'Study Quiz');
            addNotification('PDF Downloaded!', 'success');
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!ingestedText) {
        return <EmptyState title="MCQ Generator" message="Ingest study material to start." />;
    }

    return (
        <div className="space-y-6">
            <Card title={isExamMode ? "🔴 Exam in Progress" : "MCQ Generator"}>
                
                {/* EXAM HEADER BAR */}
                {isExamMode && (
                    <div className="sticky top-0 z-10 flex justify-between items-center bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800 mb-6 shadow-sm animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="text-xl font-bold font-mono text-red-600 dark:text-red-400">
                                ⏳ {formatTime(examTimeLeft)}
                            </div>
                            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                Warnings: <span className={`${tabSwitchWarnings > 0 ? 'text-red-500' : 'text-green-500'}`}>{tabSwitchWarnings}/3</span>
                            </div>
                        </div>
                        <Button onClick={() => handleEndExam(false)} className="bg-red-600 hover:bg-red-700 text-white">
                            Submit Exam
                        </Button>
                    </div>
                )}

                {/* CONTROLS (Hidden in Exam Mode) */}
                {!isExamMode && (
                    <div className="space-y-6">
                        {/* Difficulty & Slider Controls */}
                        <div className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Difficulty:</span>
                                    <div className="flex items-center gap-1 p-1 bg-gray-200 dark:bg-slate-900 rounded-md">
                                        {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
                                            <button 
                                                key={level} 
                                                onClick={() => setDifficulty(level)}
                                                className={`flex-1 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${difficulty === level ? 'bg-red-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-gray-300 dark:hover:bg-slate-700'}`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Slider 
                                        label="Number of Questions" 
                                        min={5} max={20} step={1}
                                        value={numQuestions} 
                                        onChange={setNumQuestions} 
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button onClick={handleGenerateMCQs} disabled={isGeneratingQuiz} className="flex-1">
                                    {isGeneratingQuiz ? 'Generating...' : mcqs.length > 0 ? 'Generate New Quiz' : 'Generate Quiz'}
                                </Button>
                                
                                {mcqs.length > 0 && (
                                    <>
                                        <Button onClick={handleStartExam} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600">
                                            Start Exam Mode 🛡️
                                        </Button>
                                        <Button onClick={handleDownloadPdf} variant="secondary" className="flex-1 sm:flex-none">
                                            Download PDF
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isGeneratingQuiz && <Loader />}
                
                {/* QUESTIONS LIST */}
                {mcqs.length > 0 && (
                    <div className="space-y-4 fade-in mt-6">
                        {mcqs.map((mcq, index) => (
                           <MCQItem 
                             key={index} 
                             mcq={mcq} 
                             index={index} 
                             onAnswer={(option) => handleAnswer(index, option)}
                             userAnswer={userAnswers[index] || null}
                             showResult={!isExamMode} // Hide result during exam
                           />
                        ))}
                    </div>
                )}
            </Card>

            {/* RESULTS (Only if not in exam and quiz finished) */}
            {!isExamMode && isQuizFinished && (
                <Card title="Quiz Results" className="fade-in">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-lg text-slate-800 dark:text-slate-300">You scored <span className="font-bold text-red-600 dark:text-red-400">{score}</span> out of <span className="font-bold text-red-600 dark:text-red-400">{mcqs.length}</span>.</p>
                        <Button onClick={handleDownloadPdf} variant="secondary" className="text-xs">
                            Save Results as PDF
                        </Button>
                    </div>
                    
                    {incorrectMCQs.length > 0 ? (
                         <div className="mt-6">
                            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">Adaptive Learning Path</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-4">It looks like you had some trouble with a few concepts. Here's a personalized study guide to help you reinforce those weak areas.</p>
                            <Button onClick={handleGeneratePersonalizedGuide} disabled={isGeneratingGuide}>
                                {isGeneratingGuide ? 'Generating Guide...' : 'Generate Personalized Study Guide'}
                            </Button>
                        </div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-green-600 dark:text-green-400 font-semibold">Perfect score! Great job mastering these concepts.</p>
                        </div>
                    )}
                </Card>
            )}

            {isGeneratingGuide && <Loader />}

            {personalizedGuide && (
                <Card title="Your Personalized Study Guide" className="fade-in">
                    <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-gray-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700">
                        {personalizedGuide}
                    </div>
                </Card>
            )}

            {history.length > 0 && !isExamMode && (
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Progress History</h2>
                        <Button variant="secondary" onClick={handleClearHistory} className="text-xs !py-1 !px-2">
                            Clear History
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-400">
                            <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-gray-100 dark:bg-slate-800">
                                <tr>
                                    <th scope="col" className="px-4 py-2">Date</th>
                                    <th scope="col" className="px-4 py-2">Score</th>
                                    <th scope="col" className="px-4 py-2">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(attempt => (
                                    <tr key={attempt.date} className="border-b border-slate-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-2">{new Date(attempt.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">{attempt.score} / {attempt.total}</td>
                                        <td className="px-4 py-2 font-semibold text-red-600 dark:text-red-400">{((attempt.score / attempt.total) * 100).toFixed(0)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};