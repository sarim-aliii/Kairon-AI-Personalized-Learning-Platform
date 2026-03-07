import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; // 1. Import the hook
import { getTutorResponse, generateEssayOutline, generateEssayArguments } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { ChatMessage, EssayOutline } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

type AIToolMode = 'tutor' | 'essay';

const PERSONAS = [
    { label: 'Friendly Tutor', value: 'Friendly Tutor' },
    { label: 'Socratic Mentor', value: 'Socratic Mentor' },
    { label: 'ELI5 Buddy', value: 'ELI5 Buddy' },
    { label: 'Strict Professor', value: 'Strict Professor' },
    { label: 'Philosopher', value: 'Philosopher' },
];

const EssayOutlineDisplay: React.FC<{ outline: EssayOutline }> = ({ outline }) => (
    <div className="space-y-4 text-slate-300 bg-slate-900 p-4 rounded-md border border-slate-700">
        <h3 className="text-2xl font-bold text-red-400 text-center">{outline.title}</h3>
        <div>
            <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Introduction</h4>
            <p className="leading-relaxed">{outline.introduction}</p>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Body</h4>
            <div className="space-y-3">
                {outline.body.map((section, index) => (
                    <div key={index}>
                        <h5 className="font-semibold text-slate-300">{section.heading}</h5>
                        <ul className="list-disc list-inside pl-4 text-slate-400">
                            {section.points.map((point, pIndex) => (
                                <li key={pIndex}>{point}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Conclusion</h4>
            <p className="leading-relaxed">{outline.conclusion}</p>
        </div>
    </div>
);

export const AITutor: React.FC = () => {
  const { ingestedText, addNotification, language, llm, activeProject, updateActiveProjectData } = useAppContext();
  const [mode, setMode] = useState<AIToolMode>('tutor');
  
  // Tutor state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(activeProject?.aiTutorHistory || []);
  const [currentMessage, setCurrentMessage] = useState('');
  const [persona, setPersona] = useState('Friendly Tutor'); // New State
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Essay Prep state
  const [essayTopic, setEssayTopic] = useState('');

  // --- API HOOKS ---

  // 1. Tutor Hook
  const { 
    execute: fetchTutorResponse, 
    loading: chatLoading 
  } = useApi(getTutorResponse);

  // 2. Outline Hook
  const { 
    execute: generateOutline, 
    loading: outlineLoading, 
    data: essayOutline, 
    setData: setEssayOutline 
  } = useApi(generateEssayOutline, "Essay outline generated!");

  // 3. Arguments Hook
  const { 
    execute: generateArgs, 
    loading: argsLoading, 
    data: essayArguments, 
    setData: setEssayArguments 
  } = useApi(generateEssayArguments, "Counter-arguments generated!");

  // Load history from project context
  useEffect(() => {
    if (activeProject) {
        setChatHistory(activeProject.aiTutorHistory || []);
    }
  }, [activeProject]);

  useEffect(() => {
    // Scroll to bottom of chat on new message
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, chatLoading]); 

  const handleSendMessage = useCallback(async () => {
    if (!ingestedText) {
      addNotification('Please ingest some text first to provide context.', 'info');
      return;
    }
    if (!currentMessage.trim()) return;

    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: currentMessage }];
    setChatHistory(newHistory);
    setCurrentMessage('');

    try {
      // Pass persona to the hook
      const response = await fetchTutorResponse(llm, ingestedText, newHistory, currentMessage, language, persona);
      
      if (response) {
        const updatedHistory = [...newHistory, { role: 'model', content: response }];
        setChatHistory(updatedHistory);
        // Persist history if inside a project
        updateActiveProjectData({ aiTutorHistory: updatedHistory });
      }
    } catch (e) {
      // Error handling by useApi hook toast
    }
  }, [ingestedText, currentMessage, chatHistory, addNotification, language, llm, fetchTutorResponse, persona, updateActiveProjectData]);

  const handleGenerateOutline = useCallback(async () => {
    if (!ingestedText) {
      addNotification('Please ingest some text first to provide context.', 'info');
      return;
    }
    if (!essayTopic.trim()) {
        addNotification('Please enter an essay topic or thesis.', 'info');
        return;
    }
    
    // Clear previous results
    setEssayOutline(null);
    setEssayArguments(null);

    await generateOutline(llm, ingestedText, essayTopic, language);
  }, [ingestedText, essayTopic, addNotification, language, llm, generateOutline, setEssayOutline, setEssayArguments]);

  const handleGenerateArguments = useCallback(async () => {
      if (!ingestedText || !essayTopic.trim()) return;
      
      // Clear previous args
      setEssayArguments(null);

      await generateArgs(llm, ingestedText, essayTopic, language);
  }, [ingestedText, essayTopic, language, llm, generateArgs, setEssayArguments]);

  if (!ingestedText) {
    return <EmptyState 
      title="AI Tutor & Essay Prep"
      message="Ingest your study material first. Then you can engage in a guided conversation with the AI Tutor or generate a structured essay outline."
    />;
  }

  const renderModeContent = () => {
    if (mode === 'tutor') {
      return (
        <>
            {/* Persona Selector Header */}
            <div className="flex justify-end mb-2">
                <select
                    value={persona}
                    onChange={(e) => setPersona(e.target.value)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 border-none rounded-md py-1 px-2 focus:ring-1 focus:ring-red-500 outline-none text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                    {PERSONAS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                </select>
            </div>

            <div ref={chatContainerRef} className="h-96 overflow-y-auto bg-slate-900/50 p-4 rounded-md border border-slate-700 space-y-4 mb-4 custom-scrollbar">
                {chatHistory.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-slate-400">Ask a question to start your tutoring session.</p>
                    </div>
                )}
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-red-800/60 text-white rounded-br-none' : 'bg-slate-700/80 text-slate-200 rounded-bl-none'}`}>
                            {msg.role === 'user' ? (
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            ) : (
                                <MarkdownRenderer content={msg.content} />
                            )}
                        </div>
                    </div>
                ))}
                 {chatLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-lg p-3 rounded-lg bg-slate-700/80 rounded-bl-none flex items-center gap-2">
                           <Loader spinnerClassName="w-4 h-4"/>
                           <span className="text-xs text-slate-400">Thinking...</span>
                        </div>
                    </div>
                 )}
            </div>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !chatLoading) handleSendMessage(); }}
                    placeholder={`Ask the ${persona}...`}
                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                    disabled={chatLoading}
                />
                <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || chatLoading}>
                    Send
                </Button>
            </div>
        </>
      );
    }
    
    // Essay mode
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                    type="text"
                    value={essayTopic}
                    onChange={(e) => setEssayTopic(e.target.value)}
                    placeholder="Enter an essay topic or thesis statement..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                    disabled={outlineLoading || argsLoading}
                />
                <Button onClick={handleGenerateOutline} disabled={!essayTopic.trim() || outlineLoading} className="w-full sm:w-auto flex-shrink-0">
                    {outlineLoading ? 'Generating...' : 'Generate Outline'}
                </Button>
            </div>
            
            {outlineLoading && <Loader />}
            
            {essayOutline && (
                <div className="space-y-4 fade-in">
                    <EssayOutlineDisplay outline={essayOutline} />
                    
                    <Button onClick={handleGenerateArguments} disabled={argsLoading} variant="secondary">
                        {argsLoading ? 'Thinking...' : "Generate Counter-Arguments"}
                    </Button>
                    
                    {argsLoading && <Loader />}
                    
                    {essayArguments && (
                        <div className="fade-in">
                             <h4 className="text-lg font-semibold text-slate-200 border-b border-slate-600 pb-1 mb-2">Counter-Arguments & Considerations</h4>
                             <div className="text-slate-300 leading-relaxed bg-slate-900 p-4 rounded-md border border-slate-700">
                                <MarkdownRenderer content={essayArguments} />
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-3">
        <h2 className="text-2xl font-bold text-slate-100">{mode === 'tutor' ? 'AI Tutor' : 'Essay Prep'}</h2>
        <div className="flex items-center gap-2 p-1 bg-slate-900 rounded-md">
            <button onClick={() => setMode('tutor')} className={`px-3 py-1 text-sm rounded transition-colors ${mode === 'tutor' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>Tutor</button>
            <button onClick={() => setMode('essay')} className={`px-3 py-1 text-sm rounded transition-colors ${mode === 'essay' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>Essay Prep</button>
        </div>
      </div>
      {renderModeContent()}
    </Card>
  );
};