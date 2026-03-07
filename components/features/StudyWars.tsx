import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Loader } from '../ui/Loader';

// Connect to backend
const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001');

export const StudyWars: React.FC = () => {
    const { activeProject, currentUser, addNotification } = useAppContext();
    
    const [view, setView] = useState<'menu' | 'lobby' | 'game' | 'loading' | 'results'>('menu');
    const [roomId, setRoomId] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [players, setPlayers] = useState<any>({});
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [hasAnswered, setHasAnswered] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        socket.on('room_created', (id) => {
            setRoomId(id);
            setView('lobby');
            addNotification('Room created! Share code: ' + id, 'success');
        });

        socket.on('update_players', (currentPlayers) => {
            setPlayers(currentPlayers);
        });

        socket.on('game_status', (status) => {
            if (status === 'generating_questions') {
                setView('loading');
                setStatusMessage('AI is preparing the battlefield (Generating Questions)...');
            }
        });

        socket.on('game_started', (qs) => {
            setQuestions(qs);
            setCurrentQIndex(0);
            setView('game');
            startTimer();
        });

        socket.on('update_scores', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('error', (msg) => {
            addNotification(msg, 'error');
            setView('menu');
        });

        return () => {
            socket.off('room_created');
            socket.off('update_players');
            socket.off('game_status');
            socket.off('game_started');
            socket.off('update_scores');
            socket.off('error');
        };
    }, [addNotification]);

    const startTimer = () => {
        setTimeLeft(15);
        setHasAnswered(false);
    };

    // Timer Effect
    useEffect(() => {
        if (view !== 'game') return;
        
        if (timeLeft <= 0) {
            handleNextQuestion();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, view]);

    const handleNextQuestion = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            startTimer();
        } else {
            setView('results');
            addNotification('Battle Finished!', 'success');
        }
    };

    const handleCreateRoom = () => {
        if (!activeProject) {
            addNotification('Please select a study project first!', 'info');
            return;
        }
        socket.emit('create_room', { 
            projectId: activeProject._id, 
            playerName: currentUser?.name || 'Player 1' 
        });
    };

    const handleJoinRoom = () => {
        if (!joinCode) return;
        socket.emit('join_room', { 
            roomId: joinCode, 
            playerName: currentUser?.name || 'Player 2' 
        });
        setRoomId(joinCode);
        setView('lobby');
    };

    const handleStartGame = () => {
        socket.emit('start_game', roomId);
    };

    const handleAnswer = (option: string) => {
        if (hasAnswered) return;
        setHasAnswered(true);
        
        const isCorrect = option === questions[currentQIndex].correctAnswer;
        if (isCorrect) addNotification('Direct Hit! +Points', 'success');
        else addNotification('Missed!', 'error');

        socket.emit('submit_answer', { roomId, answer: option, timeRemaining: timeLeft });
    };

    // --- VIEW RENDERING ---

    if (view === 'menu') return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 mb-2">
                    Study Wars ⚔️
                </h1>
                <p className="text-slate-600 dark:text-slate-400">Challenge your friends to a real-time knowledge battle.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 hover:border-indigo-500 transition-colors cursor-pointer border-2 border-transparent" onClick={handleCreateRoom}>
                    <div className="text-center space-y-4">
                        <div className="text-6xl">🛡️</div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Room</h3>
                        <p className="text-sm text-slate-500">Host a game using your current project's content.</p>
                        <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700">Host Battle</Button>
                    </div>
                </Card>

                <Card className="p-8 border-2 border-transparent">
                    <div className="text-center space-y-4">
                        <div className="text-6xl">⚔️</div>
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Join Room</h3>
                        <p className="text-sm text-slate-500">Enter a code to join an existing battle.</p>
                        <input 
                            type="text" 
                            placeholder="Enter Room Code (e.g. X7K9)" 
                            className="w-full p-3 text-center text-lg tracking-widest border rounded-md dark:bg-slate-900 uppercase font-mono"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        />
                        <Button onClick={handleJoinRoom} variant="secondary" className="w-full mt-4">Join Battle</Button>
                    </div>
                </Card>
            </div>
        </div>
    );

    if (view === 'lobby') return (
        <Card title="Battle Lobby">
            <div className="text-center space-y-6 p-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg inline-block">
                    <p className="text-sm text-slate-500 uppercase tracking-wide">Room Code</p>
                    <p className="text-4xl font-mono font-bold text-indigo-600 tracking-widest">{roomId}</p>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Warriors Joined:</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {Object.values(players).map((p: any, i) => (
                            <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-700 rounded-full shadow-sm border border-slate-200 dark:border-slate-600 animate-bounce">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                    {p.name.charAt(0)}
                                </div>
                                <span className="font-bold">{p.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Button onClick={handleStartGame} className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/30 transition-all">
                        🚀 Start Battle
                    </Button>
                    <p className="text-xs text-slate-400 mt-2">Only the host needs to click start.</p>
                </div>
            </div>
        </Card>
    );

    if (view === 'loading') return (
        <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <Loader />
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 animate-pulse">{statusMessage}</h2>
        </div>
    );

    if (view === 'game') return (
        <Card title="Battle in Progress" className="border-t-4 border-indigo-500">
            {/* Header: Timer & Scores */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">⏳</span>
                    <span className={`text-3xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-200'}`}>
                        {timeLeft}s
                    </span>
                </div>
                
                <div className="flex gap-6">
                    {Object.values(players).map((p: any, i) => (
                        <div key={i} className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase">{p.name}</p>
                            <p className="text-xl font-bold text-indigo-600">{p.score}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Question */}
            <div className="mb-8">
                <div className="flex justify-between text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wide">
                    <span>Question {currentQIndex + 1} of {questions.length}</span>
                    <span>Difficulty: Hard</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
                    {questions[currentQIndex]?.question}
                </h2>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4">
                {questions[currentQIndex]?.options.map((opt: string, idx: number) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(opt)}
                        disabled={hasAnswered}
                        className={`p-5 text-left rounded-xl border-2 transition-all duration-200 relative overflow-hidden group ${
                            hasAnswered 
                                ? (opt === questions[currentQIndex].correctAnswer 
                                    ? 'bg-green-100 border-green-500 dark:bg-green-900/30' 
                                    : 'opacity-50 bg-slate-100 dark:bg-slate-800')
                                : 'hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                                hasAnswered && opt === questions[currentQIndex].correctAnswer
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-slate-100 text-slate-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600'
                            }`}>
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="font-medium text-lg text-slate-700 dark:text-slate-200">{opt}</span>
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    );

    // Final Results View
    if (view === 'results') {
        const sortedPlayers = Object.values(players).sort((a: any, b: any) => b.score - a.score);
        const winner = sortedPlayers[0] as any;

        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in">
                <div className="text-6xl mb-4">🏆</div>
                <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100">Battle Finished!</h1>
                
                <Card className="p-8 border-yellow-400 border-2 shadow-xl shadow-yellow-500/20">
                    <h2 className="text-2xl font-bold mb-6">Winner</h2>
                    <div className="text-3xl font-extrabold text-indigo-600 mb-2">{winner?.name}</div>
                    <div className="text-slate-500">{winner?.score} points</div>
                </Card>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 bg-slate-50 dark:bg-slate-700 font-semibold border-b border-slate-200 dark:border-slate-600">Leaderboard</div>
                    {sortedPlayers.map((p: any, index) => (
                        <div key={index} className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span>{p.name}</span>
                            </div>
                            <span className="font-mono font-bold">{p.score} pts</span>
                        </div>
                    ))}
                </div>

                <Button onClick={() => setView('menu')} variant="secondary">Back to Menu</Button>
            </div>
        );
    }

    return <div>Error: Unknown State</div>;
};