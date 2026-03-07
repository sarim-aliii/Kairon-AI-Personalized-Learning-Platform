import React from 'react';

export const Loader: React.FC<{ spinnerClassName?: string }> = ({ spinnerClassName = 'w-16 h-16' }) => {
  return (
    <div className="flex justify-center items-center" aria-label="Loading...">
        <div className={`relative ${spinnerClassName}`}>
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle
                    className="stroke-slate-700"
                    cx="50" cy="50" r="45"
                    fill="none"
                    strokeWidth="4"
                />
                <circle
                    className="stroke-red-500/80"
                    style={{ animation: 'rotate 1.5s linear infinite', transformOrigin: '50% 50%' }}
                    cx="50" cy="50" r="45"
                    fill="none"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="200"
                    strokeDashoffset="150"
                />
                 <circle
                    className="stroke-red-500/50"
                    style={{ animation: 'rotate-reverse 2.5s linear infinite', transformOrigin: '50% 50%' }}
                    cx="50" cy="50" r="35"
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="150"
                    strokeDashoffset="120"
                />
                 <circle
                    className="stroke-red-500"
                    style={{ animation: 'rotate 1.2s linear infinite', transformOrigin: '50% 50%' }}
                    cx="50" cy="50" r="25"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="80"
                    strokeDashoffset="70"
                />
            </svg>
        </div>
    </div>
  );
};