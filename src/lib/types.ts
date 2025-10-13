// src/lib/types.ts

/**
 * Define la estructura de un recurso de estudio.
 * Un recurso puede ser un archivo Markdown interno de la aplicación o una URL externa.
 * Esta estructura de datos es fundamental para las secciones de "Temas de Estudio" y "Práctica".
 */
export type StudyResource = {
  title: string;
  category: string;
  type: 'internal' | 'url';
  source: string; // Puede ser la ruta al archivo Markdown o una URL externa.
};

/**
 * Define la estructura de una sola pregunta de práctica, ya sea generada por IA o estática.
 * Utilizada en todos los quizzes y simulacros de examen.
 */
export type GeneratedQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  topic: string;
};

/**
 * Define la estructura de un quiz completo.
 * Puede ser un quiz de un tema específico, un test psicométrico,
 * o una simulación completa del examen de admisión.
 */
export type GeneratedQuiz = {
  title: string;
  topic: string;
  questions: GeneratedQuestion[];
  isPsychometric?: boolean; // Bandera para quizzes con límite de tiempo (psicométrico o simulación).
  timeLimit?: number; // Límite de tiempo en minutos.
};

/**
 * Define la estructura de los datos de rendimiento del usuario,
 * rastreando las respuestas correctas e incorrectas por cada tema.
 * Esta información es la base para la página "Mi Progreso".
 */
export type PerformanceData = {
  topic: string;
  correct: number;
  incorrect: number;
};

/**
 * Define la estructura de un resumen generado por la IA y guardado por el usuario.
 * Utilizada en la página "Mis Resúmenes".
 */
export type SavedSummary = {
  id: string;
  title: string;
  content: string;
  originalUrl: string;
  createdAt: string;
};

/**
 * Define la estructura del objeto de retroalimentación personalizada
 * generado por la IA después de que el usuario responde una pregunta en un quiz.
 */
export type Feedback = {
  feedback: string;
  areasForImprovement: string;
  adaptedQuestionTopic: string;
  timestamp: string;
  topic: string;
};

/**
 * Define la estructura de una pregunta del quiz de estilo de aprendizaje (VARK).
 */
export type LearningStyleQuestion = {
  id: string;
  question: string;
  options: {
    style: 'V' | 'A' | 'R' | 'K';
    text: string;
  }[];
};

/**
 * Define la estructura de la estrategia de aprendizaje personalizada
 * que se guarda en localStorage después de que el usuario completa el quiz de diagnóstico.
 */
export type LearningStrategy = {
  style: string;
  strategy: string;
};
