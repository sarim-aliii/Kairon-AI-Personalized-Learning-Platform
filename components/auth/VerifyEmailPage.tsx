import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import OtpInput from '../ui/OtpInput';
import { Loader } from '../ui/Loader';
import { resendVerification } from '../../services/api'; 

interface VerifyEmailPageProps {
  email: string;
  onSuccess: () => void;
}

export const VerifyEmailPage: React.FC<VerifyEmailPageProps> = ({ email, onSuccess }) => {
  const { verifyEmail } = useAppContext();
  
  const [token, setToken] = useState('');
  const [timer, setTimer] = useState(60);
  const [successMsg, setSuccessMsg] = useState('');

  // 2. Setup Hooks
  const { 
    execute: verify, 
    loading: isLoading, 
    error: verifyError 
  } = useApi(verifyEmail);

  const { 
    execute: resend, 
    loading: isResending 
  } = useApi(resendVerification);

  // Timer Countdown Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Main Verification Logic
  const handleVerification = async (code: string) => {
    setSuccessMsg('');
    
    if (!code || code.length < 6) return;

    try {
      await verify(code);
      onSuccess();
    } catch (err) {
      // Error handled by hook
    }
  };

  // Resend Logic
  const handleResend = async () => {
    setSuccessMsg('');
    try {
      await resend(email);
      setSuccessMsg('New code sent! Please check your email.');
      setTimer(60); 
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerification(token);
  };

  return (
    <Card title="Verify Your Email" className="w-full max-w-md fade-in">
      <p className="text-slate-400 text-sm mb-6 text-center">
        A 6-digit verification code has been sent to <br/>
        <strong className="text-slate-200">{email}</strong>. 
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* OTP Input */}
        <div className="flex justify-center">
            <OtpInput 
                length={6} 
                onComplete={(code) => {
                    setToken(code);
                    handleVerification(code);
                }} 
            />
        </div>

        {/* Messages */}
        {verifyError && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                {verifyError}
            </div>
        )}
        {successMsg && (
            <div className="text-green-500 text-sm text-center bg-green-500/10 p-2 rounded">
                {successMsg}
            </div>
        )}

        {/* Verify Button */}
        <div className="pt-2">
            <Button 
                type="submit" 
                disabled={isLoading || token.length < 6} 
                className="w-full flex items-center justify-center"
            >
                 {isLoading ? <Loader spinnerClassName="w-5 h-5" /> : 'Verify Account'}
            </Button>
        </div>
      </form>

      {/* Resend Link / Timer */}
      <div className="mt-6 text-center text-sm">
        <p className="text-slate-500">
          Didn't receive the code?{' '}
          {timer > 0 ? (
            <span className="text-slate-400 font-medium">
              Resend in {timer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline focus:outline-none transition-colors"
            >
              {isResending ? 'Sending...' : 'Resend Code'}
            </button>
          )}
        </p>
      </div>
    </Card>
  );
};