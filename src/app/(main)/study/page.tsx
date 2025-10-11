'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { summarizeContent } from '@/ai/flows/content-summarization';
import { Loader2, Link, BookCopy, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function StudyPage() {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setIsLoading(true);
    try {
      const result = await summarizeContent({ url: resource.url });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen. El enlace podría no ser accesible o el contenido no es compatible. Intenta con otro recurso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Material de Estudio" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
        <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-headline">Recursos Oficiales</CardTitle>
            <CardDescription>
              Selecciona un enlace para que la IA lo resuma por ti.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {studyResources.map((resource) => (
                  <Button
                    key={resource.url}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto"
                    onClick={() => handleSummarize(resource)}
                    disabled={isLoading}
                  >
                    <Link className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{resource.title}</span>
                      <span className="text-xs text-muted-foreground">{resource.category}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <CardTitle className="font-headline">Resumen Inteligente</CardTitle>
            </div>
            <CardDescription>
              {selectedResource
                ? `Resumen de: ${selectedResource.title}`
                : 'Aquí aparecerá el resumen del recurso que elijas.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Generando resumen...</p>
                <p className="text-sm">Esto puede tardar unos momentos.</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {summary && (
              <ScrollArea className="h-full">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              </ScrollArea>
            )}
            {!isLoading && !summary && !error && (
               <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                <BookCopy className="h-12 w-12" />
                <p className="text-lg font-semibold">Tu conocimiento, simplificado.</p>
                <p>Selecciona un recurso de la izquierda para comenzar.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
