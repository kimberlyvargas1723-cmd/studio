// src/components/learning-style-quiz-tab.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { getLearningStrategy, saveLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';
import { LearningStyleQuiz } from '@/components/learning-style-quiz';

/**
 * Renders a tab for discovering or updating the user's learning style.
 * It displays the currently saved strategy or shows the reusable LearningStyleQuiz
 * component if no strategy exists or if the user chooses to retake the quiz.
 */
export function LearningStyleQuizTab() {
  const [savedStrategy, setSavedStrategy] = useState<LearningStrategy | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  useEffect(() => {
    // Prevents hydration errors by only accessing localStorage on the client.
    setIsClient(true);
    const strategy = getLearningStrategy();
    if (strategy) {
      setSavedStrategy(strategy);
    }
  }, []);
  
  const handleQuizFinish = (strategy: LearningStrategy) => {
    saveLearningStrategy(strategy);
    setSavedStrategy(strategy);
    setIsRetaking(false);
  }

  const startRetake = () => {
    setIsRetaking(true);
  }

  if (!isClient) {
    return <Card className="w-full max-w-4xl border-none shadow-none min-h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></Card>;
  }

  // Display saved strategy if it exists and we are not in the middle of retaking the quiz
  if (savedStrategy && !isRetaking) {
    return (
      <Card className="w-full max-w-4xl border-none shadow-none">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><Wand /> Tu Estrategia de Aprendizaje Personalizada</CardTitle>
          <CardDescription>
            Descubrimos que tu estilo de aprendizaje dominante es **{savedStrategy.style}**. Aquí tienes una guía creada por Vairyx para potenciar tu estudio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="border-primary/50 bg-primary/5">
             <AlertTitle className="font-bold text-primary">Tus Superpoderes de Estudio</AlertTitle>
             <AlertDescription>
                <div className="prose prose-sm dark:prose-invert max-w-none mt-2">
                    <ReactMarkdown>{savedStrategy.strategy}</ReactMarkdown>
                </div>
             </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
            <Button variant="outline" onClick={startRetake}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Volver a realizar el diagnóstico
            </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show quiz if no strategy is saved OR if user is retaking
  return (
     <LearningStyleQuiz
        onFinish={handleQuizFinish}
        title="Descubre/Actualiza tu Estilo de Aprendizaje"
        description="Responde estas preguntas para que Vairyx pueda crear o actualizar tu estrategia de estudio."
        finishButtonText="Generar mi Estrategia con IA"
      />
  );
}
