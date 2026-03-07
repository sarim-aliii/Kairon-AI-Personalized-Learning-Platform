import React, { useState, useCallback, useEffect } from 'react';
import pptxgen from "pptxgenjs"; 
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; 
import { generateLessonPlan, generateSlides } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { LessonPlan } from '../../types';
import { SlideData } from '../../services/api';


// --- Display Component (Unchanged) ---
const LessonPlanDisplay: React.FC<{ plan: LessonPlan }> = ({ plan }) => (
    <div className="space-y-6 text-slate-300 bg-slate-900 p-6 rounded-md border border-slate-700">
        <div className="text-center">
            <h3 className="text-2xl font-bold text-red-400">{plan.title}</h3>
            <p className="text-slate-400">Duration: {plan.duration}</p>
        </div>
        <div className="space-y-4">
            <div>
                <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Learning Objective</h4>
                <p>{plan.objective}</p>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Materials</h4>
                <ul className="list-disc list-inside pl-4 text-slate-400">
                    {plan.materials.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Activities</h4>
                <div className="space-y-3">
                    {plan.activities.map((activity, i) => (
                        <div key={i} className="p-3 bg-slate-800/50 rounded-md">
                            <p className="font-semibold">{activity.name} <span className="text-sm text-slate-400">({activity.duration})</span></p>
                            <p className="text-slate-400 text-sm mt-1">{activity.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Assessment</h4>
                <p>{plan.assessment}</p>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export const LessonPlanner: React.FC = () => {
    const { ingestedText, addNotification, language, llm, activeProject, updateActiveProjectData } = useAppContext();
    const [topic, setTopic] = useState('');
    
    // Local state for plan (initialized from DB, updated by hook)
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(activeProject?.lessonPlan || null);

    // 2. Setup Hooks
    const { 
        execute: createPlan, 
        loading: isPlanning 
    } = useApi(generateLessonPlan);

    // New Hook for Slides
    const { 
        execute: createSlides, 
        loading: isCreatingSlides 
    } = useApi(generateSlides);

    useEffect(() => {
        setLessonPlan(activeProject?.lessonPlan || null);
    }, [activeProject]);

    const handleGenerate = useCallback(async () => {
        if (!ingestedText) {
            addNotification('Please ingest some text first to provide context.', 'info');
            return;
        }
        if (!topic.trim()) {
            addNotification('Please enter a topic for the lesson plan.', 'info');
            return;
        }

        // 3. Execute Hook
        const plan = await createPlan(llm, ingestedText, topic, language);

        // If successful
        if (plan) {
            setLessonPlan(plan);
            try {
                await updateActiveProjectData({ lessonPlan: plan });
                addNotification("Lesson plan generated and saved!", "success");
            } catch (e: any) {
                addNotification("Generated plan but failed to save: " + e.message, "error");
            }
        }
    }, [ingestedText, topic, addNotification, language, llm, updateActiveProjectData, createPlan]);

    const handleDownloadSlides = async () => {
        if (!activeProject?._id) {
             addNotification('No active project found.', 'error');
             return;
        }
        if (!topic.trim()) {
             addNotification('Please enter a topic to generate slides.', 'info');
             return;
        }

        try {
            // 1. Fetch JSON structure from Gemini
            const slidesData: SlideData[] | null = await createSlides(llm, activeProject._id, topic, language);

            if (slidesData && slidesData.length > 0) {
                // 2. Render PPTX
                const pres = new pptxgen();
                
                // Metadata
                pres.author = 'Kairon AI';
                pres.company = 'Kairon AI';
                pres.subject = topic;
                pres.title = topic;

                // Title Slide
                const titleSlide = pres.addSlide();
                titleSlide.background = { color: 'F3F4F6' }; // Light gray
                titleSlide.addText(topic, { 
                    x: 0.5, y: '40%', w: '90%', h: 1, 
                    fontSize: 44, bold: true, color: 'DC2626', align: 'center', fontFace: 'Arial'
                });
                titleSlide.addText(`Generated by Kairon AI`, { 
                    x: 0.5, y: '55%', w: '90%', h: 0.5,
                    fontSize: 18, color: '4B5563', align: 'center', fontFace: 'Arial'
                });

                // Content Slides
                slidesData.forEach((slideContent) => {
                    const slide = pres.addSlide();
                    slide.background = { color: 'FFFFFF' };
                    
                    // Slide Title
                    slide.addText(slideContent.title, { 
                        x: 0.5, y: 0.3, w: '90%', h: 0.8, 
                        fontSize: 28, bold: true, color: '111827', fontFace: 'Arial',
                        // border: { pt: 0, pb: 2, color: 'DC2626' } // Bottom border red
                    });
                    
                    // Bullets
                    slide.addText(slideContent.bullets.map(b => `${b}`).join('\n'), { 
                        x: 0.8, y: 1.5, w: '85%', h: 4, 
                        fontSize: 18, color: '374151', lineSpacing: 32, fontFace: 'Arial',
                        // bullet: { type: 'number', color: 'DC2626' },
                        bullet: { type: 'number' }
                    });

                    // Speaker Notes
                    slide.addNotes(slideContent.speakerNotes);
                    
                    // Footer
                    slide.addText(`${topic} - Kairon AI`, { 
                        x: 0.5, y: '92%', fontSize: 10, color: '9CA3AF', fontFace: 'Arial' 
                    });
                });

                // 3. Trigger Download
                await pres.writeFile({ fileName: `${topic.replace(/\s+/g, '_')}_Presentation.pptx` });
                addNotification("Slides downloaded successfully!", "success");
            }
        } catch (error: any) {
            // Hook handles the API error, but pptxgen error might occur here
            console.error("PPT Generation Error", error);
        }
    };

    if (!ingestedText) {
        return <EmptyState
            title="AI-Powered Lesson Planner"
            message="For educators: Ingest a textbook chapter or article, then enter a topic to instantly generate a structured 50-minute lesson plan."
        />;
    }

    return (
        <Card title="Lesson Plan & Slides">
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter the main topic (e.g., 'Photosynthesis')..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        disabled={isPlanning || isCreatingSlides}
                    />
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button onClick={handleGenerate} disabled={!topic.trim() || isPlanning} className="flex-1 sm:w-auto">
                            {isPlanning ? 'Planning...' : 'Generate Plan'}
                        </Button>
                        
                        <Button 
                            onClick={handleDownloadSlides} 
                            disabled={!topic.trim() || isCreatingSlides} 
                            variant="secondary"
                            className="flex-1 sm:w-auto flex items-center justify-center gap-2 border border-slate-600"
                            title="Generate and Download PowerPoint"
                        >
                            {isCreatingSlides ? (
                                <Loader spinnerClassName="w-4 h-4" />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-6.172a2 2 0 00-.586-1.414l-4.828-4.828A2 2 0 0014.172 3H5zM13 5.414l3.586 3.586H13V5.414zM8 12a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                </svg>
                            )}
                            {isCreatingSlides ? 'Building...' : 'PPTX'}
                        </Button>
                    </div>
                </div>
                
                {isPlanning && <Loader />}
                
                {lessonPlan && (
                    <div className="fade-in mt-4">
                        <LessonPlanDisplay plan={lessonPlan} />
                    </div>
                )}
            </div>
        </Card>
    );
};