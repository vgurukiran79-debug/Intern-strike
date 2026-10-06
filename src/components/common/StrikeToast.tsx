import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Sparkles } from 'lucide-react';

interface StrikeToastProps {
  show: boolean;
  amount: number;
  message?: string;
  onClose?: () => void;
}

export const StrikeToast: React.FC<StrikeToastProps> = ({
  show,
  amount,
  message = 'STRIKE EARNED!',
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-900/95 via-cyan-950/95 to-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.35)] backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <span className="text-xl">🔥</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  {message}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-1 text-2xl font-black tracking-tight text-white font-mono">
                +{amount} <span className="text-sm font-semibold text-amber-400 ml-0.5">STRIKES</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
