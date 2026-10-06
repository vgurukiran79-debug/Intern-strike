import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, Flame, Sparkles, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { sound } from '../../services/audio';

interface PomodoroRoomProps {
  currentTaskTitle: string;
  category: string;
  onSessionComplete: (completedTask: boolean, durationMinutes: number) => void;
  todayFocusMinutes: number;
  totalFocusMinutes: number;
  dailyGoalHours?: number;
  customWorkMinutes?: number;
  customBreakMinutes?: number;
}

export const PomodoroRoom: React.FC<PomodoroRoomProps> = ({
  currentTaskTitle,
  category,
  onSessionComplete,
  todayFocusMinutes,
  totalFocusMinutes,
  dailyGoalHours = 3.0,
  customWorkMinutes = 25,
  customBreakMinutes = 5,
}) => {
  // Preset options incorporating user's custom daily goals target
  const presets = [
    { label: `${customWorkMinutes} / ${customBreakMinutes} (Goal)`, focusMinutes: customWorkMinutes, breakMinutes: customBreakMinutes },
    { label: '25 / 5', focusMinutes: 25, breakMinutes: 5 },
    { label: '50 / 10', focusMinutes: 50, breakMinutes: 10 },
    { label: '90 / 15', focusMinutes: 90, breakMinutes: 15 },
  ];

  // Deduplicate if custom matches 25 / 5
  const uniquePresets = presets.filter((p, index, self) => 
    index === self.findIndex((t) => t.focusMinutes === p.focusMinutes && t.breakMinutes === p.breakMinutes)
  );

  const [selectedPreset, setSelectedPreset] = useState(uniquePresets[0]);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [taskName, setTaskName] = useState(currentTaskTitle || 'Machine Learning Interview Drill');
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [sessionCompletedDuration, setSessionCompletedDuration] = useState(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync incoming props if user started a task from another page
  useEffect(() => {
    if (currentTaskTitle && currentTaskTitle !== taskName) {
      setTaskName(currentTaskTitle);
    }
  }, [currentTaskTitle]);

  // Handle countdown
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            sound.playTimerDone();
            if (mode === 'focus') {
              setSessionCompletedDuration(selectedPreset.focusMinutes);
              setShowCompletionDialog(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, selectedPreset]);

  const handleSelectPreset = (p: typeof presets[0]) => {
    setSelectedPreset(p);
    setIsRunning(false);
    setMode('focus');
    setSecondsRemaining(p.focusMinutes * 60);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(
      mode === 'focus' ? selectedPreset.focusMinutes * 60 : selectedPreset.breakMinutes * 60
    );
  };

  const handleSwitchMode = (newMode: 'focus' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsRemaining(
      newMode === 'focus' ? selectedPreset.focusMinutes * 60 : selectedPreset.breakMinutes * 60
    );
  };

  const handleEarlyEndSession = () => {
    if (window.confirm('Do you want to conclude this session now?')) {
      setIsRunning(false);
      setSessionCompletedDuration(Math.max(1, Math.round((selectedPreset.focusMinutes * 60 - secondsRemaining) / 60)));
      setShowCompletionDialog(true);
    }
  };

  const handleFinishCompletion = (completedTask: boolean) => {
    setShowCompletionDialog(false);
    onSessionComplete(completedTask, sessionCompletedDuration);
    // Reset to focus
    setMode('focus');
    setSecondsRemaining(selectedPreset.focusMinutes * 60);
  };

  // Minutes and seconds formatting
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress for background ring or bar
  const totalDuration = mode === 'focus' ? selectedPreset.focusMinutes * 60 : selectedPreset.breakMinutes * 60;
  const progressPercent = Math.min(100, Math.round(((totalDuration - secondsRemaining) / totalDuration) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🍅</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              POMODORO FOCUS ROOM
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Deep focus block. Distraction-free zone to earn your daily strikes.
          </p>
        </div>

        {/* Focus Mode & Presets */}
        <div className="flex items-center gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => handleSelectPreset(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedPreset.label === p.label
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Chamber */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0d131f] via-[#090e18] to-[#070b13] border border-slate-800/90 p-8 md:p-12 text-center shadow-2xl">
        {/* Subtle breathing glow */}
        <div className={`absolute -inset-1 rounded-3xl transition-opacity duration-1000 blur-2xl pointer-events-none ${
          isRunning ? 'opacity-30 bg-gradient-to-r from-amber-500/30 to-cyan-500/30' : 'opacity-0'
        }`} />

        {/* Mode Toggle (Focus / Break) */}
        <div className="inline-flex p-1 rounded-xl bg-slate-900/90 border border-slate-800 mb-8 z-10 relative">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              mode === 'focus'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            FOCUS BLOCK
          </button>
          <button
            onClick={() => handleSwitchMode('break')}
            className={`px-5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
              mode === 'break'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SHORT BREAK
          </button>
        </div>

        {/* Current Task Display & Edit */}
        <div className="mb-6 relative z-10 max-w-xl mx-auto">
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
            Active Task · {category.toUpperCase()}
          </div>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full text-center text-lg md:text-xl font-bold text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none transition-colors px-2 py-1"
            placeholder="What are you working on right now?"
          />
        </div>

        {/* Big Digital Countdown Timer */}
        <div className="my-8 relative z-10 select-none">
          <div className="text-7xl md:text-9xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            {timeFormatted}
          </div>
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest mt-2">
            {mode === 'focus' ? 'Deep Work Interval' : 'Rest & Hydrate'}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-8 relative z-10">
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-1000 ${
                mode === 'focus' ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 relative z-10">
          <button
            onClick={handleResetTimer}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleToggleTimer}
            className={`px-8 py-4 rounded-2xl font-bold text-sm uppercase font-mono tracking-wider transition-all flex items-center gap-3 shadow-xl ${
              isRunning
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-orange-500/20 hover:scale-[1.02]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={handleEarlyEndSession}
            className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors text-xs font-mono"
            title="End Session & Award Strikes"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </button>
        </div>
      </div>

      {/* Focus Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#0a0e17] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Today's Focus</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {todayFocusMinutes} <span className="text-xs text-slate-400 font-normal">mins</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e17] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Total Focus Time</div>
          <div className="text-xl font-bold text-cyan-400 font-mono mt-1">
            {(totalFocusMinutes / 60).toFixed(1)} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e17] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Target Pace</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {(dailyGoalHours || 3.0).toFixed(1)} <span className="text-xs text-slate-400 font-normal">hrs / day</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0a0e17] border border-slate-800">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Focus Reward</div>
          <div className="text-xl font-bold text-amber-400 font-mono mt-1 flex items-center gap-1">
            <span>🔥</span> +5 <span className="text-xs text-slate-400 font-normal">per block</span>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#0a0e17] border border-cyan-500/40 p-6 md:p-8 text-center shadow-[0_0_50px_rgba(6,182,212,0.3)]">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
              🔥
            </div>

            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-1">
              FOCUS SESSION COMPLETE
            </div>
            <h3 className="text-2xl font-extrabold text-white mb-2 font-mono">
              +5 STRIKES EARNED!
            </h3>
            <p className="text-sm text-slate-300 mb-6">
              You crushed a {sessionCompletedDuration}-minute deep work block on:
              <br />
              <strong className="text-cyan-300 font-semibold">"{taskName}"</strong>
            </p>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-6 text-left">
              <span className="text-xs font-mono text-slate-400 block mb-1">
                Did you also complete the task objective?
              </span>
              <span className="text-xs text-slate-500">
                Completing the underlying task unlocks its full strike reward (+10 to +20).
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleFinishCompletion(true)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20"
              >
                YES, COMPLETED (+FULL STRIKES)
              </button>
              <button
                onClick={() => handleFinishCompletion(false)}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs uppercase font-mono tracking-wider border border-slate-700"
              >
                NOT YET (FOCUS ONLY)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
