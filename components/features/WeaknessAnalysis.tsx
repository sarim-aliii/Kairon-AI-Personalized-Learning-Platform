import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { analyzeWeakness } from '../../services/amazonService';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { RemedialContent } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

export const WeaknessAnalysis: React.FC = () => {
    const { activeProject, llm, language, addNotification } = useAppContext();
    const [analysis, setAnalysis] = useState<RemedialContent | null>(null);

    const { 
        execute: runAnalysis, 
        loading, 
        error 
    } = useApi(analyzeWeakness);

    const handleAnalyze = async () => {
        if (!activeProject) return;
        const result = await runAnalysis(llm, activeProject._id, language);
        if (result) setAnalysis(result);
    };

    // Calculate "Health" stats purely for display before analysis
    const totalCards = activeProject?.srsFlashcards?.length || 0;
    const weakCards = activeProject?.srsFlashcards?.filter(fc => fc.easeFactor < 2.3).length || 0;
    const healthScore = totalCards > 0 ? Math.round(((totalCards - weakCards) / totalCards) * 100) : 100;

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Health Card */}
                <div className="flex-1">
                    <Card title="Knowledge Health">
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-slate-200 dark:text-slate-700" />
                                    <circle 
                                        cx="48" cy="48" r="40" 
                                        stroke="currentColor" strokeWidth="8" fill="none" 
                                        strokeDasharray={251} 
                                        strokeDashoffset={251 - (251 * healthScore) / 100}
                                        className={`${healthScore > 80 ? 'text-green-500' : healthScore > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-xl font-bold text-slate-700 dark:text-slate-200">{healthScore}%</span>
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    We detected <strong>{weakCards} struggling items</strong> out of {totalCards} active flashcards.
                                </p>
                                <Button onClick={handleAnalyze} disabled={loading} className="w-full sm:w-auto">
                                    {loading ? 'Analyzing Patterns...' : 'Run Weakness Detector'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Topics List */}
                {analysis && (
                    <div className="flex-1 animate-in slide-in-from-right">
                        <Card title="Problem Areas Detected">
                            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {analysis.weakTopics.length === 0 ? (
                                    <p className="text-sm text-slate-500 italic">No specific patterns found.</p>
                                ) : (
                                    analysis.weakTopics.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/10 rounded border border-red-100 dark:border-red-900/30">
                                            <div>
                                                <span className="font-semibold text-red-700 dark:text-red-400 text-sm block">{item.topic}</span>
                                                <span className="text-xs text-red-500/80">{item.reason}</span>
                                            </div>
                                            <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs font-bold px-2 py-1 rounded-full">
                                                {item.count} items
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {loading && <div className="py-12"><Loader /></div>}

            {/* Remedial Content */}
            {analysis && analysis.focusTopic !== "None" && (
                <div className="animate-in slide-in-from-bottom duration-500">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1 rounded-xl shadow-lg">
                        <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Remedial Lesson: {analysis.focusTopic}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">AI-generated content to bridge your knowledge gap</p>
                                </div>
                            </div>

                            <div className="prose dark:prose-invert max-w-none text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                                <MarkdownRenderer content={analysis.explanation} />
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {analysis.actionableTips.map((tip, i) => (
                                    <div key={i} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                                        <strong>Tip {i + 1}:</strong> {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};