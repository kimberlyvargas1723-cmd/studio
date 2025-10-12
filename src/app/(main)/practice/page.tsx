// src/app/(main)/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PsychometricPracticeTab } from '@/components/psychometric-practice-tab';
import { BrainCircuit, BookCheck } from 'lucide-react';

/**
 * Renders the practice page, which now uses tabs to allow users to
 * either generate AI-powered quizzes by topic or engage in a timed
 * psychometric practice session.
 */
export default function PracticePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Centro de Práctica" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="topic-quiz" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="topic-quiz">
              <BookCheck className="mr-2" />
              Quiz por Tema
            </TabsTrigger>
            <TabsTrigger value="psychometric-practice">
                <BrainCircuit className="mr-2" />
              Práctica Psicométrica
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic-quiz">
            <GenerateQuestionsTab />
          </TabsContent>
          <TabsContent value="psychometric-practice">
            <PsychometricPracticeTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
