// src/app/(main)/study/page.tsx
'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
 * Renders the study page, which allows users to select study resources from a list.
 * It can display internal markdown content, open external links,
 * and trigger an AI-powered summarization for internal content.
 */
export default function StudyPage() {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // On initial load, fetch and display the personalized study guide.
    const fetchGuide = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/GUIA_DE_ESTUDIO.md');
        if (!response.ok) {
          throw new Error('No se pudo cargar la guía de estudio.');
        }
        const content = await response.text();
        setResourceContent(content);
        setSelectedResource({
          title: 'Guía de Estudio Personalizada',
          category: 'Introducción',
          type: 'internal',
          source: 'GUIA_DE_ESTUDIO.md',
        });
      } catch (e) {
        console.error('Failed to fetch study guide:', e);
        setError('No se pudo cargar la guía de estudio inicial.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuide();
  }, []);

  /**
   * Handles the selection of a study resource.
   * For internal resources, it fetches and displays the markdown content.
   * For external URLs, it opens the link in a new tab.
   * @param {StudyResource} resource - The study resource to handle.
   */
  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);

    const sourceFile = resource.type === 'internal' ? `/estudio/${resource.source}` : `/${resource.source}`;

    if (resource.type === 'internal') {
      setIsLoading(true);
      try {
        const response = await fetch(sourceFile);
        if (!response.ok) {
            throw new Error(`Network response was not ok, status: ${response.status}`);
        }
        const content = await response.text();
        setResourceContent(content);
      } catch (e) {
        console.error('Failed to fetch internal resource:', e);
        setError('No se pudo cargar el contenido del recurso. Asegúrate de que el archivo existe en la carpeta `public/estudio`.');
        setResourceContent(null);
      } finally {
        setIsLoading(false);
      }
    } else {
        window.open(resource.source, '_blank');
        setResourceContent(`Se está abriendo el recurso externo en una nueva pestaña. La IA no puede resumir PDFs o enlaces externos directamente, pero puedes copiar y pegar el texto si deseas un resumen.`);
        setIsLoading(false);
    }
  };

  /**
   * Triggers the AI summarization process for the currently displayed internal content.
   * The content is passed as a data URI to the AI flow.
   */
  const handleSummarizeContent = async () => {
    if (!resourceContent || selectedResource?.type !== 'internal') return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    try {
      const result = await summarizeContent({ url: `data:text/markdown;charset=utf-8,${encodeURIComponent(resourceContent)}` });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen del contenido.');
    } finally {
      setIsSummarizing(false);
    }
  };
  

  /**
   * Saves the currently generated summary to the browser's local storage
   * and shows a confirmation toast.
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
        {/* Sidebar with list of study resources */}
        <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-headline">Recursos de Estudio</CardTitle>
            <CardDescription>
              Selecciona un tema para leer o un enlace para abrir.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)]">
              <div className="space-y-2">
                <Button
                    key="guia-de-estudio"
                    variant="ghost"
                    className="w-full justify-start text-left h-auto"
                    onClick={() => handleResourceSelect({title: 'Guía de Estudio Personalizada', category: 'Introducción', type: 'internal', source: 'GUIA_DE_ESTUDIO.md'})}
                    disabled={isLoading || isSummarizing}
                  >
                    <Book className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>Guía de Estudio</span>
                      <span className="text-xs text-muted-foreground">Introducción</span>
                    </div>
                  </Button>
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

        {/* Main content area for displaying resources and summaries */}
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">{selectedResource?.title.includes('Guía') ? 'Guía de Estudio' : (selectedResource?.type === 'internal' ? 'Material de Lectura' : 'Recurso Externo')}</CardTitle>
              </div>
              {summary && !isLoading && (
                <Button variant="outline" size="sm" onClick={handleSaveSummary}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Resumen
                </Button>
              )}
               {resourceContent && selectedResource?.type === 'internal' && !summary && !selectedResource?.title.includes('Guía') &&(
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
                <p>{isSummarizing ? 'Resumiendo el material...' : 'Cargando...'}</p>
                <p className="text-sm">Esto puede tardar unos momentos.</p>
              </div>
            )}
            
            {error && !isLoading && !isSummarizing && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!isLoading && !isSummarizing && !error && (
              summary ? (
                <ScrollArea className="h-[calc(100vh-20rem)]">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                  </div>
                </ScrollArea>
              ) : resourceContent ? (
                   <ScrollArea className="h-[calc(100vh-20rem)]">
                        <article className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{resourceContent}</ReactMarkdown>
                        </article>
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
