'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { summarizeContent } from '@/ai/flows/content-summarization';
import { Loader2, Link, BookCopy, FileText, Save, Book, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { readFileSync } from 'fs';

// This is a mock for client-side. In a real scenario, you'd fetch this.
const internalContentCache: Record<string, string> = {};


export default function StudyPage() {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);
    
    if (resource.type === 'internal') {
        // In a real app, you'd fetch the markdown file content.
        // We'll simulate it by having a pre-filled cache or a client-side fetch.
        // This is a placeholder for that logic. For this environment, we can't use fs.
        // A real implementation would be:
        // const response = await fetch(`/content/${resource.source}`);
        // const content = await response.text();
        // For now, let's use a placeholder.
        const content = `Contenido para ${resource.title} no se pudo cargar en este entorno de demostración, pero en la aplicación real, el contenido del archivo ${resource.source} aparecería aquí.`;
        setResourceContent(content);
    } else {
        setResourceContent(null);
        handleSummarizeUrl(resource);
    }
  };

  const handleSummarizeContent = async () => {
    if (!resourceContent) return;
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
     try {
      // We'll use the summarizeContent flow, but it expects a URL.
      // We will adapt by passing a data URI placeholder or modifying the flow.
      // For now, we'll just show the concept.
      const result = await summarizeContent({ url: `data:text/plain,${encodeURIComponent(resourceContent)}` });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('No se pudo generar el resumen del contenido interno.');
    } finally {
      setIsSummarizing(false);
    }
  }
  
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
  }

  const handleSaveSummary = () => {
    if (!summary || !selectedResource) return;

    const savedSummaries = JSON.parse(localStorage.getItem('savedSummaries') || '[]');
    const newSummary = {
      id: Date.now().toString(),
      title: `Resumen de: ${selectedResource.title}`,
      content: summary,
      originalUrl: selectedResource.source,
      createdAt: new Date().toISOString(),
    };
    
    savedSummaries.push(newSummary);
    localStorage.setItem('savedSummaries', JSON.stringify(savedSummaries));

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
                    disabled={isLoading}
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
            {isLoading && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Generando resumen del enlace...</p>
                <p className="text-sm">Esto puede tardar unos momentos.</p>
              </div>
            )}
             {isSummarizing && !summary && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Resumiendo el material de lectura...</p>
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {summary ? (
              <ScrollArea className="h-full">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  {summary}
                </div>
              </ScrollArea>
            ) : resourceContent ? (
                 <ScrollArea className="h-full">
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                       {/* This is a placeholder. Real content would be fetched from the md file. */}
                        En un entorno de producción, el contenido del archivo Markdown se mostraría aquí. 
                        Por ahora, este es un texto de ejemplo para mostrar cómo se vería la interfaz. 
                        El archivo seleccionado es <strong>{selectedResource?.source}</strong>.
                        <br/><br/>
                        Puedes hacer clic en <strong>"Resumir con IA"</strong> para generar un resumen de este texto.
                    </div>
                </ScrollArea>
            ) : !isLoading && !error && (
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
