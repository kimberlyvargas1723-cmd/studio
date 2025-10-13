// src/hooks/use-quiz.ts
'use client';
import { useState, useEffect, useRef } from 'react';
import { analyzePerformanceAndAdapt } from '@/ai/flows/personalized-feedback-adaptation';
import { updatePerformanceData, saveFeedback } from '@/lib/services';
import type { GeneratedQuiz, GeneratedQuestion, Feedback } from '@/lib/types';

type UseQuizProps = {
  quiz: GeneratedQuiz;
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};

/**
 * A custom hook to manage the entire state and logic of a quiz.
 * It handles question progression, scoring, timers, answer submission,
 * and AI feedback generation.
 *
 * @param {UseQuizProps} props - The initial quiz data and callbacks.
 * @returns An object with state and handler functions for the quiz.
 */
export const useQuiz = ({ quiz, onQuizFeedback, learningStyle }: UseQuizProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(quiz.timeLimit ? quiz.timeLimit * 60 : null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion: GeneratedQuestion = quiz.questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  useEffect(() => {
    if (quiz.isPsychometric && timeLeft !== null && !isQuizFinished && !isAnswered) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timerRef.current!);
            handleNextQuestion(); // Auto-advance when time is up
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
    
    updatePerformanceData(currentQuestion.topic, correct);

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

  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setFeedback(null);
    if (quiz.timeLimit) setTimeLeft(quiz.timeLimit * 60);
  };

  const formatTime = (seconds: number) => {
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
