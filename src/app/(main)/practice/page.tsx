// src/app/(main)/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';

/**
 * Renders the practice page, which allows users to generate and take quizzes.
 * This page serves as a container for the quiz generation and interaction components.
 */
export default function PracticePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Práctica" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
          <GenerateQuestionsTab />
      </main>
    </div>
  );
}
