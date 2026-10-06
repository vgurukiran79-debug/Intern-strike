import React, { useState } from 'react';
import { InterviewQuestion, QuestionCategory, QuestionDifficulty, MockInterviewResult } from '../../types';
import { 
  Swords, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  BookOpen, 
  Award, 
  HelpCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { evaluateInterviewAnswer } from '../../services/gemini';
import { MockInterviewModal } from './MockInterviewModal';
import { sound } from '../../services/audio';

interface InterviewArenaProps {
  questions: InterviewQuestion[];
  onSaveQuestionAnswer: (questionId: string, answer: string, feedback: InterviewQuestion['feedback']) => void;
  onFinishMockInterview: (result: MockInterviewResult) => void;
}

const CATEGORIES: QuestionCategory[] = [
  'Python',
  'Machine Learning',
  'Deep Learning',
  'GenAI',
  'LLM',
  'RAG',
  'SQL',
  'APIs',
  'Projects',
  'HR',
];

export const InterviewArena: React.FC<InterviewArenaProps> = ({
  questions,
  onSaveQuestionAnswer,
  onFinishMockInterview,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory | 'All'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuestionDifficulty | 'All'>('All');
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestion | null>(questions[0] || null);
  const [userAnswerInput, setUserAnswerInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMockModal, setShowMockModal] = useState(false);

  // Filtered questions
  const filteredQuestions = questions.filter((q) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchDiff = selectedDifficulty === 'All' || q.difficulty === selectedDifficulty;
    return matchCat && matchDiff;
  });

  const handleSelectQuestion = (q: InterviewQuestion) => {
    setActiveQuestion(q);
    setUserAnswerInput(q.userAnswer || '');
  };

  const handleSubmitAnswer = async () => {
    if (!activeQuestion || !userAnswerInput.trim()) return;

    setIsSubmitting(true);
    try {
      const feedback = await evaluateInterviewAnswer(
        activeQuestion.question,
        activeQuestion.category,
        activeQuestion.modelAnswer,
        userAnswerInput
      );

      sound.playStrikeEarned();
      onSaveQuestionAnswer(activeQuestion.id, userAnswerInput, feedback);
      
      // Update local active question state
      setActiveQuestion({
        ...activeQuestion,
        completed: true,
        userAnswer: userAnswerInput,
        feedback,
      });
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & AI Mock Launcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚔️</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight">
              INTERVIEW ARENA
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Drill high-frequency technical questions. Practice mode gives +10 strikes; AI Mock Interview awards +20.
          </p>
        </div>

        {/* AI Mock Interview CTA */}
        <button
          onClick={() => setShowMockModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4 text-purple-200" />
          <span>Launch AI Mock Interview (5 Qs)</span>
        </button>
      </div>

      {/* Category Pills & Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Arena Grid: Left List / Right Active Question Drill */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Questions List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filteredQuestions.map((q) => {
            const isSelected = activeQuestion?.id === q.id;

            return (
              <div
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/30 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                    : q.completed
                    ? 'bg-slate-900/40 border-slate-800/60 hover:border-slate-700'
                    : 'bg-[#0a0e17] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400 font-semibold">{q.category}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400">{q.difficulty}</span>
                  </div>

                  {q.completed ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                    </span>
                  ) : (
                    <span className="text-amber-400 font-bold">+10 Strikes</span>
                  )}
                </div>

                <p className="text-xs md:text-sm font-semibold text-white line-clamp-2 leading-snug">
                  {q.question}
                </p>

                {q.feedback && (
                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Score: <strong className="text-cyan-400">{q.feedback.score}/10</strong></span>
                    <span className="truncate max-w-[200px]">{q.feedback.overallAssessment}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Question Workspace & Model Answer */}
        <div className="lg:col-span-7">
          {activeQuestion ? (
            <div className="rounded-2xl bg-[#0a0e17] border border-slate-800/90 p-5 md:p-6 shadow-xl sticky top-6 space-y-5">
              {/* Question Header */}
              <div className="pb-4 border-b border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      {activeQuestion.category}
                    </span>
                    <span className="text-slate-400">Difficulty: {activeQuestion.difficulty}</span>
                  </div>
                  <span className="text-amber-400 font-bold font-mono">
                    {activeQuestion.completed ? '✓ Completed' : '+10 Strikes Reward'}
                  </span>
                </div>

                <h2 className="text-base md:text-lg font-bold text-white leading-relaxed">
                  {activeQuestion.question}
                </h2>
              </div>

              {/* Answer Input Area */}
              <div>
                <label className="text-xs font-mono text-slate-400 block mb-1.5">
                  Your Answer:
                </label>
                <textarea
                  rows={4}
                  value={userAnswerInput}
                  onChange={(e) => setUserAnswerInput(e.target.value)}
                  placeholder="Explain your approach, memory model, or algorithmic trade-offs here..."
                  className="w-full p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 leading-relaxed font-sans"
                />

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 font-mono">
                    {userAnswerInput.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                  <button
                    disabled={isSubmitting || !userAnswerInput.trim()}
                    onClick={handleSubmitAnswer}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition-all ${
                      userAnswerInput.trim()
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit Answer (+10 Strikes)'}
                  </button>
                </div>
              </div>

              {/* Evaluation Feedback if completed */}
              {activeQuestion.feedback && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                      EVALUATION SCORE
                    </span>
                    <span className="text-lg font-black font-mono text-cyan-400">
                      {activeQuestion.feedback.score} / 10
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic">
                    "{activeQuestion.feedback.overallAssessment}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div>
                      <span className="text-emerald-400 font-semibold block mb-1 font-mono uppercase">
                        What You Got Right:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {activeQuestion.feedback.strengths.map((s, i) => (
                          <li key={i}>✓ {s}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-amber-400 font-semibold block mb-1 font-mono uppercase">
                        What You Missed:
                      </span>
                      <ul className="space-y-1 text-slate-300">
                        {activeQuestion.feedback.missedPoints.map((m, i) => (
                          <li key={i}>→ {m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Model Answer & Key Points Collapsible / Display */}
              <div className="p-4 rounded-xl bg-[#070b13] border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center gap-1.5 font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>MODEL ANSWER & KEY POINTS</span>
                </div>

                <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                  {activeQuestion.modelAnswer}
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 font-mono uppercase block mb-1 font-semibold">
                    Core Points Interviewers Look For:
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {activeQuestion.keyPoints.map((kp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Select a question to practice.
            </div>
          )}
        </div>
      </div>

      {/* AI Mock Modal */}
      <MockInterviewModal
        isOpen={showMockModal}
        onClose={() => setShowMockModal(false)}
        onFinishMock={onFinishMockInterview}
      />
    </div>
  );
};
