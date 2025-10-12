// src/components/psychometric-practice-tab.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { GeneratedQuiz as GeneratedQuizComponent } from '@/components/generated-quiz';
import { psychometricQuizPool } from '@/lib/psychometric-quiz-data';
import type { GeneratedQuiz } from '@/lib/types';

const QUESTIONS_PER_SESSION = 15;
const TIME_LIMIT_MINUTES = 15;

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

/**
 * Renders the tab for psychometric practice. It allows users to start a timed
 * practice session by drawing a random set of questions from a predefined pool,
 * simulating the pressure of the real exam.
 */
export function PsychometricPracticeTab() {
  const [practiceQuiz, setPracticeQuiz] = useState<GeneratedQuiz | null>(null);

  const handleStartPractice = () => {
    const shuffledQuestions = shuffleArray([...psychometricQuizPool]);
    const selectedQuestions = shuffledQuestions.slice(0, QUESTIONS_PER_SESSION);

    setPracticeQuiz({
      title: 'Práctica Psicométrica',
      topic: 'Examen Psicométrico',
      questions: selectedQuestions,
      isPsychometric: true,
      timeLimit: TIME_LIMIT_MINUTES,
    });
  };

  if (practiceQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={practiceQuiz}
        onBack={() => setPracticeQuiz(null)}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">Práctica Psicométrica Cronometrada</CardTitle>
        <CardDescription>
          El examen psicométrico es una prueba de velocidad y precisión. Entrena en condiciones reales con un límite de tiempo.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center">
        <BrainCircuit className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-semibold">¿Lista para el desafío?</h3>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Te enfrentarás a {QUESTIONS_PER_SESSION} preguntas de series, analogías y razonamiento abstracto con un límite de {TIME_LIMIT_MINUTES} minutos, simulando la presión del examen real.
        </p>
        <Button size="lg" className="mt-8" onClick={handleStartPractice}>
          Iniciar Práctica
        </Button>
      </CardContent>
    </Card>
  );
}
