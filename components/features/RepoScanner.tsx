import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { analyzeGitHubRepo } from '../../services/api';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Loader } from '../ui/Loader';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { Mermaid } from '../ui/Mermaid';

export const RepoScanner: React.FC = () => {
    const { llm, language, addNotification } = useAppContext();
    const [repoUrl, setRepoUrl] = useState('');
    
    // We use a specific type for the result data
    const { 
        execute: scanRepo, 
        loading, 
        data 
    } = useApi(async () => await analyzeGitHubRepo(llm, repoUrl, language));

    const handleScan = async () => {
        if (!repoUrl.includes('github.com')) {
            addNotification("Please enter a valid GitHub URL", "info");
            return;
        }
        await scanRepo();
    };

    return (
        <div className="space-y-6 fade-in">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">GitHub Architect</h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Ingest an entire public repository and generate a visual architecture map.
                </p>
            </div>

            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Repository URL
                        </label>
                        <Input 
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/facebook/react"
                            disabled={loading}
                        />
                    </div>
                    <Button 
                        onClick={handleScan} 
                        disabled={loading || !repoUrl}
                        className="w-full md:w-auto min-w-[120px]"
                    >
                        {loading ? 'Analyzing...' : 'Scan Repo'}
                    </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    *Works best with public repositories. Analysis may take 30-60 seconds for large codebases.
                </p>
            </Card>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader size="lg" />
                    <p className="mt-6 text-slate-500 animate-pulse text-center">
                        Reading file tree...<br/>
                        Downloading source code...<br/>
                        Consulting the Architect...
                    </p>
                </div>
            )}

            {!loading && data && (
                <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                    {/* Architecture Diagram */}
                    <Card title="System Architecture" className="overflow-hidden">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-lg overflow-x-auto flex justify-center">
                            <Mermaid chart={data.diagram} />
                        </div>
                    </Card>

                    {/* Explanation */}
                    <Card title="Codebase Analysis">
                        <MarkdownRenderer content={data.explanation} />
                    </Card>
                </div>
            )}
        </div>
    );
};