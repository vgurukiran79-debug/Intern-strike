/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  DailyStrikeTask, 
  MissionDay, 
  InternshipApplication, 
  InterviewQuestion, 
  Achievement, 
  FocusSession,
  ApplicationStatus,
  MockInterviewResult
} from './types';
import { storage } from './services/storage';
import { sound } from './services/audio';

// Components
import { Navbar } from './components/common/Navbar';
import { StrikeToast } from './components/common/StrikeToast';
import { NextActionCard } from './components/home/NextActionCard';
import { ReadinessCard } from './components/home/ReadinessCard';
import { StrikeMaintainer } from './components/home/StrikeMaintainer';
import { QuickActions } from './components/home/QuickActions';
import { MissionTimeline } from './components/mission/MissionTimeline';
import { PomodoroRoom } from './components/focus/PomodoroRoom';
import { JobTracker } from './components/jobs/JobTracker';
import { InterviewArena } from './components/interview/InterviewArena';
import { ProfileView } from './components/profile/ProfileView';
import { CareerCoachModal } from './components/coach/CareerCoachModal';
import { WeeklyReviewModal } from './components/review/WeeklyReviewModal';
import { StrikeLog } from './types';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Application Data States (synced with storage)
  const [user, setUser] = useState<UserProfile>(() => storage.getUser());

  const [tasks, setTasks] = useState<DailyStrikeTask[]>(() => storage.getTasks());
  const [mission, setMission] = useState<MissionDay[]>(() => storage.getMission());
  const [applications, setApplications] = useState<InternshipApplication[]>(() => storage.getApplications());
  const [questions, setQuestions] = useState<InterviewQuestion[]>(() => storage.getQuestions());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [sessions, setSessions] = useState<FocusSession[]>(() => storage.getSessions());
  const [strikeLogs, setStrikeLogs] = useState<StrikeLog[]>(() => storage.getStrikeLogs());

  // Focus room parameters when launched from another card
  const [focusTask, setFocusTask] = useState<{ title: string; category: string; minutes: number }>({
    title: 'Set up professional GitHub profile & LinkedIn headline',
    category: 'github',
    minutes: 25,
  });

  // UI Modals & Feedback
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isWeeklyReviewOpen, setIsWeeklyReviewOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [toastData, setToastData] = useState<{ show: boolean; amount: number; message: string }>({
    show: false,
    amount: 10,
    message: 'STRIKE EARNED!',
  });

  // Calculations
  const userLevel = storage.getUserLevel(user.totalStrikes);
  const readiness = storage.calculateReadiness(mission, applications, questions);
  const currentDay = mission.find((d) => !d.completed)?.dayNumber || 1;
  const nextAction = storage.getNextBestAction(tasks, applications, readiness, currentDay);

  // Time-based greeting for Guru Kiran
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Sync state to storage
  useEffect(() => {
    storage.saveUser(user);
  }, [user]);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    storage.saveMission(mission);
  }, [mission]);

  useEffect(() => {
    storage.saveApplications(applications);
  }, [applications]);

  useEffect(() => {
    storage.saveQuestions(questions);
  }, [questions]);

  useEffect(() => {
    storage.saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    storage.saveSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    storage.saveStrikeLogs(strikeLogs);
  }, [strikeLogs]);

  // Trigger celebration toast and sound
  const awardStrikes = (amount: number, message = 'STRIKE EARNED!') => {
    sound.playStrikeEarned();
    setUser((prev) => ({
      ...prev,
      totalStrikes: prev.totalStrikes + amount,
    }));
    setToastData({ show: true, amount, message });
    setTimeout(() => {
      setToastData((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  // Central Strike Logger
  const handleLogStrike = (
    title: string,
    amount: number,
    category: string,
    type: StrikeLog['type'] = 'manual'
  ) => {
    awardStrikes(amount, `+${amount} STRIKES EARNED!`);
    const newLog: StrikeLog = {
      id: `log-${Date.now()}`,
      title,
      amount,
      category,
      timestamp: new Date().toISOString(),
      type,
    };
    setStrikeLogs((prev) => [newLog, ...prev]);

    // Advance streak if first action today
    const todayStr = new Date().toISOString().split('T')[0];
    setUser((prev) => {
      const isNewDay = prev.lastActiveDate !== todayStr || prev.currentStreak === 0;
      const nextStreak = isNewDay ? prev.currentStreak + 1 : prev.currentStreak;
      return {
        ...prev,
        currentStreak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak),
        lastActiveDate: todayStr,
      };
    });
  };

  // Audio mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  // 1. Toggle today's task complete/incomplete
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            handleLogStrike(t.title, t.strikeReward, t.category, 'task');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  // 2. Start Action: switch to Focus Room with pre-populated task
  const handleStartTaskInFocus = (task: DailyStrikeTask) => {
    setFocusTask({
      title: task.title,
      category: task.category,
      minutes: task.estimatedMinutes,
    });
    if (task.actionType === 'interview') {
      setCurrentTab('interview');
    } else if (task.actionType === 'apply') {
      setCurrentTab('jobs');
    } else {
      setCurrentTab('focus');
    }
  };

  // 3. Mark Next Action Complete directly
  const handleCompleteNextAction = (task: DailyStrikeTask) => {
    handleToggleTask(task.id);
  };

  // 4. Focus Session Completed callback
  const handleFocusSessionComplete = (completedTask: boolean, durationMinutes: number) => {
    // 5 strikes for focus block
    let earned = 5;
    if (completedTask) {
      earned += 10;
    }
    handleLogStrike(
      focusTask.title,
      earned,
      focusTask.category,
      'session'
    );

    // Record session
    const newSession: FocusSession = {
      id: `s-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      taskTitle: focusTask.title,
      category: focusTask.category as any,
      durationMinutes,
      completed: completedTask,
    };
    setSessions((prev) => [newSession, ...prev]);

    // Check if matched a task in today's strikes
    if (completedTask) {
      setTasks((prev) =>
        prev.map((t) => (t.title === focusTask.title ? { ...t, completed: true } : t))
      );
    }
  };

  // 5. Toggle 30-day mission subtask
  const handleToggleMissionSubtask = (
    dayNumber: number,
    section: 'learn' | 'practice' | 'build' | 'career'
  ) => {
    setMission((prev) =>
      prev.map((d) => {
        if (d.dayNumber === dayNumber) {
          const currentVal = d[section].completed;
          const nextVal = !currentVal;
          if (nextVal) {
            awardStrikes(10, `DAY ${dayNumber} STRIKE EARNED!`);
          }
          const updatedDay = {
            ...d,
            [section]: { ...d[section], completed: nextVal },
          };
          // If all 4 complete, mark whole day completed
          const allCompleted =
            (section === 'learn' ? nextVal : d.learn.completed) &&
            (section === 'practice' ? nextVal : d.practice.completed) &&
            (section === 'build' ? nextVal : d.build.completed) &&
            (section === 'career' ? nextVal : d.career.completed);
          return { ...updatedDay, completed: allCompleted };
        }
        return d;
      })
    );
  };

  // 6. Save Application
  const handleSaveApplication = (app: InternshipApplication, isNew: boolean) => {
    if (isNew) {
      awardStrikes(20, 'INTERNSHIP APPLICATION SENT!');
      setApplications((prev) => [app, ...prev]);
    } else {
      setApplications((prev) => prev.map((a) => (a.id === app.id ? app : a)));
    }
  };

  // 7. Update Application Status
  const handleUpdateAppStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (newStatus === 'INTERVIEW' && a.status !== 'INTERVIEW') {
            awardStrikes(30, 'INTERVIEW ROUND SECURED! 🔥');
          } else if (newStatus === 'OFFER' && a.status !== 'OFFER') {
            awardStrikes(100, '💼 INTERNSHIP OFFER SECURED!');
          }
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  };

  // 8. Delete Application
  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // 9. Save Interview Answer Evaluation
  const handleSaveQuestionAnswer = (
    questionId: string,
    answer: string,
    feedback: InterviewQuestion['feedback']
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          if (!q.completed) {
            awardStrikes(10, 'INTERVIEW QUESTION MASTERED!');
          }
          return { ...q, completed: true, userAnswer: answer, feedback };
        }
        return q;
      })
    );
  };

  // 10. Finish AI Mock Interview
  const handleFinishMockInterview = (result: MockInterviewResult) => {
    awardStrikes(20, 'AI MOCK INTERVIEW COMPLETED!');
  };

  // 11. Reset intern strike data completely to clean fresh baseline
  const handleResetData = () => {
    storage.resetToDefault();
    setUser(storage.getUser());
    setTasks(storage.getTasks());
    setMission(storage.getMission());
    setApplications(storage.getApplications());
    setQuestions(storage.getQuestions());
    setAchievements(storage.getAchievements());
    setSessions(storage.getSessions());
    setStrikeLogs(storage.getStrikeLogs());
    setToastData({
      show: true,
      amount: 0,
      message: 'DATA RESET: FRESH BASELINE READY',
    });
    setTimeout(() => {
      setToastData((prev) => ({ ...prev, show: false }));
    }, 2800);
  };

  // Compute focus minutes
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayFocusMinutes = sessions
    .filter((s) => s.date === todayDateStr)
    .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalFocusMinutes = sessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Toast Celebration */}
      <StrikeToast
        show={toastData.show}
        amount={toastData.amount}
        message={toastData.message}
      />

      {/* Navigation Shell */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        userLevel={userLevel}
        onOpenCoach={() => setIsCoachOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        currentDay={currentDay}
        applicationsCount={applications.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* TAB 1: HOME DASHBOARD */}
        {currentTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 1. GREETING SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
                  {getGreeting()}, {user.preferredName} 👋
                </h1>
                <p className="text-xs md:text-sm text-slate-400 mt-1 font-medium">
                  Let's get one step closer to your internship.
                </p>
              </div>

              {/* Day in mission tracker pill */}
              <div className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-semibold">
                <span className="text-cyan-400">MISSION DAY {currentDay < 10 ? `0${currentDay}` : currentDay}</span>
                <span className="text-slate-600">/</span>
                <span className="text-slate-400">30 DAYS</span>
              </div>
            </div>

            {/* 2. INTERNSHIP READINESS PROGRESS */}
            <ReadinessCard readiness={readiness} />

            {/* 3. NEXT BEST ACTION (Most visually prominent card) */}
            <NextActionCard
              action={nextAction}
              onStartAction={handleStartTaskInFocus}
              onCompleteAction={handleCompleteNextAction}
            />

            {/* 4. PROPER STRIKE MAINTAINER */}
            <StrikeMaintainer
              user={user}
              userLevel={userLevel}
              tasks={tasks}
              strikeLogs={strikeLogs}
              onToggleTask={handleToggleTask}
              onStartTask={handleStartTaskInFocus}
              onLogStrike={handleLogStrike}
            />

            {/* 6. QUICK ACTIONS STRIP */}
            <div>
              <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">
                COMMAND QUICK ACTIONS
              </div>
              <QuickActions onNavigate={setCurrentTab} />
            </div>
          </div>
        )}

        {/* TAB 2: 30-DAY MISSION */}
        {currentTab === 'mission' && (
          <div className="animate-in fade-in duration-200">
            <MissionTimeline
              mission={mission}
              onToggleSubtask={handleToggleMissionSubtask}
              onStartFocus={(title, category, minutes) => {
                setFocusTask({ title, category, minutes });
                setCurrentTab('focus');
              }}
            />
          </div>
        )}

        {/* TAB 3: FOCUS ROOM */}
        {currentTab === 'focus' && (
          <div className="animate-in fade-in duration-200">
            <PomodoroRoom
              currentTaskTitle={focusTask.title}
              category={focusTask.category}
              onSessionComplete={handleFocusSessionComplete}
              todayFocusMinutes={todayFocusMinutes}
              totalFocusMinutes={totalFocusMinutes}
              dailyGoalHours={user.dailyGoals?.dailyFocusHours || user.dailyGoalHours || 3.0}
              customWorkMinutes={user.dailyGoals?.pomodoroWorkMinutes}
              customBreakMinutes={user.dailyGoals?.pomodoroBreakMinutes}
            />
          </div>
        )}

        {/* TAB 4: INTERNSHIPS TRACKER */}
        {currentTab === 'jobs' && (
          <div className="animate-in fade-in duration-200">
            <JobTracker
              applications={applications}
              onSaveApplication={handleSaveApplication}
              onDeleteApplication={handleDeleteApplication}
              onUpdateStatus={handleUpdateAppStatus}
            />
          </div>
        )}

        {/* TAB 5: INTERVIEW ARENA */}
        {currentTab === 'interview' && (
          <div className="animate-in fade-in duration-200">
            <InterviewArena
              questions={questions}
              onSaveQuestionAnswer={handleSaveQuestionAnswer}
              onFinishMockInterview={handleFinishMockInterview}
            />
          </div>
        )}

        {/* TAB 6: PROFILE & SETTINGS */}
        {currentTab === 'profile' && (
          <div className="animate-in fade-in duration-200">
            <ProfileView
              user={user}
              userLevel={userLevel}
              achievements={achievements}
              onSaveProfile={setUser}
              onResetData={handleResetData}
              isMuted={isMuted}
              onToggleMute={handleToggleMute}
              onOpenWeeklyReview={() => setIsWeeklyReviewOpen(true)}
            />
          </div>
        )}
      </main>

      {/* AI Career Coach Dialog */}
      <CareerCoachModal
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
        user={user}
        readiness={readiness}
        currentDay={currentDay}
      />

      {/* Weekly Review Dialog */}
      <WeeklyReviewModal
        isOpen={isWeeklyReviewOpen}
        onClose={() => setIsWeeklyReviewOpen(false)}
        user={user}
        readiness={readiness}
        applicationsCount={applications.length}
        interviewsCount={applications.filter((a) => a.status === 'INTERVIEW').length}
        totalFocusMinutes={totalFocusMinutes}
      />
    </div>
  );
}
