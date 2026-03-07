import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; // 1. Import the hook
import { generatePodcastScript } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { PodcastSegment } from '../../types';

export const AudioDeepDive: React.FC = () => {
    // Removed addNotification as the hook handles errors now
    const { ingestedText, activeProject, language, llm } = useAppContext();
    
    // 2. Setup the API Hook
    const { 
        execute: generateScript, 
        loading: isGenerating, 
        data: scriptData 
    } = useApi(generatePodcastScript, "Podcast script generated successfully!");

    // Default to empty array if data is null so the rest of the component works safely
    const script: PodcastSegment[] = scriptData || [];

    // Audio Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Audio Refs
    const synth = useRef<SpeechSynthesis>(window.speechSynthesis);
    const hostVoice = useRef<SpeechSynthesisVoice | null>(null);
    const guestVoice = useRef<SpeechSynthesisVoice | null>(null);
    const isPaused = useRef(false);

    // Load voices on mount
    useEffect(() => {
        const loadVoices = () => {
            const voices = synth.current.getVoices();
            // Try to find distinct voices. 
            // This logic tries to pick a Male/Female pair or just two different voices.
            const langVoices = voices.filter(v => v.lang.startsWith('en')); // Default to English for voice selection logic
            
            if (langVoices.length > 0) {
                hostVoice.current = langVoices.find(v => v.name.includes('Google US English')) || langVoices[0];
                guestVoice.current = langVoices.find(v => v.name.includes('Google UK English Female')) || langVoices[1] || langVoices[0];
            }
        };

        loadVoices();
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            synth.current.cancel();
        };
    }, []);

    const handleGenerate = async () => {
        if (!activeProject) return;
        
        // Stop any current playback before regenerating
        synth.current.cancel();
        setIsPlaying(false);
        isPaused.current = false;

        // 3. Call the hook
        const result = await generateScript(llm, activeProject._id, language);
        
        // Reset index if generation was successful
        if (result) {
            setCurrentIndex(0);
        }
    };

    const speakSegment = (index: number) => {
        if (index >= script.length) {
            setIsPlaying(false);
            setCurrentIndex(0);
            return;
        }

        const segment = script[index];
        const utterance = new SpeechSynthesisUtterance(segment.text);
        
        // Assign Voice
        utterance.voice = segment.speaker === 'Host' ? hostVoice.current : guestVoice.current;
        // Pitch/Rate tweaks to make them sound more distinct
        utterance.pitch = segment.speaker === 'Host' ? 1 : 1.1;
        utterance.rate = 1.0;

        utterance.onend = () => {
            if (!isPaused.current) {
                setCurrentIndex(prev => prev + 1);
                speakSegment(index + 1);
            }
        };

        synth.current.speak(utterance);
    };

    const togglePlay = () => {
        if (script.length === 0) return;

        if (isPlaying) {
            synth.current.cancel();
            isPaused.current = true;
            setIsPlaying(false);
        } else {
            isPaused.current = false;
            setIsPlaying(true);
            speakSegment(currentIndex);
        }
    };

    if (!ingestedText) {
        return <EmptyState title="Audio Deep Dive" message="Ingest content to generate an AI podcast." />;
    }

    return (
        <div className="space-y-6">
            <Card title="Audio Deep Dive 🎧">
                <div className="flex flex-col gap-6">
                    <p className="text-slate-400">
                        Turn your notes into a podcast. 
                        Host Alex and Guest Jamie will discuss the material to help you learn by listening.
                    </p>
                    
                    <div className="flex items-center gap-4">
                         <Button onClick={handleGenerate} disabled={isGenerating} className="w-full sm:w-auto">
                            {isGenerating ? 'Generating Script...' : script.length > 0 ? 'Regenerate Podcast' : 'Generate Podcast'}
                        </Button>
                        
                        {script.length > 0 && (
                            <Button onClick={togglePlay} variant="secondary" className={`w-full sm:w-auto flex items-center justify-center gap-2 ${isPlaying ? 'border-red-500 text-red-500' : ''}`}>
                                {isPlaying ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                        Stop
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                        {currentIndex > 0 ? 'Resume' : 'Play'}
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {isGenerating && <Loader />}
                </div>
            </Card>

            {/* Script Display / Player Visualizer */}
            {script.length > 0 && (
                <div className="space-y-4 fade-in">
                    {script.map((seg, idx) => (
                        <div 
                            key={idx} 
                            className={`p-4 rounded-xl border transition-all duration-300 ${
                                idx === currentIndex && isPlaying 
                                    ? 'scale-105 shadow-lg border-red-500 bg-slate-800' 
                                    : 'border-slate-800 bg-slate-900/50 opacity-60'
                            } ${
                                seg.speaker === 'Host' ? 'ml-0 mr-12' : 'ml-12 mr-0'
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${seg.speaker === 'Host' ? 'bg-blue-400' : 'bg-green-400'}`} />
                                <span className={`text-xs font-bold uppercase tracking-wider ${seg.speaker === 'Host' ? 'text-blue-400' : 'text-green-400'}`}>
                                    {seg.speaker === 'Host' ? 'Alex (Expert)' : 'Jamie (Learner)'}
                                </span>
                            </div>
                            <p className="text-slate-200 leading-relaxed">{seg.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};