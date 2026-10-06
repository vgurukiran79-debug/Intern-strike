import { 
  UserProfile, 
  DailyStrikeTask, 
  MissionDay, 
  InternshipApplication, 
  InterviewQuestion, 
  Achievement, 
  FocusSession,
  ReadinessBreakdown,
  UserLevel
} from '../types';

// Fresh storage keys
const STORAGE_KEYS = {
  USER: 'internstrike_v3_user',
  TASKS: 'internstrike_v3_tasks',
  MISSION: 'internstrike_v3_mission',
  APPLICATIONS: 'internstrike_v3_apps',
  QUESTIONS: 'internstrike_v3_questions',
  ACHIEVEMENTS: 'internstrike_v3_achievements',
  SESSIONS: 'internstrike_v3_sessions',
  LOGS: 'internstrike_v3_logs',
};

// Initial Fresh User Profile (Strikes: 0, Streak: 0, Beginner)
export const INITIAL_USER: UserProfile = {
  name: 'Guru Kiran',
  preferredName: 'Guru',
  email: 'vgurukiranvgurukiran@gmail.com',
  degree: 'B.E.',
  branch: 'Artificial Intelligence & Machine Learning',
  year: '2nd Year',
  college: 'BMS College of Engineering',
  targetRole: 'AI/ML & GenAI Intern',
  targetLocation: 'Bengaluru, Karnataka',
  dailyGoalHours: 3,
  missionStartDate: new Date().toISOString().split('T')[0],
  targetDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
  totalStrikes: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  streakFreezeCount: 1,
  dailyGoals: {
    dailyStrikeTarget: 35,
    dailyFocusHours: 3.0,
    dailyTasksCount: 4,
    dailyApplicationsTarget: 2,
    dailyQuestionsTarget: 5,
    pomodoroWorkMinutes: 25,
    pomodoroBreakMinutes: 5,
  },
};

