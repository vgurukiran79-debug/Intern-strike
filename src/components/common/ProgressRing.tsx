import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  sublabel?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 180,
  strokeWidth = 12,
  className = '',
  label,
  sublabel,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-800/80"
        />
        {/* Progress Gradient Accent */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#strikeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient id="strikeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
          {Math.round(progress)}%
        </span>
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mt-0.5">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[11px] text-slate-400 mt-0.5 font-medium">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
