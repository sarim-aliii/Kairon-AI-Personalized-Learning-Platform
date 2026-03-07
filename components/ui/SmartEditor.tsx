import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { transformContent } from '../../services/amazonService';
import { Loader } from './Loader';

interface SmartEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

interface Command {
    id: string;
    label: string;
    icon: React.ReactNode;
    instruction: string;
}

const COMMANDS: Command[] = [
    { id: 'expand', label: 'Expand / Continue', instruction: 'Continue writing this train of thought logically. Add 2-3 detailed sentences.', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg> },
    { id: 'fix', label: 'Fix Grammar & Spelling', instruction: 'Correct grammar and spelling errors in the selected text. Keep the tone professional.', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
    { id: 'summarize', label: 'Summarize Selection', instruction: 'Summarize the selected text into one concise bullet point.', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
    { id: 'example', label: 'Give an Example', instruction: 'Provide a concrete example or analogy to explain the concept in the selected text.', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
    { id: 'simplify', label: 'Simplify Language', instruction: 'Rewrite the selection to be simpler and easier to understand (ELI5 style).', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
];

export const SmartEditor: React.FC<SmartEditorProps> = ({ value, onChange, placeholder, className }) => {
    const { llm, language, addNotification } = useAppContext();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    // Menu State
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    // API Hook
    const { execute: runTransform, loading: isProcessing } = useApi(transformContent);

    // Handle Input & Slash Detection
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        const cursor = e.target.selectionStart;
        const charBefore = newValue.slice(cursor - 1, cursor);
        
        if (charBefore === '/') {
            // Calculate pseudo-position for menu (simplified relative to container)
            // A full implementation would use a mirror div for exact pixel coordinates
            setMenuPosition({ 
                top: 60, // Fixed offset for simplicity
                left: 20 
            });
            setShowMenu(true);
            setSelectedIndex(0);
        } else if (showMenu) {
            // Close menu if user types space or deletes the slash
            if (charBefore === ' ' || newValue.length < value.length) {
                setShowMenu(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!showMenu) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % COMMANDS.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + COMMANDS.length) % COMMANDS.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(COMMANDS[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowMenu(false);
        }
    };

    const executeCommand = async (command: Command) => {
        if (!textareaRef.current) return;
        
        const cursor = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;
        const hasSelection = cursor !== selectionEnd;
        
        const fullText = value;
        
        // If text is selected, use that. Otherwise, use text before cursor as context.
        const selectedText = hasSelection 
            ? fullText.substring(cursor, selectionEnd) 
            : fullText.substring(Math.max(0, cursor - 1000), cursor);

        // Remove the slash if it exists immediately before cursor
        let textBefore = fullText.substring(0, cursor);
        const textAfter = fullText.substring(selectionEnd);
        
        if (textBefore.endsWith('/')) {
            textBefore = textBefore.slice(0, -1);
        }

        setShowMenu(false);

        try {
            const result = await runTransform(llm, fullText, selectedText, command.instruction, language);
            
            let newText = '';
            if (hasSelection) {
                // If text was selected, replace it with the AI result (e.g., fixing grammar)
                newText = textBefore.substring(0, cursor) + result + textAfter;
            } else {
                // If no selection, append the AI result (e.g., expanding thought)
                newText = textBefore + " " + result + textAfter;
            }
            
            onChange(newText);
            addNotification("AI content generated!", "success");
            
            // Refocus editor
            textareaRef.current.focus();
        } catch (e) {
            // Error handled by hook
        }
    };

    return (
        <div className="relative w-full group">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`${className} font-mono text-sm leading-relaxed custom-scrollbar outline-none`}
                disabled={isProcessing}
            />
            
            {/* Loading Overlay */}
            {isProcessing && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10">
                    <div className="bg-slate-900 p-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-3">
                        <Loader spinnerClassName="w-5 h-5" />
                        <span className="text-sm font-medium text-slate-200">AI is writing...</span>
                    </div>
                </div>
            )}

            {/* AI Command Menu */}
            {showMenu && (
                <div 
                    className="absolute z-20 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-100"
                    style={{ top: menuPosition.top, left: menuPosition.left }}
                >
                    <div className="bg-slate-800 px-3 py-2 border-b border-slate-700">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Commands</p>
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                        {COMMANDS.map((cmd, idx) => (
                            <button
                                key={cmd.id}
                                onClick={() => executeCommand(cmd)}
                                onMouseEnter={() => setSelectedIndex(idx)}
                                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                                    idx === selectedIndex 
                                    ? 'bg-red-600 text-white' 
                                    : 'text-slate-300 hover:bg-slate-800'
                                }`}
                            >
                                <span className={idx === selectedIndex ? 'text-white' : 'text-slate-500'}>
                                    {cmd.icon}
                                </span>
                                <div>
                                    <p className="font-medium">{cmd.label}</p>
                                    <p className={`text-[10px] ${idx === selectedIndex ? 'text-red-100' : 'text-slate-500'}`}>
                                        {cmd.instruction.substring(0, 40)}...
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Helper Hint */}
            {!showMenu && !isProcessing && (
                <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-60 transition-opacity">
                    <span className="bg-slate-800/80 backdrop-blur-sm text-slate-400 text-xs px-2 py-1 rounded border border-slate-700 shadow-sm">
                        Type <strong>/</strong> for AI
                    </span>
                </div>
            )}
        </div>
    );
};