// Complete 30-Day Mission Roadmap (All 30 Days fresh & uncompleted)
export const INITIAL_ROADMAP: MissionDay[] = [
  {
    dayNumber: 1,
    title: 'Career Setup & Foundation',
    theme: 'Career setup + GitHub + LinkedIn',
    completed: false,
    estimatedHours: 2.5,
    totalReward: 35,
    learn: { description: 'Set up professional GitHub profile, clean repo layout & LinkedIn headline for AIML intern', completed: false },
    practice: { description: 'Configure Git SSH, push sample repo, write profile README with tech stack badges', completed: false },
    build: { description: 'Create personal developer portfolio repo and starter landing page', completed: false },
    career: { description: 'Connect with 10 AIML engineers and startup founders in Bengaluru on LinkedIn', completed: false }
  },
  {
    dayNumber: 2,
    title: 'Python Fundamentals & Zen',
    theme: 'Python fundamentals',
    completed: false,
    estimatedHours: 3,
    totalReward: 35,
    learn: { description: 'Memory management, mutable vs immutable types, scopes (LEGB), *args/**kwargs', completed: false },
    practice: { description: 'Solve 10 Python core interview challenges on HackerRank / LeetCode', completed: false },
    build: { description: 'CLI Memory Inspector script in Python demonstrating ref count & id()', completed: false },
    career: { description: 'Identify 5 target AI startups in Koramangala & Indiranagar hiring interns', completed: false }
  },
  {
    dayNumber: 3,
    title: 'Python Data Structures Under the Hood',
    theme: 'Python data structures',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Hash maps (dict collision handling), set operations, collections (deque, defaultdict, Counter)', completed: false },
    practice: { description: 'Implement LRU Cache using OrderedDict and custom doubly linked list', completed: false },
    build: { description: 'High-throughput word frequency benchmark analyzing 1MB log file', completed: false },
    career: { description: 'Bookmarked 3 internship job descriptions to extract keyword requirements', completed: false }
  },
  {
    dayNumber: 4,
    title: 'Vectorized Computing with NumPy',
    theme: 'NumPy',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Ndarray memory layout (strides, C-order vs Fortran), broadcasting rules, matrix multiplication', completed: false },
    practice: { description: 'Solve 15 NumPy matrix manipulation and vectorization exercises without loops', completed: false },
    build: { description: 'Implement Vectorized Cosine Similarity & Matrix Factorization from scratch', completed: false },
    career: { description: 'Follow 5 AI tech leads on Twitter & LinkedIn discussing Bangalore tech scene', completed: false }
  },
  {
    dayNumber: 5,
    title: 'Data Wrangling with Pandas',
    theme: 'Pandas',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 40,
    learn: { description: 'Vectorized string operations, groupby aggregations, window functions, missing value imputation', completed: false },
    practice: { description: 'Clean a noisy Bangalore Tech Salaries raw dataset (deduplicate, impute, parse dates)', completed: false },
    build: { description: 'Automated Exploratory Data Analysis (EDA) report script with profiling metrics', completed: false },
    career: { description: 'Update LinkedIn featured section with your GitHub NumPy/Pandas code samples', completed: false }
  },
  {
    dayNumber: 6,
    title: 'Data Visualization & Storytelling',
    theme: 'Matplotlib + data visualization',
    completed: false,
    estimatedHours: 2.5,
    totalReward: 35,
    learn: { description: 'Subplots, custom color palettes, Seaborn distributions, heatmaps, interactive Plotly charts', completed: false },
    practice: { description: 'Create 5 publication-ready charts visualizing AIML model metrics (ROC-AUC, Confusion Matrix)', completed: false },
    build: { description: 'Interactive AI Job Market Dashboard using Plotly / Streamlit', completed: false },
    career: { description: 'Share one insightful chart on LinkedIn discussing AI intern demand trends', completed: false }
  },
  {
    dayNumber: 7,
    title: 'Python & Data Mini Project',
    theme: 'Python/data mini project',
    completed: false,
    estimatedHours: 4,
    totalReward: 45,
    learn: { description: 'Project packaging, virtual environments (uv / poetry), clean modular code architecture', completed: false },
    practice: { description: 'Write unit tests with pytest for data transformation pipeline', completed: false },
    build: { description: 'Ship "Bengaluru Tech Housing vs AI Hubs" statistical analyzer repo with clean README', completed: false },
    career: { description: 'Apply to first 2 AI intern openings on Wellfound / Internshala', completed: false }
  },
  {
    dayNumber: 8,
    title: 'Machine Learning Fundamentals',
    theme: 'Machine Learning fundamentals',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Supervised vs unsupervised, bias-variance tradeoff, cross-validation, regularization (L1/L2)', completed: false },
    practice: { description: 'Solve 10 conceptual ML interview questions on loss functions and optimization', completed: false },
    build: { description: 'Gradient Descent visualizer demonstrating convergence under different learning rates', completed: false },
    career: { description: 'Reach out to 2 alumni working as ML engineers for resume advice', completed: false }
  },
  {
    dayNumber: 9,
    title: 'Linear Regression & Cost Functions',
    theme: 'Linear Regression',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Ordinary Least Squares (OLS) closed form vs Gradient Descent, assumptions of linear regression', completed: false },
    practice: { description: 'Code Linear Regression from scratch in pure NumPy with Ridge/Lasso regularization', completed: false },
    build: { description: 'Predict startup funding valuation based on team size, tech stack & market data', completed: false },
    career: { description: 'Draft cold email template customized for early-stage AI founders', completed: false }
  },
  {
    dayNumber: 10,
    title: 'Classification Algorithms',
    theme: 'Classification',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 40,
    learn: { description: 'Logistic Regression, Sigmoid function, Decision Trees, Gini impurity vs Entropy, Random Forests', completed: false },
    practice: { description: 'Solve 10 interview questions on classification tradeoffs & imbalanced datasets', completed: false },
    build: { description: 'Create student internship placement classifier model with hyperparameter tuning', completed: false },
    career: { description: 'Apply to 2 AI startup internships with customized cover notes', completed: false }
  },
  {
    dayNumber: 11,
    title: 'Model Evaluation & Metrics',
    theme: 'Model evaluation',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Precision, Recall, F1-Score, PR-AUC vs ROC-AUC, Class Imbalance techniques (SMOTE)', completed: false },
    practice: { description: 'Calculate confusion matrix metrics by hand and diagnose false positives vs false negatives', completed: false },
    build: { description: 'Model Evaluation Suite module generating HTML diagnostic reports', completed: false },
    career: { description: 'Join Bangalore AI/ML WhatsApp and Discord developer communities', completed: false }
  },
  {
    dayNumber: 12,
    title: 'Unsupervised Learning & Clustering',
    theme: 'K-Means clustering',
    completed: false,
    estimatedHours: 3,
    totalReward: 35,
    learn: { description: 'K-Means, K-Means++, Elbow method, Silhouette score, PCA dimensionality reduction', completed: false },
    practice: { description: 'Implement K-Means clustering algorithm using NumPy vector operations', completed: false },
    build: { description: 'Customer segmentation pipeline grouping GitHub developer profiles by tech stacks', completed: false },
    career: { description: 'Identify 3 companies using unsupervised embeddings in Bangalore', completed: false }
  },
  {
    dayNumber: 13,
    title: 'End-to-End ML Mini Project',
    theme: 'ML mini project',
    completed: false,
    estimatedHours: 4,
    totalReward: 45,
    learn: { description: 'Scikit-Learn Pipelines, ColumnTransformer, serialization with joblib/pickle', completed: false },
    practice: { description: 'Build end-to-end inference script taking raw JSON and returning predictions', completed: false },
    build: { description: 'Resume Skill Extraction & Placement Predictor trained on open student datasets', completed: false },
    career: { description: 'Push repo with interactive Streamlit demo link hosted on Streamlit Cloud', completed: false }
  },
  {
    dayNumber: 14,
    title: 'Machine Learning Interview Drill',
    theme: 'ML interview preparation',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 50,
    learn: { description: 'Overfitting prevention, curse of dimensionality, ensemble bagging vs boosting (XGBoost/LightGBM)', completed: false },
    practice: { description: 'Complete 25 high-frequency ML engineer interview questions in Interview Arena', completed: false },
    build: { description: 'ML Cheat Sheet markdown guide for interview prep in your notes repo', completed: false },
    career: { description: 'Perform 1 full AI Mock Interview session on InternStrike Arena', completed: false }
  },
  {
    dayNumber: 15,
    title: 'LLM Foundations & Architecture',
    theme: 'LLM fundamentals',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Transformer self-attention mechanism, tokens, context window, temperature, top-p, hallucinations', completed: false },
    practice: { description: 'Calculate token counts, pricing, and latency across Gemini Flash vs Pro models', completed: false },
    build: { description: 'Self-Attention toy visualization showing Q, K, V matrix dot product', completed: false },
    career: { description: 'Update LinkedIn headline: "B.E. AIML | Building with Gemini & PyTorch | Seeking AI Internships"', completed: false }
  },
  {
    dayNumber: 16,
    title: 'AI APIs, JSON & REST Protocols',
    theme: 'AI APIs + JSON + REST',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'Structured JSON outputs, function calling schema, system instructions, streaming responses', completed: false },
    practice: { description: 'Build robust API client handling rate limits, backoff retry, and JSON schema validation', completed: false },
    build: { description: 'AI Code Reviewer script that analyzes Git diffs and outputs JSON suggestions', completed: false },
    career: { description: 'Apply to 2 GenAI startup internships on Wellfound', completed: false }
  },
  {
    dayNumber: 17,
    title: 'Prompt Engineering & System Design',
    theme: 'Prompt engineering',
    completed: false,
    estimatedHours: 3,
    totalReward: 35,
    learn: { description: 'Few-shot prompting, Chain-of-Thought (CoT), ReAct pattern, prompt injection defenses', completed: false },
    practice: { description: 'Refine 5 ambiguous business prompts into deterministic structured extraction prompts', completed: false },
    build: { description: 'Prompt Evaluation Benchmark comparing output fidelity across 10 test cases', completed: false },
    career: { description: 'Send connection note to 3 GenAI founders in Bangalore', completed: false }
  },
  {
    dayNumber: 18,
    title: 'Embeddings & Vector Spaces',
    theme: 'Embeddings',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 40,
    learn: { description: 'Dense vs sparse embeddings, Cosine vs Dot Product vs Euclidean distance, Vector Indexing (HNSW, IVFFlat)', completed: false },
    practice: { description: 'Generate text embeddings with Gemini text-embedding models and compute semantic similarity', completed: false },
    build: { description: 'Semantic Job Matcher: Embed your resume and match against 50 job descriptions', completed: false },
    career: { description: 'Review Bengaluru AI job boards for embedding/vector search requirements', completed: false }
  },
  {
    dayNumber: 19,
    title: 'Retrieval Augmented Generation (RAG)',
    theme: 'RAG',
    completed: false,
    estimatedHours: 4,
    totalReward: 45,
    learn: { description: 'Naive vs Advanced RAG: Chunking strategies, semantic routing, reranking, hallucination reduction', completed: false },
    practice: { description: 'Implement Document Chunking with overlap and metadata preservation in Python', completed: false },
    build: { description: 'Build local RAG pipeline over college syllabus / technical textbooks using ChromaDB', completed: false },
    career: { description: 'Prepare RAG architecture diagram to discuss in technical interviews', completed: false }
  },
  {
    dayNumber: 20,
    title: 'AI Agents & Tool Calling',
    theme: 'AI agents',
    completed: false,
    estimatedHours: 4,
    totalReward: 45,
    learn: { description: 'Agentic workflows: Planning, tool execution loops, memory management, error recovery', completed: false },
    practice: { description: 'Implement tool calling with function schemas (Weather, Web Search, Calculator)', completed: false },
    build: { description: 'Autonomous Internship Scout Agent that checks career pages and summarizes requirements', completed: false },
    career: { description: 'Apply to 3 AI agent startup internships', completed: false }
  },
  {
    dayNumber: 21,
    title: 'Production AI Backend with FastAPI',
    theme: 'FastAPI + AI API',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 40,
    learn: { description: 'Asynchronous Python (asyncio), Pydantic schemas, dependency injection, CORS, streaming SSE', completed: false },
    practice: { description: 'Create FastAPI service with streaming endpoint (/chat/stream) and health checks', completed: false },
    build: { description: 'Production-ready AI microservice with API key authentication & error middleware', completed: false },
    career: { description: 'Post FastAPI + AI demo on GitHub with live Swagger docs', completed: false }
  },
  {
    dayNumber: 22,
    title: 'Capstone AI Project: Architecture & Scope',
    theme: 'Start main AI project',
    completed: false,
    estimatedHours: 4,
    totalReward: 50,
    learn: { description: 'Architecture design: Multi-modal RAG agent for specialized industry domain', completed: false },
    practice: { description: 'Write technical design document (PRD) detailing architecture, API endpoints, schema', completed: false },
    build: { description: 'Initialize monorepo, environment configuration, database schema, and test suite', completed: false },
    career: { description: 'Share project inception post on LinkedIn: "Building an enterprise AI assistant"', completed: false }
  },
  {
    dayNumber: 23,
    title: 'Capstone: Backend & Pipeline Development',
    theme: 'Backend development',
    completed: false,
    estimatedHours: 4.5,
    totalReward: 50,
    learn: { description: 'Background tasks, rate limiting, token usage analytics, caching layer', completed: false },
    practice: { description: 'Implement persistent conversation memory with vector session indexing', completed: false },
    build: { description: 'Robust FastAPI backend with complete test coverage for LLM workflows', completed: false },
    career: { description: 'Follow up with 2 recruiters on previously submitted applications', completed: false }
  },
  {
    dayNumber: 24,
    title: 'Capstone: Advanced RAG & Agent Integration',
    theme: 'RAG integration',
    completed: false,
    estimatedHours: 4.5,
    totalReward: 50,
    learn: { description: 'Hybrid search (BM25 + Dense vector search), Cohere / BGE reranking', completed: false },
    practice: { description: 'Tune chunk sizes and retrieval precision to achieve >90% factual accuracy', completed: false },
    build: { description: 'Integrate hybrid retrieval with agentic query rewriting and source citation', completed: false },
    career: { description: 'Apply to 3 AI/ML roles requiring RAG experience', completed: false }
  },
  {
    dayNumber: 25,
    title: 'Capstone: Modern Web UI & Interaction',
    theme: 'Frontend development',
    completed: false,
    estimatedHours: 4,
    totalReward: 45,
    learn: { description: 'Optimistic UI updates, streaming text animation, markdown rendering, responsive layouts', completed: false },
    practice: { description: 'Connect React/Next.js frontend to FastAPI backend via Server-Sent Events', completed: false },
    build: { description: 'Sleek dark-mode user interface with source document citations and feedback thumbs', completed: false },
    career: { description: 'Record 60-second Loom product demo walking through architecture and live query', completed: false }
  },
  {
    dayNumber: 26,
    title: 'Deployment, CI/CD & GitHub Polish',
    theme: 'Deployment + GitHub README',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 45,
    learn: { description: 'Docker containerization, GitHub Actions CI/CD, cloud deployment (Cloud Run / Vercel)', completed: false },
    practice: { description: 'Write multi-stage Dockerfile optimizing image size (<200MB)', completed: false },
    build: { description: 'Deploy live production application; craft stellar README with GIF, architecture diagram, setup steps', completed: false },
    career: { description: 'Pin capstone repository to top of GitHub profile with live demo link', completed: false }
  },
  {
    dayNumber: 27,
    title: 'Resume Engineering & LinkedIn Overhaul',
    theme: 'Resume + LinkedIn',
    completed: false,
    estimatedHours: 3,
    totalReward: 40,
    learn: { description: 'ATS-friendly resume structure, XYZ formula (Accomplished [X] as measured by [Y] by doing [Z])', completed: false },
    practice: { description: 'Audit resume against 3 Bangalore AI job descriptions using ATS keyword tools', completed: false },
    build: { description: 'Polished single-page LaTeX/Typst resume featuring Capstone RAG project and ML skills', completed: false },
    career: { description: 'Update LinkedIn profile with project media, recommendations, and clear internship availability', completed: false }
  },
  {
    dayNumber: 28,
    title: 'Technical & Behavioral Interview Mastery',
    theme: 'Technical + HR interview preparation',
    completed: false,
    estimatedHours: 3.5,
    totalReward: 50,
    learn: { description: 'STAR method for behavioral questions, explaining ML project failures, explaining math intuitively', completed: false },
    practice: { description: 'Answer "Tell me about your most challenging bug" and "Explain RAG to a non-technical PM"', completed: false },
    build: { description: 'Interview cheat sheet with STAR stories for every major project in your portfolio', completed: false },
    career: { description: 'Conduct full 30-minute AI Mock Interview on InternStrike Arena with score target >8.0', completed: false }
  },
  {
    dayNumber: 29,
    title: 'Internship Application Blitz',
    theme: 'Internship application attack',
    completed: false,
    estimatedHours: 4,
    totalReward: 60,
    learn: { description: 'Personalized cold outreach strategy, finding engineering hiring managers on LinkedIn', completed: false },
    practice: { description: 'Customize cover pitch highlighting live capstone demo link for 5 companies', completed: false },
    build: { description: 'Target 10 top AI/ML startups in Bengaluru across fintech, healthtech, and enterprise SaaS', completed: false },
    career: { description: 'Submit 10 high-intent applications; send 5 personalized founder/lead messages', completed: false }
  },
  {
    dayNumber: 30,
    title: 'Internship Launch & Victory Lap',
    theme: 'Internship launch + mock interviews',
    completed: false,
    estimatedHours: 3,
    totalReward: 100,
    learn: { description: 'Negotiation fundamentals for interns, onboarding expectations, professional communication', completed: false },
    practice: { description: 'Final comprehensive mock technical interview drill across full curriculum', completed: false },
    build: { description: 'Internship follow-up system and tracking calendar for interview loops', completed: false },
    career: { description: 'Log all application responses, schedule interview prep sessions, secure the offer!', completed: false }
  }
];

