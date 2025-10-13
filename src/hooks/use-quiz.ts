// src/hooks/use-quiz.ts
'use client';
import { useState, useEffect, useRef } from 'react';
import { analyzePerformanceAndAdapt } from '@/ai/flows/personalized-feedback-adaptation';
import { updatePerformanceData, saveFeedback } from '@/lib/services';
import type { GeneratedQuiz, GeneratedQuestion, Feedback } from '@/lib/types';

/**
 * Define las propiedades que el hook `useQuiz` necesita para funcionar.
 */
type UseQuizProps = {
  /** El objeto del quiz que contiene las preguntas, el título, etc. */
  quiz: GeneratedQuiz;
  /** Callback opcional para notificar al componente padre del resultado ('correct' o 'incorrect'). */
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  /** El estilo de aprendizaje del usuario para adaptar el feedback. */
  learningStyle?: string;
};

/**
 * Un hook personalizado que encapsula toda la lógica y el estado para un quiz interactivo.
 * Maneja la progresión de preguntas, la selección de respuestas, la puntuación,
 * los límites de tiempo, la evaluación de respuestas y la generación de feedback por IA.
 *
 * @param {UseQuizProps} props - Las propiedades para inicializar el hook, incluyendo el quiz y los callbacks.
 * @returns Un objeto que contiene el estado actual del quiz y las funciones para interactuar con él.
 */
export const useQuiz = ({ quiz, onQuizFeedback, learningStyle }: UseQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Para el feedback de la IA
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion: GeneratedQuestion = quiz.questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  /**
   * Efecto para manejar el temporizador en quizzes psicométricos o simulacros.
   * Se activa solo si el quiz tiene un límite de tiempo (`timeLimit`).
   */
  useEffect(() => {
    if (quiz.isPsychometric && timeLeft !== null && !isQuizFinished && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            handleNextQuestion(); // Avanza automáticamente cuando el tiempo se acaba.
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz.isPsychometric, currentQuestionIndex, isQuizFinished, isAnswered]);

  /**
   * Maneja el envío de una respuesta. Evalúa si es correcta, actualiza el rendimiento,
   * y (si no es psicométrico) solicita feedback personalizado a la IA.
   */
  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsLoading(true);
    setIsAnswered(true);

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 1);
      onQuizFeedback?.('correct');
    } else {
      onQuizFeedback?.('incorrect');
    }
    
    // Actualiza los datos de rendimiento en localStorage.
    updatePerformanceData(currentQuestion.topic, correct);

    // Solo genera feedback de IA para quizzes de aprendizaje, no para simulacros.
    if (!quiz.isPsychometric) {
      try {
        const result = await analyzePerformanceAndAdapt({
          question: currentQuestion.question,
          studentAnswer: selectedAnswer,
          correctAnswer: currentQuestion.correctAnswer,
          topic: currentQuestion.topic,
          learningStyle: learningStyle
        });
        const newFeedback: Feedback = {...result, timestamp: new Date().toISOString(), topic: currentQuestion.topic};
        setFeedback(newFeedback);
        saveFeedback(newFeedback);
      } catch (error) {
        console.error("Error getting feedback:", error);
        // Genera un feedback de error para el usuario si la IA falla.
        const errorFeedback: Feedback = {
          feedback: "No se pudo obtener la retroalimentación. Por favor, intenta de nuevo.",
          areasForImprovement: "N/A",
          adaptedQuestionTopic: currentQuestion.topic,
          timestamp: new Date().toISOString(),
          topic: currentQuestion.topic,
        };
        setFeedback(errorFeedback);
        saveFeedback(errorFeedback);
      }
    }
    setIsLoading(false);
  };

  /**
   * Avanza a la siguiente pregunta del quiz, reseteando el estado correspondiente.
   */
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  /**
   * Reinicia el quiz al estado inicial.
   */
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  /**
   * Formatea los segundos restantes a un formato MM:SS.
   * @param {number} seconds - El total de segundos a formatear.
   * @returns {string} El tiempo formateado.
   */
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    currentQuestion,
    isQuizFinished,
    selectedAnswer,
    isAnswered,
    isCorrect,
    feedback,
    isLoading,
    score,
    timeLeft,
    setSelectedAnswer,
    handleAnswerSubmit,
    handleNextQuestion,
    handleRestartQuiz,
    formatTime,
  };
};
