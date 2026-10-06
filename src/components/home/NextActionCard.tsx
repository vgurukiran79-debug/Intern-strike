import React from 'react';
import { DailyStrikeTask } from '../../types';
import { Clock, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NextActionCardProps {
  action: DailyStrikeTask;
  onStartAction: (task: DailyStrikeTask) => void;
  onCompleteAction: (task: DailyStrikeTask) => void;
}

export const NextActionCard: React.FC<NextActionCardProps> = ({
  action,
  onStartAction,
  onCompleteAction,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1525] to-[#0a101d] border-2 border-cyan-500/40 p-5 md:p-6 shadow-[0_0_35px_rgba(6,182,212,0.15)] group transition-all hover:border-cyan-400/60">
      {/* Background subtle glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header kicker */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-cyan-400 uppercase font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span>NEXT BEST ACTION</span>
        </div>

        {/* Reward */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold shadow-sm">
          <span>🔥</span>
          <span>+{action.strikeReward} STRIKES</span>
        </div>
      </div>

      {/* Main Task Title */}
      <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug mb-2 group-hover:text-cyan-50 transition-colors">
        {action.title}
      </h2>

      {/* Why description */}
      <p className="text-sm text-slate-300/90 leading-relaxed mb-5 max-w-2xl font-normal">
        {action.whyDescription}
      </p>

      {/* Meta Row & Action Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">{action.estimatedMinutes} min</span>
            <span className="text-slate-400">est.</span>
          </div>
          <span className="text-slate-400">·</span>
          <div className="capitalize text-slate-400 font-medium">
            Category: <span className="text-cyan-300 font-semibold">{action.category.toUpperCase()}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onCompleteAction(action)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            title="Mark as done already"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mark Done</span>
          </button>

          <button
            onClick={() => onStartAction(action)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>START NOW</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