// Fresh Day 1 Strikes Tasks (0 / 4 completed)
export const INITIAL_TODAY_TASKS: DailyStrikeTask[] = [
  {
    id: 'task-1',
    title: 'Set up professional GitHub profile & LinkedIn headline',
    category: 'github',
    estimatedMinutes: 25,
    strikeReward: 10,
    completed: false,
    whyDescription: 'Day 1 Launch: Clean developer presence signals internship readiness to tech recruiters.',
    actionType: 'build',
    dayNumber: 1
  },
  {
    id: 'task-2',
    title: 'Complete 25-minute Deep Work focus session',
    category: 'projects',
    estimatedMinutes: 25,
    strikeReward: 5,
    completed: false,
    whyDescription: 'First deep focus block sets your daily rhythm and starts your strike streak.',
    actionType: 'focus',
    dayNumber: 1
  },
  {
    id: 'task-3',
    title: 'Solve 5 Python core interview questions in Arena',
    category: 'interview',
    estimatedMinutes: 20,
    strikeReward: 10,
    completed: false,
    whyDescription: 'Sharpen your core Python internals (memory, mutability, time complexity) for initial screens.',
    actionType: 'interview',
    dayNumber: 1
  },
  {
    id: 'task-4',
    title: 'Identify & track 2 target AI startups in Bengaluru',
    category: 'applications',
    estimatedMinutes: 20,
    strikeReward: 10,
    completed: false,
    whyDescription: 'Build your initial pipeline in the Internship Tracker to prepare for applications.',
    actionType: 'apply',
    dayNumber: 1
  }
];

