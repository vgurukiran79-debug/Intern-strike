import React, { useState } from 'react';
import { Swords, Sparkles, Send, CheckCircle2, ChevronRight, Award, AlertCircle, RefreshCw } from 'lucide-react';
import { MockInterviewResult } from '../../types';
import { generateMockInterviewReport } from '../../services/gemini';
import { sound } from '../../services/audio';

interface MockInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFinishMock: (result: MockInterviewResult) => void;
}

const MOCK_QUESTIONS = [
  {
    q: "Guru, walk me through your foundational AI background. How have you balanced theory in college with hands-on coding in Python?",
    category: "Background & Fundamentals",
  },
  {
    q: "In Machine Learning, what is the geometric difference between L1 (Lasso) and L2 (Ridge) regularization? Why does L1 produce sparse weights?",
    category: "Machine Learning Math",
  },
  {
    q: "If you are deploying a Retrieval-Augmented Generation (RAG) system for a Bengaluru fintech startup, how would you evaluate if the retriever is returning hallucinated or noisy chunks?",
    category: "GenAI & RAG Architecture",
  },
  {
    q: "Tell me about a technical bug or unexpected model metric drop you encountered during a project. How did you isolate and resolve it?",
    category: "Problem Solving & Debugging",
  },
  {
    q: "Why do you specifically want to intern with us in Bengaluru right now, and what kind of impact do you expect to make in your first 30 days?",
    category: "Behavioral & Culture Fit",
  },
];

export const MockInterviewModal: React.FC<MockInterviewModalProps> = ({
  isOpen,
  onClose,
  onFinishMock,
}) => {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4
  const [userAnswer, setUserAnswer] = useState('');
  const [qaPairs, setQaPairs] = useState<{ question: string; answer: string }[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [report, setReport] = useState<MockInterviewResult | null>(null);

  if (!isOpen) return null;

  const handleNextQuestion = async () => {
    if (!userAnswer.trim()) return;

    const currentQ = MOCK_QUESTIONS[currentStep].q;
    const updatedPairs = [...qaPairs, { question: currentQ, answer: userAnswer }];
    setQaPairs(updatedPairs);
    setUserAnswer('');

    if (currentStep < MOCK_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all 5 questions -> generate comprehensive bar-raiser report
      setIsEvaluating(true);
      try {
        const finalReport = await generateMockInterviewReport(
          'AI/ML Engineer Intern',
          'AIML Comprehensive Drill',
          updatedPairs
        );
        sound.playStrikeEarned();
        setReport(finalReport);
      } catch {
        // handled in service
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const handleCompleteAndClaim = () => {
    if (report) {
      onFinishMock(report);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-3xl bg-[#090e18] border border-purple-500/40 p-6 md:p-8 text-left shadow-[0_0_60px_rgba(168,85,247,0.2)] my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Swords className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">
                  AI MOCK INTERVIEW
                </h3>
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30">
                  BAR RAISER MODE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                5-question technical simulation · Instant evaluation report
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 text-sm font-mono"
          >
            ✕ ESC
          </button>
        </div>

        {/* Content Body */}
        {isEvaluating ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
            <div className="text-sm font-mono font-bold text-purple-300">
              SYNTHESIZING INTERVIEW REPORT...
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Evaluating technical accuracy, problem solving depth, communication clarity, and project intuition...
            </p>
          </div>
        ) : report ? (
          /* FINAL INTERVIEW REPORT */
          <div className="py-4 space-y-6 animate-in fade-in duration-300">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block mb-1">
                  EVALUATION COMPLETE
                </span>
                <h4 className="text-xl font-black text-white font-mono">
                  INTERVIEW REPORT
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  Role: {report.role} · Bangalore Startup Standards
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400 uppercase">OVERALL RATING</div>
                <div className="text-3xl font-black font-mono text-cyan-400">
                  {report.overallScore}<span className="text-sm text-slate-500">/10</span>
                </div>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Technical</div>
                <div className="text-lg font-bold font-mono text-white mt-1">{report.technicalScore}/10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Problem Solving</div>
                <div className="text-lg font-bold font-mono text-white mt-1">{report.problemSolvingScore}/10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Communication</div>
                <div className="text-lg font-bold font-mono text-white mt-1">{report.communicationScore}/10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Project Depth</div>
                <div className="text-lg font-bold font-mono text-white mt-1">{report.projectScore}/10</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Confidence</div>
                <div className="text-lg font-bold font-mono text-white mt-1">{report.confidenceScore}/10</div>
              </div>
            </div>

            {/* Feedback Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Strengths */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <div className="font-bold font-mono text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> 3 KEY STRENGTHS
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {report.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
                <div className="font-bold font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> 3 IMPROVEMENTS NEEDED
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  {report.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">→</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Next Topics to Study */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <span className="font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                RECOMMENDED STUDY TOPICS BEFORE REAL ROUND:
              </span>
              <div className="flex flex-wrap gap-2">
                {report.nextTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-purple-950/50 text-purple-300 border border-purple-800/60 rounded-lg font-mono text-[11px]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Claim Reward Button */}
            <div className="pt-2">
              <button
                onClick={handleCompleteAndClaim}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 hover:opacity-95 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-purple-500/20"
              >
                CLAIM +20 STRIKES & SAVE REPORT
              </button>
            </div>
          </div>
        ) : (
          /* QUESTION IN PROGRESS */
          <div className="py-4 space-y-5">
            {/* Progress Kicker */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-purple-400 font-bold">
                QUESTION {currentStep + 1} OF {MOCK_QUESTIONS.length}
              </span>
              <span className="text-slate-400">
                {MOCK_QUESTIONS[currentStep].category}
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / MOCK_QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                Interviewer asks:
              </div>
              <p className="text-base md:text-lg font-semibold text-white leading-relaxed">
                "{MOCK_QUESTIONS[currentStep].q}"
              </p>
            </div>

            {/* User Answer Textarea */}
            <div>
              <label className="text-xs font-mono text-slate-400 block mb-1.5">
                Your Answer (Explain clearly with technical reasoning):
              </label>
              <textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your response here as you would speak it in an interview..."
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-400 leading-relaxed font-sans"
              />
            </div>

            {/* Submit / Next Button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400 font-mono">
                {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
              </div>

              <button
                disabled={!userAnswer.trim()}
                onClick={handleNextQuestion}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition-all ${
                  userAnswer.trim()
                    ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <span>{currentStep === MOCK_QUESTIONS.length - 1 ? 'Finish & Generate Report' : 'Next Question'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
