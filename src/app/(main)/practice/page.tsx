// src/app/(main)/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningStyleQuizTab } from '@/components/learning-style-quiz-tab';
import { ExamSimulationTab } from '@/components/exam-simulation-tab';
import { BrainCircuit, BookCheck, ClipboardCheck } from 'lucide-react';

/**
 * Define las props para la página de práctica.
 * @param {(result: 'correct' | 'incorrect') => void} [onQuizFeedback] - Callback para notificar al layout del resultado de un quiz.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario (V, A, R, K).
 */
type PracticePageProps = {
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};


/**
 * Renderiza la página del "Centro de Práctica".
 * Utiliza un sistema de pestañas para permitir a los usuarios:
 * 1. Generar quizzes por tema con IA (`GenerateQuestionsTab`).
 * 2. Descubrir su estilo de aprendizaje (`LearningStyleQuizTab`).
 * 3. Realizar un simulacro de examen completo (`ExamSimulationTab`).
 * 
 * @param {PracticePageProps} props - Las props pasadas desde el layout.
 */
export default function PracticePage({ onQuizFeedback, learningStyle }: PracticePageProps) {
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
              Mi Estilo
            </TabsTrigger>
            <TabsTrigger value="exam-simulation">
                <ClipboardCheck className="mr-2" />
              Simulacro
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic-quiz">
            <GenerateQuestionsTab onQuizFeedback={onQuizFeedback} learningStyle={learningStyle} />
          </TabsContent>
          <TabsContent value="learning-style">
            <LearningStyleQuizTab />
          </TabsContent>
           <TabsContent value="exam-simulation">
            <ExamSimulationTab onQuizFeedback={onQuizFeedback} learningStyle={learningStyle} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