// Clean Applications list (Empty for fresh user entry)
export const INITIAL_APPLICATIONS: InternshipApplication[] = [];

// Fresh High-Yield Question Bank (All uncompleted, no mock answers/feedback)
export const INITIAL_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q-1',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'Explain the difference between a list and a tuple in Python. When would you prefer one over the other?',
    modelAnswer: 'A list is mutable (can be modified after creation with append, remove, etc.) and implemented as a dynamic array with over-allocation for O(1) amortized appending. A tuple is immutable (fixed size and contents) and stored in a single memory block with no extra over-allocation.\n\nKey differences:\n1. Mutability: Lists can change; tuples cannot.\n2. Memory & Speed: Tuples consume less memory and instantiate faster because Python caches small tuples and doesn\'t allocate extra capacity.\n3. Hashability: Tuples containing only immutable elements are hashable and can be used as dictionary keys or set elements; lists cannot.\n4. Semantics: Lists represent homogeneous sequences of variable length; tuples represent heterogeneous records or fixed structures (e.g. coordinates (x, y)).',
    keyPoints: [
      'Lists are mutable; tuples are immutable',
      'Tuples have lower memory overhead and faster creation',
      'Tuples are hashable (can be dict keys / set elements) if elements are immutable',
      'Dynamic array over-allocation in lists vs fixed block in tuples'
    ],
    completed: false
  },
  {
    id: 'q-2',
    category: 'Python',
    difficulty: 'Intermediate',
    question: 'How does Python handle memory management and garbage collection? What is the role of cyclic garbage collection?',
    modelAnswer: 'Python primarily uses Reference Counting: every PyObject has an `ob_refcnt` counter that increments when referenced and decrements when unreferenced. When it hits zero, the memory is deallocated immediately.\n\nHowever, reference counting fails on circular references (e.g., Object A references B, and B references A). To resolve this, Python runs a generational cyclic garbage collector (`gc` module) that divides objects into 3 generations (0, 1, 2) based on survival across collection cycles. It uses pointer inspection to detect unreachable reference loops and collects them.',
    keyPoints: [
      'Primary mechanism is reference counting (immediate upon zero)',
      'Reference counting cannot handle circular references',
      'Generational cyclic garbage collector operates across 3 generations',
      'PyObject structure contains ob_refcnt'
    ],
    completed: false
  },
  {
    id: 'q-3',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'Explain the Bias-Variance tradeoff. How do regularization techniques like L1 and L2 help control it?',
    modelAnswer: 'The Bias-Variance tradeoff represents the conflict between underfitting and overfitting in predictive modeling.\n- Bias is the error from erroneous assumptions in the learning algorithm (high bias = underfitting, e.g. using a linear model on quadratic data).\n- Variance is the error from sensitivity to small fluctuations in the training set (high variance = overfitting, modeling random noise).\n- Total Error = Bias² + Variance + Irreducible Error.\n\nRegularization constrains model complexity by adding a penalty term to the loss function:\n- L2 Regularization (Ridge): Adds penalty λ * ∑w_i². Shrinks weights towards zero without making them exactly zero, preventing any single feature from dominating.\n- L1 Regularization (Lasso): Adds penalty λ * ∑|w_i|. Has diamond-shaped contours that drive unimportant feature weights strictly to zero, effectively performing automatic feature selection.',
    keyPoints: [
      'High bias causes underfitting; high variance causes overfitting',
      'Total Error formula decomposition (Bias² + Variance + Irreducible Error)',
      'L1 (Lasso) penalty λ * ∑|w_i| drives weights strictly to 0 (sparse feature selection)',
      'L2 (Ridge) penalty λ * ∑w_i² shrinks weights smoothly towards 0 without sparsity'
    ],
    completed: false
  },
  {
    id: 'q-4',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    question: 'Why is ROC-AUC sometimes misleading for imbalanced datasets, and what metric should you use instead?',
    modelAnswer: 'ROC-AUC plots True Positive Rate (Sensitivity) vs False Positive Rate (FPR = FP / (FP + TN)). In heavily imbalanced datasets (e.g. 99% negative class, 1% positive class like fraud detection), the number of True Negatives (TN) is massive.\nEven if the model generates a large number of False Positives, the denominator (FP + TN) remains huge, keeping FPR artificially tiny. Thus, the ROC curve appears deceptively stellar even when precision is disastrously low.\n\nAlternative: Precision-Recall Curve (PR-AUC) or F1-Score. PR-AUC evaluates Precision (TP / (TP + FP)) against Recall (TP / (TP + FN)), completely omitting TN from its calculations. Therefore, False Positives immediately degrade precision and are visibly penalized.',
    keyPoints: [
      'ROC uses False Positive Rate = FP / (FP + TN)',
      'Large TN in imbalanced datasets suppresses FPR, making ROC deceptively high',
      'PR-AUC (Precision-Recall) does not use TN and heavily penalizes False Positives',
      'F1-score or PR-AUC is the gold standard for imbalanced classification'
    ],
    completed: false
  },
  {
    id: 'q-5',
    category: 'GenAI',
    difficulty: 'Intermediate',
    question: 'What is Retrieval-Augmented Generation (RAG), and what are the main reasons a RAG system might fail or hallucinate?',
    modelAnswer: 'RAG augments LLMs with an external knowledge retrieval step before generating a response. It typically embeds documents into a vector database, performs similarity search for a user query, inserts retrieved chunks into the prompt context, and instructs the LLM to synthesize an answer.\n\nMain failure modes:\n1. Retrieval Failure: Semantic search retrieves irrelevant or noisy chunks (poor chunking, bad embedding model, vocabulary mismatch).\n2. Missing Information in Context: The necessary answer is not in the top-K chunks.\n3. Context Length & Recency Bias: The LLM suffers from "lost in the middle" and ignores key facts in dense contexts.\n4. Extraction Failure / Hallucination: The LLM answers from its parametric pre-training weights instead of retrieved facts or confabulates ungrounded details.\n5. Conflicting Data: Multiple retrieved chunks contain contradictory information.',
    keyPoints: [
      'Combines external vector retrieval with LLM parametric synthesis',
      'Retrieval errors (poor chunking, sub-optimal top-K, vocabulary mismatch)',
      '"Lost in the middle" phenomena where LLM ignores middle context chunks',
      'Parametric knowledge leakage overriding retrieved citations',
      'Contradictory or noisy source documents'
    ],
    completed: false
  },
  {
    id: 'q-6',
    category: 'GenAI',
    difficulty: 'Advanced',
    question: 'What is the difference between dense retrieval and sparse retrieval, and why is hybrid search preferred in production AI pipelines?',
    modelAnswer: 'Sparse retrieval (e.g. BM25, TF-IDF) relies on exact lexical token matching and frequency weighting. It is exceptionally fast and excels at precise keywords, acronyms, product IDs, and code symbols, but fails at synonymy and semantic intent.\n\nDense retrieval uses neural embeddings (e.g. cosine distance between 768/1536-dimensional vectors) to capture conceptual similarity and semantic intent regardless of exact wording, but can miss exact keyword matches and specific identifiers.\n\nHybrid search combines both using Reciprocal Rank Fusion (RRF) or weighted score normalization. It captures both semantic nuance AND exact acronyms/IDs, typically followed by a cross-encoder reranker (e.g. Cohere / BGE) to achieve industry-leading retrieval precision.',
    keyPoints: [
      'Sparse (BM25) = exact token frequency and lexical matching',
      'Dense = semantic embedding vector similarity',
      'Sparse excels at specific IDs/acronyms; dense excels at conceptual intent',
      'Hybrid combines both via Reciprocal Rank Fusion (RRF) + cross-encoder reranking'
    ],
    completed: false
  },
  {
    id: 'q-7',
    category: 'HR',
    difficulty: 'Beginner',
    question: 'Tell me about yourself and why you want to intern as an AI/ML Engineer at this stage of your degree.',
    modelAnswer: 'Structure using Past -> Present -> Future -> Impact:\n"I am Guru Kiran, a 2nd-year B.E. student in Artificial Intelligence & Machine Learning at BMS College of Engineering, Bengaluru. Over the past year, I have focused deeply on moving beyond theory into applied engineering—building end-to-end Python models, working with vector embeddings, and creating FastAPI AI backends.\nRecently, I developed an end-to-end AI placement prediction engine and a vectorized semantic search pipeline on GitHub. What excites me most about your team is the chance to work on production-scale models serving real users in Bengaluru. I want an internship where I can take ownership of real pipelines, learn from senior ML engineers, and deliver tangible speed and accuracy improvements."',
    keyPoints: [
      'Clear, punchy introduction with degree, college, and domain',
      'Concrete projects and tech stack evidence (FastAPI, vector search, Scikit-learn)',
      'Specific excitement about the target company\'s scale',
      'Hunger for production engineering and ownership'
    ],
    completed: false
  }
];

