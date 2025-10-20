// src/components/generate-questions-tab.tsx
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, BookCheck } from 'lucide-react';
import type { GeneratedQuiz, StudyResource } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { generatePracticeQuestionsAction } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedQuiz as GeneratedQuizComponent } from '@/components/generated-quiz';
import { studyResources } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

/**
 * Define las props para el componente `GenerateQuestionsTab`.
 * @param {(result: 'correct' | 'incorrect') => void} [onQuizFeedback] - Callback para notificar al layout del resultado de un quiz.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario.
 */
type GenerateQuestionsTabProps = {
  onQuizFeedback?: (result: 'correct' | 'incorrect') => void;
  learningStyle?: string;
};

/**
 * Un componente que permite a los usuarios generar un quiz de práctica
 * basado en un tema de estudio seleccionado.
 * Utiliza una Acción de Servidor para crear las preguntas, manteniendo el cliente ligero.
 */
export function GenerateQuestionsTab({ onQuizFeedback, learningStyle }: GenerateQuestionsTabProps) {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [internalResources] = useState<StudyResource[]>(() =>
    studyResources.filter(r => r.type === 'internal')
  );
  const { toast } = useToast();

  /**
   * Maneja la generación de un quiz llamando a una Acción de Servidor.
   * El cliente solo se encarga de gestionar el estado de la UI.
   * @param {StudyResource} resource - El recurso de estudio para generar el quiz.
   */
  const handleGenerate = async (resource: StudyResource) => {
    setIsLoading(true);
    setSelectedResource(resource);
    setGeneratedQuiz(null);
    
    const result = await generatePracticeQuestionsAction(resource);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error al generar quiz', description: result.error });
      setIsLoading(false);
      return;
    }

    setGeneratedQuiz({
      title: `Quiz de: ${resource.title}`,
      topic: resource.title,
      questions: result.questions!,
    });
    
    setIsLoading(false);
  };

  // Si se ha generado un quiz, renderiza el componente del quiz.
  if (generatedQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={generatedQuiz}
        onBack={() => {
          setGeneratedQuiz(null);
          setSelectedResource(null);
        }}
        onQuizFeedback={onQuizFeedback}
        learningStyle={learningStyle}
      />
    );
  }

  // De lo contrario, muestra la UI para seleccionar un tema y generar un quiz.
  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Generador de Quiz por Tema
        </CardTitle>
        <CardDescription>
          Selecciona un tema de estudio para crear un quiz personalizado con IA. Esta es la mejor forma de diagnosticar tus áreas de oportunidad.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Generando preguntas sobre {selectedResource?.title}...</p>
            <p className="text-sm">
              Esto puede tardar unos momentos. La IA está creando un quiz para
              ti.
            </p>
          </div>
        ) : internalResources.length > 0 ? (
          <ScrollArea className="h-[50vh] pr-2">
            <div className="space-y-2">
              {internalResources.map(resource => (
                <Card key={resource.source} className="p-4 flex flex-wrap justify-between items-center gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.category}
                    </p>
                  </div>
                  <Button onClick={() => handleGenerate(resource)}>
                    Generar Quiz
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
            <BookCheck className="h-12 w-12 mb-4 text-accent" />
            <p className="text-lg font-semibold">No hay temas de estudio disponibles</p>
            <p>
              Pronto se agregarán más materiales de estudio internos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
