import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { generateSummary } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { EmptyState } from '../ui/EmptyState';
import { useSpeech } from '../../hooks/useSpeech';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { ContextualHover } from '../ui/ContextualHover';

export const Summary: React.FC = () => {
  const { ingestedText, addNotification, language, llm, activeProject, updateActiveProjectData } = useAppContext();

  // Local state for immediate display (initialized from DB)
  const [summary, setSummary] = useState<string | null>(activeProject?.summary || null);

  // Text-to-Speech Hook
  const { speak, cancelSpeaking, isSpeaking } = useSpeech(language);

  // 2. Setup API Hook
  const {
    execute: createSummary,
    loading: isLoading
  } = useApi(generateSummary); // We handle success manually to update DB

  useEffect(() => {
    setSummary(activeProject?.summary || null);
    return () => cancelSpeaking();
  }, [activeProject, cancelSpeaking]);

  const handleGenerateSummary = useCallback(async () => {
    if (!ingestedText) {
      addNotification('Please ingest some text first.', 'info');
      return;
    }

    cancelSpeaking(); // Stop any current speech

    // 3. Execute Hook
    const result = await createSummary(llm, ingestedText, language);

    if (result) {
      setSummary(result);
      try {
        await updateActiveProjectData({ summary: result });
        addNotification("Summary generated and saved!", "success");
      } catch (e: any) {
        addNotification("Summary generated but failed to save: " + e.message, "error");
      }
    }
  }, [ingestedText, addNotification, language, llm, updateActiveProjectData, cancelSpeaking, createSummary]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      cancelSpeaking();
    } else if (summary) {
      speak(summary);
    }
  };

  if (!ingestedText) {
    return <EmptyState
      title="Generate a Summary"
      message="First, provide some study material in the 'Ingest' tab. Once you've ingested text, you can generate a concise summary here."
    />;
  }

  return (
    <Card title="Auto Summary">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? 'Generating...' : (summary ? 'Regenerate Summary' : 'Generate Summary')}
          </Button>

          {/* Read Aloud Button */}
          {summary && (
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-full transition-all duration-200 border ${isSpeaking
                  ? 'bg-red-600 text-white border-red-500 animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                }`}
              title={isSpeaking ? "Stop Reading" : "Read Aloud"}
            >
              {isSpeaking ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          )}
        </div>

        {isLoading && <Loader />}

        {summary && (
          <div className="fade-in bg-gray-50 dark:bg-slate-900 p-4 rounded-md border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Summary</h3>
            <div className="w-full overflow-hidden">
              <ContextualHover>
                <MarkdownRenderer content={summary} />
              </ContextualHover>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};