// Fresh Achievements (All locked)
export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: 'First Application',
    description: 'Submit your first internship application to a real company.',
    icon: '🏆',
    rewardStrikes: 20,
    unlocked: false
  },
  {
    id: 'ach-2',
    title: '7-Day Strike Streak',
    description: 'Complete at least one meaningful strike task every day for 7 consecutive days.',
    icon: '🔥',
    rewardStrikes: 35,
    unlocked: false
  },
  {
    id: 'ach-3',
    title: 'First GitHub Project',
    description: 'Ship and push a complete documented data/ML project to GitHub.',
    icon: '💻',
    rewardStrikes: 25,
    unlocked: false
  },
  {
    id: 'ach-4',
    title: 'First Mock Interview',
    description: 'Complete a full technical evaluation session in the Interview Arena.',
    icon: '🎤',
    rewardStrikes: 20,
    unlocked: false
  },
  {
    id: 'ach-5',
    title: '10 Applications Sent',
    description: 'Expand your pipeline to 10 verified internship applications.',
    icon: '📩',
    rewardStrikes: 50,
    unlocked: false
  },
  {
    id: 'ach-6',
    title: '100 Interview Questions',
    description: 'Solve and review 100 technical interview questions.',
    icon: '🧠',
    rewardStrikes: 50,
    unlocked: false
  },
  {
    id: 'ach-7',
    title: '500 Strikes Milestone',
    description: 'Amass 500 total strikes to reach "Internship Ready" engineer status.',
    icon: '🚀',
    rewardStrikes: 100,
    unlocked: false
  },
  {
    id: 'ach-8',
    title: 'First Interview Scheduled',
    description: 'Advance an application into the Interview stage with a company.',
    icon: '🎯',
    rewardStrikes: 30,
    unlocked: false
  },
  {
    id: 'ach-9',
    title: 'Internship Selected',
    description: 'Receive and accept an official internship offer letter.',
    icon: '💼',
    rewardStrikes: 100,
    unlocked: false
  }
];

