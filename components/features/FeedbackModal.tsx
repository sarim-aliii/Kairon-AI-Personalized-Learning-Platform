import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { useApi } from '../../hooks/useApi'; // 1. Import the hook
import { sendFeedback } from '../../services/api';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

type FeedbackType = 'Bug' | 'Feature Request' | 'Other';

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, addNotification }) => {
    const [type, setType] = useState<FeedbackType>('Bug');
    const [message, setMessage] = useState('');

    // 2. Setup the Hook
    const { 
        execute: submitFeedback, 
        loading 
    } = useApi(sendFeedback, "Feedback sent! Thank you.");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            addNotification("Please enter a message.", "error");
            return;
        }
        
        try {
            // 3. Execute the hook
            // The hook handles the API call, success toast, and error toast.
            await submitFeedback(type, message);
            
            // If we get here, it succeeded
            setMessage('');
            onClose();
        } catch (error) {
            // Hook handles the error notification, we just catch it 
            // to prevent the modal from closing.
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-2xl w-full max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold text-slate-100 mb-1">Send Feedback</h2>
                <p className="text-sm text-slate-400 mb-6">Found a bug or have a suggestion?</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Feedback Type</label>
                        <select 
                            value={type} 
                            onChange={(e) => setType(e.target.value as FeedbackType)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
                        >
                            <option value="Bug">Bug Report</option>
                            <option value="Feature Request">Feature Request</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Tell us what happened or what you'd like to see..."
                            className="w-full h-32 bg-slate-800 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-red-500 focus:outline-none transition resize-none"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" onClick={onClose} variant="secondary" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex items-center gap-2">
                            {loading ? <Loader spinnerClassName="w-4 h-4" /> : 'Submit Feedback'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};