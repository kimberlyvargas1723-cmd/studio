// src/app/(main)/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { PracticeQuiz } from '@/components/practice-quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';

export default function PracticePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Práctica" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="quiz" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz">Quiz General</TabsTrigger>
            <TabsTrigger value="generate">Generar Quiz con IA</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <div className="flex justify-center mt-4">
              <PracticeQuiz />
            </div>
          </TabsContent>
          <TabsContent value="generate">
            <GenerateQuestionsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
