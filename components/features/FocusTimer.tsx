import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '../ui/Button';
import { useAppContext } from '../../context/AppContext';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_SETTINGS = {
  focus: { label: 'Focus', minutes: 25, color: 'text-red-500', borderColor: 'border-red-500' },
  shortBreak: { label: 'Short Break', minutes: 5, color: 'text-green-500', borderColor: 'border-green-500' },
  longBreak: { label: 'Long Break', minutes: 15, color: 'text-blue-500', borderColor: 'border-blue-500' },
};

const ALARM_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'; 

export const FocusTimer: React.FC = () => {
  const { addNotification, updateProgress } = useAppContext();
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS['focus'].minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const endTimeRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Request notification permission and load audio on mount
  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    
    // Pre-load audio
    audioRef.current = new Audio(ALARM_SOUND_URL);
    audioRef.current.volume = 0.7;

    // Cleanup audio on unmount
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn("Audio play failed (user interaction required first)", e));
    }
  };

  const sendSystemNotification = (title: string, body: string) => {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(TIMER_SETTINGS[newMode].minutes * 60);
    setIsActive(false);
    endTimeRef.current = null;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_SETTINGS[mode].minutes * 60);
    endTimeRef.current = null;
  };

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    playSound(); // 🔊 Play Sound!
    
    if (mode === 'focus') {
      addNotification("Focus session complete! +25 XP", "success");
      sendSystemNotification("Kairon AI: Focus Complete", "Great job! Take a short break.");
      
      // Award XP
      if (updateProgress) updateProgress(25); 
      
      // Auto-switch to break mode (ready to start)
      switchMode('shortBreak');
    } else {
      addNotification("Break is over! Time to focus.", "info");
      sendSystemNotification("Kairon AI: Break Over", "Ready to get back to work?");
      switchMode('focus');
    }
  }, [mode, addNotification, updateProgress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      if (!endTimeRef.current) {
          endTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        if (endTimeRef.current) {
            const now = Date.now();
            const remaining = Math.ceil((endTimeRef.current - now) / 1000);
            
            if (remaining <= 0) {
                setTimeLeft(0);
                handleTimerComplete();
                clearInterval(interval);
            } else {
                setTimeLeft(remaining);
            }
        }
      }, 1000);
    } else {
      endTimeRef.current = null;
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime = TIMER_SETTINGS[mode].minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4 transition-all duration-500 ${timeLeft === 0 ? 'animate-pulse ring-2 ring-red-500' : ''}`}>
      <div className="flex justify-between items-center mb-3">
         <h3 className={`text-sm font-bold ${TIMER_SETTINGS[mode].color} uppercase tracking-wider`}>
             {TIMER_SETTINGS[mode].label}
         </h3>
         <div className="flex gap-1">
            <button 
                onClick={() => switchMode('focus')} 
                className={`w-2 h-2 rounded-full transition-colors ${mode === 'focus' ? 'bg-red-500' : 'bg-slate-600 hover:bg-red-500/50'}`} 
                title="Focus Mode"
            />
            <button 
                onClick={() => switchMode('shortBreak')} 
                className={`w-2 h-2 rounded-full transition-colors ${mode === 'shortBreak' ? 'bg-green-500' : 'bg-slate-600 hover:bg-green-500/50'}`} 
                title="Short Break"
            />
            <button 
                onClick={() => switchMode('longBreak')} 
                className={`w-2 h-2 rounded-full transition-colors ${mode === 'longBreak' ? 'bg-blue-500' : 'bg-slate-600 hover:bg-blue-500/50'}`} 
                title="Long Break"
            />
         </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="text-4xl font-mono font-bold text-slate-200 mb-4 tracking-widest relative">
             {formatTime(timeLeft)}
             {/* Simple Progress Bar under text */}
             <div className="absolute -bottom-2 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden">
                 <div 
                    className={`h-full transition-all duration-1000 ease-linear ${
                        mode === 'focus' ? 'bg-red-500' : mode === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500'
                    }`} 
                    style={{ width: `${100 - progress}%` }}
                 />
             </div>
        </div>

        <div className="flex gap-2 w-full">
          <Button 
            onClick={toggleTimer} 
            variant="primary" 
            className={`flex-1 py-1 text-sm ${mode === 'shortBreak' ? '!bg-green-600 hover:!bg-green-700' : mode === 'longBreak' ? '!bg-blue-600 hover:!bg-blue-700' : ''}`}
          >
            {isActive ? 'Pause' : 'Start'}
          </Button>
          <Button onClick={resetTimer} variant="secondary" className="py-1 text-sm px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
};