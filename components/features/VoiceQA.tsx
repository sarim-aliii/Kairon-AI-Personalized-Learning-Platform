import React, { useState, useCallback } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { FileUploader } from '../ui/FileUploader';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; 
import { EmptyState } from '../ui/EmptyState';
import { transcribeAudio, transcribeYoutube, generateSummary, generateFlashcards, generateAnswer } from '../../services/amazonService';
import { Loader } from '../ui/Loader';


const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
};

export const AudioAnalysis: React.FC = () => {
  const { addNotification, language, llm } = useAppContext();
  
  // Media Inputs
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [youtubeLink, setYoutubeLink] = useState('');
  
  // Data State
  const [transcribedText, setTranscribedText] = useState<string | null>(null);
  const [question, setQuestion] = useState('');
  
  // --- API HOOKS ---

  // 1. Transcribe Hook (Handles both File and YouTube logic via wrapper if needed, or we just call the service directly)
  const { execute: runTranscribeFile, loading: isTranscribingFile } = useApi(transcribeAudio);
  const { execute: runTranscribeYoutube, loading: isTranscribingYoutube } = useApi(transcribeYoutube);

  // 2. Summary Hook
  const { 
      execute: runSummary, 
      loading: isSummarizing, 
      data: summary 
  } = useApi(generateSummary);

  // 3. Flashcards Hook
  const { 
      execute: runFlashcards, 
      loading: isGeneratingFlashcards, 
      data: flashcardsData 
  } = useApi(generateFlashcards);
  
  const flashcards = flashcardsData || [];

  // 4. QA Hook
  const { 
      execute: runQA, 
      loading: isAnswering, 
      data: answer 
  } = useApi(generateAnswer);


  const acceptedMimeTypes = {
    'audio/wav': ['.wav'],
    'audio/mpeg': ['.mp3'],
    'audio/mp4': ['.m4a'],
    'audio/x-m4a': ['.m4a'],
    'video/mp4': ['.mp4'],
    'video/quicktime': ['.mov'],
    'video/webm': ['.webm'],
  };

  const resetState = () => {
    setTranscribedText(null);
    setQuestion('');
  };

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
        setMediaFile(files[0]);
        setYoutubeLink('');
        resetState();
    }
  };

  const handleTranscribeFile = useCallback(async () => {
    if (!mediaFile) return;
    resetState();
    
    // Manual file-to-base64 (client side op)
    try {
        const base64Data = await fileToBase64(mediaFile);
        const text = await runTranscribeFile(llm, base64Data, mediaFile.type);
        setTranscribedText(text);
    } catch (e: any) {
        // fileToBase64 might fail, so we catch here. 
        // runTranscribeFile errors are handled by hook toast.
        addNotification(e.message, 'error');
    }
  }, [mediaFile, llm, runTranscribeFile, addNotification]);

  const handleTranscribeYoutube = useCallback(async () => {
    if (!youtubeLink.trim()) {
        addNotification('Please enter a YouTube URL.', 'info');
        return;
    }
    resetState();
    
    const text = await runTranscribeYoutube(llm, youtubeLink);
    setTranscribedText(text);
  }, [youtubeLink, llm, runTranscribeYoutube, addNotification]);


  // Action Handlers
  const handleGenerateSummary = async () => {
      if (!transcribedText) return;
      await runSummary(llm, transcribedText, language);
  };

  const handleGenerateFlashcards = async () => {
      if (!transcribedText) return;
      await runFlashcards(llm, transcribedText, language);
  };

  const handleAskQuestion = async () => {
      if (!transcribedText) return;
      if (!question.trim()) {
          addNotification('Please enter a question.', 'info');
          return;
      }
      await runQA(llm, transcribedText, question, language);
  };

  // Combined loading state for the main card
  const isLoading = isTranscribingFile || isTranscribingYoutube;

  return (
    <div className="space-y-6">
        <Card title="Audio & Video Analysis">
            <div className="space-y-6">
                
                <div className={`transition-opacity ${youtubeLink ? 'opacity-50' : 'opacity-100'}`}>
                    <FileUploader 
                        onFileUpload={handleFileUpload} 
                        acceptedMimeTypes={acceptedMimeTypes} 
                        multiple={false}
                        unsupportedFormatError="Unsupported format."
                        onError={addNotification}
                    />
                    {mediaFile && (
                        <div className="flex items-center justify-between mt-3 p-3 bg-slate-900 rounded-md border border-slate-700">
                             <p className="text-sm text-slate-300 truncate">Selected: <strong>{mediaFile.name}</strong></p>
                             <Button onClick={handleTranscribeFile} disabled={isLoading} className="text-sm py-1 px-3">
                                {isTranscribingFile ? 'Transcribing...' : 'Transcribe File'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-slate-800 text-slate-400">OR USE YOUTUBE</span>
                    </div>
                </div>

                <div className={`flex flex-col sm:flex-row gap-3 transition-opacity ${mediaFile ? 'opacity-50' : 'opacity-100'}`}>
                    <input 
                        type="text" 
                        value={youtubeLink}
                        onChange={(e) => {
                            setYoutubeLink(e.target.value);
                            setMediaFile(null);
                            resetState();
                        }}
                        placeholder="Paste YouTube Video URL here..." 
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        disabled={isLoading}
                    />
                    <Button onClick={handleTranscribeYoutube} disabled={!youtubeLink.trim() || isLoading} className="sm:w-auto">
                        {isTranscribingYoutube ? 'Fetching...' : 'Transcribe YouTube'}
                    </Button>
                </div>

            </div>
        </Card>

        {/* Loading Indicator */}
        {isLoading && !transcribedText && (
            <div className="flex flex-col items-center gap-4 py-8">
                <Loader />
                <p className="text-slate-400">Processing content...</p>
            </div>
        )}
        
        {/* Results Section */}
        {transcribedText && (
            <Card title="Analysis Results" className="fade-in">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-200 mb-2">Transcript</h3>
                        <div className="bg-slate-900 p-4 rounded-md border border-slate-700 max-h-60 overflow-y-auto custom-scrollbar">
                            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{transcribedText}</p>
                        </div>
                    </div>
                    
                    <hr className="border-slate-700"/>
                    
                    <div>
                         <h3 className="text-xl font-semibold text-slate-200 mb-4">AI Tools</h3>
                         <div className="grid grid-cols-1 gap-4">
                            
                            {/* Summary Tool */}
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-slate-300">Summary</h4>
                                    <Button onClick={handleGenerateSummary} disabled={isSummarizing} variant="secondary" className="text-xs">Generate</Button>
                                </div>
                                {isSummarizing && <Loader spinnerClassName="w-6 h-6" />}
                                {summary && <p className="text-slate-300 text-sm whitespace-pre-wrap fade-in">{summary}</p>}
                            </div>

                            {/* Flashcards Tool */}
                             <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-semibold text-slate-300">Flashcards</h4>
                                    <Button onClick={handleGenerateFlashcards} disabled={isGeneratingFlashcards} variant="secondary" className="text-xs">Generate</Button>
                                </div>
                                {isGeneratingFlashcards && <Loader spinnerClassName="w-6 h-6" />}
                                {flashcards.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 fade-in">
                                            {flashcards.map((fc, i) => (
                                                <div key={i} className="p-3 bg-slate-900/80 rounded border border-slate-600">
                                                    <p className="text-xs text-slate-400 mb-1">Q: {fc.question}</p>
                                                    <p className="text-sm text-slate-200">A: {fc.answer}</p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Q&A Tool */}
                            <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                <h4 className="font-semibold text-slate-300 mb-3">Ask a Question</h4>
                                <div className="flex gap-2">
                                    <input 
                                            type="text" 
                                            value={question} 
                                            onChange={e => setQuestion(e.target.value)} 
                                            placeholder="What did the speaker say about..." 
                                            className="flex-1 bg-slate-900 border border-slate-700 rounded text-sm p-2 text-slate-300 focus:ring-1 focus:ring-red-500 outline-none" 
                                            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                                    />
                                    <Button onClick={handleAskQuestion} disabled={isAnswering || !question.trim()}>Ask</Button>
                                </div>
                                {isAnswering && <div className="mt-3"><Loader spinnerClassName="w-6 h-6" /></div>}
                                {answer && (
                                    <div className="mt-3 p-3 bg-slate-900/80 rounded border-l-2 border-red-500 fade-in">
                                            <p className="text-slate-300 text-sm">{answer}</p>
                                    </div>
                                )}
                            </div>

                         </div>
                    </div>
                </div>
            </Card>
        )}

        {!mediaFile && !youtubeLink && !transcribedText && <EmptyState 
            title="Audio & Video Analysis"
            message="Upload a lecture recording or paste a YouTube link. Kairon AI will transcribe it, enabling you to summarize, study, and ask questions about the content."
        />}
    </div>
  );
};