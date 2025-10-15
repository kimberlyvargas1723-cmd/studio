// src/app/practice/page.tsx
'use client';
import { Header } from '@/components/header';
import { GenerateQuestionsTab } from '@/components/generate-questions-tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningStyleQuizTab } from '@/components/learning-style-quiz-tab';
import { ExamSimulationTab } from '@/components/exam-simulation-tab';
import { BrainCircuit, BookCheck, ClipboardCheck, Microscope, Dumbbell, Layers } from 'lucide-react';
import { CaseStudyTab } from '@/components/case-study-tab';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlashcardsTab } from '@/components/flashcards-tab';

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
 * Renderiza la página del "Gimnasio Mental".
 * Utiliza un sistema de pestañas para organizar las diferentes "salas de entrenamiento":
 * 1. Generar quizzes por tema (`GenerateQuestionsTab`).
 * 2. Entrenar la aplicación de conceptos con casos prácticos (`CaseStudyTab`).
 * 3. Realizar un simulacro de examen completo (`ExamSimulationTab`).
 * 4. Descubrir su estilo de aprendizaje (`LearningStyleQuizTab`).
 * 5. Practicar con flashcards (`FlashcardsTab`).
 * 
 * @param {PracticePageProps} props - Las props pasadas desde el layout.
 */
export default function PracticePage({ onQuizFeedback, learningStyle }: PracticePageProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Gimnasio Mental" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Card className="w-full max-w-5xl border-0 bg-transparent shadow-none">
            <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-2">
                    <Dumbbell className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">¡Bienvenida al Gimnasio Mental!</CardTitle>
                <CardDescription className="max-w-2xl mx-auto">
                    Este es tu centro de alto rendimiento. Cada sección es una "máquina" diferente para entrenar tu cerebro. Elige tu rutina para hoy.
                </CardDescription>
            </CardHeader>
        </Card>
        <Tabs defaultValue="topic-quiz" className="w-full max-w-5xl">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
            <TabsTrigger value="topic-quiz" className="flex-col h-full py-2">
              <BookCheck className="mb-1" />
              Sala de Quizzes
            </TabsTrigger>
             <TabsTrigger value="case-studies" className="flex-col h-full py-2">
              <Microscope className="mb-1" />
              Dojo de Casos
            </TabsTrigger>
            <TabsTrigger value="flashcards" className="flex-col h-full py-2">
              <Layers className="mb-1" />
              Sala de Flashcards
            </TabsTrigger>
            <TabsTrigger value="exam-simulation" className="flex-col h-full py-2">
                <ClipboardCheck className="mb-1" />
              Simuladores
            </TabsTrigger>
            <TabsTrigger value="learning-style" className="flex-col h-full py-2">
                <BrainCircuit className="mb-1" />
              Mi Estilo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="topic-quiz">
            <GenerateQuestionsTab onQuizFeedback={onQuizFeedback} learningStyle={learningStyle} />
          </TabsContent>
           <TabsContent value="case-studies">
            <CaseStudyTab onQuizFeedback={onQuizFeedback} learningStyle={learningStyle} />
          </TabsContent>
          <TabsContent value="flashcards">
            <FlashcardsTab />
          </TabsContent>
           <TabsContent value="exam-simulation">
            <ExamSimulationTab onQuizFeedback={onQuizFeedback} learningStyle={learningStyle} />
          </TabsContent>
          <TabsContent value="learning-style">
            <LearningStyleQuizTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
