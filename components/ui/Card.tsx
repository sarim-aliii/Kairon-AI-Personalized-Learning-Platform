import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700/50 transition-all duration-300 hover:border-red-500/30 ${className}`}>
      {title && <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{title}</h2>}
      {children}
    </div>
  );
};