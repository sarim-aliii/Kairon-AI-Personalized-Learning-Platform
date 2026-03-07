import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { generateCodeAnalysis, explainCodeAnalysis, translateCode } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { Mermaid } from '../ui/Mermaid';
import { CodeAnalysisResult, CodeTranslationResult } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';

type ArtifactType = 'code' | 'algorithm' | 'pseudocode' | 'flowchart';

const RUNTIME_LANGUAGES = [
    { label: 'Python', value: 'python' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Java', value: 'java' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
    { label: 'C++', value: 'c++' },
];

const TARGET_LANGUAGES = [
    { label: 'Python', value: 'Python' },
    { label: 'JavaScript', value: 'JavaScript' },
    { label: 'TypeScript', value: 'TypeScript' },
    { label: 'Java', value: 'Java' },
    { label: 'C++', value: 'C++' },
    { label: 'Go', value: 'Go' },
    { label: 'Rust', value: 'Rust' },
    { label: 'Swift', value: 'Swift' },
];

const CodeAnalysis: React.FC = () => {
    const { 
        addNotification, 
        language, 
        llm, 
        activeProject, 
        ingestText, 
        updateProjectData 
    } = useAppContext();
    
    const [code, setCode] = useState(activeProject?.codeSnippet || '');
    const [mermaidTheme, setMermaidTheme] = useState<'dark' | 'default'>('dark');
    
    // Execution State
    const [languageRuntime, setLanguageRuntime] = useState('python');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    // Translation State
    const [targetLanguage, setTargetLanguage] = useState('Java');

    // Explanation State
    const [explanationArtifact, setExplanationArtifact] = useState('');
    const [explanationType, setExplanationType] = useState<ArtifactType>('code');

    // Fullscreen State
    const [expandedArtifact, setExpandedArtifact] = useState<{ title: string, content: string } | null>(null);

    // --- API HOOKS ---

    // 1. Analysis Hook
    const { 
        execute: runAnalysis, 
        loading: isAnalyzing, 
        data: analysisResult, 
        setData: setAnalysisResult 
    } = useApi(generateCodeAnalysis); 

    // 2. Explanation Hook
    const { 
        execute: runExplanation, 
        loading: isExplaining, 
        data: explanationResult,
        setData: setExplanationResult
    } = useApi(explainCodeAnalysis);

    // 3. Translation Hook
    const { 
        execute: runTranslation, 
        loading: isTranslating, 
        data: translationResult, 
    } = useApi(translateCode);


    // Sync Active Project Data with Hook State
    useEffect(() => {
        if (activeProject) {
            setCode(activeProject.codeSnippet || '');
            setAnalysisResult(activeProject.codeAnalysis || null);
        }
    }, [activeProject, setAnalysisResult]);

    // Close fullscreen on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setExpandedArtifact(null);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const handleRunCode = async () => {
        if (!code.trim()) return;
        setIsRunning(true);
        setOutput('');
        
        try {
            // Using Piston API for code execution
            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: languageRuntime,
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

    const handleGenerate = useCallback(async () => {
        if (!code.trim()) {
            addNotification('Please paste code to analyze.', 'info');
            return;
        }
        
        // Clear previous explanation when generating new analysis
        setExplanationResult(null);

        // 1. Run the Analysis
        const result = await runAnalysis(llm, code, language);

        // If result is null, it failed. Stop here.
        if (!result) return;

        // 2. Handle Project Persistence
        try {
            let targetProjectId = activeProject?._id;

            // If no project exists, create one now
            if (!targetProjectId) {
                const projectName = `Code Analysis ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                const newProject = await ingestText(projectName, code, false);
                if (newProject) targetProjectId = newProject._id;
            }

            // 3. Save the specific Code Analysis data to the project
            if (targetProjectId) {
                await updateProjectData(targetProjectId, { 
                    codeSnippet: code,
                    codeAnalysis: result 
                });
            }
        } catch (e: any) {
            addNotification("Analysis generated, but failed to save to project: " + e.message, 'error');
        }
        
    }, [code, addNotification, language, llm, activeProject, ingestText, updateProjectData, runAnalysis, setExplanationResult]);

    const handleTranslate = useCallback(async () => {
        if (!code.trim()) {
            addNotification('Please paste code to translate.', 'info');
            return;
        }
        await runTranslation(llm, code, targetLanguage);
    }, [code, targetLanguage, llm, addNotification, runTranslation]);

    const handleExplain = useCallback(async () => {
        if (!explanationArtifact.trim()) {
            addNotification(`Please provide the ${explanationType} to explain.`, 'info');
            return;
        }
        await runExplanation(llm, explanationArtifact, language, explanationType);
    }, [explanationArtifact, explanationType, addNotification, language, llm, runExplanation]);

    const copyToExplain = (type: ArtifactType) => {
        if (analysisResult) {
            switch (type) {
                case 'algorithm': setExplanationArtifact(analysisResult.algorithm); break;
                case 'pseudocode': setExplanationArtifact(analysisResult.pseudocode); break;
                case 'flowchart': setExplanationArtifact(analysisResult.flowchart); break;
                default: break;
            }
            setExplanationType(type);
            addNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to Explanation Tool. Scroll down to view.`, 'success');
        }
    }

    const toggleMermaidTheme = () => {
        setMermaidTheme(prev => prev === 'dark' ? 'default' : 'dark');
    };

    const downloadArtifact = (type: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${type}_kairon_ai.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <Card title="Interactive Code Editor">
                <div className="space-y-4">
                    {/* Toolbar Row 1: Language & Main Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Run Language:</span>
                             <select 
                                value={languageRuntime}
                                onChange={(e) => setLanguageRuntime(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md focus:ring-red-500 focus:border-red-500 block p-1.5"
                            >
                                {RUNTIME_LANGUAGES.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button onClick={handleRunCode} disabled={!code.trim() || isRunning} className="text-xs sm:text-sm px-3 py-1.5 bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                                {isRunning ? 'Running...' : '▶ Run Code'}
                            </Button>
                            <Button onClick={handleGenerate} disabled={!code.trim() || isAnalyzing} variant="secondary" className="text-xs sm:text-sm px-3 py-1.5 w-full sm:w-auto">
                                {isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}
                            </Button>
                        </div>
                    </div>

                    {/* Toolbar Row 2: Translation Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-blue-50 dark:bg-slate-800/50 p-2 rounded-md border border-blue-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Translate to:</span>
                             <select 
                                value={targetLanguage}
                                onChange={(e) => setTargetLanguage(e.target.value)}
                                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-md block p-1.5"
                            >
                                {TARGET_LANGUAGES.map(lang => (
                                    <option key={lang.value} value={lang.value}>{lang.label}</option>
                                ))}
                            </select>
                        </div>
                        <Button 
                            onClick={handleTranslate} 
                            disabled={!code.trim() || isTranslating} 
                            className="text-xs sm:text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white"
                        >
                            {isTranslating ? 'Translating...' : '⚡ Translate Code'}
                        </Button>
                    </div>

                    {/* Editor & Console Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Editor Panel */}
                        <div className="h-80 border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden">
                            <Editor
                                height="100%"
                                language={languageRuntime}
                                theme="vs-dark"
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                }}
                            />
                        </div>

                        {/* Output Console */}
                        <div className="h-80 flex flex-col bg-black rounded-md border border-slate-700 overflow-hidden font-mono text-sm">
                            <div className="bg-slate-900 px-3 py-2 border-b border-slate-700 text-xs text-slate-400 font-bold uppercase tracking-wider flex justify-between">
                                <span>Console Output</span>
                                {output && <button onClick={() => setOutput('')} className="hover:text-white">Clear</button>}
                            </div>
                            <div className="flex-1 p-3 overflow-auto text-green-400 whitespace-pre-wrap">
                                {isRunning ? (
                                    <span className="animate-pulse">Executing script...</span>
                                ) : (
                                    output || <span className="text-slate-600 italic">// Output will appear here</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {isAnalyzing && <Loader />}
            {isTranslating && <Loader />}

            {/* Translation Result Card */}
            {translationResult && (
                <Card title={`Translation: ${targetLanguage}`} className="fade-in border-blue-200 dark:border-blue-900">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Translated Code View */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Translated Code</h3>
                            <div className="h-80 border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden">
                                <Editor
                                    height="100%"
                                    language={targetLanguage.toLowerCase()}
                                    theme="vs-dark"
                                    value={(translationResult as CodeTranslationResult).translatedCode}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        scrollBeyondLastLine: false,
                                    }}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => {
                                        const res = translationResult as CodeTranslationResult;
                                        downloadArtifact(`translated_${targetLanguage}`, res.translatedCode);
                                    }} 
                                    variant="secondary" 
                                    className="flex-1 text-xs"
                                >
                                    Download Code
                                </Button>
                                <Button 
                                    onClick={() => {
                                        const res = translationResult as CodeTranslationResult;
                                        setExplanationArtifact(res.translatedCode);
                                        setExplanationType('code');
                                        addNotification('Translated code copied to Explanation Tool.', 'success');
                                    }}
                                    variant="secondary"
                                    className="flex-1 text-xs"
                                >
                                    Copy to Explain
                                </Button>
                            </div>
                        </div>

                        {/* Explanation View */}
                        <div className="space-y-2">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-200">Key Differences</h3>
                            <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700 h-80 overflow-y-auto custom-scrollbar">
                                <MarkdownRenderer content={(translationResult as CodeTranslationResult).explanation} />
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {analysisResult && (
                <Card title="Generated Artifacts" className="fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(analysisResult).map(([key, value]) => (
                            <div 
                                key={key} 
                                className={`space-y-2 ${key === 'flowchart' ? 'md:col-span-2' : ''}`}
                            > 
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </h3>
                                    {key === 'flowchart' && (
                                        <button 
                                            onClick={toggleMermaidTheme}
                                            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline"
                                        >
                                            Theme: {mermaidTheme === 'dark' ? 'Dark' : 'Light'}
                                        </button>
                                    )}
                                </div>
                                
                                {key === 'flowchart' ? (
                                    <div className={`p-1 rounded-md border border-slate-200 dark:border-slate-700 overflow-hidden ${mermaidTheme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                                        <Mermaid chart={value} theme={mermaidTheme} />
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 dark:bg-slate-900 p-3 rounded-md border border-slate-200 dark:border-slate-700 h-64 overflow-y-auto whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 custom-scrollbar font-mono">
                                        {value}
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button onClick={() => copyToExplain(key as ArtifactType)} variant="secondary" className="text-xs flex-1">
                                        Copy to Explain
                                    </Button>
                                    {/* Action Buttons for Text Artifacts */}
                                    {key !== 'flowchart' && (
                                        <>
                                            <Button 
                                                onClick={() => setExpandedArtifact({ title: key, content: value })} 
                                                variant="secondary" 
                                                className="text-xs px-3" 
                                                title="Fullscreen"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 011 1v1.586l2.293-2.293a1 1 0 011.414 1.414L5.414 15H7a1 1 0 010 2H3a1 1 0 01-1-1v-4a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                            </Button>
                                            <Button onClick={() => downloadArtifact(key, value)} variant="secondary" className="text-xs px-3" title="Download as Text">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </Button>
                                        </>
                                    )}
                                    {/* Separate fullscreen logic for flowchart */}
                                    {key === 'flowchart' && (
                                        <Button 
                                            onClick={() => setExpandedArtifact({ title: key, content: value })} 
                                            variant="secondary" 
                                            className="text-xs px-3" 
                                            title="Fullscreen"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 011 1v1.586l2.293-2.293a1 1 0 011.414 1.414L5.414 15H7a1 1 0 010 2H3a1 1 0 01-1-1v-4a1 1 0 011-1zm10 0a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Card title="Explanation Tool">
                 <div className="flex flex-col space-y-4">
                    <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-md">
                        {(['code', 'algorithm', 'pseudocode', 'flowchart'] as ArtifactType[]).map(type => (
                            <button key={type} onClick={() => { setExplanationType(type); setExplanationArtifact(''); }} 
                                className={`px-3 py-1 text-xs rounded transition-colors ${explanationType === type ? 'bg-red-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'}`}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                    <textarea
                        value={explanationArtifact}
                        onChange={(e) => setExplanationArtifact(e.target.value)}
                        placeholder={`Paste the ${explanationType} here to get an explanation...`}
                        className="w-full h-32 bg-gray-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-3 text-slate-800 dark:text-slate-300 font-mono text-sm focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        disabled={isExplaining}
                    />
                    <Button onClick={handleExplain} disabled={!explanationArtifact.trim() || isExplaining} className="w-full">
                        {isExplaining ? 'Explaining...' : `Explain ${explanationType.charAt(0).toUpperCase() + explanationType.slice(1)}`}
                    </Button>
                    
                    {isExplaining && <Loader />}
                    
                    {explanationResult && (
                         <div className="fade-in mt-4">
                             <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Explanation</h4>
                             <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700 w-full overflow-hidden">
                                <MarkdownRenderer content={explanationResult} />
                             </div>
                         </div>
                    )}
                 </div>
            </Card>

            {/* FULLSCREEN MODAL */}
            {expandedArtifact && (
                <div className="fixed inset-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm flex flex-col p-4 md:p-8 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-3xl font-bold text-red-600 dark:text-red-400 capitalize">{expandedArtifact.title}</h2>
                        <button 
                            onClick={() => setExpandedArtifact(null)}
                            className="p-2 rounded-full bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Close (Esc)"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className={`flex-1 overflow-auto bg-gray-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-base text-slate-800 dark:text-slate-300 whitespace-pre-wrap shadow-2xl ${expandedArtifact.title === 'flowchart' ? 'p-0 overflow-hidden' : 'p-6'}`}>
                        {expandedArtifact.title === 'flowchart' ? (
                            <div className="w-full h-full">
                                <Mermaid chart={expandedArtifact.content} theme={mermaidTheme} />
                            </div>
                        ) : (
                            expandedArtifact.content
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CodeAnalysis;