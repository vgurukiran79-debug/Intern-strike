import React from 'react';
import { 
  Home, 
  Target, 
  Timer, 
  Briefcase, 
  Swords, 
  User, 
  Sparkles,
  Zap,
  TrendingUp,
  Volume2,
  VolumeX
} from 'lucide-react';
import { UserProfile, UserLevel } from '../../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: UserProfile;
  userLevel: UserLevel;
  onOpenCoach: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentDay?: number;
  applicationsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  userLevel,
  onOpenCoach,
  isMuted,
  onToggleMute,
  currentDay = 1,
  applicationsCount = 0,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mission', label: '30-Day Mission', icon: Target },
    { id: 'focus', label: 'Focus Room', icon: Timer },
    { id: 'jobs', label: 'Internships', icon: Briefcase },
    { id: 'interview', label: 'Interview Arena', icon: Swords },
    { id: 'profile', label: 'Profile & Settings', icon: User },
  ];

  const mobileNavItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'mission', label: 'Mission', icon: Target },
    { id: 'focus', label: 'Focus', icon: Timer },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0a0e17] border-r border-slate-800/80 h-screen sticky top-0 z-40 select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => onSelectTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all">
                {/* Minimal lightning + upward arrow combined symbol */}
                <div className="relative flex items-center justify-center">
                  <Zap className="w-5 h-5 fill-white stroke-none" />
                  <TrendingUp className="w-3.5 h-3.5 text-white absolute -top-1 -right-1" />
                </div>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-wider text-white group-hover:text-cyan-400 transition-colors flex items-center gap-1 font-mono">
                  INTERN<span className="text-cyan-400">STRIKE</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-medium tracking-tight">
                  30 Days · Daily Strikes
                </span>
              </div>
            </button>

            <button
              onClick={onToggleMute}
              title={isMuted ? "Unmute audio cues" : "Mute audio cues"}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* User Quick Status & Strike Badge */}
        <div className="mx-4 mt-4 p-3 rounded-xl bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 font-medium">Status</span>
            <span className="text-cyan-400 font-semibold font-mono text-[11px]">{userLevel}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">🔥</span>
              <span className="text-lg font-black text-white font-mono">{user.totalStrikes}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Strikes</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {user.currentStreak}d streak
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'mission' && (
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded">
                    Day {currentDay}
                  </span>
                )}
                {item.id === 'jobs' && (
                  <span className="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800 rounded">
                    {applicationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Career Coach Quick Button */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={onOpenCoach}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30 text-purple-200 hover:border-purple-400/50 hover:from-purple-900/60 transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  AI Career Coach
                </div>
                <div className="text-[10px] text-purple-300/80">
                  Ask tactical next steps
                </div>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded">
              GEMINI
            </span>
          </button>

          {/* User profile footer */}
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold font-mono">
                {user.preferredName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-white truncate max-w-[110px]">
                  {user.preferredName}
                </div>
                <div className="text-[10px] text-slate-400 truncate max-w-[110px]">
                  2nd Yr AIML · BLR
                </div>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('profile')}
              className="text-[10px] text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Edit
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <button 
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-white stroke-none" />
          </div>
          <span className="text-sm font-extrabold tracking-wider text-white font-mono">
            INTERN<span className="text-cyan-400">STRIKE</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Strikes Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold">
            <span className="text-sm">🔥</span>
            <span className="text-white">{user.totalStrikes}</span>
          </div>

          {/* Coach Quick Button */}
          <button
            onClick={onOpenCoach}
            className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40"
            title="AI Coach"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0a0e17]/95 backdrop-blur-lg border-t border-slate-800/90 px-2 py-1.5 flex items-center justify-around z-40 safe-bottom">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] font-semibold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
