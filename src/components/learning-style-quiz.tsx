// src/components/learning-style-quiz.tsx
'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, BrainCircuit, Sparkles } from 'lucide-react';
import { learningStyleQuiz } from '@/lib/learning-style-quiz';
import { generateLearningStrategyAction } from '@/app/actions';
import type { LearningStrategy } from '@/lib/types';

type LearningStyleQuizProps = {
  onFinish: (strategy: LearningStrategy) => void;
  title: string;
  description: string;
  finishButtonText: string;
};

/**
 * A reusable component that presents the VARK learning style quiz,
 * calculates the dominant style, and calls an AI flow to generate a
 * personalized learning strategy.
 *
 * @param {LearningStyleQuizProps} props - Props to customize the quiz presentation and behavior.
 */
export function LearningStyleQuiz({ onFinish, title, description, finishButtonText }: LearningStyleQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = learningStyleQuiz[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= learningStyleQuiz.length;

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
      onFinish(newStrategy);

    } catch (e: any) {
        console.error(e);
        setIsLoading(false);
        // Optionally, show an error message to the user
    }
  };
  
  if (isLoading) {
     return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-xl font-semibold">Analizando tus respuestas...</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Vairyx está creando una estrategia de aprendizaje única solo para ti. ¡Un momento!
            </p>
        </div>
     );
  }

  return (
    <Card className="w-full max-w-2xl animate-fade-in-up border-none shadow-none">
      {!isQuizFinished ? (
        <>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{title}</CardTitle>
            <CardDescription>
              {description} - Pregunta {currentQuestionIndex + 1} de {learningStyleQuiz.length}.
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
          <h3 className="text-2xl font-semibold">¡Diagnóstico Completo!</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Has respondido todas las preguntas. Ahora Vairyx analizará tus preferencias para generar tu estrategia de estudio personalizada.
          </p>
          <Button size="lg" className="mt-8" onClick={handleFinish}>
            <Sparkles className="mr-2" />
            {finishButtonText}
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
