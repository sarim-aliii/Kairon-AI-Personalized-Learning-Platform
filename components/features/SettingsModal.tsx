import React from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { exportUserData } from '../../services/api';
import { generateUserReport } from '../../utils/pdfGenerator';
import { LANGUAGE_OPTIONS } from '../constants/languages';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { 
        llm, 
        setLlm, 
        language, 
        setLanguage, 
        theme, 
        toggleTheme,
        addNotification
    } = useAppContext();

    const { execute: runExport, loading: isExporting } = useApi(exportUserData);

    // JSON Export
    const handleJsonExport = async () => {
        try {
            const data = await runExport();
            if (data) {
                const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                    JSON.stringify(data, null, 2)
                )}`;
                const link = document.createElement("a");
                link.href = jsonString;
                link.download = `kairon_backup_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                addNotification("Backup (JSON) exported successfully!", "success");
            }
        } catch (e) {
            console.error(e);
        }
    };

    // PDF Export
    const handlePdfExport = async () => {
        try {
            // Re-use the same API call to get all data
            const data = await runExport();
            if (data) {
                generateUserReport(data.user, data.projects);
                addNotification("Report (PDF) generated successfully!", "success");
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 006 0z" />
                    </svg>
                    Settings
                </h2>

                <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Theme Toggle */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Appearance</h3>
                        <div className="bg-slate-800 p-1 rounded-md flex">
                            <button
                                onClick={() => theme === 'dark' && toggleTheme()}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
                                    theme === 'light' 
                                    ? 'bg-white text-slate-900 shadow-sm' 
                                    : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Light
                            </button>
                            <button
                                onClick={() => theme === 'light' && toggleTheme()}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded transition-all ${
                                    theme === 'dark' 
                                    ? 'bg-slate-600 text-white shadow-sm' 
                                    : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                                Dark
                            </button>
                        </div>
                    </div>

                    {/* LLM Selection */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">AI Model</h3>
                        <select
                            value={llm}
                            onChange={(e) => setLlm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        >
                            <optgroup label="Recommended">
                                <option value="gemini-flash-latest">Gemini Flash (Fast & Efficient)</option>
                                <option value="gemini-pro-latest">Gemini Pro (Reasoning & Quality)</option>
                            </optgroup>
                            <optgroup label="Gemini 2.0 (New)">
                                <option value="gemini-2.0-flash-001">Gemini 2.0 Flash</option>
                                <option value="gemini-2.0-flash-lite-preview-02-05">Gemini 2.0 Flash-Lite</option>
                            </optgroup>
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                            Choose "Flash" for speed or "Pro" for complex tasks.
                        </p>
                    </div>

                    {/* Language Selection */}
                    <div>
                        <h3 className="text-sm font-semibold text-slate-400 mb-2">Output Language</h3>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2.5 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        >
                            {LANGUAGE_OPTIONS.map((lang) => (
                                <option key={lang} value={lang}>
                                    {lang}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">
                            AI responses will be generated in this language.
                        </p>
                    </div>
                    
                    {/* Data Management */}
                    <div className="pt-4 border-t border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-400 mb-3">Data Management</h3>
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={handlePdfExport} 
                                disabled={isExporting} 
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2"
                            >
                                {isExporting ? <Loader spinnerClassName="w-4 h-4" /> : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isExporting ? 'Generating...' : 'Download Report (PDF)'}
                            </Button>

                            <Button 
                                onClick={handleJsonExport} 
                                disabled={isExporting} 
                                variant="secondary"
                                className="w-full flex items-center justify-center gap-2 border-slate-700"
                            >
                                {isExporting ? <Loader spinnerClassName="w-4 h-4" /> : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {isExporting ? 'Exporting...' : 'Backup Data (JSON)'}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">
                            PDF is for reading. JSON is for restoring data.
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700 flex justify-end">
                    <Button onClick={onClose} className="w-full sm:w-auto px-8">
                        Close
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};