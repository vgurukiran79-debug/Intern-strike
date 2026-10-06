export type UserLevel = 'Beginner' | 'Learner' | 'Builder' | 'AI Engineer' | 'Internship Ready';

export interface DailyGoals {
  dailyStrikeTarget: number; // e.g. 35 strikes
  dailyFocusHours: number; // e.g. 3.0 hours
  dailyTasksCount: number; // e.g. 4 tasks
  dailyApplicationsTarget: number; // e.g. 2 apps
  dailyQuestionsTarget: number; // e.g. 5 questions
  pomodoroWorkMinutes: number; // e.g. 25
  pomodoroBreakMinutes: number; // e.g. 5
}

export interface UserProfile {
  name: string;
  preferredName: string;
  email: string;
  degree: string;
  branch: string;
  year: string;
  college: string;
  targetRole: string;
  targetLocation: string;
  dailyGoalHours: number;
  missionStartDate: string;
  targetDate: string;
  totalStrikes: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  streakFreezeCount?: number;
  dailyGoals?: DailyGoals;
}

export interface StrikeLog {
  id: string;
  title: string;
  amount: number;
  category: string;
  timestamp: string;
  type?: 'task' | 'session' | 'application' | 'interview' | 'manual';
}

export type TaskCategory = 
  | 'python' 
  | 'ml' 
  | 'genai' 
  | 'projects' 
  | 'interview' 
  | 'applications' 
  | 'github' 
  | 'resume';

export interface DailyStrikeTask {
  id: string;
  title: string;
  category: TaskCategory;
  estimatedMinutes: number;
  strikeReward: number;
  completed: boolean;
  whyDescription: string;
  actionType: 'focus' | 'interview' | 'apply' | 'build' | 'learn';
  relatedJobId?: string;
  dayNumber?: number;
}

export interface MissionDay {
  dayNumber: number;
  title: string;
  theme: string;
  completed: boolean;
  estimatedHours: number;
  totalReward: number;
  learn: {
    description: string;
    completed: boolean;
  };
  practice: {
    description: string;
    completed: boolean;
  };
  build: {
    description: string;
    completed: boolean;
  };
  career: {
    description: string;
    completed: boolean;
  };
}

export type ApplicationStatus = 
  | 'SAVED' 
  | 'APPLIED' 
  | 'SHORTLISTED' 
  | 'INTERVIEW' 
  | 'OFFER' 
  | 'REJECTED';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface InternshipApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  workMode: WorkMode;
  status: ApplicationStatus;
  appliedDate: string;
  deadline?: string;
  interviewDate?: string;
  followUpDate?: string;
  jobUrl?: string;
  recruiterName?: string;
  recruiterContact?: string;
  notes?: string;
  resumeVersion?: string;
  stipend?: string;
}

export type QuestionCategory = 
  | 'Python' 
  | 'Machine Learning' 
  | 'Deep Learning' 
  | 'GenAI' 
  | 'LLM' 
  | 'RAG' 
  | 'SQL' 
  | 'APIs' 
  | 'Projects' 
  | 'HR';

export type QuestionDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InterviewQuestion {
  id: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  question: string;
  modelAnswer: string;
  keyPoints: string[];
  userAnswer?: string;
  feedback?: {
    score: number; // 1-10
    strengths: string[];
    missedPoints: string[];
    overallAssessment: string;
  };
  completed: boolean;
}

export interface MockInterviewResult {
  id: string;
  date: string;
  role: string;
  category: string;
  technicalScore: number; // 0-10
  problemSolvingScore: number;
  communicationScore: number;
  projectScore: number;
  confidenceScore: number;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  nextTopics: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardStrikes: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface FocusSession {
  id: string;
  date: string;
  taskTitle: string;
  category: TaskCategory;
  durationMinutes: number;
  completed: boolean;
}

export interface ReadinessBreakdown {
  python: number;
  ml: number;
  genai: number;
  projects: number;
  github: number;
  resume: number;
  interview: number;
  applications: number;
  overall: number;
}
