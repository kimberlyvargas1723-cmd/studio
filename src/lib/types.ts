export type StudyResource = {
  title: string;
  url: string;
  category: string;
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
