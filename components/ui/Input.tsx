import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, className, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <input
        id={id}
        className={`w-full bg-slate-900 border rounded-md p-3 text-slate-300 focus:ring-2 focus:outline-none transition ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:ring-red-500'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
};