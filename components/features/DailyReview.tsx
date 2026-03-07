import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { getDueFlashcards } from '../../services/api';
import { analyzeWeakness } from '../../services/amazonService'; // Import the service
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { SRFlashcard, StudyProject, RemedialContent } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

// Simplified Flashcard Component for Review Mode
const ReviewCard: React.FC<{ 
    card: SRFlashcard; 
    projectName: string; 
    onGraded: (quality: number) => void 
}> = ({ card, projectName, onGraded }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    // Reset flip when card changes
    useEffect(() => {
        setIsFlipped(false);
    }, [card]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-2 text-xs text-center text-slate-500 uppercase tracking-widest">
                From: {projectName}
            </div>
            
            <div 
                className={`flip-card h-80 rounded-xl cursor-pointer group ${isFlipped ? 'flipped' : ''}`} 
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <div className="flip-card-inner rounded-xl shadow-2xl">
                    {/* Front */}
                    <div className="flip-card-front bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center p-8">
                        <span className="text-xs font-bold text-slate-400 absolute top-4 left-4">QUESTION</span>
                        <p className="text-center text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {card.question}
                        </p>
                        <p className="text-xs text-slate-400 absolute bottom-4">Click to reveal</p>
                    </div>

                    {/* Back */}
                    <div className="flip-card-back bg-slate-900 border border-slate-700 flex flex-col justify-between p-8 relative">
                         <span className="text-xs font-bold text-green-400 absolute top-4 left-4">ANSWER</span>
                        <div className="flex-1 flex items-center justify-center overflow-y-auto">
                            <p className="text-center text-lg text-slate-200 leading-relaxed">
                                {card.answer}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-4 gap-3 mt-6 w-full" onClick={(e) => e.stopPropagation()}>
                            <Button variant="secondary" className="!bg-red-600 !text-white hover:!bg-red-700 text-xs py-3" onClick={() => onGraded(0)}>
                                Again
                            </Button>
                            <Button variant="secondary" className="!bg-orange-600 !text-white hover:!bg-orange-700 text-xs py-3" onClick={() => onGraded(1)}>
                                Hard
                            </Button>
                            <Button variant="secondary" className="!bg-blue-600 !text-white hover:!bg-blue-700 text-xs py-3" onClick={() => onGraded(2)}>
                                Good
                            </Button>
                            <Button variant="secondary" className="!bg-green-600 !text-white hover:!bg-green-700 text-xs py-3" onClick={() => onGraded(3)}>
                                Easy
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ReviewItem {
    card: SRFlashcard;
    projectId: string;
    projectName: string;
}

export const DailyReview: React.FC = () => {
    const { updateProjectData, updateProgress, addNotification, llm, language } = useAppContext();
    
    const [projectsData, setProjectsData] = useState<StudyProject[]>([]);
    const [reviewQueue, setReviewQueue] = useState<ReviewItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // Track failures: Map<ProjectId, Count>
    const [sessionFailures, setSessionFailures] = useState<Record<string, number>>({});
    const [remedialData, setRemedialData] = useState<RemedialContent | null>(null);

    // Fetch Hook
    const { 
        execute: fetchDue, 
        loading 
    } = useApi(getDueFlashcards);

    const {
        execute: runWeaknessAnalysis,
        loading: isAnalyzing
    } = useApi(analyzeWeakness);

    useEffect(() => {
        const loadCards = async () => {
            const data = await fetchDue();
            if (data) {
                setProjectsData(data);
                
                const now = new Date();
                const queue: ReviewItem[] = [];
                
                data.forEach(p => {
                    if (p.srsFlashcards) {
                        p.srsFlashcards.forEach(card => {
                            if (new Date(card.dueDate) <= now) {
                                queue.push({
                                    card,
                                    projectId: p._id,
                                    projectName: p.name
                                });
                            }
                        });
                    }
                });
                
                setReviewQueue(queue);
            }
        };
        loadCards();
    }, [fetchDue]);

    const handleGrade = async (quality: number) => {
        const item = reviewQueue[currentIndex];
        const card = item.card;

        // Track failures (Quality < 3 is usually considered a struggle/fail in strict terms, but let's say < 2 for "Again")
        if (quality < 2) {
            setSessionFailures(prev => ({
                ...prev,
                [item.projectId]: (prev[item.projectId] || 0) + 1
            }));
        }

        // SRS Algorithm (Standard SM-2)
        let { easeFactor, interval } = card;

        if (quality < 2) { 
            interval = 1;
        } else {
            if (interval === 0) interval = 1;
            else if (interval === 1) interval = 6;
            else interval = Math.round(interval * easeFactor);
        }
        
        easeFactor = easeFactor + (0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
        if (easeFactor < 1.3) easeFactor = 1.3;

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + interval);

        const updatedCard: SRFlashcard = { ...card, easeFactor, interval, dueDate: dueDate.toISOString() };

        // 1. Update the local projectsData state (to keep track)
        const projectIndex = projectsData.findIndex(p => p._id === item.projectId);
        if (projectIndex > -1) {
            const project = projectsData[projectIndex];
            const updatedFlashcards = project.srsFlashcards?.map(c => c.id === card.id ? updatedCard : c);
            
            // 2. Persist to Backend immediately
            await updateProjectData(item.projectId, { srsFlashcards: updatedFlashcards });
        }

        // 3. Move to next card
        if (currentIndex < reviewQueue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setIsSessionComplete(true);
            updateProgress(reviewQueue.length * 10);
            addNotification(`Daily Review Complete! +${reviewQueue.length * 10} XP`, "success");
        }
    };

    const handleAnalyzeWeakness = async () => {
        // Find the project with the most failures
        const sortedProjects = Object.entries(sessionFailures).sort((a, b) => b[1] - a[1]);
        
        if (sortedProjects.length === 0) return;

        const worstProjectId = sortedProjects[0][0];
        
        // Ensure we only run it once or if requested
        const result = await runWeaknessAnalysis(llm, worstProjectId, language);
        if (result) {
            setRemedialData(result);
        }
    };

    if (loading) return <Loader />;

    if (isSessionComplete) {
        // Determine if we should suggest remedial action
        const totalFailures = Object.values(sessionFailures).reduce((a, b) => a + b, 0);
        const hasWeakness = totalFailures > 0;

        return (
            <div className="space-y-6 animate-in fade-in">
                <Card className="text-center py-12">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-green-500/20 rounded-full text-green-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-100 mb-2">All Caught Up!</h2>
                    <p className="text-slate-400 mb-8">You've reviewed all your due cards for today.</p>
                    
                    {hasWeakness && !remedialData && (
                        <div className="max-w-md mx-auto bg-red-900/20 border border-red-900/50 p-6 rounded-lg">
                            <h3 className="text-red-400 font-bold mb-2">Struggle Detected</h3>
                            <p className="text-slate-300 text-sm mb-4">
                                You missed {totalFailures} cards today. Our AI can analyze your mistakes and create a custom lesson to help you.
                            </p>
                            <Button onClick={handleAnalyzeWeakness} disabled={isAnalyzing}>
                                {isAnalyzing ? 'Analyzing Weaknesses...' : 'Generate Remedial Lesson'}
                            </Button>
                        </div>
                    )}

                    {!hasWeakness && (
                        <Button onClick={() => window.location.reload()}>Refresh</Button>
                    )}
                </Card>

                {/* Remedial Content Display */}
                {remedialData && (
                    <div className="animate-in slide-in-from-bottom duration-500">
                        <Card title={`Remedial Lesson: ${remedialData.focusTopic}`} className="border-l-4 border-l-blue-500">
                            <div className="prose dark:prose-invert max-w-none text-sm text-slate-300 mb-6">
                                <MarkdownRenderer content={remedialData.explanation} />
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {remedialData.actionableTips.map((tip, i) => (
                                    <div key={i} className="bg-slate-800 p-3 rounded border border-slate-700 text-xs text-slate-400">
                                        <strong className="text-slate-200 block mb-1">Tip {i + 1}</strong>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        );
    }

    if (reviewQueue.length === 0) {
        return <EmptyState 
            title="No Reviews Due" 
            message="You're all caught up! Check back tomorrow or add new material to study." 
        />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 fade-in">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-100">Daily Review</h2>
                <span className="text-sm font-mono text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {reviewQueue.length}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                    className="bg-green-500 h-full transition-all duration-500" 
                    style={{ width: `${((currentIndex) / reviewQueue.length) * 100}%` }} 
                />
            </div>

            <ReviewCard 
                key={reviewQueue[currentIndex].card.id}
                card={reviewQueue[currentIndex].card}
                projectName={reviewQueue[currentIndex].projectName}
                onGraded={handleGrade}
            />
        </div>
    );
};