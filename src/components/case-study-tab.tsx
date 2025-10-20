// src/components/case-study-tab.tsx
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Microscope } from 'lucide-react';
import { GeneratedQuiz } from '@/components/generated-quiz';
import { caseStudiesPool } from '@/lib/case-studies';
import type { GeneratedQuiz as GeneratedQuizType } from '@/lib/types';


const CASE_STUDY_QUESTIONS = 10;

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
 * Define las props para el componente `CaseStudyTab`.
 * @param {(result: 'correct' | 'incorrect') => void} [onQuizFeedback] - Callback para notificar al layout del resultado de una respuesta.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario.
 */
type CaseStudyTabProps = {
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};

/**
 * Renderiza la pestaña "Dojo de Casos", una nueva forma de entrenamiento interactivo.
 * Presenta al usuario una serie de mini-escenarios o "casos prácticos" donde debe
 * aplicar sus conocimientos de psicología para identificar el concepto clave.
 */
export function CaseStudyTab({ onQuizFeedback, learningStyle }: CaseStudyTabProps) {
  const [activeQuiz, setActiveQuiz] = useState<GeneratedQuizType | null>(null);

  /**
   * Inicia una sesión de práctica de casos de estudio.
   * Selecciona aleatoriamente un subconjunto de casos del banco de preguntas
   * y configura el objeto del quiz para ser renderizado.
   */
  const handleStartCaseStudy = () => {
    const shuffledCases = shuffleArray([...caseStudiesPool]);
    const selectedCases = shuffledCases.slice(0, CASE_STUDY_QUESTIONS);
    setActiveQuiz({
        title: 'Dojo de Casos Prácticos',
        topic: 'Aplicación de Conceptos',
        questions: selectedCases,
    });
  };

  if (activeQuiz) {
    return (
      <GeneratedQuiz
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
        <div className="flex justify-center items-center mb-4">
            <Microscope className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Dojo de Casos Prácticos</CardTitle>
        <CardDescription>
          ¡Hora de ponerse el sombrero de psicólogo! En lugar de memorizar, aquí aplicarás la teoría a situaciones reales. Afina tu intuición diagnóstica.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-6">
        <Card className="hover:border-primary transition-colors text-center p-6 max-w-lg">
            <CardHeader>
                <CardTitle className="font-headline">Entrenamiento de Aplicación</CardTitle>
                <CardDescription>
                    Te presentaremos {CASE_STUDY_QUESTIONS} mini-escenarios. Tu misión es identificar el concepto psicológico clave en cada uno. ¿Lista para el desafío?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleStartCaseStudy}>
                    Comenzar Entrenamiento
                </Button>
            </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
