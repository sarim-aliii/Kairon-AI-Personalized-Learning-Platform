import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import OtpInput from '../ui/OtpInput'; 
import { Loader } from '../ui/Loader';
import { useApi } from '../../hooks/useApi'; // 1. Import hook
import { forgotPassword, resetPassword } from '../../services/api'; 

interface ForgotPasswordPageProps {
  onSuccess: (email: string) => void;
  onSwitchToLogin: () => void;
  onSwitchToSignUp: () => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onSuccess, onSwitchToLogin, onSwitchToSignUp }) => {
  // STEPS: 1 = Email, 2 = OTP + New Password
  const [step, setStep] = useState<1 | 2>(1);
  
  // Form State
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State (Manual error state kept for specific 404 handling)
  const [customError, setCustomError] = useState(''); 
  const [successMessage, setSuccessMessage] = useState('');

  // --- API HOOKS ---

  // 1. Hook for Sending Code
  const { 
    execute: sendCode, 
    loading: isSending 
  } = useApi(forgotPassword); // We handle success/error messages manually for finer control

  // 2. Hook for Resetting Password
  const { 
    execute: reset, 
    loading: isResetting 
  } = useApi(resetPassword); // We handle success/error messages manually


  // --- STEP 1: SEND CODE ---
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');
    setSuccessMessage('');

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setCustomError('Please enter a valid email address.');
      return;
    }

    try {
      await sendCode(email);
      setStep(2); 
      setSuccessMessage(`Code sent to ${email}`);
    } 
    catch (err: any) {
       // Handle specific errors based on your backend responses
       if (err.message?.includes('404') || err.message?.toLowerCase().includes('user not found')) {
         setCustomError("We couldn't find an account with that email.");
       } else if (err.message?.includes('registered with')) {
         setCustomError(err.message);
       } else {
         setCustomError(err.message || "Failed to send reset code.");
       }
    } 
  };

  // --- STEP 2: RESET PASSWORD ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    // Validation
    if (otp.length !== 6) {
        setCustomError("Please enter the full 6-digit verification code.");
        return;
    }
    if (!newPassword) {
        setCustomError("New password is required.");
        return;
    }
    if (newPassword !== confirmPassword) {
        setCustomError("Passwords do not match.");
        return;
    }
    
    try {
      await reset({ email, otp, password: newPassword });
      
      // Success!
      onSuccess(email); 
      onSwitchToLogin(); 
    } catch (err: any) {
      setCustomError(err.message || "Failed to reset password. Code might be expired.");
    }
  };

  return (
    <Card title={step === 1 ? "Reset Password" : "Set New Password"} className="w-full max-w-md fade-in">
      
      {/* Back Button for Step 2 */}
      {step === 2 && (
        <button 
            onClick={() => { setStep(1); setCustomError(''); }}
            className="text-xs text-slate-400 hover:text-white mb-4 flex items-center"
        >
            ← Back to Email
        </button>
      )}

      {/* Success Banner */}
      {successMessage && (
          <div className="bg-green-500/10 text-green-500 text-sm p-3 rounded mb-4 text-center">
             {successMessage}
          </div>
      )}

      {/* Error Banner */}
      {customError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded mb-4 text-center">
            {customError}
        </div>
      )}

      {step === 1 ? (
        /* --- STEP 1 FORM --- */
        <form onSubmit={handleSendCode} className="space-y-6">
            <p className="text-slate-400 text-sm">
                Enter your email address and we will send you a 6-digit code to reset your password.
            </p>
            <Input
                id="reset-email"
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setCustomError(''); }}
                disabled={isSending}
                autoComplete="email"
            />
            <Button type="submit" disabled={isSending} className="w-full flex items-center justify-center">
                {isSending ? <Loader spinnerClassName="w-5 h-5" /> : 'Send Reset Code'}
            </Button>
        </form>
      ) : (
        /* --- STEP 2 FORM --- */
        <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="text-center">
                <label className="text-sm text-slate-400 mb-2 block">Verification Code</label>
                <div className="flex justify-center">
                    <OtpInput 
                        length={6} 
                        onComplete={(code) => setOtp(code)} 
                    />
                </div>
            </div>

            <Input
                id="new-password"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isResetting}
            />

            <Input
                id="confirm-password"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isResetting}
            />

            <Button type="submit" disabled={isResetting} className="w-full flex items-center justify-center mt-2">
                {isResetting ? <Loader spinnerClassName="w-5 h-5" /> : 'Reset Password'}
            </Button>
        </form>
      )}

      {/* Footer Links */}
      <div className="mt-6 text-center space-y-2">
        <p className="text-sm text-slate-400">
           Remember your password?{' '}
           <button type="button" onClick={onSwitchToLogin} className="font-semibold text-red-400 hover:underline focus:outline-none">
             Back to Login
           </button>
        </p>
        {step === 1 && (
             <p className="text-xs text-slate-500">
                Don't have an account?{' '}
                <button type="button" onClick={onSwitchToSignUp} className="text-slate-400 hover:text-white hover:underline">
                    Sign Up
                </button>
             </p>
        )}
      </div>
    </Card>
  );
};