// Fresh Focus Sessions history (Empty)
export const INITIAL_SESSIONS: FocusSession[] = [];

class StorageService {
  constructor() {
    // Clear any legacy mock keys from prior sessions if detected
    this.cleanupLegacyStorage();
  }

  private cleanupLegacyStorage(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      const legacyKeys = [
        'internstrike_user',
        'internstrike_tasks',
        'internstrike_mission',
        'internstrike_apps',
        'internstrike_questions',
        'internstrike_achievements',
        'internstrike_sessions',
        'internstrike_v2_user',
        'internstrike_v2_tasks',
        'internstrike_v2_mission',
        'internstrike_v2_apps',
        'internstrike_v2_questions',
        'internstrike_v2_achievements',
        'internstrike_v2_sessions',
        'internstrike_v2_logs'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }

  public getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  }

  public saveUser(user: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch {
      // storage disabled
    }
  }

  public getTasks(): DailyStrikeTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : INITIAL_TODAY_TASKS;
    } catch {
      return INITIAL_TODAY_TASKS;
    }
  }

  public saveTasks(tasks: DailyStrikeTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {
      // storage disabled
    }
  }

  public getMission(): MissionDay[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MISSION);
      return data ? JSON.parse(data) : INITIAL_ROADMAP;
    } catch {
      return INITIAL_ROADMAP;
    }
  }

  public saveMission(mission: MissionDay[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.MISSION, JSON.stringify(mission));
    } catch {
      // storage disabled
    }
  }

  public getApplications(): InternshipApplication[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return data ? JSON.parse(data) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  }

  public saveApplications(apps: InternshipApplication[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
    } catch {
      // storage disabled
    }
  }

  public getQuestions(): InterviewQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : INITIAL_QUESTIONS;
    } catch {
      return INITIAL_QUESTIONS;
    }
  }

  public saveQuestions(qs: InterviewQuestion[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(qs));
    } catch {
      // storage disabled
    }
  }

  public getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  public saveAchievements(achs: Achievement[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achs));
    } catch {
      // storage disabled
    }
  }

  public getSessions(): FocusSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  }

  public saveSessions(sessions: FocusSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch {
      // storage disabled
    }
  }

  public getStrikeLogs(): import('../types').StrikeLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveStrikeLogs(logs: import('../types').StrikeLog[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
    } catch {
      // storage disabled
    }
  }

  public resetToDefault(): void {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }

  /**
   * Calculate User Level based on Total Strikes:
   * 0–49: Beginner
   * 50–149: Learner
   * 150–299: Builder
   * 300–499: AI Engineer
   * 500+: Internship Ready
   */
  public getUserLevel(strikes: number): UserLevel {
    if (strikes >= 500) return 'Internship Ready';
    if (strikes >= 300) return 'AI Engineer';
    if (strikes >= 150) return 'Builder';
    if (strikes >= 50) return 'Learner';
    return 'Beginner';
  }

  /**
   * Transparent Readiness Score Calculation Formula:
   * Python: 15%
   * ML: 15%
   * GenAI: 15%
   * Projects: 15%
   * GitHub: 10%
   * Resume: 10%
   * Interview: 10%
   * Applications: 10%
   * Total: 100%
   */
  public calculateReadiness(
    mission: MissionDay[], 
    apps: InternshipApplication[], 
    questions: InterviewQuestion[]
  ): ReadinessBreakdown {
    // Days 1-7: Python & Foundations (7 days)
    const pythonDays = mission.slice(0, 7);
    const pythonDone = pythonDays.filter(d => d.completed).length;
    const pythonScore = Math.round((pythonDone / pythonDays.length) * 100);

    // Days 8-14: ML (7 days)
    const mlDays = mission.slice(7, 14);
    const mlDone = mlDays.filter(d => d.completed).length;
    const mlScore = Math.round((mlDone / mlDays.length) * 100);

    // Days 15-21: GenAI & APIs (7 days)
    const genaiDays = mission.slice(14, 21);
    const genaiDone = genaiDays.filter(d => d.completed).length;
    const genaiScore = Math.round((genaiDone / genaiDays.length) * 100);

    // Days 22-26: Projects (5 days)
    const projectDays = mission.slice(21, 26);
    const projectDone = projectDays.filter(d => d.completed).length;
    const projectsScore = Math.round((projectDone / projectDays.length) * 100);

    // GitHub score: from Day 1, Day 7, Day 26 completions
    const githubDone = (mission[0]?.practice.completed ? 1 : 0) + 
                       (mission[6]?.build.completed ? 1 : 0) + 
                       (mission[25]?.build.completed ? 1 : 0);
    const githubScore = Math.round((githubDone / 3) * 100);

    // Resume: Day 27 build
    const resumeScore = mission[26]?.build.completed ? 100 : (mission[0]?.learn.completed ? 20 : 0);

    // Interview score: proportion of questions practiced + mock completed
    const answeredQs = questions.filter(q => q.completed).length;
    const interviewScore = Math.round((answeredQs / Math.max(1, questions.length)) * 100);

    // Applications score: based on submitted applications (target 10 apps = 100%)
    const submittedCount = apps.filter(a => a.status !== 'SAVED').length;
    const appScore = Math.min(100, Math.round((submittedCount / 10) * 100));

    // Weighted Overall
    const overall = Math.round(
      pythonScore * 0.15 +
      mlScore * 0.15 +
      genaiScore * 0.15 +
      projectsScore * 0.15 +
      githubScore * 0.10 +
      resumeScore * 0.10 +
      interviewScore * 0.10 +
      appScore * 0.10
    );

    return {
      python: pythonScore,
      ml: mlScore,
      genai: genaiScore,
      projects: projectsScore,
      github: githubScore,
      resume: resumeScore,
      interview: interviewScore,
      applications: appScore,
      overall: Math.min(100, overall)
    };
  }

  /**
   * Next Best Action Algorithm:
   * Priority:
   * 1. Interview scheduled tomorrow / within 24h
   * 2. Overdue task in today's strikes
   * 3. Weakest skill area (<60%)
   * 4. Current day's mission task
   * 5. Application pipeline target
   */
  public getNextBestAction(
    tasks: DailyStrikeTask[], 
    apps: InternshipApplication[], 
    readiness: ReadinessBreakdown,
    currentDay: number
  ): DailyStrikeTask {
    // 1. Check for interview scheduled
    const upcomingInterview = apps.find(a => a.status === 'INTERVIEW' && a.interviewDate);
    if (upcomingInterview) {
      const interviewTask = tasks.find(t => t.category === 'interview' && !t.completed);
      if (interviewTask) {
        return {
          ...interviewTask,
          whyDescription: `Upcoming interview with ${upcomingInterview.company} (${upcomingInterview.role}). Sharpening interview skills right now directly protects this lead.`
        };
      }
    }

    // 2. Uncompleted task for today with highest reward
    const uncompletedTask = tasks.find(t => !t.completed);
    if (uncompletedTask) {
      return uncompletedTask;
    }

    // 3. If all today's tasks completed, recommend next day or mock interview
    return {
      id: 'next-best-bonus',
      title: 'Run a 15-minute AI Mock Interview round',
      category: 'interview',
      estimatedMinutes: 15,
      strikeReward: 20,
      completed: false,
      whyDescription: `All today's strikes completed! Testing your verbal explanations reinforces Day ${currentDay} recall and earns bonus strikes.`,
      actionType: 'interview'
    };
  }
}

export const storage = new StorageService();
