import React from 'react';
import { ReadinessBreakdown } from '../../types';
import { ProgressRing } from '../common/ProgressRing';

interface ReadinessCardProps {
  readiness: ReadinessBreakdown;
  onExploreSkills?: () => void;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({ readiness }) => {
  const breakdownItems = [
    { label: 'Python', value: readiness.python, color: 'bg-cyan-500' },
    { label: 'Machine Learning', value: readiness.ml, color: 'bg-blue-500' },
    { label: 'GenAI', value: readiness.genai, color: 'bg-purple-500' },
    { label: 'Projects', value: readiness.projects, color: 'bg-emerald-500' },
    { label: 'Interview', value: readiness.interview, color: 'bg-amber-500' },
    { label: 'Applications', value: readiness.applications, color: 'bg-rose-500' },
    { label: 'GitHub', value: readiness.github, color: 'bg-teal-500' },
  ];

  return (
    <div className="rounded-2xl bg-[#0a0e17] border border-slate-800/90 p-5 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            INTERNSHIP READINESS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent algorithmic score based on real completed tasks
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Large Circular Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-2">
          <ProgressRing 
            progress={readiness.overall} 
            size={175} 
            strokeWidth={14}
            label="Internship Ready"
            sublabel="Target: 85%+"
          />
          <div className="mt-3 text-center">
            <span className="text-xs text-slate-400 font-medium">
              Calculated across 8 weighted engineering vectors
            </span>
          </div>
        </div>

        {/* Breakdown Bars */}
        <div className="lg:col-span-7 space-y-2.5">
          {breakdownItems.map((item) => (
            <div key={item.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-300 group-hover:text-white transition-colors">
                  {item.label}
                </span>
                <span className="font-mono font-semibold text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {item.value}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${Math.min(100, item.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
