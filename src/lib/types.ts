export type StudyMaterial = {
  title: string;
  category: string;
  type: 'internal' | 'video' | 'url';
  source: string; // Path to markdown file or YouTube video ID
  url: string;
};

export type PracticeQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  topic: string;
  explanation: string;
};

export type PerformanceData = {
  topic: string;
  correct: number;
  incorrect: number;
};

export type SavedSummary = {
  id: string;
  title: string;
  content: string;
  originalUrl: string;
  createdAt: string;
};

export type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type GeneratedQuiz = {
  title: string;
  questions: GeneratedQuestion[];
};
