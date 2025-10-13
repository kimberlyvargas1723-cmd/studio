// src/components/exam-simulation-tab.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Brain } from 'lucide-react';
import { GeneratedQuiz as GeneratedQuizComponent } from '@/components/generated-quiz';
import { examQuestionPool } from '@/lib/exam-simulation-questions';
import { psychometricQuizPool } from '@/lib/psychometric-quiz-data';
import type { GeneratedQuiz } from '@/lib/types';

const SIMULATION_QUESTIONS = 30;
const SIMULATION_TIME_MINUTES = 30;
const PSYCHOMETRIC_QUESTIONS = 15;
const PSYCHOMETRIC_TIME_MINUTES = 10;

/**
 * Mezcla un array en su lugar y lo devuelve (algoritmo de Fisher-Yates).
 * @template T
 * @param {T[]} array El array a mezclar.
 * @returns {T[]} El mismo array, pero mezclado.
 */
function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Define las props para el componente `ExamSimulationTab`.
 * @param {(result: 'correct' | 'incorrect') => void} [onQuizFeedback] - Callback para notificar al layout del resultado de una respuesta.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario.
 */
type ExamSimulationTabProps = {
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};

/**
 * Renderiza la pestaña para realizar una simulación de examen de admisión (EXANI-II)
 * o una simulación específica del examen psicométrico.
 * Ofrece la opción de elegir entre los dos tipos de examen.
 */
export function ExamSimulationTab({ onQuizFeedback, learningStyle }: ExamSimulationTabProps) {
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuiz | null>(null);

  /**
   * Inicia una simulación de examen.
   * Mezcla el banco de preguntas correspondiente, selecciona un subconjunto
   * y configura el objeto del quiz con las preguntas y el límite de tiempo.
   * @param {'knowledge' | 'psychometric'} type - El tipo de simulación a iniciar.
   */
  const handleStartSimulation = (type: 'knowledge' | 'psychometric') => {
    if (type === 'knowledge') {
        const shuffledQuestions = shuffleArray([...examQuestionPool]);
        const selectedQuestions = shuffledQuestions.slice(0, SIMULATION_QUESTIONS);
        setActiveQuiz({
            title: 'Simulacro: Examen de Conocimientos',
            topic: 'Simulacro General',
            questions: selectedQuestions,
            isPsychometric: true, // Se marca como true para activar el temporizador y deshabilitar el feedback de IA.
            timeLimit: SIMULATION_TIME_MINUTES,
        });
    } else {
        const shuffledQuestions = shuffleArray([...psychometricQuizPool]);
        const selectedQuestions = shuffledQuestions.slice(0, PSYCHOMETRIC_QUESTIONS);
        setActiveQuiz({
            title: 'Simulacro: Examen Psicométrico',
            topic: 'Examen Psicométrico',
            questions: selectedQuestions,
            isPsychometric: true, // Activa el temporizador.
            timeLimit: PSYCHOMETRIC_TIME_MINUTES,
        });
    }
  };

  if (activeQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={activeQuiz}
        onBack={() => setActiveQuiz(null)}
        onQuizFeedback={onQuizFeedback}
        learningStyle={learningStyle}
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader className="text-center">
        <CardTitle className="font-headline">Simulacro de Examen</CardTitle>
        <CardDescription>
          Elige qué examen quieres simular. Cada uno está diseñado para imitar la presión y el formato del examen real.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6 pt-6">
        <Card className="hover:border-primary transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><ClipboardCheck className="text-primary"/>Conocimientos (EXANI-II)</CardTitle>
                <CardDescription>
                    Enfrenta {SIMULATION_QUESTIONS} preguntas de todas las áreas (Psicología, Matemáticas, Lectura) con un límite de {SIMULATION_TIME_MINUTES} minutos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={() => handleStartSimulation('knowledge')}>
                    Iniciar Simulacro de Conocimientos
                </Button>
            </CardContent>
        </Card>
         <Card className="hover:border-primary transition-colors">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><Brain className="text-primary"/>Examen Psicométrico</CardTitle>
                <CardDescription>
                    Mide tu agilidad mental con {PSYCHOMETRIC_QUESTIONS} preguntas de series, analogías y razonamiento abstracto en solo {PSYCHOMETRIC_TIME_MINUTES} minutos.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={() => handleStartSimulation('psychometric')}>
                    Iniciar Simulacro Psicométrico
                </Button>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
