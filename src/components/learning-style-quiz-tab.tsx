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
 * Renderiza una pestaña para descubrir o actualizar el estilo de aprendizaje del usuario.
 * Muestra la estrategia guardada actualmente o el componente reutilizable `LearningStyleQuiz`
 * si no existe una estrategia o si el usuario decide volver a realizar el quiz.
 */
export function LearningStyleQuizTab() {
  const [savedStrategy, setSavedStrategy] = useState<LearningStrategy | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  /**
   * Efecto para cargar la estrategia desde localStorage solo en el cliente.
   * Esto previene errores de hidratación.
   */
  useEffect(() => {
    setIsClient(true);
    const strategy = getLearningStrategy();
    if (strategy) {
      setSavedStrategy(strategy);
    }
  }, []);
  
  /**
   * Callback que se ejecuta cuando el quiz finaliza.
   * Guarda la nueva estrategia y actualiza el estado para mostrarla.
   * @param {LearningStrategy} strategy - La estrategia generada por la IA.
   */
  const handleQuizFinish = (strategy: LearningStrategy) => {
    saveLearningStrategy(strategy);
    setSavedStrategy(strategy);
    setIsRetaking(false);
  }

  /**
   * Pone la UI en modo "realizar quiz de nuevo".
   */
  const startRetake = () => {
    setIsRetaking(true);
  }

  // Muestra un loader mientras se determina si estamos en el cliente.
  if (!isClient) {
    return (
        <Card className="w-full max-w-4xl border-none shadow-none min-h-[300px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </Card>
    );
  }

  // Muestra la estrategia guardada si existe y no se está volviendo a hacer el quiz.
  if (savedStrategy && !isRetaking) {
    return (
      <Card className="w-full max-w-4xl border-none shadow-none animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Wand className="h-6 w-6" /> Tu Estrategia de Aprendizaje Personalizada</CardTitle>
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

  // Muestra el quiz si no hay estrategia guardada o si se está volviendo a hacer.
  return (
     <LearningStyleQuiz
        onFinish={handleQuizFinish}
        title="Descubre/Actualiza tu Estilo de Aprendizaje"
        description="Responde estas preguntas para que Vairyx pueda crear o actualizar tu estrategia de estudio."
        finishButtonText="Actualizar mi Estrategia con IA"
      />
  );
}
