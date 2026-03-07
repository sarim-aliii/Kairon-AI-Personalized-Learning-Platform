import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Tab } from '../../types';
import { Button } from './Button';

interface EmptyStateProps {
    title: string;
    message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
    const { setActiveTab } = useAppContext();
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-slate-800/50 border border-slate-700 rounded-lg fade-in">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">{title}</h2>
            <p className="text-slate-400 mb-6 max-w-md">{message}</p>
            <Button onClick={() => setActiveTab(Tab.Ingest)}>
                Go to Ingest Tab
            </Button>
        </div>
    );
};
