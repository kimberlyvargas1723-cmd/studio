// src/lib/database-types.ts
// ========================================
// PSICOGUÍA - TIPOS DE BASE DE DATOS FIRESTORE
// ========================================

// ========== USUARIO Y AUTENTICACIÓN ==========
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'student' | 'teacher' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  profileCompleted: boolean;
}

// ========== PERFIL DE APRENDIZAJE ==========
export interface LearningProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  preferredSubjects: string[];
  studyGoals: string[];
  weakAreas: string[];
  studyStreak: number;
  totalStudyTime: number;
  createdAt: Date;
  updatedAt: Date;
}

// ========== TEMAS DE ESTUDIO ==========
export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  module: 'psicologia' | 'ciencias_salud' | 'matematicas' | 'lectura';
  subtopics: string[];
  difficulty: 'basico' | 'intermedio' | 'avanzado';
  estimatedTime: number;
  prerequisites: string[];
  resources: StudyResource[];
}

// ========== RECURSOS DE ESTUDIO ==========
export interface StudyResource {
  id: string;
  type: 'video' | 'pdf' | 'audio' | 'quiz' | 'flashcard';
  title: string;
  description: string;
  url: string;
  duration?: number;
  fileSize?: number;
  tags: string[];
  createdAt: Date;
}

// ========== SESIONES DE ESTUDIO ==========
export interface StudySession {
  id: string;
  userId: string;
  topicId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  questionsAnswered: number;
  correctAnswers: number;
  focusScore: number;
  notes: string;
  completed: boolean;
}

// ========== PREGUNTAS ==========
export interface Question {
  id: string;
  topicId: string;
  module: string; // Más flexible para incluir módulos dinámicos
  type: string; // Más flexible para tipos de pregunta
  difficulty: string; // Más flexible para niveles de dificultad
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  timesAnswered: number;
  successRate: number;
  createdAt: Date;
}

// ========== QUIZZES Y EXAMENES ==========
export interface Quiz {
  id: string;
  title: string;
  description: string;
  topicIds: string[];
  questions: Question[];
  timeLimit?: number;
  passingScore: number;
  difficulty: string;
  createdBy: string;
  isPublic: boolean;
  attempts: number;
  averageScore: number;
  createdAt: Date;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Answer[];
  score: number;
  percentage: number;
  timeSpent: number;
  completedAt: Date;
  passed: boolean;
}

export interface Answer {
  questionId: string;
  answer: string | number;
  correct: boolean;
  timeSpent: number;
}

// ========== PROGRESO Y LOGROS ==========
export interface UserProgress {
  userId: string;
  topicProgress: TopicProgress[];
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  overallAccuracy: number;
  studyStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  achievements: Achievement[];
  lastStudyDate: Date;
}

export interface TopicProgress {
  topicId: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracyRate: number;
  timeSpent: number;
  completed: boolean;
  lastPracticed: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'study' | 'accuracy' | 'streak' | 'completion';
}

// ========== ANALYTICS Y REPORTES ==========
export interface StudyAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  date: Date;
  studyTime: number;
  questionsAnswered: number;
  accuracyRate: number;
  topicsStudied: string[];
  quizAttempts: number;
  averageQuizScore: number;
}

// ========== NOTIFICACIONES ==========
export interface Notification {
  id: string;
  userId: string;
  type: 'study_reminder' | 'achievement' | 'quiz_available' | 'progress_update';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ========== ENUMERACIONES ==========
export const LEARNING_STYLES = ['visual', 'auditory', 'kinesthetic', 'reading'] as const;
export const DIFFICULTY_LEVELS = ['facil', 'medio', 'dificil'] as const;
export const QUESTION_TYPES = ['multiple_choice', 'true_false'] as const;
export const MODULES = ['psicologia', 'ciencias_salud', 'matematicas', 'lectura', 'psicometrico'] as const;

export type LearningStyle = typeof LEARNING_STYLES[number];
export type DifficultyLevel = typeof DIFFICULTY_LEVELS[number];
export type QuestionType = typeof QUESTION_TYPES[number];
export type ModuleType = typeof MODULES[number];
