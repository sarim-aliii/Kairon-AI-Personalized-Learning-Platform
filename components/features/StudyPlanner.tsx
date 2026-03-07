import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; // 1. Import hook
import { generateStudyPlan } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { StudyPlan } from '../../types';
import { Slider } from '../ui/Slider';

// --- Display Component (Unchanged) ---
const StudyPlanDisplay: React.FC<{ plan: StudyPlan }> = ({ plan }) => {
    
    const handleDownloadText = () => {
        let content = `${plan.title}\n`;
        content += `Duration: ${plan.durationDays} Days\n`;
        content += `================================\n\n`;

        plan.schedule.forEach((day) => {
            content += `Day ${day.day}: ${day.topic}\n`;
            content += `------------------------\n`;
            day.tasks.forEach((task) => {
                content += `[ ] ${task}\n`;
            });
            content += `\n`;
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_study_plan.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleExportCalendar = () => {
        // Create basic iCalendar content
        let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Kairon AI//Study Plan//EN\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
        
        const today = new Date();
        
        plan.schedule.forEach((day) => {
            // Calculate date for this study day (Day 1 = Today, Day 2 = Tomorrow, etc.)
            const eventDate = new Date(today);
            eventDate.setDate(today.getDate() + (day.day - 1));
            
            // Format date as YYYYMMDD for full-day events
            const dateString = eventDate.toISOString().split('T')[0].replace(/-/g, '');
            
            // Escape special characters in description
            const description = day.tasks.map(t => `• ${t}`).join('\\n');

            icsContent += "BEGIN:VEVENT\n";
            icsContent += `DTSTART;VALUE=DATE:${dateString}\n`;
            icsContent += `DTEND;VALUE=DATE:${dateString}\n`; // Single day event
            icsContent += `SUMMARY:Study: ${day.topic}\n`;
            icsContent += `DESCRIPTION:${description}\n`;
            icsContent += "STATUS:CONFIRMED\n";
            icsContent += "TRANSP:TRANSPARENT\n"; // Show as 'free' so it doesn't block other meetings, or 'OPAQUE' to block
            icsContent += "END:VEVENT\n";
        });
        
        icsContent += "END:VCALENDAR";

        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_schedule.ics`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6 text-slate-500 dark:text-slate-300 bg-gray-50 dark:bg-slate-900 p-6 rounded-md border border-slate-200 dark:border-slate-700 relative">
            <div className="absolute top-4 right-4 flex gap-2">
                 {/* Calendar Export Button */}
                 <button 
                    onClick={handleExportCalendar}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Add to Calendar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                </button>

                 {/* Text Download Button */}
                 <button 
                    onClick={handleDownloadText}
                    className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 rounded-md transition-colors"
                    title="Download as Text"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            <div className="text-center pt-2">
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{plan.title}</h3>
                <p className="text-slate-500 dark:text-slate-400">{plan.durationDays}-Day Study Plan</p>
            </div>
            <div className="space-y-4">
                {plan.schedule.map((day) => (
                    <div key={day.day} className="p-4 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Day {day.day}: <span className="text-red-600 dark:text-red-400">{day.topic}</span></h4>
                        <ul className="list-disc list-inside pl-4 text-slate-500 dark:text-slate-400 mt-2">
                            {day.tasks.map((task, i) => <li key={i}>{task}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Main Component ---
export const StudyPlanner: React.FC = () => {
    const { ingestedText, addNotification, language, llm, activeProject, updateActiveProjectData } = useAppContext();
    const [days, setDays] = useState(7);
    
    // Local state for the plan
    const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(activeProject?.studyPlan || null);

    // 2. Setup Hook
    const { 
        execute: createStudyPlan, 
        loading: isLoading 
    } = useApi(generateStudyPlan);

    useEffect(() => {
        setStudyPlan(activeProject?.studyPlan || null);
    }, [activeProject]);

    const handleGenerate = useCallback(async () => {
        if (!ingestedText) {
            addNotification('Please ingest your study material first.', 'info');
            return;
        }

        // 3. Execute Hook
        const plan = await createStudyPlan(llm, ingestedText, days, language);

        // If successful
        if (plan) {
            setStudyPlan(plan);
            try {
                await updateActiveProjectData({ studyPlan: plan });
                addNotification("Study plan generated and saved!", "success");
            } catch (e: any) {
                addNotification("Generated plan but failed to save: " + e.message, "error");
            }
        }
    }, [ingestedText, days, addNotification, language, llm, updateActiveProjectData, createStudyPlan]);

    if (!ingestedText) {
        return <EmptyState
            title="Personalized Study Planner"
            message="Beat procrastination. Ingest your notes, set your study timeframe, and get a custom day-by-day plan to prepare for your exam."
        />;
    }

    return (
        <Card title="Study Plan Generator">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-100 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="w-full sm:w-1/2">
                       <Slider label="How many days to study?" min={1} max={30} value={days} onChange={setDays} />
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto flex-shrink-0">
                        {isLoading ? 'Generating...' : 'Generate Study Plan'}
                    </Button>
                </div>
                {isLoading && <Loader />}
                {studyPlan && (
                    <div className="fade-in mt-4">
                        <StudyPlanDisplay plan={studyPlan} />
                    </div>
                )}
            </div>
        </Card>
    );
};