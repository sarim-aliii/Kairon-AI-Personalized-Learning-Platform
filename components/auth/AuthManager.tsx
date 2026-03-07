import React, { useState, useEffect } from 'react';
import { LoginPage } from './LoginPage';
import { SignUpPage } from './SignUpPage';
import { ForgotPasswordPage } from './ForgotPasswordPage';
import { VerifyEmailPage } from './VerifyEmailPage';
import { ResetPasswordPage } from './ResetPasswordPage';

type AuthView = 'login' | 'signup' | 'forgot-password' | 'verify-email' | 'reset-password';

export const AuthManager: React.FC = () => {
    const [view, setView] = useState<AuthView>('login');
    const [userEmail, setUserEmail] = useState('');
    const [resetToken, setResetToken] = useState('');

    // Check for token in URL on mount (e.g., ?token=xyz or ?resetToken=xyz)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token') || params.get('resetToken');
        
        if (token) {
            setResetToken(token);
            setView('reset-password');
            // Clean up URL to prevent token reuse issues on refresh
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSignUpSuccess = (email: string) => {
        setUserEmail(email);
        setView('verify-email');
    };

    const handleForgotPasswordSuccess = (email: string) => {
        setUserEmail(email);
    };

    const handlePasswordResetSuccess = () => {
        setView('login');
    };

    const renderView = () => {
        switch (view) {
            case 'login':
                return <LoginPage onSwitchToSignUp={() => setView('signup')} onSwitchToForgotPassword={() => setView('forgot-password')} />;
            case 'signup':
                return <SignUpPage onSwitchToLogin={() => setView('login')} onSignUpSuccess={handleSignUpSuccess} />;
            case 'forgot-password':
                return (
                    <ForgotPasswordPage 
                        onSuccess={handleForgotPasswordSuccess} 
                        onSwitchToLogin={() => setView('login')}
                        onSwitchToSignUp={() => setView('signup')} 
                    />
                );
            case 'verify-email':
                return <VerifyEmailPage email={userEmail} onSuccess={() => { /* Handled by AppContext auto-login or redirect */ }} />;
            case 'reset-password':
                return <ResetPasswordPage token={resetToken} onSuccess={handlePasswordResetSuccess} onSwitchToLogin={() => setView('login')} />;
            default:
                return <LoginPage onSwitchToSignUp={() => setView('signup')} onSwitchToForgotPassword={() => setView('forgot-password')} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
             <div className="flex items-center mb-8">
                <svg className="w-9 h-9 text-red-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14.5 9L6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 21L14.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14.5 9L18 12L14.5 15" stroke="url(#kaironGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="14.5" cy="12" r="2" fill="url(#kaironGradient)" filter="url(#glow)"/>
                     <defs>
                        <linearGradient id="kaironGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#f87171" />
                        </linearGradient>
                         <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                            <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
                <h1 className="text-4xl font-bold text-slate-100 tracking-wider">Kairon AI</h1>
            </div>
            {renderView()}
        </div>
    );
};