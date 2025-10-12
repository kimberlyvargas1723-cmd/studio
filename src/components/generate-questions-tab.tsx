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
 * A component that allows users to generate a practice quiz based on a selected study topic.
 * It now uses a Server Action to create questions, keeping the client-side lean.
 */
export function GenerateQuestionsTab() {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [internalResources] = useState<StudyResource[]>(() =>
    studyResources.filter(r => r.type === 'internal')
  );
  const { toast } = useToast();

  /**
   * Handles quiz generation by calling a Server Action.
   * The client is only responsible for managing UI state.
   * @param {StudyResource} resource - The study resource to generate a quiz from.
   */
  const handleGenerate = async (resource: StudyResource) => {
    setIsLoading(true);
    setSelectedResource(resource);
    setGeneratedQuiz(null);
    
    try {
      const result = await generatePracticeQuestionsAction(resource);

      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedQuiz({
        title: `Quiz de: ${resource.title}`,
        topic: resource.title,
        questions: result.questions!,
      });
    } catch (e: any) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: e.message || 'No se pudo generar el quiz. Intenta de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  // If a quiz has been generated, render the quiz component.
  if (generatedQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={generatedQuiz}
        onBack={() => {
          setGeneratedQuiz(null);
          setSelectedResource(null);
        }}
      />
    );
  }

  // Otherwise, show the UI for selecting a topic and generating a quiz.
  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader>
        <CardTitle className="font-headline">
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
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {internalResources.map(resource => (
                <Card key={resource.source} className="p-4 flex justify-between items-center">
                  <div>
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
