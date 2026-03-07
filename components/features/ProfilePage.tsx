import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { AVATARS, AVATAR_KEYS } from '../ui/avatars';

const ActivityChart: React.FC<{ data: { date: string; xp: number }[] }> = ({ data }) => {
    const chartData = useMemo(() => {
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            // Ensure data exists before trying to find
            const existing = data ? data.find(item => item.date === dateStr) : undefined;
            result.push({ 
                date: dateStr, 
                day: d.toLocaleDateString('en-US', { weekday: 'short' }), 
                xp: existing ? existing.xp : 0 
            });
        }
        return result;
    }, [data]);

    const maxVal = Math.max(...chartData.map(d => d.xp), 100); // Scale to at least 100

    return (
        <div className="h-48 w-full flex items-end justify-between gap-2 pt-6">
            {chartData.map((d) => (
                <div key={d.date} className="flex flex-col items-center gap-2 flex-1 group">
                    <div className="w-full relative flex items-end justify-center h-32 bg-slate-800/30 rounded-t-sm overflow-hidden">
                        <div 
                            className="w-full bg-red-500/80 group-hover:bg-red-400 transition-all duration-500 rounded-t-sm"
                            style={{ height: `${(d.xp / maxVal) * 100}%` }}
                        ></div>
                        {/* Tooltip */}
                        <div className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                            {d.xp} XP
                        </div>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{d.day}</span>
                </div>
            ))}
        </div>
    );
};

export const ProfilePage: React.FC = () => {
    const { currentUser, logout, updateUserAvatar, updateUserName } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setNewName(currentUser.name || '');
        }
    }, [currentUser]);

    if (!currentUser) {
        return null;
    }

    const currentAvatarKey = currentUser.avatar || 'avatar-1';
    const CurrentAvatarComponent = AVATARS[currentAvatarKey];

    const handleSaveName = async () => {
        if (newName.trim() !== '') {
            setIsSaving(true);
            try {
                await updateUserName(newName);
                setIsEditing(false);
            } 
            catch (error: any) {
                if (error.message?.includes('401')) logout();
            } 
            finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto fade-in pb-12">
            {/* Top Row: Profile Card & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Profile Info (Takes up 2 cols) */}
                <Card className="md:col-span-2">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative flex-shrink-0">
                            <div className="w-24 h-24 rounded-full bg-slate-700/50 p-2 ring-4 ring-slate-800">
                                {CurrentAvatarComponent && <CurrentAvatarComponent className="w-full h-full text-red-400" />}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-slate-900 text-xs font-bold px-2 py-0.5 rounded-full border border-slate-700 text-yellow-500">
                                Lvl {currentUser.level}
                            </div>
                        </div>

                        <div className="text-center sm:text-left flex-1 space-y-1">
                            {isEditing ? (
                                <div className="flex items-center justify-center sm:justify-start gap-2">
                                    <input 
                                        type="text" 
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-slate-900 border border-slate-700 rounded px-3 py-1 text-slate-100 focus:ring-2 focus:ring-red-500 outline-none"
                                        disabled={isSaving}
                                    />
                                    <button onClick={handleSaveName} disabled={isSaving} className="text-green-400 hover:text-green-300 text-sm">{isSaving ? '...' : 'Save'}</button>
                                    <button onClick={() => setIsEditing(false)} disabled={isSaving} className="text-slate-500 hover:text-slate-400 text-sm">Cancel</button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <h2 className="text-3xl font-bold text-slate-100">{currentUser.name || 'User'}</h2>
                                    <button onClick={() => setIsEditing(true)} className="text-slate-500 hover:text-red-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                                </div>
                            )}
                            <p className="text-sm text-slate-400">{currentUser.email}</p>
                            <p className="text-sm text-slate-500">Member since {new Date((currentUser as any).createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                        
                         <div className="w-full sm:w-auto">
                             <Button onClick={logout} variant="secondary" className="w-full text-xs">Logout</Button>
                        </div>
                    </div>

                    {/* Integrated Avatar Picker */}
                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Select Avatar</h4>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                            {AVATAR_KEYS.map((key) => {
                                const AvatarComponent = AVATARS[key];
                                const isSelected = key === currentAvatarKey;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => updateUserAvatar(key)}
                                        className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-red-500 ${isSelected ? 'bg-red-500/30 ring-2 ring-red-500' : 'bg-slate-700/50 hover:bg-slate-700'}`}
                                    >
                                        <AvatarComponent className={`w-full h-full ${isSelected ? 'text-white' : 'text-slate-300'}`} />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>

                {/* Quick Stats (Takes up 1 col) */}
                <Card>
                    <h3 className="text-lg font-bold text-slate-200 mb-4">Lifetime Stats</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-400 text-sm">Total XP</span>
                            <span className="text-xl font-mono font-bold text-yellow-500">{currentUser.xp?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-lg">
                            <span className="text-slate-400 text-sm">Current Streak</span>
                            <span className="text-xl font-mono font-bold text-orange-500">{currentUser.currentStreak} 🔥</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Activity Chart */}
                <Card title="Activity (Last 7 Days)">
                    <ActivityChart data={currentUser.dailyStats || []} />
                </Card>

                {/* 2. Skill Distribution */}
                <Card title="Skill Proficiency">
                    <div className="space-y-4 pt-2">
                        {currentUser.skillStats && Object.keys(currentUser.skillStats).length > 0 ? (
                            Object.entries(currentUser.skillStats).map(([skill, xp]) => (
                                <div key={skill}>
                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                        <span>{skill}</span>
                                        <span>{Math.floor(xp / 100)} Lvl</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2">
                                        <div 
                                            className="bg-red-500 h-2 rounded-full" 
                                            style={{ width: `${Math.min((xp % 100), 100)}%` }} // Show progress to next level
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500">
                                <p>No skill data yet.</p>
                                <p className="text-xs mt-1">Complete Interview Prep questions to see your breakdown.</p>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};