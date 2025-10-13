// src/lib/types.ts

/**
 * @fileoverview
 * Este archivo centraliza todas las definiciones de tipos de TypeScript personalizadas
 * utilizadas en la aplicación. Proporcionar tipos claros y bien documentados es
 * crucial para la mantenibilidad y la prevención de errores.
 */

/**
 * Define la estructura de un recurso de estudio.
 * Un recurso puede ser un archivo Markdown interno de la aplicación o una URL externa.
 * Esta estructura de datos es fundamental para las secciones de "Temas de Estudio" y "Práctica".
 */
export type StudyResource = {
  /** El título del recurso que se muestra en la UI. */
  title: string;
  /** La categoría temática del recurso (ej. "Fundamentos de Psicología"). */
  category: string;
  /** El tipo de recurso, determina cómo se carga el contenido. */
  type: 'internal' | 'url';
  /** La fuente del contenido: la ruta al archivo Markdown o una URL completa. */
  source: string;
};

/**
 * Define la estructura de una sola pregunta de práctica, ya sea generada por IA o estática.
 * Utilizada en todos los quizzes y simulacros de examen.
 */
export type GeneratedQuestion = {
  /** El texto de la pregunta. */
  question: string;
  /** Un array de 4 posibles respuestas. */
  options: string[];
  /** La respuesta correcta, que debe coincidir con una de las opciones. */
  correctAnswer: string;
  /** Una breve explicación de por qué la respuesta es correcta. */
  explanation: string;
  /** El tema específico de la pregunta. */
  topic: string;
};

/**
 * Define la estructura de un quiz completo.
 * Puede ser un quiz de un tema específico, un test psicométrico,
 * o una simulación completa del examen de admisión.
 */
export type GeneratedQuiz = {
  /** El título del quiz que se muestra al usuario. */
  title: string;
  /** El tema general del quiz. */
  topic: string;
  /** Un array de preguntas que componen el quiz. */
  questions: GeneratedQuestion[];
  /** Bandera opcional para quizzes con límite de tiempo (psicométrico o simulación).
   *  Si es `true`, se activa el temporizador y se deshabilita el feedback de IA.
   */
  isPsychometric?: boolean;
  /** Límite de tiempo en minutos. Solo se aplica si `isPsychometric` es `true`. */
  timeLimit?: number;
};

/**
 * Define la estructura de los datos de rendimiento del usuario,
 * rastreando las respuestas correctas e incorrectas por cada tema.
 * Esta información es la base para la página "Mi Progreso".
 */
export type PerformanceData = {
  /** El nombre del tema. */
  topic: string;
  /** El número de respuestas correctas para este tema. */
  correct: number;
  /** El número de respuestas incorrectas para este tema. */
  incorrect: number;
};

/**
 * Define la estructura de un resumen generado por la IA y guardado por el usuario.
 * Utilizada en la página "Mis Resúmenes".
 */
export type SavedSummary = {
  /** Un ID único para el resumen, generalmente un timestamp. */
  id: string;
  /** El título del resumen. */
  title: string;
  /** El contenido del resumen en formato Markdown. */
  content: string;
  /** La fuente original del contenido resumido. */
  originalUrl: string;
  /** La fecha y hora de creación en formato ISO string. */
  createdAt: string;
};

/**
 * Define la estructura del objeto de retroalimentación personalizada
 * generado por la IA después de que el usuario responde una pregunta en un quiz.
 */
export type Feedback = {
  /** El feedback específico y conversacional para el usuario. */
  feedback: string;
  /** El concepto o habilidad clave a mejorar. */
  areasForImprovement: string;
  /** Un tema sugerido para la siguiente pregunta. */
  adaptedQuestionTopic: string;
  /** La fecha y hora en que se generó el feedback. */
  timestamp: string;
  /** El tema de la pregunta que originó el feedback. */
  topic: string;
};

/**
 * Define la estructura de una pregunta del quiz de estilo de aprendizaje (VARK).
 */
export type LearningStyleQuestion = {
  /** Un identificador único para la pregunta. */
  id: string;
  /** El texto de la pregunta. */
  question: string;
  /** Un array de 4 opciones, cada una asociada a un estilo VARK. */
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
  /** El nombre completo del estilo de aprendizaje (ej. "Visual"). */
  style: string;
  /** La descripción detallada de la estrategia en formato Markdown. */
  strategy: string;
};
