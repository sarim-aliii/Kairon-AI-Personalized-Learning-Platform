import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { conductMockInterview } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { ChatMessage, Difficulty } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { useSpeech } from '../../hooks/useSpeech';

interface MockInterviewProps {
    topic: string;
    onClose: () => void;
}

const RUNTIME_LANGUAGES = [
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'c++' },
    { label: 'Go', value: 'go' },
];

export const MockInterview: React.FC<MockInterviewProps> = ({ topic, onClose }) => {
    const { llm, language, addNotification, updateProgress } = useAppContext();
    const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
    const [status, setStatus] = useState<'setup' | 'active' | 'feedback'>('setup');
    
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    
    // --- EDITOR STATE ---
    const [code, setCode] = useState('// Write your solution here...');
    const [editorLanguage, setEditorLanguage] = useState('python');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // --- VOICE MODE STATE & HOOKS ---
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    
    const { 
        isListening, 
        transcript, 
        startListening, 
        stopListening, 
        speak, 
        cancelSpeaking, 
        browserSupportsSpeech,
        setTranscript 
    } = useSpeech(language);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    // --- API HOOKS ---
    const { 
        execute: initInterview, 
        loading: isStarting 
    } = useApi(conductMockInterview);

    const { 
        execute: sendMessage, 
        loading: isSending 
    } = useApi(conductMockInterview);

    // Scroll to bottom on updates
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory, isSending]);

    // Sync Voice Transcript to Input
    useEffect(() => {
        if (isVoiceMode && isListening) {
            setCurrentMessage(transcript);
        }
    }, [transcript, isVoiceMode, isListening]);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => cancelSpeaking();
    }, [cancelSpeaking]);

    const handleClose = () => {
        cancelSpeaking();
        onClose();
    };

    const handleRunCode = async () => {
        if (!code.trim()) return;
        setIsRunning(true);
        setOutput('');
        
        try {
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: editorLanguage,
                    version: '*',
                    files: [{ content: code }]
                })
            });
            
            const data = await response.json();
            if (data.run) {
                setOutput(data.run.output || 'Code executed successfully with no output.');
            } else {
                setOutput('Error: Could not execute code. Please check syntax.');
            }
        } catch (e: any) {
            setOutput(`Execution Failed: ${e.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const startInterview = async () => {
        setStatus('active');
        const initialPrompt = "Hello, I am ready for the interview.";
        
        try {
            const response = await initInterview(llm, topic, initialPrompt, [], language, difficulty);
            
            if (response) {
                setChatHistory([
                    { role: 'user', content: initialPrompt }, 
                    { role: 'model', content: response }
                ]);
                
                if (isVoiceMode) {
                    speak(response);
                }
            }
        } catch (e) {
            setStatus('setup');
        }
    };

    const handleSendMessage = async () => {
        if (!currentMessage.trim()) return;

        if (isListening) stopListening();

        const userMsg: ChatMessage = { role: 'user', content: currentMessage };
        
        const newHistory = [...chatHistory, userMsg];
        setChatHistory(newHistory); 
        setCurrentMessage('');
        setTranscript(''); 

        const isEnding = currentMessage.toLowerCase().includes('end interview') || currentMessage.toLowerCase().includes('stop');

        if (isEnding) {
             setStatus('feedback');
             updateProgress(100, topic); 
             return;
        }

        try {
            // Include Code Context Invisibly
            let promptToSend = userMsg.content;
            if (code && code.length > 50 && code !== '// Write your solution here...') {
                promptToSend += `\n\n[CONTEXT - MY CURRENT CODE ON WHITEBOARD (${editorLanguage})]:\n\`\`\`${editorLanguage}\n${code}\n\`\`\`\n\nPlease critique or reference this code if relevant to my answer.`;
            }

            const response = await sendMessage(llm, topic, promptToSend, chatHistory, language, difficulty);
            
            if (response) {
                setChatHistory(prev => [...prev, { role: 'model', content: response }]);
                
                if (isVoiceMode) {
                    speak(response);
                }
            }
        } catch (e) {
            // Error handled by hook
        }
    };

    // Combined loading state
    const isLoading = isStarting || isSending;

    return (
        <Card title={`Mock Interview: ${topic}`} className="h-[85vh] flex flex-col relative overflow-hidden">
            {/* SETUP SCREEN */}
            {status === 'setup' && (
                <div className="flex flex-col items-center justify-center h-full space-y-8 animate-in fade-in">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-slate-200">Ready to practice?</h3>
                        <p className="text-slate-400 max-w-md">I will act as your technical interviewer. I'll ask questions, evaluate your answers, and you can write code on the whiteboard.</p>
                    </div>

                    <div className="space-y-4 w-full max-w-xs flex flex-col items-center">
                        <div className="w-full">
                            <label className="text-sm font-medium text-slate-300 mb-1 block">Select Difficulty</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        {browserSupportsSpeech && (
                             <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-900/50 border border-slate-700 rounded-md w-full justify-center hover:bg-slate-800 transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={isVoiceMode} 
                                    onChange={() => setIsVoiceMode(!isVoiceMode)} 
                                    className="accent-red-500 w-4 h-4"
                                />
                                <span className={`text-sm font-medium ${isVoiceMode ? 'text-red-400' : 'text-slate-400'}`}>
                                    Enable Voice Mode 🎙️
                                </span>
                            </label>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <Button onClick={handleClose} variant="secondary">Cancel</Button>
                        <Button onClick={startInterview} disabled={isStarting}>
                            {isStarting ? 'Starting...' : 'Start Interview'}
                        </Button>
                    </div>
                </div>
            )}

            {/* ACTIVE INTERVIEW / FEEDBACK SCREEN */}
            {(status === 'active' || status === 'feedback') && (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2 px-1">
                         <div className="flex items-center gap-3">
                             <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                                {status === 'feedback' ? 'Interview Complete' : 'Live Interview'}
                             </span>
                             {browserSupportsSpeech && status === 'active' && (
                                <button 
                                    onClick={() => {
                                        setIsVoiceMode(!isVoiceMode);
                                        cancelSpeaking();
                                    }}
                                    className={`p-1 rounded-full transition-colors ${isVoiceMode ? 'bg-red-500/20 text-red-400' : 'text-slate-600 hover:text-slate-400'}`}
                                    title={isVoiceMode ? "Disable Voice" : "Enable Voice"}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                    </svg>
                                </button>
                             )}
                         </div>
                         <button onClick={handleClose} className="text-slate-400 hover:text-white text-sm">Exit</button>
                    </div>

                    {/* Main Content Area - Split View */}
                    <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden min-h-0">
                        
                        {/* LEFT: CHAT INTERFACE */}
                        <div className="flex-1 flex flex-col h-full min-w-0 border-r border-slate-700/50 pr-2">
                            {/* Chat History - flex-1 ensures it takes available space but allows shrinking */}
                            <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[90%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-red-900/40 border border-red-500/30' : 'bg-slate-800 border border-slate-700'}`}>
                                            {msg.role === 'model' ? (
                                                <div className="text-slate-200 text-sm">
                                                    <MarkdownRenderer content={msg.content} />
                                                </div>
                                            ) : (
                                                <p className="text-slate-200 text-sm whitespace-pre-wrap">{msg.content}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg flex items-center gap-2">
                                            <Loader spinnerClassName="w-4 h-4" />
                                            <span className="text-xs text-slate-400">Interviewer is evaluating...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chat Input - Fixed height container */}
                            {status === 'active' && (
                                <div className="mt-auto pt-4 border-t border-slate-700 flex gap-2 items-center flex-shrink-0 bg-slate-900 z-10 pb-1">
                                    {isVoiceMode && (
                                        <button
                                            onMouseDown={startListening}
                                            onMouseUp={stopListening}
                                            onMouseLeave={stopListening}
                                            onTouchStart={startListening}
                                            onTouchEnd={stopListening}
                                            disabled={isLoading}
                                            className={`p-3 rounded-lg border transition-all duration-200 flex-shrink-0 ${
                                                isListening 
                                                ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105' 
                                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-500'
                                            }`}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}

                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={currentMessage}
                                            onChange={(e) => setCurrentMessage(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !isLoading) handleSendMessage(); }}
                                            placeholder={isVoiceMode ? "Hold mic or type..." : "Type response..."}
                                            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 pr-8 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition disabled:opacity-50 text-sm h-12"
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>

                                    <Button onClick={handleSendMessage} disabled={!currentMessage.trim() || isLoading} className="h-12 px-6 text-sm flex-shrink-0">
                                        Send
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* RIGHT: WHITEBOARD (EDITOR) */}
                        <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                            {/* Editor Toolbar */}
                            <div className="flex justify-between items-center p-2 bg-slate-800 border-b border-slate-700 flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase">Whiteboard</span>
                                    <select 
                                        value={editorLanguage}
                                        onChange={(e) => setEditorLanguage(e.target.value)}
                                        className="bg-slate-900 border border-slate-600 text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-red-500"
                                    >
                                        {RUNTIME_LANGUAGES.map(l => (
                                            <option key={l.value} value={l.value}>{l.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button 
                                    onClick={handleRunCode} 
                                    disabled={isRunning} 
                                    className="text-xs py-1 px-3 bg-green-600 hover:bg-green-700 h-8"
                                >
                                    {isRunning ? 'Running...' : '▶ Run Code'}
                                </Button>
                            </div>

                            {/* Code Editor */}
                            <div className="flex-1 relative min-h-0">
                                <Editor
                                    height="100%"
                                    language={editorLanguage}
                                    theme="vs-dark"
                                    value={code}
                                    onChange={(val) => setCode(val || '')}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        padding: { top: 10 }
                                    }}
                                />
                            </div>

                            {/* Output Console */}
                            <div className="h-1/3 bg-black border-t border-slate-700 flex flex-col flex-shrink-0">
                                <div className="px-3 py-1 bg-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex justify-between items-center">
                                    <span>Console Output</span>
                                    {output && <button onClick={() => setOutput('')} className="hover:text-white">Clear</button>}
                                </div>
                                <div className="flex-1 p-2 overflow-auto font-mono text-xs text-green-400 whitespace-pre-wrap">
                                    {isRunning ? (
                                        <span className="animate-pulse">Executing script...</span>
                                    ) : (
                                        output || <span className="text-slate-600 italic">// Output will appear here</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {status === 'feedback' && (
                        <div className="mt-2 text-center">
                            <p className="text-green-400 mb-2 font-medium text-sm">Session Ended. Review feedback above.</p>
                            <Button onClick={handleClose}>Close Session</Button>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};