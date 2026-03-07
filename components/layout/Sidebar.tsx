import React, { useState } from 'react';
import { TodoList } from '../features/TodoList';
import { useAppContext } from '../../context/AppContext';
import { ProjectHistory } from './ProjectHistory';
import { FocusTimer } from '../features/FocusTimer';
import { FeedbackModal } from '../features/FeedbackModal';
import { SettingsModal } from '../features/SettingsModal';
import { Tab } from '../../types';


export const Sidebar: React.FC = () => {
    const { 
        isSidebarCollapsed, 
        currentUser, 
        setActiveTab, 
        activeTab,
        addNotification
    } = useAppContext();

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const currentXP = currentUser?.xp || 0;
    const currentLevel = currentUser?.level || 1;
    const xpProgress = currentXP % 100;

    return (
        <>
            <aside className={`w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden ${isSidebarCollapsed ? 'md:w-0 border-transparent' : 'md:w-72 lg:w-80'}`}>
                <div className={`space-y-6 overflow-y-auto flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'opacity-0 p-0' : 'p-6 opacity-100'}`}>

                    {/* GAMIFICATION STATS */}
                    {currentUser && (
                        <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Level {currentLevel}</span>
                                <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400" title="Daily Streak">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.298-2.296a1 1 0 00-1.648-1.052c-.865 1.354-1.325 2.863-1.325 4.765 0 5.863 4.825 10.663 10.68 10.663 5.855 0 10.612-4.8 10.612-10.663 0-4.186-2.115-7.792-5.217-9.679a1 1 0 00-1.086.398 1 1 0 00.591 1.45 6.987 6.987 0 013.726 6.258 7.006 7.006 0 11-11.923-3.862c.158.31.334.618.526.917.24.376.518.716.828 1.015a1 1 0 001.477-1.414c-.42-.42-.766-.936-.99-1.518a10.96 10.96 0 01-.576-2.526z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold">{currentUser.currentStreak || 0} Day Streak</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2.5 mb-1">
                                <div
                                    className="bg-red-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${xpProgress}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-slate-500 dark:text-slate-400">{xpProgress} / 100 XP</p>
                                
                                {/* Leaderboard Button */}
                                <button 
                                    onClick={() => setActiveTab(Tab.Leaderboard)}
                                    className={`text-xs font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                                        activeTab === Tab.Leaderboard 
                                        ? 'bg-yellow-500/20 text-yellow-500' 
                                        : 'text-slate-500 hover:text-yellow-500 dark:text-slate-400 dark:hover:text-yellow-400'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Leaderboard
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Daily Review Button */}
                    <button
                        onClick={() => setActiveTab(Tab.DailyReview)}
                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all transform hover:scale-[1.02] shadow-md group ${
                            activeTab === Tab.DailyReview
                            ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-red-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-red-500/50 hover:shadow-lg'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab === Tab.DailyReview ? 'text-white' : 'text-red-500 group-hover:scale-110 transition-transform'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Daily Review
                    </button>

                    {/* Study Wars Button - ADDED */}
                    <button
                        onClick={() => setActiveTab(Tab.StudyWars)}
                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold transition-all transform hover:scale-[1.02] shadow-md group ${
                            activeTab === Tab.StudyWars
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-500/20'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:shadow-lg'
                        }`}
                    >
                        {/* Crossed Swords Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab === Tab.StudyWars ? 'text-white' : 'text-indigo-500 group-hover:scale-110 transition-transform'}`} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14.707 13.293a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L11.414 8.5l3.293 3.293a1 1 0 010 1.414z" opacity="0" /> 
                            <path fillRule="evenodd" d="M10.04 7.96L8.414 6.336a2 2 0 010-2.829L9.66 2.26a1 1 0 011.415 0l4.242 4.243a1 1 0 010 1.414l-1.625 1.626 5.614 5.615c1.334 1.334 1.54 3.35.46 4.43l-1.414 1.414c-1.08 1.08-3.096.874-4.43-.46l-5.615-5.614-1.626 1.625a1 1 0 01-1.414 0L.929 12.308a1 1 0 010-1.414l2.828-2.829 1.625 1.626 4.658-4.659V7.96zM15.314 3.672L11.071 7.914l3.536 3.536 4.243-4.243-3.536-3.535z" clipRule="evenodd" />
                            <path d="M3.05 16.657l4.243 4.243 1.414-1.414-4.243-4.243-1.414 1.414z" />
                        </svg>
                        Study Wars
                    </button>

                    {/* FOCUS TIMER */}
                    <FocusTimer />

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* PROJECT HISTORY & TODO LIST */}
                    <ProjectHistory />

                    <hr className="border-slate-200 dark:border-slate-800" />

                    <TodoList />

                    <hr className="border-slate-200 dark:border-slate-800" />

                    {/* BOTTOM ACTIONS */}
                    <div className="pt-2 flex items-center justify-between gap-1">
                        <a
                            href="mailto:kaironapp.ai@gmail.com"
                            className="flex-1 flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors text-sm font-medium group hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
                            </svg>
                            Customer Support
                        </a>

                        {/* Feedback Button */}
                        <button
                            onClick={() => setIsFeedbackOpen(true)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="Send Feedback"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={() => setIsSettingsOpen(true)}
                            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="Settings"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Modals */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                addNotification={addNotification}
            />
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </>
    );
};