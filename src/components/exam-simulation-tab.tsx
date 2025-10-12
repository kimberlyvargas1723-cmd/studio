// src/components/exam-simulation-tab.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck } from 'lucide-react';
import { GeneratedQuiz as GeneratedQuizComponent } from '@/components/generated-quiz';
import { examQuestionPool } from '@/lib/exam-simulation-questions';
import type { GeneratedQuiz, GeneratedQuestion } from '@/lib/types';

const QUESTIONS_PER_SESSION = 30;
const TIME_LIMIT_MINUTES = 30;

/**
 * Shuffles an array in-place and returns it.
 * @param {T[]} array The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

type ExamSimulationTabProps = {
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};

/**
 * Renders the tab for a full admission exam simulation (EXANI-II style).
 * It presents a timed, multi-topic quiz to simulate the real exam experience.
 */
export function ExamSimulationTab({ onQuizFeedback, learningStyle }: ExamSimulationTabProps) {
  const [simulationQuiz, setSimulationQuiz] = useState<GeneratedQuiz | null>(null);

  const handleStartSimulation = () => {
    const shuffledQuestions = shuffleArray([...examQuestionPool]);
    const selectedQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_SESSION);

    setSimulationQuiz({
      title: 'Simulacro de Examen de Admisión',
      topic: 'Simulacro General',
      questions: selectedQuestions,
      isPsychometric: true, // Re-use psychometric flag for timed general exam
      timeLimit: TIME_LIMIT_MINUTES,
    });
  };

  if (simulationQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={simulationQuiz}
        onBack={() => setSimulationQuiz(null)}
        onQuizFeedback={onQuizFeedback}
        learningStyle={learningStyle}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Simulacro de Examen de Admisión</CardTitle>
        <CardDescription>
          Pon a prueba tu conocimiento y tu velocidad con una simulación realista del examen de conocimientos (EXANI-II).
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center">
        <ClipboardCheck className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold">¿Lista para la prueba final?</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Enfrentarás {QUESTIONS_PER_SESSION} preguntas de todos los temas del examen con un límite de {TIME_LIMIT_MINUTES} minutos. ¡Es la hora de la verdad!
        </p>
        <Button size="lg" className="mt-8" onClick={handleStartSimulation}>
          Iniciar Simulacro
        </Button>
      </CardContent>
    </Card>
  );
}
