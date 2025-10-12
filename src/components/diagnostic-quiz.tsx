// src/components/diagnostic-quiz.tsx
'use client';
import { diagnosticQuiz } from '@/lib/diagnostic-quiz';
import { GeneratedQuiz } from './generated-quiz';

/**
 * A wrapper component specifically for the diagnostic quiz.
 * It fetches the predefined diagnostic quiz data and passes it to the
 * generic `GeneratedQuiz` component, marking it as a diagnostic test.
 * This is the first step in the user's onboarding journey.
 */
export function DiagnosticQuiz() {

  const handleBack = () => {
    // This is a no-op for the diagnostic quiz as it's part of a mandatory flow.
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <GeneratedQuiz quiz={diagnosticQuiz} onBack={handleBack} isDiagnostic={true} />
    </div>
  );
}
