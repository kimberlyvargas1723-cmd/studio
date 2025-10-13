// src/components/diagnostic-quiz.tsx
'use client';

import { useRouter } from 'next/navigation';
import { saveLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';
import { LearningStyleQuiz } from '@/components/learning-style-quiz';

/**
 * A wrapper component specifically for the initial onboarding diagnostic quiz.
 * 
 * Its main responsibilities are:
 * 1. To render the reusable `LearningStyleQuiz` component.
 * 2. To define what happens *after* the quiz is completed in the context of onboarding:
 *    - Save the generated learning strategy to localStorage.
 *    - Mark onboarding as complete in localStorage.
 *    - Redirect the user to the main dashboard.
 * 
 * This component acts as a "host" for the quiz during the first-time user experience.
 */
export function DiagnosticQuiz() {
  const router = useRouter();

  /**
   * Callback function passed to the `LearningStyleQuiz`.
   * This function is executed once the user completes the quiz and the AI
   * has generated their personalized learning strategy.
   * @param {LearningStrategy} strategy - The strategy object returned from the AI flow.
   */
  const handleFinishOnboarding = (strategy: LearningStrategy) => {
    // Persist the user's learning strategy.
    saveLearningStrategy(strategy);
    // Set a flag to indicate that the onboarding process is complete.
    localStorage.setItem('onboardingComplete', 'true');
    // Redirect the user to the dashboard to begin using the app.
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      {/* Render the reusable quiz component with the specific onboarding handler */}
      <LearningStyleQuiz 
        onFinish={handleFinishOnboarding}
        title="Diagnóstico de Estilo de Aprendizaje"
        description="Elige la opción que mejor te describa para cada situación."
        finishButtonText="Generar mi Estrategia y Empezar"
      />
    </div>
  );
}
