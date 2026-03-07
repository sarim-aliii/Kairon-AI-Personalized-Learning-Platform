import React from 'react';

// A collection of 8 stylish, futuristic avatars.
export const AVATARS: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'avatar-1': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="3" fill="currentColor"/>
    </svg>
  ),
  'avatar-2': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M9 12L12 15L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'avatar-3': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L2 21H22L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 10V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'avatar-4': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M12 22V12" stroke="currentColor" strokeWidth="2"/>
      <path d="M4 7L12 12L20 7" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'avatar-5': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  'avatar-6': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <circle cx="9.5" cy="10.5" r="1.5" fill="currentColor"/>
      <circle cx="14.5" cy="10.5" r="1.5" fill="currentColor"/>
      <path d="M9 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  'avatar-7': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 21C7.02944 21 3 16.9706 3 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"/>
    </svg>
  ),
  'avatar-8': (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M20 12L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M17 7L7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M7 7L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export const AVATAR_KEYS = Object.keys(AVATARS);
