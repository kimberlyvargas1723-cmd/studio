// src/app/(main)/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningStyleQuizTab } from '@/components/learning-style-quiz-tab';
import { ExamSimulationTab } from '@/components/exam-simulation-tab';
import { BrainCircuit, BookCheck, ClipboardCheck } from 'lucide-react';

/**
 * Renders the practice center page, which uses tabs to allow users to
 * generate AI-powered quizzes by topic, discover their learning style, 
 * or run a full exam simulation.
 * @param {object} props - The component props.
 * @param {(result: 'correct' | 'incorrect') => void} props.onQuizFeedback - Callback to notify the layout of quiz results.
 */
export default function PracticePage({ onQuizFeedback }: { onQuizFeedback?: (result: 'correct' | 'incorrect') => void }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Centro de Práctica" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="topic-quiz" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topic-quiz">
              <BookCheck className="mr-2" />
              Quiz por Tema
            </TabsTrigger>
            <TabsTrigger value="learning-style">
                <BrainCircuit className="mr-2" />
              Mi Estilo de Aprendizaje
            </TabsTrigger>
            <TabsTrigger value="exam-simulation">
                <ClipboardCheck className="mr-2" />
              Simulacro de Examen
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic-quiz">
            <GenerateQuestionsTab onQuizFeedback={onQuizFeedback} />
          </TabsContent>
          <TabsContent value="learning-style">
            <LearningStyleQuizTab />
          </TabsContent>
           <TabsContent value="exam-simulation">
            <ExamSimulationTab onQuizFeedback={onQuizFeedback} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
