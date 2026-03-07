import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi'; // 1. Import hook
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Loader } from '../ui/Loader';

interface ResetPasswordPageProps {
  token: string;
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, onSuccess, onSwitchToLogin }) => {
  const { resetPassword } = useAppContext();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // 2. Setup Hook
  // Wraps the context function. Auto-toasts on success/error.
  const { 
    execute: executeReset, 
    loading: isLoading, 
    error: apiError 
  } = useApi(resetPassword, "Password has been reset successfully!");

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      newErrors.newPassword = 'Password must be 8+ characters and include an uppercase, lowercase, number, and special character.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirming password is required.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({}); // Clear local errors on new submit attempt
    
    if (!validate()) return;
    
    if (!token.trim()) {
        setValidationErrors({ form: "Reset token is missing or invalid."});
        return;
    }

    try {
      // 3. Execute Hook
      await executeReset(token, newPassword);
      onSuccess();
    } catch (error) {
      // Hook handles the toast. 
      // We don't need to do anything here unless we want specific side effects.
    }
  };

  return (
    <Card title="Set New Password" className="w-full max-w-md fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="new-password"
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={validationErrors.newPassword}
          disabled={isLoading}
        />
        <Input
          id="confirm-new-password"
          label="Confirm New Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={validationErrors.confirmPassword}
          disabled={isLoading}
        />
        
        {/* Show either local validation form error OR API error */}
        {(validationErrors.form || apiError) && (
            <p className="text-sm text-red-400 -mb-2">
                {validationErrors.form || apiError}
            </p>
        )}

        <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full flex items-center justify-center">
                {isLoading ? <Loader spinnerClassName="w-5 h-5" /> : 'Reset Password'}
            </Button>
        </div>
      </form>
       <p className="text-sm text-center text-slate-400 mt-6">
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-red-400 hover:underline focus:outline-none">
            Back to Login
          </button>
        </p>
    </Card>
  );
};