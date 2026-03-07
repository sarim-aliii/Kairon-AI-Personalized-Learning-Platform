import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useApi } from '../../hooks/useApi';
import { getLeaderboard, shareProjectWithUser, LeaderboardUser } from '../../services/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Loader } from '../ui/Loader';
import { AVATARS } from '../ui/avatars';

export const Leaderboard: React.FC = () => {
  const { activeProject, currentUser, addNotification } = useAppContext();
  const [shareEmail, setShareEmail] = useState('');

  // 1. Fetch Leaderboard Hook
  const { 
    execute: fetchLeaderboard, 
    data: leaderboardData, 
    loading: isLoading 
  } = useApi<LeaderboardUser[], []>(getLeaderboard);

  // 2. Share Project Hook
  const { 
    execute: shareProject, 
    loading: isSharing 
  } = useApi(shareProjectWithUser, "Project shared successfully!");

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleShare = async () => {
    if (!activeProject) return;
    if (!shareEmail.trim()) {
        addNotification("Please enter an email address.", "error");
        return;
    }
    await shareProject(activeProject._id, shareEmail);
    setShareEmail('');
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COL: LEADERBOARD */}
        <div className="lg:col-span-2">
            <Card title="🏆 Global Leaderboard">
                {isLoading ? (
                    <div className="flex justify-center py-10"><Loader /></div>
                ) : (
                    <div className="space-y-4">
                        {leaderboardData?.map((user, index) => {
                            const AvatarComponent = AVATARS[user.avatar || 'avatar-1'];
                            const isMe = user._id === currentUser?._id;
                            
                            return (
                                <div 
                                    key={user._id} 
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                        isMe 
                                        ? 'bg-red-500/10 border-red-500/50 scale-[1.01]' 
                                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                                            index === 0 ? 'text-yellow-400 bg-yellow-400/10' :
                                            index === 1 ? 'text-slate-300 bg-slate-300/10' :
                                            index === 2 ? 'text-amber-600 bg-amber-600/10' :
                                            'text-slate-500'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        
                                        <div className="w-10 h-10 rounded-full bg-slate-700 p-1">
                                            {AvatarComponent && <AvatarComponent className="w-full h-full text-slate-300" />}
                                        </div>

                                        <div>
                                            <p className={`font-semibold ${isMe ? 'text-red-400' : 'text-slate-200'}`}>
                                                {user.name} {isMe && '(You)'}
                                            </p>
                                            <p className="text-xs text-slate-500">Lvl {user.level} • {user.currentStreak} Day Streak 🔥</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-mono font-bold text-yellow-500">{user.xp.toLocaleString()} XP</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>

        {/* RIGHT COL: SOCIAL ACTIONS */}
        <div className="space-y-6">
            <Card title="🤝 Study Groups">
                <p className="text-slate-400 text-sm mb-4">
                    Collaborate with friends! Share your current project to let them view your notes and summaries.
                </p>

                {activeProject ? (
                    <div className="space-y-3">
                        <div className="p-3 bg-slate-800 rounded border border-slate-700">
                            <span className="text-xs text-slate-500 uppercase">Active Project</span>
                            <p className="font-semibold text-slate-200 truncate">{activeProject.name}</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-300">Invite by Email</label>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    value={shareEmail}
                                    onChange={(e) => setShareEmail(e.target.value)}
                                    placeholder="friend@example.com"
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-md p-2 text-sm text-slate-200 focus:ring-2 focus:ring-red-500 outline-none"
                                />
                                <Button onClick={handleShare} disabled={isSharing} className="text-sm">
                                    {isSharing ? '...' : 'Share'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded text-center">
                        <p className="text-yellow-500 text-sm">Select a project from the sidebar to share it.</p>
                    </div>
                )}
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30">
                <h3 className="text-lg font-bold text-white mb-2">🚀 Boost Your XP</h3>
                <ul className="space-y-2 text-sm text-indigo-200">
                    <li className="flex items-center gap-2">✅ Complete a Quiz (+50 XP)</li>
                    <li className="flex items-center gap-2">✅ Finish a Study Session (+25 XP)</li>
                    <li className="flex items-center gap-2">✅ Ask the AI Tutor (+10 XP)</li>
                </ul>
            </Card>
        </div>

      </div>
    </div>
  );
};