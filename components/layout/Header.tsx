import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Tab } from '../../types';


const mainTabs = Object.values(Tab).filter(tab => tab !== Tab.Profile);

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, toggleSidebar } = useAppContext();

  return (
    <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4 gap-6">
          
          <div className="flex items-center flex-shrink-0 gap-4">
            {/* Sidebar Toggle Button */}
            <button 
                onClick={toggleSidebar}
                className="p-2 -ml-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600 transition-colors"
                aria-label="Toggle Sidebar"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center">
                <svg className="w-9 h-9 text-red-500 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <path d="M6 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14.5 9L6 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M6 21L14.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M14.5 9L18 12L14.5 15" stroke="url(#kaironGradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="14.5" cy="12" r="2" fill="url(#kaironGradient)" filter="url(#glow)"/>
                </svg>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-wider whitespace-nowrap hidden sm:block">Kairon AI</h1>
            </div>
          </div>

          <nav className="flex-1 w-full overflow-hidden flex items-center justify-start">
            <div className="flex items-center flex-nowrap overflow-x-auto gap-x-2 md:gap-x-4 text-sm font-semibold uppercase tracking-wider pb-2 scrollbar-hide w-full">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3 py-2 rounded-md whitespace-nowrap transition-colors duration-200 flex-shrink-0 ${
                    activeTab === tab
                      ? 'text-red-500 dark:text-red-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 dark:bg-red-400 rounded-full shadow-[0_0_8px_theme(colors.red.400)] transition-opacity duration-300 ${ activeTab === tab ? 'opacity-100' : 'opacity-0' }`}></span>
                </button>
              ))}
            </div>
          </nav>

          <button
                onClick={() => setActiveTab(Tab.Profile)}
                className={`px-3 py-2 rounded-md whitespace-nowrap font-semibold text-sm transition-colors duration-200 flex items-center gap-2 ${
                  activeTab === Tab.Profile
                    ? 'bg-gray-100 dark:bg-slate-800 text-red-500 dark:text-red-400'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/50'
                }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Profile</span>
            </button>
        </div>
      </div>
    </header>
  );
};