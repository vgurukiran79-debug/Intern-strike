import React, { useState } from 'react';
import { MissionDay } from '../../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Zap, 
  BookOpen, 
  Code2, 
  Hammer, 
  Briefcase, 
  ChevronRight,
  Filter,
  Flame,
  ArrowRight
} from 'lucide-react';

interface MissionTimelineProps {
  mission: MissionDay[];
  onToggleSubtask: (dayNumber: number, section: 'learn' | 'practice' | 'build' | 'career') => void;
  onStartFocus: (taskTitle: string, category: string, minutes: number) => void;
}

export const MissionTimeline: React.FC<MissionTimelineProps> = ({
  mission,
  onToggleSubtask,
  onStartFocus,
}) => {
  const activeDay = mission.find(d => !d.completed)?.dayNumber || 1;
  const [selectedDayNum, setSelectedDayNum] = useState<number>(activeDay);
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  const selectedDay = mission.find(d => d.dayNumber === selectedDayNum) || mission[0];

  const filteredDays = filterWeek === 'all' 
    ? mission 
    : mission.filter(d => Math.ceil(d.dayNumber / 7) === filterWeek);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              30-DAY INTERNSHIP MISSION
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Curated daily curriculum for 2nd-year AIML students. Complete each strike to launch your internship.
          </p>
        </div>

        {/* Week Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setFilterWeek('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              filterWeek === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All 30 Days
          </button>
          {[1, 2, 3, 4, 5].map((w) => (
            <button
              key={w}
              onClick={() => setFilterWeek(w)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filterWeek === w
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week {w}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Timeline List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {filteredDays.map((day) => {
            const isSelected = day.dayNumber === selectedDayNum;
            const isToday = day.dayNumber === activeDay;
            const subtasksCompleted = [
              day.learn.completed,
              day.practice.completed,
              day.build.completed,
              day.career.completed,
            ].filter(Boolean).length;

            return (
              <div
                key={day.dayNumber}
                onClick={() => setSelectedDayNum(day.dayNumber)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                    : day.completed
                    ? 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
                    : 'bg-[#0a0e17] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                      day.completed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isToday
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      DAY {day.dayNumber < 10 ? `0${day.dayNumber}` : day.dayNumber}
                      {day.completed && ' ✓'}
                    </span>

                    {isToday && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                        ACTIVE TODAY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-400">
                    <Zap className="w-3.5 h-3.5" />
                    <span>+{day.totalReward}</span>
                  </div>
                </div>

                <div className="mt-2">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {day.theme}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                    <span>{subtasksCompleted}/4 tasks</span>
                    <span>·</span>
                    <span>{day.estimatedHours} hrs</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Day Deep Dive */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#0a0e17] border border-slate-800/90 p-5 md:p-6 shadow-xl sticky top-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    DAY {selectedDay.dayNumber < 10 ? `0${selectedDay.dayNumber}` : selectedDay.dayNumber} OF 30
                  </span>
                  {selectedDay.completed && (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {selectedDay.title}
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Theme: {selectedDay.theme}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">Total Reward</div>
                  <div className="text-lg font-black font-mono text-amber-400 flex items-center gap-1 justify-end">
                    <span>🔥</span> +{selectedDay.totalReward} STRIKES
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Pillars: LEARN, PRACTICE, BUILD, CAREER */}
            <div className="space-y-4 my-6">
              {/* 1. LEARN */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedDay.learn.completed ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleSubtask(selectedDay.dayNumber, 'learn')}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        selectedDay.learn.completed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${selectedDay.learn.completed ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold font-mono text-cyan-400 uppercase">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>LEARN</span>
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${selectedDay.learn.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {selectedDay.learn.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartFocus(`Day ${selectedDay.dayNumber} Learn: ${selectedDay.theme}`, 'learn', 45)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                    title="Focus session"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>

              {/* 2. PRACTICE */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedDay.practice.completed ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleSubtask(selectedDay.dayNumber, 'practice')}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        selectedDay.practice.completed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${selectedDay.practice.completed ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold font-mono text-blue-400 uppercase">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>PRACTICE</span>
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${selectedDay.practice.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {selectedDay.practice.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartFocus(`Day ${selectedDay.dayNumber} Practice: ${selectedDay.theme}`, 'ml', 45)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                    title="Focus session"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
              </div>

              {/* 3. BUILD */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedDay.build.completed ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleSubtask(selectedDay.dayNumber, 'build')}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        selectedDay.build.completed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${selectedDay.build.completed ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-400 uppercase">
                        <Hammer className="w-3.5 h-3.5" />
                        <span>BUILD</span>
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${selectedDay.build.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {selectedDay.build.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartFocus(`Day ${selectedDay.dayNumber} Build: ${selectedDay.theme}`, 'projects', 50)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                    title="Focus session"
                  >
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* 4. CAREER */}
              <div className={`p-4 rounded-xl border transition-all ${
                selectedDay.career.completed ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleSubtask(selectedDay.dayNumber, 'career')}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        selectedDay.career.completed 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                          : 'border border-slate-600 hover:border-cyan-400 text-transparent'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${selectedDay.career.completed ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold font-mono text-purple-400 uppercase">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>CAREER</span>
                      </div>
                      <p className={`text-sm mt-1 leading-relaxed ${selectedDay.career.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {selectedDay.career.description}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onStartFocus(`Day ${selectedDay.dayNumber} Career: Apply & Connect`, 'applications', 25)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs shrink-0"
                    title="Focus session"
                  >
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Estimated Time: <strong>{selectedDay.estimatedHours} Hours</strong></span>
              </div>

              <button
                onClick={() => onStartFocus(`Day ${selectedDay.dayNumber}: ${selectedDay.theme}`, 'ml', 25)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <span>START DAY IN FOCUS ROOM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
