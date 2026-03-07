import React, { useState, useCallback, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; // 1. Import hook
import { performSemanticSearch } from '../../services/amazonService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';
import { Slider } from '../ui/Slider';
import { EmptyState } from '../ui/EmptyState';
import { SearchResult } from '../../services/api';

const SEARCH_HISTORY_KEY = 'semanticSearchHistory';

export const SemanticSearch: React.FC = () => {
  const { ingestedText, activeProjectId, addNotification, llm } = useAppContext();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState(4);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Global Search Toggle
  const [isGlobal, setIsGlobal] = useState(false);

  // 2. Setup Hook
  // We use the hook to manage loading state, data (results), and errors automatically.
  const { 
    execute: search, 
    loading: isLoading, 
    data: results 
  } = useApi(performSemanticSearch); // Auto-toasts on error, we handle empty success manually

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
    }
  }, []);

  const updateSearchHistory = (newQuery: string) => {
    const updatedHistory = [newQuery, ...searchHistory.filter(item => item.toLowerCase() !== newQuery.toLowerCase())].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  };

  const runSearch = useCallback(async (currentQuery: string) => {
    if (!ingestedText && !isGlobal) {
      addNotification('Please ingest some text first, or enable Global Search.', 'info');
      return;
    }
    if (!currentQuery.trim()) {
      addNotification('Please enter a search query.', 'info');
      return;
    }
    
    setSearchAttempted(true);
    updateSearchHistory(currentQuery);
    
    // 3. Execute Hook
    await search(
        llm, 
        ingestedText, 
        currentQuery, 
        topK, 
        activeProjectId || undefined, 
        isGlobal
    );
    
  }, [ingestedText, topK, addNotification, searchHistory, llm, isGlobal, activeProjectId, search]);
  
  const handleSearch = () => {
    runSearch(query);
  };
  
  const handleHistoryClick = (term: string) => {
    setQuery(term);
    runSearch(term);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  if (!ingestedText && !isGlobal) {
    return <EmptyState 
      title="Semantic Search"
      message="Find the most relevant information in your notes. Ingest your study material to enable powerful, meaning-based search."
    />;
  }

  return (
    <Card title={isGlobal ? "Global Knowledge Search" : "Project Semantic Search"}>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isGlobal ? "Search across all your projects..." : "Search within this project..."}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
                {isLoading ? '...' : 'Search'}
              </Button>
          </div>
          
          <div className="flex items-center justify-between">
              <div className="w-1/2">
                <Slider label="Results Count" min={1} max={10} value={topK} onChange={setTopK} />
              </div>
              
              {/* Global Search Toggle */}
              <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isGlobal} onChange={() => setIsGlobal(!isGlobal)} />
                    <div className={`block w-10 h-6 rounded-full ${isGlobal ? 'bg-red-600' : 'bg-slate-700'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${isGlobal ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-3 text-sm font-medium text-slate-300">
                    Search All Projects
                  </div>
              </label>
          </div>
        </div>
        
        {searchHistory.length > 0 && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-slate-400">Recent Searches</h4>
              <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-red-400 transition-colors">
                Clear History
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleHistoryClick(term)}
                  className="px-3 py-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-full text-sm transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && <Loader />}
        
        {results && results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-200 mt-4">Results</h3>
            {results.map((result, index) => (
              <div 
                key={index} 
                className="bg-slate-800/50 p-4 rounded-md border border-slate-700 fade-in flex flex-col gap-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Show Project Name if Global Search or if present */}
                {result.projectName && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-red-900/20 px-2 py-0.5 rounded">
                            {result.projectName}
                        </span>
                        <span className="text-xs text-slate-500">
                            (Match Score: {(result.score * 100).toFixed(0)}%)
                        </span>
                    </div>
                )}
                <p className="text-slate-300 leading-relaxed">{result.text}</p>
              </div>
            ))}
          </div>
        )}

        {searchAttempted && !isLoading && (!results || results.length === 0) && (
             <p className="text-slate-400 mt-4">No relevant snippets found for your query.</p>
        )}
      </div>
    </Card>
  );
};