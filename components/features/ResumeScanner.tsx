import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { analyzeResume } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { ResumeAnalysisResult } from '../../types';

export const ResumeScanner: React.FC = () => {
    const { llm, language, addNotification } = useAppContext();
    
    const [resumeText, setResumeText] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    
    const { 
        execute: runScan, 
        loading: isScanning, 
        data: result 
    } = useApi(analyzeResume);

    const handleScan = async () => {
        if (!resumeText.trim() || !jobDescription.trim()) {
            addNotification('Please provide both your Resume text and the Job Description.', 'info');
            return;
        }
        await runScan(llm, resumeText, jobDescription, language);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Resume AI Screener</h2>
                    <p className="text-slate-500 dark:text-slate-400">Optimize your resume for ATS algorithms and get hired faster.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* INPUT SECTION */}
                <div className="space-y-4">
                    <Card title="1. Paste Your Resume">
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Copy and paste your resume text here..."
                            className="w-full h-64 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                        />
                    </Card>

                    <Card title="2. Paste Job Description">
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Copy and paste the job description here..."
                            className="w-full h-64 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                        />
                    </Card>

                    <Button 
                        onClick={handleScan} 
                        disabled={isScanning} 
                        className="w-full py-3 text-lg shadow-lg shadow-blue-500/20"
                    >
                        {isScanning ? 'Analyzing Match...' : 'Scan Resume'}
                    </Button>
                </div>

                {/* RESULTS SECTION */}
                <div className="space-y-6">
                    {isScanning && (
                        <div className="h-full flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                            <Loader />
                            <p className="mt-4 text-slate-500 animate-pulse">Simulating ATS Scan...</p>
                        </div>
                    )}

                    {!isScanning && result && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-500">
                            {/* Match Score Card */}
                            <Card className="flex flex-col items-center justify-center py-8 border-blue-200 dark:border-blue-900/50 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-900">
                                <div className="relative flex items-center justify-center w-32 h-32">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-200 dark:text-slate-700" />
                                        <circle 
                                            cx="64" cy="64" r="56" 
                                            stroke="currentColor" strokeWidth="12" fill="none" 
                                            strokeDasharray={351} 
                                            strokeDashoffset={351 - (351 * (result as ResumeAnalysisResult).matchScore) / 100}
                                            className={`${getScoreColor((result as ResumeAnalysisResult).matchScore)} transition-all duration-1000 ease-out`}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <span className={`absolute text-3xl font-bold ${getScoreColor((result as ResumeAnalysisResult).matchScore)}`}>
                                        {(result as ResumeAnalysisResult).matchScore}%
                                    </span>
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-slate-700 dark:text-slate-200">ATS Match Score</h3>
                            </Card>

                            {/* Missing Keywords */}
                            <Card title="⚠️ Missing Keywords" className="border-l-4 border-l-red-500">
                                <div className="flex flex-wrap gap-2">
                                    {(result as ResumeAnalysisResult).missingKeywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-full font-medium border border-red-200 dark:border-red-800">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    Add these exact terms to your skills or experience section to pass the automated screeners.
                                </p>
                            </Card>

                            {/* Tailored Summary */}
                            <Card title="✨ Tailored Professional Summary">
                                <div className="p-4 bg-blue-50 dark:bg-slate-800/50 rounded-lg border border-blue-100 dark:border-slate-700">
                                    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                        "{(result as ResumeAnalysisResult).tailoredSummary}"
                                    </p>
                                    <Button 
                                        variant="secondary" 
                                        className="mt-3 text-xs w-full sm:w-auto"
                                        onClick={() => {
                                            navigator.clipboard.writeText((result as ResumeAnalysisResult).tailoredSummary);
                                            addNotification('Summary copied to clipboard', 'success');
                                        }}
                                    >
                                        Copy Summary
                                    </Button>
                                </div>
                            </Card>

                            {/* Suggestions */}
                            <Card title="💡 Improvement Suggestions">
                                <ul className="space-y-3">
                                    {(result as ResumeAnalysisResult).suggestions.map((suggestion, i) => (
                                        <li key={i} className="flex gap-3 text-slate-700 dark:text-slate-300 text-sm">
                                            <span className="text-blue-500 font-bold mt-0.5">•</span>
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>
                    )}

                    {!isScanning && !result && (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg font-medium">Ready to optimize?</p>
                            <p className="text-sm">Paste your resume and the job description to see your match score.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};