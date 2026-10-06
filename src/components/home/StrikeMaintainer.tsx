import React, { useState } from 'react';
import { 
  Flame, 
  Shield, 
  ShieldCheck, 
  Check, 
  Plus, 
  ArrowUpRight, 
  Zap, 
  GitCommit, 
  Code, 
  Send, 
  Briefcase, 
  Clock, 
  History, 
  Award,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { UserProfile, UserLevel, DailyStrikeTask, StrikeLog } from '../../types';

interface StrikeMaintainerProps {
  user: UserProfile;
  userLevel: UserLevel;
  tasks: DailyStrikeTask[];
  strikeLogs: StrikeLog[];
  onToggleTask: (taskId: string) => void;
  onStartTask: (task: DailyStrikeTask) => void;
  onLogStrike: (title: string, amount: number, category: string, type: StrikeLog['type']) => void;
  onUseStreakFreeze?: () => void;
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 45) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return 'Recent';
  }
}

export const StrikeMaintainer: React.FC<StrikeMaintainerProps> = ({
  user,
  userLevel,
  tasks,
  strikeLogs,
  onToggleTask,
  onStartTask,
  onLogStrike,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showLast5Modal, setShowLast5Modal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPoints, setCustomPoints] = useState(10);
  const [customCategory, setCustomCategory] = useState('projects');
  const [activeTab, setActiveTab] = useState<'tasks' | 'quick-log' | 'recent-strikes' | 'ledger'>('tasks');

  // Dynamic calculation of today's custom daily strike goal target
  const targetStrikes = user.dailyGoals?.dailyStrikeTarget || 35;
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayStrikesEarned = strikeLogs
    .filter(l => l.timestamp.startsWith(todayDateStr))
    .reduce((sum, l) => sum + l.amount, 0) + 
    tasks.filter(t => t.completed).reduce((sum, t) => sum + t.strikeReward, 0);
  const todayTargetProgress = Math.min(100, Math.round((todayStrikesEarned / targetStrikes) * 100));

  // Check if today has at least 1 completed task or log
  const todayTasksCompleted = tasks.filter(t => t.completed).length;
  const isMaintainedToday = todayTasksCompleted > 0 || strikeLogs.some(l => {
    const today = new Date().toISOString().split('T')[0];
    return l.timestamp.startsWith(today);
  });

  // Calculate 7 days for the streak track
  const streakCount = user.currentStreak || 0;
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = dayNames.map((label, idx) => ({
    label,
    completed: idx < streakCount || (isMaintainedToday && idx === streakCount - 1),
    isToday: idx === Math.min(6, streakCount),
  }));

  // Last 5 strikes earned (most recent first)
  const last5Strikes = strikeLogs.slice(0, 5);

  // Quick Strike presets
  const quickPresets = [
    { label: 'GitHub Commit', points: 10, category: 'github', type: 'manual' as const, icon: GitCommit },
    { label: 'Solved LeetCode/Problem', points: 10, category: 'python', type: 'manual' as const, icon: Code },
    { label: 'Recruiter Message', points: 15, category: 'applications', type: 'manual' as const, icon: Send },
    { label: '25m Focus Block', points: 5, category: 'projects', type: 'session' as const, icon: Clock },
    { label: 'Submitted Job App', points: 20, category: 'applications', type: 'application' as const, icon: Briefcase },
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onLogStrike(customTitle.trim(), customPoints, customCategory, 'manual');
    setCustomTitle('');
    setShowCustomModal(false);
  };

  // Next level milestone calculation
  let nextMilestone = 50;
  let nextTitle = 'Learner';
  if (user.totalStrikes >= 500) {
    nextMilestone = 1000;
    nextTitle = 'Internship Master';
  } else if (user.totalStrikes >= 300) {
    nextMilestone = 500;
    nextTitle = 'Internship Ready';
  } else if (user.totalStrikes >= 150) {
    nextMilestone = 300;
    nextTitle = 'AI Engineer';
  } else if (user.totalStrikes >= 50) {
    nextMilestone = 150;
    nextTitle = 'Builder';
  }

  const levelProgress = Math.min(100, Math.round((user.totalStrikes / nextMilestone) * 100));

  return (
    <div className="rounded-3xl bg-[#090d15] border border-slate-800/90 p-5 md:p-6 shadow-xl space-y-5">
      {/* 1. TOP BANNER: STRIKE STATUS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-all ${
            isMaintainedToday
              ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-white shadow-orange-500/20 ring-2 ring-orange-500/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <Flame className={`w-6 h-6 ${isMaintainedToday ? 'fill-white text-white animate-pulse' : 'text-slate-500'}`} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-black text-white font-mono tracking-tight flex items-center gap-2">
                STRIKE MAINTAINER
              </h3>
              {isMaintainedToday ? (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> ACTIVE TODAY
                </span>
              ) : (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> AT RISK
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isMaintainedToday 
                ? 'Your daily strike is locked in. Streak protected for today!' 
                : 'Complete at least 1 task or log an activity to maintain your streak.'}
            </p>
          </div>
        </div>

        {/* Total Strikes & Level */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              TOTAL STRIKES
            </span>
            <div className="text-lg font-black font-mono text-amber-400 flex items-center justify-end gap-1">
              <span>🔥</span> {user.totalStrikes}
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              STREAK
            </span>
            <div className="text-lg font-black font-mono text-cyan-400 flex items-center justify-end gap-1">
              {user.currentStreak}d
            </div>
          </div>
        </div>
      </div>

      {/* 2. 7-DAY VISUAL STREAK TRACKER & SHIELD */}
      <div className="pb-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-xs mb-2.5 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">7-Day Streak Window:</span>
            <strong className="text-white">{user.currentStreak} Days Maintained</strong>
          </div>

          {/* Streak Freeze Shield Badge */}
          <div className="flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2.5 py-0.5 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold">1 Streak Shield Armed</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all ${
                day.completed
                  ? 'bg-orange-950/20 border-orange-500/40 text-orange-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-[10px] font-semibold text-slate-400 mb-0.5">{day.label}</span>
              <span className="text-xs font-bold font-mono">
                {day.completed ? '🔥' : '○'}
              </span>
            </div>
          ))}
        </div>

        {/* Level Progression */}
        <div className="mt-3.5 pt-2">
          <div className="flex items-center justify-between text-[11px] mb-1 font-mono text-slate-400">
            <span>Tier: <strong className="text-cyan-300 font-semibold">{userLevel}</strong></span>
            <span>Next Tier ({nextTitle}): <strong>{user.totalStrikes} / {nextMilestone} Strikes</strong></span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>

        {/* Custom Daily Strike Goal Tracker */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>🎯 Custom Daily Goal:</span>
              <strong className="text-white">{targetStrikes} Strikes/day</strong>
            </span>
            <span className="font-bold text-amber-400">
              {todayStrikesEarned} / {targetStrikes} Strikes ({todayTargetProgress}%)
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${todayTargetProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. PROMINENT LAST 5 STRIKES EARNED SECTION */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0e1625] to-slate-950/80 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xs">
              ⚡
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                LAST 5 STRIKES EARNED
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">
                Transparent reward ledger ({last5Strikes.length} logged)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowLast5Modal(true)}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-300 hover:text-white bg-cyan-950/70 hover:bg-cyan-900/80 px-2.5 py-1 rounded-lg border border-cyan-700/60 transition-colors shadow-sm"
              title="Open dedicated modal showing last 5 strikes earned and transparency ledger"
            >
              <History className="w-3 h-3 text-cyan-400" />
              <span>View Modal</span>
            </button>
            <button
              onClick={() => setShowRewardModal(true)}
              className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
              title="View reward rules and transparency modal"
            >
              <Info className="w-3 h-3" />
              <span>Reward Rules</span>
            </button>
          </div>
        </div>

        {/* The List of Last 5 Strikes */}
        {last5Strikes.length === 0 ? (
          <div className="py-4 px-3 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            <p className="text-xs text-slate-400 font-medium">
              No strikes earned yet today. Complete your first task or quick log an activity to start your reward audit trail!
            </p>
            <div className="flex items-center justify-center gap-2 mt-2.5">
              <button
                onClick={() => onLogStrike('25m Focus Block', 5, 'projects', 'session')}
                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md border border-slate-700 transition-colors"
              >
                +5 Deep Work
              </button>
              <button
                onClick={() => onLogStrike('GitHub Commit', 10, 'github', 'manual')}
                className="px-2.5 py-1 text-[10px] font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-md border border-slate-700 transition-colors"
              >
                +10 GitHub Commit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {last5Strikes.map((strike, idx) => (
              <div
                key={strike.id || idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {/* Point Badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-black text-xs shrink-0 shadow-sm">
                    <span>🔥</span>
                    <span>+{strike.amount}</span>
                  </div>

                  {/* Title & Category */}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-slate-200 truncate font-sans">
                      {strike.title}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <span className="uppercase text-cyan-400/90 font-medium">{strike.category}</span>
                      <span>·</span>
                      <span className="capitalize">{strike.type || 'reward'}</span>
                    </div>
                  </div>
                </div>

                {/* Relative Timestamp */}
                <div className="text-[10px] text-slate-400 font-mono shrink-0 pl-2">
                  {formatRelativeTime(strike.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. TABS: TODAY'S TASKS | QUICK STRIKE LOGGER | FULL LEDGER */}
      <div className="pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today's Tasks ({todayTasksCompleted}/{tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('quick-log')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'quick-log'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quick Log</span>
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                activeTab === 'ledger'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Full Ledger ({strikeLogs.length})</span>
            </button>
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono font-semibold border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Custom Strike</span>
          </button>
        </div>

        {/* TAB 1: Today's Strikes Checklist */}
        {activeTab === 'tasks' && (
          <div className="space-y-2.5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  task.completed
                    ? 'bg-slate-900/40 border-slate-800/50 text-slate-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 ${task.completed ? 'opacity-100' : 'opacity-0'}`} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-mono">
                      <span>{task.estimatedMinutes}m</span>
                      <span>·</span>
                      <span className="capitalize">{task.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3">
                  <div className="text-xs font-mono font-bold text-amber-400">
                    +{task.strikeReward}
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => onStartTask(task)}
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
                      title="Launch session"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: Quick Strike Action Logger */}
        {activeTab === 'quick-log' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-2">
              Did work off the platform? Log it directly here to maintain your strike and gain points:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {quickPresets.map((preset, i) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={i}
                    onClick={() => onLogStrike(preset.label, preset.points, preset.category, preset.type)}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 text-slate-400 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono group-hover:text-cyan-300 transition-colors">
                          {preset.label}
                        </div>
                        <div className="text-[10px] text-slate-500 capitalize font-mono">
                          {preset.category}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      +{preset.points}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Full Strike Ledger */}
        {activeTab === 'ledger' && (
          <div className="space-y-2">
            {strikeLogs.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No strikes recorded yet today. Complete your first task or quick log an action to maintain your strike!
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {strikeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">+{log.amount}</span>
                      <span className="text-white font-medium">{log.title}</span>
                      <span className="text-slate-500">({log.category})</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {formatRelativeTime(log.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: LAST 5 STRIKES EARNED AUDIT MODAL */}
      {showLast5Modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-xl rounded-3xl bg-[#090d16] border border-cyan-500/40 p-6 md:p-7 text-left shadow-2xl my-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-lg shadow-lg shadow-amber-500/10">
                  ⚡
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white font-mono uppercase tracking-tight flex items-center gap-2">
                    LAST 5 STRIKES EARNED
                  </h4>
                  <p className="text-xs text-slate-400">
                    Transparent reward audit trail & verification ledger
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLast5Modal(false)}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Total Amassed</span>
                <span className="text-base font-black text-amber-400 flex items-center justify-center gap-1">
                  <span>🔥</span> {user.totalStrikes}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Today's Target</span>
                <span className="text-base font-black text-cyan-400">
                  {todayStrikesEarned} / {targetStrikes}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-slate-400 block uppercase">Active Tier</span>
                <span className="text-xs font-bold text-emerald-400 truncate block mt-1">
                  {userLevel}
                </span>
              </div>
            </div>

            {/* The 5 Strikes Audit List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 font-bold uppercase tracking-wider">
                  Verified Reward Entries ({last5Strikes.length} / 5)
                </span>
                <span className="text-[11px] text-slate-500">
                  Newest first
                </span>
              </div>

              {last5Strikes.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-900 flex items-center justify-center text-xl text-slate-600">
                    ⚡
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white font-mono">
                      No strikes recorded yet
                    </h5>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      Complete a 25-minute deep focus session (+5), solve interview problems (+10), or send an internship application (+20) to record your first strikes.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLast5Modal(false);
                        onLogStrike('25m Deep Focus Block', 5, 'projects', 'session');
                      }}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 rounded-lg border border-cyan-800/80 transition-colors"
                    >
                      +5 Focus Block
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLast5Modal(false);
                        onLogStrike('GitHub Code Commit', 10, 'github', 'manual');
                      }}
                      className="px-3 py-1.5 text-xs font-mono font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-800 transition-colors"
                    >
                      +10 GitHub Commit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {last5Strikes.map((strike, idx) => (
                    <div
                      key={strike.id || idx}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {/* Rank badge */}
                          <div className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400 shrink-0 mt-0.5">
                            #{idx + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-200 font-sans leading-snug">
                              {strike.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono">
                              <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 uppercase font-semibold">
                                {strike.category}
                              </span>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-400 capitalize">
                                Source: {strike.type || 'Manual'}
                              </span>
                              <span className="text-slate-500">·</span>
                              <span className="text-slate-500">
                                {new Date(strike.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Amount */}
                        <div className="flex flex-col items-end shrink-0">
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-black text-xs shadow-sm">
                            <span>🔥</span>
                            <span>+{strike.amount}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono mt-1">
                            {formatRelativeTime(strike.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* If fewer than 5, render clean empty placeholders */}
                  {Array.from({ length: 5 - last5Strikes.length }).map((_, slotIdx) => (
                    <div
                      key={`empty-slot-${slotIdx}`}
                      className="p-2.5 rounded-xl border border-dashed border-slate-800/80 bg-slate-950/30 flex items-center justify-between text-xs text-slate-600 font-mono"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-slate-600">
                          #{last5Strikes.length + slotIdx + 1}
                        </span>
                        <span className="text-[11px]">Slot open — complete an activity to earn strikes</span>
                      </div>
                      <span className="text-[10px] text-slate-600">Pending</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Official Transparent Rules Matrix */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TRANSPARENT REWARD VALUE MATRIX</span>
                </span>
                <span className="text-slate-500">Official Formula</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">25m Focus Block</span>
                  <span className="text-amber-400 font-bold">+5</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Daily Task</span>
                  <span className="text-amber-400 font-bold">+10</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">5 Interview Qs</span>
                  <span className="text-amber-400 font-bold">+10</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">GitHub Commit</span>
                  <span className="text-amber-400 font-bold">+10</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Recruiter Message</span>
                  <span className="text-amber-400 font-bold">+15</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Job Application</span>
                  <span className="text-amber-400 font-bold">+20</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Mock Interview</span>
                  <span className="text-amber-400 font-bold">+20</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Real Interview</span>
                  <span className="text-amber-400 font-bold">+30</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Offer Letter</span>
                  <span className="text-emerald-400 font-bold">+100</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setShowLast5Modal(false);
                  setShowCustomModal(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono font-semibold border border-slate-800 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Custom Activity</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLast5Modal(false)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: REWARD TRANSPARENCY & RULES MODAL */}
      {showRewardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#0a0e17] border border-cyan-500/40 p-6 md:p-7 text-left shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm">
                  🔥
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                    REWARD SYSTEM TRANSPARENCY
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    How strikes are earned and verified
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRewardModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Strikes are awarded strictly for high-yield engineering activities that bring you closer to an internship. Meaningless clicks do not earn strikes.
              </p>

              {/* Table of Rules */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
                <div className="grid grid-cols-12 p-2.5 bg-slate-800/60 font-mono text-[10px] uppercase text-slate-400 font-bold">
                  <div className="col-span-8">Activity</div>
                  <div className="col-span-4 text-right">Reward</div>
                </div>
                <div className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">25-minute Deep Focus session</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+5 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Complete daily learning task</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+10 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Complete 5 interview questions</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+10 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">GitHub project commit</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+10 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Recruiter message / networking</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+15 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Internship application sent</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+20 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Full AI Mock Interview drill</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+20 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Real company interview round</div>
                    <div className="col-span-4 text-right text-amber-400 font-bold">+30 Strikes</div>
                  </div>
                  <div className="grid grid-cols-12 p-2.5 text-slate-300">
                    <div className="col-span-8">Internship offer secured</div>
                    <div className="col-span-4 text-right text-emerald-400 font-bold">+100 Strikes</div>
                  </div>
                </div>
              </div>

              {/* Recent 5 Strikes Audit inside Modal */}
              <div className="pt-2">
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Your Recent 5 Strikes:
                </span>
                {last5Strikes.length === 0 ? (
                  <div className="text-slate-500 font-mono text-[11px] italic">
                    No strikes logged yet today.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {last5Strikes.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono">
                        <span className="text-slate-300 truncate max-w-[280px]">{s.title}</span>
                        <span className="text-amber-400 font-bold">+{s.amount} Strikes</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowRewardModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CUSTOM STRIKE ENTRY MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <form
            onSubmit={handleCustomSubmit}
            className="w-full max-w-md rounded-2xl bg-[#0a0e17] border border-cyan-500/40 p-6 text-left shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Log Custom Strike Activity
              </h4>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xs font-mono"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1">
                Activity Description *
              </label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., Read PyTorch Linear layer documentation"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Strike Reward
                </label>
                <select
                  value={customPoints}
                  onChange={(e) => setCustomPoints(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value={5}>+5 Strikes (Short)</option>
                  <option value={10}>+10 Strikes (Standard)</option>
                  <option value={15}>+15 Strikes (Significant)</option>
                  <option value={20}>+20 Strikes (Milestone)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="python">Python</option>
                  <option value="ml">Machine Learning</option>
                  <option value="genai">GenAI</option>
                  <option value="projects">Projects</option>
                  <option value="github">GitHub</option>
                  <option value="interview">Interview</option>
                  <option value="applications">Applications</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider"
              >
                Log Strike (+{customPoints})
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
