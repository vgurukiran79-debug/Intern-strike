import React from 'react';
import { Timer, Briefcase, Swords, Target, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    {
      id: 'focus',
      label: 'FOCUS ROOM',
      sublabel: '25m Pomodoro Block',
      icon: Timer,
      color: 'hover:border-amber-500/50 hover:bg-amber-950/20 text-amber-400',
    },
    {
      id: 'jobs',
      label: 'APPLY NOW',
      sublabel: 'Kanban Application Tracker',
      icon: Briefcase,
      color: 'hover:border-cyan-500/50 hover:bg-cyan-950/20 text-cyan-400',
    },
    {
      id: 'interview',
      label: 'INTERVIEW DRILL',
      sublabel: 'Practice & AI Mock Round',
      icon: Swords,
      color: 'hover:border-purple-500/50 hover:bg-purple-950/20 text-purple-400',
    },
    {
      id: 'mission',
      label: '30-DAY MISSION',
      sublabel: 'Curriculum Roadmap',
      icon: Target,
      color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20 text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={() => onNavigate(act.id)}
            className={`p-4 rounded-xl bg-[#0a0e17] border border-slate-800 text-left transition-all duration-200 group ${act.color} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-current group-hover:translate-x-0.5 transition-all" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white font-mono group-hover:text-current transition-colors">
                {act.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate font-medium">
                {act.sublabel}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
