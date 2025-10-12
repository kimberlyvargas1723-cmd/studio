// src/app/(main)/study/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { summarizeContent } from '@/ai/flows/content-summarization';
import { Loader2, BookCopy, FileText, Save, Book, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { saveSummary as saveSummaryToStorage } from '@/lib/services';

/**
 * Renders the study page, allowing users to select study resources,
 * view their content, and generate AI-powered summaries.
 */
export default function StudyPage() {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  /**
   * Fetches and displays the content of a selected study resource.
   * If the resource is external, it triggers summarization directly.
   * @param resource The study resource to handle.
   */
  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);
    setIsLoading(true);

    if (resource.type === 'internal') {
      try {
        // Fetch the content of the internal markdown file.
        const response = await fetch(`/estudio/${resource.source}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const content = await response.text();
        setResourceContent(content);
      } catch (e) {
        console.error('Failed to fetch internal resource:', e);
        setError('No se pudo cargar el contenido del recurso.');
        setResourceContent(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For external URLs, proceed to summarize directly.
      handleSummarizeUrl(resource);
    }
  };

  /**
   * Generates a summary for the currently displayed internal content.
   */
  const handleSummarizeContent = async () => {
    if (!resourceContent) return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    try {
      // Use a data URI to pass the local content to the summarization flow.
      const result = await summarizeContent({ url: `data:text/plain;charset=utf-8,${encodeURIComponent(resourceContent)}` });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen del contenido interno.');
    } finally {
      setIsSummarizing(false);
    }
  };
  
  /**
   * Generates a summary from an external URL.
   * @param resource The external study resource to summarize.
   */
  const handleSummarizeUrl = async (resource: StudyResource) => {
    setIsLoading(true);
    setSummary(null);
    setError(null);

    try {
      const result = await summarizeContent({ url: resource.source });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen. El enlace podría no ser accesible o el contenido no es compatible. Intenta con otro recurso.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Saves the current summary to the browser's local storage.
   */
  const handleSaveSummary = () => {
    if (!summary || !selectedResource) return;

    saveSummaryToStorage({
      id: Date.now().toString(),
      title: `Resumen de: ${selectedResource.title}`,
      content: summary,
      originalUrl: selectedResource.source,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: 'Resumen Guardado',
      description: 'Puedes encontrar tus resúmenes en la sección "Mis Resúmenes".',
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Temas de Estudio" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
        <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-headline">Recursos de Estudio</CardTitle>
            <CardDescription>
              Selecciona un tema para leer o un enlace para resumir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                {studyResources.map((resource) => (
                  <Button
                    key={resource.source}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto"
                    onClick={() => handleResourceSelect(resource)}
                    disabled={isLoading || isSummarizing}
                  >
                    {resource.type === 'internal' ? <Book className="h-5 w-5 mr-3 text-muted-foreground" /> : <ExternalLink className="h-5 w-5 mr-3 text-muted-foreground" />}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">{selectedResource?.type === 'internal' ? 'Material de Lectura' : 'Resumen Inteligente'}</CardTitle>
              </div>
              {summary && !isLoading && (
                <Button variant="outline" size="sm" onClick={handleSaveSummary}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Resumen
                </Button>
              )}
               {resourceContent && !summary && (
                <Button variant="outline" size="sm" onClick={handleSummarizeContent} disabled={isSummarizing}>
                    {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Resumir con IA
                </Button>
              )}
            </div>
            <CardDescription>
              {selectedResource
                ? `Recurso: ${selectedResource.title}`
                : 'Aquí aparecerá el contenido del recurso que elijas.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
            {(isLoading || isSummarizing) && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>{isSummarizing ? 'Resumiendo el material...' : 'Generando resumen del enlace...'}</p>
                <p className="text-sm">Esto puede tardar unos momentos.</p>
              </div>
            )}
            
            {error && !isLoading && !isSummarizing && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Aler>
            )}

            {!isLoading && !isSummarizing && !error && (
              summary ? (
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    {summary}
                  </div>
                </ScrollArea>
              ) : resourceContent ? (
                   <ScrollArea className="h-[calc(100vh-20rem)]">
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: resourceContent }} />
                  </ScrollArea>
              ) : (
                 <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <BookCopy className="h-12 w-12" />
                  <p className="text-lg font-semibold">Tu conocimiento, simplificado.</p>
                  <p>Selecciona un recurso de la izquierda para comenzar.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
