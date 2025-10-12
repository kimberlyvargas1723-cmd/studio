'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { PracticeQuiz } from '@/components/practice-quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Lightbulb, Loader2, BookCheck } from 'lucide-react';
import type { SavedSummary, GeneratedQuiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { generatePracticeQuestions } from '@/ai/flows/practice-question-generation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GeneratedQuiz as GeneratedQuizComponent } from '@/components/generated-quiz';

function GenerateQuestionsTab() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<SavedSummary | null>(
    null
  );
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedSummaries = JSON.parse(
      localStorage.getItem('savedSummaries') || '[]'
    );
    setSummaries(savedSummaries);
  }, []);

  const handleGenerate = async (summary: SavedSummary) => {
    setSelectedSummary(summary);
    setGeneratedQuiz(null);
    setIsLoading(true);
    try {
      const result = await generatePracticeQuestions({
        summarizedContent: summary.content,
        topic: summary.title,
      });
      setGeneratedQuiz({
        title: `Quiz de: ${summary.title}`,
        questions: result.questions,
      });
    } catch (e) {
      console.error(e);
      // TODO: show error toast
    } finally {
      setIsLoading(false);
    }
  };

  if (generatedQuiz) {
    return (
      <GeneratedQuizComponent
        quiz={generatedQuiz}
        onBack={() => {
          setGeneratedQuiz(null);
          setSelectedSummary(null);
        }}
      />
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="font-headline">
          Generador de Preguntas desde Resúmenes
        </CardTitle>
        <CardDescription>
          Selecciona uno de tus resúmenes guardados para crear un quiz
          personalizado con IA.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[300px]">
        {isLoading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Generando preguntas...</p>
            <p className="text-sm">
              Esto puede tardar unos momentos. La IA está creando un quiz para
              ti.
            </p>
          </div>
        ) : summaries.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {summaries.map(summary => (
                <Card key={summary.id} className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{summary.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Creado: {new Date(summary.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => handleGenerate(summary)}>
                    Generar Quiz
                  </Button>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
            <BookCheck className="h-12 w-12 mb-4 text-accent" />
            <p className="text-lg font-semibold">No tienes resúmenes guardados</p>
            <p>
              Ve a la sección de "Estudiar", genera un resumen y guárdalo para
              empezar.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
