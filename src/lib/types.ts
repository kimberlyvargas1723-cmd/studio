
export type StudyResource = {
  title: string;
  category: string;
  type: 'internal' | 'url';
  source: string; // Path to markdown file or external URL
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
  topic: string;
  questions: GeneratedQuestion[];
};

export type Feedback = {
  feedback: string;
  areasForImprovement: string;
  adaptedQuestionTopic: string;
  timestamp: string;
  topic: string;
};
