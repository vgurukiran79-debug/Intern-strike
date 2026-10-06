import React from 'react';
import { TrendingUp, Award, Clock, Briefcase, Swords, GitCommit, CheckCircle2 } from 'lucide-react';
import { UserProfile, ReadinessBreakdown } from '../../types';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  readiness: ReadinessBreakdown;
  applicationsCount?: number;
  interviewsCount?: number;
  totalFocusMinutes?: number;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  onClose,
  user,
  readiness,
  applicationsCount = 0,
  interviewsCount = 0,
  totalFocusMinutes = 0,
}) => {
  if (!isOpen) return null;

  const focusHrs = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#090e18] border border-cyan-500/40 p-6 md:p-8 text-left shadow-[0_0_60px_rgba(6,182,212,0.25)] my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 block mb-1">
              PERFORMANCE SNAPSHOT
            </span>
            <h3 className="text-xl font-black text-white font-mono">
              WEEKLY REPORT
            </h3>
            <p className="text-xs text-slate-400">
              Real-time progress analytics for {user.preferredName}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-mono"
          >
            ✕ ESC
          </button>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-center">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Strikes Earned</span>
            <div className="text-xl font-black font-mono text-amber-400 mt-1 flex items-center justify-center gap-1">
              <span>🔥</span> {user.totalStrikes}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Focus Time</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1">
              {focusHrs}h {focusMins}m
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Applications</span>
            <div className="text-xl font-bold font-mono text-white mt-1">
              {applicationsCount} Sent
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Interviews</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
              {interviewsCount} Scheduled
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Streak</span>
            <div className="text-xl font-bold font-mono text-purple-400 mt-1">
              {user.currentStreak} Days
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Readiness</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-1 flex items-center justify-center gap-1">
              <span>{readiness.overall}%</span>
            </div>
          </div>
        </div>

        {/* Qualitative Highlights */}
        <div className="space-y-3 my-5 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
            <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block mb-1">
              🏆 STRONGEST AREA: Projects & Python Foundation
            </span>
            <p className="text-slate-300">
              Completed all 7 days of Python and shipped the Bangalore tech housing data project to GitHub.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
            <span className="text-amber-400 font-mono font-bold uppercase tracking-wider block mb-1">
              ⚠️ NEEDS IMPROVEMENT: Interview Communication & Speed
            </span>
            <p className="text-slate-300">
              Technical answers are accurate, but needs structured delivery (STAR method) and verbal clarity under pressure.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
            <span className="text-cyan-400 font-mono font-bold uppercase tracking-wider block mb-1">
              🎯 NEXT WEEK PRIORITY: ML Algorithms & Foreset AI Interview
            </span>
            <p className="text-slate-300">
              Master Linear/Logistic Regression, prepare for the scheduled Oct 7 interview, and apply to 5 more startups.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-colors"
          >
            LOCKED IN · CONTINUE MISSION
          </button>
        </div>
      </div>
    </div>
  );
};
