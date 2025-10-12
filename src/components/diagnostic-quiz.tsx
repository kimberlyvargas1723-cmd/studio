// src/components/diagnostic-quiz.tsx
'use client';

import { useRouter } from 'next/navigation';
import { saveLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';
import { LearningStyleQuiz } from '@/components/learning-style-quiz';

/**
 * A wrapper component for the initial diagnostic quiz during onboarding.
 * It uses the reusable LearningStyleQuiz component and handles the logic
 * for what happens after the quiz is completed: saving the strategy, marking
* onboarding as complete, and redirecting to the dashboard.
 */
export function DiagnosticQuiz() {
  const router = useRouter();

  const handleFinishOnboarding = (strategy: LearningStrategy) => {
    saveLearningStrategy(strategy);
    localStorage.setItem('onboardingComplete', 'true');
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <LearningStyleQuiz 
        onFinish={handleFinishOnboarding}
        title="Diagnóstico de Estilo de Aprendizaje"
        description="Elige la opción que mejor te describa."
        finishButtonText="Generar mi Estrategia y Empezar"
      />
    </div>
  );
}
