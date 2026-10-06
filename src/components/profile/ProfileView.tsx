import React, { useState } from 'react';
import { UserProfile, Achievement, UserLevel, DailyGoals } from '../../types';
import { 
  User, 
  Award, 
  Settings, 
  Flame, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Lock, 
  Volume2, 
  VolumeX,
  Target,
  Clock,
  Sparkles,
  Sliders,
  TrendingUp,
  Briefcase,
  Swords,
  Timer,
  Check
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  userLevel: UserLevel;
  achievements: Achievement[];
  onSaveProfile: (updated: UserProfile) => void;
  onResetData: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenWeeklyReview: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  userLevel,
  achievements,
  onSaveProfile,
  onResetData,
  isMuted,
  onToggleMute,
  onOpenWeeklyReview,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings'>('profile');
  const [formData, setFormData] = useState<UserProfile>(user);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [goalsSavedSuccess, setGoalsSavedSuccess] = useState(false);

  // Daily goals state initialized from user profile or defaults
  const [dailyGoals, setDailyGoals] = useState<DailyGoals>(
    user.dailyGoals || {
      dailyStrikeTarget: 35,
      dailyFocusHours: user.dailyGoalHours || 3.0,
      dailyTasksCount: 4,
      dailyApplicationsTarget: 2,
      dailyQuestionsTarget: 5,
      pomodoroWorkMinutes: 25,
      pomodoroBreakMinutes: 5,
    }
  );

  const handleSubmitProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...formData,
      dailyGoalHours: dailyGoals.dailyFocusHours,
      dailyGoals,
    };
    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveGoals = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      ...formData,
      dailyGoalHours: dailyGoals.dailyFocusHours,
      dailyGoals,
    };
    setFormData(updated);
    onSaveProfile(updated);
    setGoalsSavedSuccess(true);
    setTimeout(() => setGoalsSavedSuccess(false), 2500);
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Trajectory forecast calculations
  const weeklyStrikes = dailyGoals.dailyStrikeTarget * 7;
  const weeklyHours = dailyGoals.dailyFocusHours * 7;
  const daysToEngineerTier = Math.max(1, Math.ceil((300 - user.totalStrikes) / Math.max(1, dailyGoals.dailyStrikeTarget)));
  const daysToReadyTier = Math.max(1, Math.ceil((500 - user.totalStrikes) / Math.max(1, dailyGoals.dailyStrikeTarget)));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              PROFILE & CONFIGURATION
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Student identity, custom daily strike targets, time commitments, and honors.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'profile'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all flex items-center gap-1.5 ${
              activeTab === 'achievements'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Honors</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 rounded-full">
              {unlockedCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
              activeTab === 'settings'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Daily Goals & Settings
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="p-6 rounded-2xl bg-[#0a0e17] border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-black font-mono shadow-lg shadow-cyan-500/20">
            {user.preferredName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-white font-mono">{user.name}</h2>
              <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">
                {userLevel}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {user.degree} {user.branch} · {user.year} · {user.college}
            </p>
            <p className="text-xs text-cyan-300 font-mono mt-0.5">
              Target: {user.targetRole} ({user.targetLocation})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWeeklyReview}
            className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-semibold transition-colors"
          >
            Weekly Review
          </button>
          <div className="text-right p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">STRIKES</div>
            <div className="text-lg font-black text-amber-400 font-mono flex items-center gap-1">
              <span>🔥</span> {user.totalStrikes}
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: Profile Form */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSubmitProfile} className="p-6 rounded-2xl bg-[#0a0e17] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-2">
            ACADEMIC & TARGET CONFIGURATION
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Preferred Name (Greeting)</label>
              <input
                type="text"
                value={formData.preferredName}
                onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Engineering Branch</label>
              <input
                type="text"
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">College / Institution</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Target Internship Role</label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Target Location Hub</label>
              <input
                type="text"
                value={formData.targetLocation}
                onChange={(e) => setFormData({ ...formData, targetLocation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-mono uppercase">Daily Focus Goal (Hours)</label>
              <input
                type="number"
                min={1}
                max={12}
                step={0.5}
                value={formData.dailyGoalHours}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setFormData({ ...formData, dailyGoalHours: val });
                  setDailyGoals({ ...dailyGoals, dailyFocusHours: val });
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Academic profile updated
              </span>
            ) : <div />}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/20"
            >
              <Save className="w-4 h-4" />
              <span>Update Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Achievements */}
      {activeTab === 'achievements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>UNLOCKED: {unlockedCount} / {achievements.length} BADGES</span>
            <span>TOTAL REWARDS AVAILABLE: 435 STRIKES</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border transition-all text-left ${
                  ach.unlocked
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl">{ach.icon}</span>
                  <div className="flex items-center gap-1 font-mono text-xs font-bold">
                    {ach.unlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        +{ach.rewardStrikes}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" />
                        +{ach.rewardStrikes}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white font-mono">
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>

                {ach.unlocked && ach.unlockedAt && (
                  <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono">
                    Unlocked: {ach.unlockedAt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Settings & Daily Goals Configuration */}
      {activeTab === 'settings' && (
        <div className="space-y-6 text-xs">
          {/* A. DEDICATED DAILY GOALS CONFIGURATION INTERFACE */}
          <div className="p-6 rounded-3xl bg-[#0a0e17] border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.1)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm md:text-base font-bold text-white font-mono uppercase tracking-wider">
                    DAILY GOALS & TIME COMMITMENTS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define your custom daily strike targets, focus time, and pacing. Overrides default targets.
                  </p>
                </div>
              </div>

              {goalsSavedSuccess && (
                <span className="text-xs text-emerald-400 font-mono font-semibold flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" /> Targets Applied!
                </span>
              )}
            </div>

            {/* 1. Daily Strike Target */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Daily Strike Target</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Target strike points to earn every 24 hours to stay on track
                  </span>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <input
                    type="number"
                    min={5}
                    max={200}
                    step={5}
                    value={dailyGoals.dailyStrikeTarget}
                    onChange={(e) => setDailyGoals({ ...dailyGoals, dailyStrikeTarget: Math.max(5, Number(e.target.value)) })}
                    className="w-20 px-2 py-1 bg-slate-950 border border-amber-500/50 rounded-xl text-amber-400 font-mono font-bold text-center text-sm focus:outline-none focus:border-amber-400"
                  />
                  <div className="text-sm font-black font-mono text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/30 whitespace-nowrap">
                    🔥 STRIKES
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={5}
                  value={dailyGoals.dailyStrikeTarget}
                  onChange={(e) => setDailyGoals({ ...dailyGoals, dailyStrikeTarget: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>10 (Minimum)</span>
                  <span>35 (Standard)</span>
                  <span>50 (Aggressive)</span>
                  <span>100 (Full Blitz)</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { label: 'Steady', val: 20 },
                  { label: 'Standard Target', val: 35 },
                  { label: 'Aggressive', val: 50 },
                  { label: 'Full Blitz', val: 75 },
                ].map((preset) => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setDailyGoals({ ...dailyGoals, dailyStrikeTarget: preset.val })}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      dailyGoals.dailyStrikeTarget === preset.val
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {preset.val} Strikes ({preset.label})
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Deep Work Focus Time Commitment */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-mono text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Daily Deep Work Commitment</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Pomodoro & focused coding commitment without distractions
                  </span>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <input
                    type="number"
                    min={0.5}
                    max={12}
                    step={0.5}
                    value={dailyGoals.dailyFocusHours}
                    onChange={(e) => setDailyGoals({ ...dailyGoals, dailyFocusHours: Math.max(0.5, Number(e.target.value)) })}
                    className="w-20 px-2 py-1 bg-slate-950 border border-cyan-500/50 rounded-xl text-cyan-400 font-mono font-bold text-center text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <div className="text-sm font-black font-mono text-cyan-400 bg-cyan-950/60 px-3 py-1.5 rounded-xl border border-cyan-800/40 whitespace-nowrap">
                    {Math.round(dailyGoals.dailyFocusHours * 60)} min
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={0.5}
                  value={dailyGoals.dailyFocusHours}
                  onChange={(e) => setDailyGoals({ ...dailyGoals, dailyFocusHours: Number(e.target.value) })}
                  className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1.0h</span>
                  <span>2.5h</span>
                  <span>4.0h</span>
                  <span>6.0h</span>
                  <span>8.0h</span>
                </div>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {[1.5, 2.5, 3.0, 4.0, 5.0].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDailyGoals({ ...dailyGoals, dailyFocusHours: hrs })}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      dailyGoals.dailyFocusHours === hrs
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {hrs.toFixed(1)} Hours ({Math.round(hrs * 60)}m)
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Pomodoro Work & Break Intervals Configuration */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-cyan-400" />
                <label className="font-mono text-slate-200 font-bold uppercase tracking-wider text-xs">
                  Pomodoro Timer Intervals
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1.5 font-mono">Work Block: {dailyGoals.pomodoroWorkMinutes} minutes</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[20, 25, 30, 45, 50, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyGoals({ ...dailyGoals, pomodoroWorkMinutes: mins })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                          dailyGoals.pomodoroWorkMinutes === mins
                            ? 'bg-cyan-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1.5 font-mono">Rest Break: {dailyGoals.pomodoroBreakMinutes} minutes</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[3, 5, 10, 15].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyGoals({ ...dailyGoals, pomodoroBreakMinutes: mins })}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-colors ${
                          dailyGoals.pomodoroBreakMinutes === mins
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {mins}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Pipeline & Practice Targets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Daily Tasks Target */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="font-mono text-slate-300 uppercase block font-semibold">
                  Daily Checklist Target
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tasks to clear:</span>
                  <span className="text-base font-bold font-mono text-white">
                    {dailyGoals.dailyTasksCount} Tasks
                  </span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDailyGoals({ ...dailyGoals, dailyTasksCount: num })}
                      className={`flex-1 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                        dailyGoals.dailyTasksCount === num
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Applications Target */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="font-mono text-slate-300 uppercase block font-semibold">
                  Job Applications Target
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Outreach / Day:</span>
                  <span className="text-base font-bold font-mono text-white">
                    {dailyGoals.dailyApplicationsTarget} Roles
                  </span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDailyGoals({ ...dailyGoals, dailyApplicationsTarget: num })}
                      className={`flex-1 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                        dailyGoals.dailyApplicationsTarget === num
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Interview Questions Target */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <label className="font-mono text-slate-300 uppercase block font-semibold">
                  Interview Questions Goal
                </label>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Drills / Day:</span>
                  <span className="text-base font-bold font-mono text-white">
                    {dailyGoals.dailyQuestionsTarget} Qs
                  </span>
                </div>
                <div className="flex gap-1.5 pt-1">
                  {[3, 5, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDailyGoals({ ...dailyGoals, dailyQuestionsTarget: num })}
                      className={`flex-1 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                        dailyGoals.dailyQuestionsTarget === num
                          ? 'bg-purple-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Live Pacing Trajectory Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 border border-cyan-500/30">
              <div className="flex items-center gap-2 mb-2 font-mono text-cyan-300 font-bold uppercase text-[11px] tracking-wider">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>PROJECTED INTERNSHIP TRAJECTORY</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-2 font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Weekly Strikes</span>
                  <span className="text-base font-black text-amber-400">~{weeklyStrikes}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Weekly Deep Work</span>
                  <span className="text-base font-black text-cyan-400">~{weeklyHours.toFixed(1)} hrs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">AI Engineer Tier</span>
                  <span className="text-base font-black text-white">~{daysToEngineerTier} days</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Intern Ready Tier</span>
                  <span className="text-base font-black text-emerald-400">~{daysToReadyTier} days</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center mt-1">
                Based on your current <strong>{dailyGoals.dailyStrikeTarget} strikes/day</strong> velocity. Targets will dynamically calibrate your timers and trackers.
              </p>
            </div>

            {/* Save Goals Button */}
            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleSaveGoals()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                <Save className="w-4 h-4" />
                <span>Save Custom Daily Goals</span>
              </button>
            </div>
          </div>

          {/* B. AUDIO & NOTIFICATIONS */}
          <div className="p-6 rounded-2xl bg-[#0a0e17] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">
              AUDIO & NOTIFICATIONS
            </h3>
            <p className="text-slate-400">
              Web Audio synthesizer tones for strike celebrations and timer completions.
            </p>
            <button
              onClick={onToggleMute}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-colors ${
                !isMuted
                  ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{isMuted ? 'Sound Cues Muted' : 'Sound Cues Enabled (Web Audio)'}</span>
            </button>
          </div>

          {/* C. DATA MANAGEMENT & RESET */}
          <div className="p-6 rounded-2xl bg-[#0a0e17] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1">
              RESET INTERN STRIKE DATA
            </h3>
            <p className="text-slate-400 text-xs">
              Clear all local cache, mock metrics, past strikes, and sample information. Resets the entire dashboard to a fresh baseline ready for new data entry.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset intern strike data? This will clear all mock metrics, past strikes, and sample data for a fresh start.')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold transition-colors text-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Intern Strike Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
