// src/components/learning-style-quiz-tab.tsx
'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, BrainCircuit, Sparkles, Wand, RefreshCw } from 'lucide-react';
import { learningStyleQuiz } from '@/lib/learning-style-quiz';
import { generateLearningStrategyAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ReactMarkdown from 'react-markdown';
import { getLearningStrategy, saveLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';

/**
 * Renders a tab for discovering or updating the user's learning style.
 * It allows taking a VARK-based quiz. Once completed, it calls an AI flow
 * to generate a personalized learning strategy, which is then saved and displayed.
 * Users can retake the quiz at any time to update their strategy.
 */
export function LearningStyleQuizTab() {
  const [savedStrategy, setSavedStrategy] = useState<LearningStrategy | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
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

  const handleAnswerSelect = (questionId: string, style: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: style }));
  };

  const handleNext = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const handleFinish = async () => {
    setIsLoading(true);
    const styleCounts: Record<string, number> = { V: 0, A: 0, R: 0, K: 0 };
    Object.values(answers).forEach(style => {
      styleCounts[style]++;
    });

    const dominantStyle = Object.keys(styleCounts).reduce((a, b) => styleCounts[a] > styleCounts[b] ? a : b);
    
    try {
      const result = await generateLearningStrategyAction(dominantStyle);
      if (result.error) {
        throw new Error(result.error);
      }
      const newStrategy: LearningStrategy = { style: result.style!, strategy: result.strategy! };
      saveLearningStrategy(newStrategy);
      setSavedStrategy(newStrategy);
    } catch (e: any) {
        console.error(e);
        // Handle error, maybe show a toast
    } finally {
        setIsLoading(false);
        setIsRetaking(false); // Finish retake mode
        setCurrentQuestionIndex(0); // Reset for next time
        setAnswers({});
    }
  };
  
  const startRetake = () => {
    setIsRetaking(true);
    setCurrentQuestionIndex(0);
    setAnswers({});
  }

  const currentQuestion = learningStyleQuiz[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= learningStyleQuiz.length;

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

  if (isLoading) {
     return (
        <Card className="w-full max-w-4xl border-none shadow-none min-h-[400px] flex flex-col items-center justify-center text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold">Analizando tus respuestas...</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Vairyx está creando una estrategia de aprendizaje única solo para ti.
            </p>
        </Card>
     );
  }

  // Show quiz if no strategy is saved OR if user is retaking
  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      {!isQuizFinished ? (
        <>
          <CardHeader>
            <CardTitle className="font-headline">Descubre tu Estilo de Aprendizaje</CardTitle>
            <CardDescription>
              Responde estas preguntas para que Vairyx pueda crear una estrategia de estudio a tu medida. Pregunta {currentQuestionIndex + 1} de {learningStyleQuiz.length}.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <h3 className="font-semibold text-lg mb-4">{currentQuestion.question}</h3>
            <RadioGroup onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)} className="space-y-3">
              {currentQuestion.options.map(opt => (
                <Label key={opt.style} htmlFor={`${currentQuestion.id}-${opt.style}`} className="flex items-center space-x-3 p-4 rounded-md border transition-colors cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                  <RadioGroupItem value={opt.style} id={`${currentQuestion.id}-${opt.style}`} />
                  <span>{opt.text}</span>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNext} disabled={!answers[currentQuestion.id]}>
              Siguiente
            </Button>
          </CardFooter>
        </>
      ) : (
        <CardContent className="min-h-[300px] flex flex-col items-center justify-center text-center pt-6">
            <BrainCircuit className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold">¡Diagnóstico Completo!</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Has respondido todas las preguntas. Ahora Vairyx analizará tus preferencias para generar tu plan de estudio personalizado.
            </p>
            <Button size="lg" className="mt-8" onClick={handleFinish}>
                <Sparkles className="mr-2" />
                Generar mi Estrategia con IA
            </Button>
      </CardContent>
      )}
    </Card>
  );
}
