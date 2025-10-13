// src/components/study-content-display.tsx
'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Save, BookCopy, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { CombinedMarkdownComponents } from '@/components/markdown-components';
import type { StudyResource } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Define las props para el componente `StudyContentDisplay`.
 * Este componente es puramente presentacional (dumb component).
 */
type StudyContentDisplayProps = {
  selectedResource: StudyResource | null;
  resourceContent: string | null;
  summary: string | null;
  isLoading: boolean;
  isSummarizing: boolean;
  isExtracting: boolean;
  error: string | null;
  onSummarize: () => void;
  onSaveSummary: () => void;
};

/**
 * Un componente presentacional responsable de renderizar el área de contenido principal de la página de Estudio.
 * Muestra el contenido del recurso seleccionado, un resumen generado, estados de carga o errores.
 * Incluye una barra de progreso de lectura que se actualiza en tiempo real.
 * Es controlado por un componente contenedor padre (`StudyContentContainer`).
 *
 * @param {StudyContentDisplayProps} props - Las props para renderizar el contenido de estudio.
 * @param {React.Ref<HTMLDivElement>} ref - Una ref para poder desplazar este componente a la vista.
 */
export const StudyContentDisplay = React.forwardRef<HTMLDivElement, StudyContentDisplayProps>(
  (
    {
      selectedResource,
      resourceContent,
      summary,
      isLoading,
      isSummarizing,
      isExtracting,
      error,
      onSummarize,
      onSaveSummary,
    },
    ref
  ) => {
    const [scrollProgress, setScrollProgress] = useState(0);

    /**
     * Calcula y actualiza el progreso del scroll.
     * Se llama en el evento `onScroll` del `ScrollArea`.
     * @param e - El evento de scroll del div.
     */
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      // Evita la división por cero si el contenido es más pequeño que el contenedor.
      if (scrollHeight <= clientHeight) {
        setScrollProgress(100);
        return;
      }
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setScrollProgress(progress);
    };
    
    const showProgressBar = !isLoading && (resourceContent || summary);

    return (
      <Card ref={ref} className="w-full lg:w-2/3">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
               {scrollProgress === 100 ? (
                <CheckCircle className="h-6 w-6 text-green-500 animate-fade-in-up" />
              ) : (
                <FileText className="h-6 w-6 text-primary" />
              )}
              <CardTitle className="font-headline">{selectedResource?.title || 'Contenido'}</CardTitle>
            </div>
            {summary && !isLoading ? (
              <Button variant="outline" size="sm" onClick={onSaveSummary}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Resumen
              </Button>
            ) : resourceContent && !summary ? (
              <Button variant="outline" size="sm" onClick={onSummarize} disabled={isLoading}>
                {isSummarizing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Resumir con IA
              </Button>
            ) : null}
          </div>
          <CardDescription>
            {selectedResource ? `Recurso: ${selectedResource.title}` : 'Aquí aparecerá el contenido del recurso que elijas.'}
          </CardDescription>
          {showProgressBar && (
             <div className="pt-4">
                <Progress value={scrollProgress} className="w-full h-2 transition-all duration-300" />
             </div>
          )}
        </CardHeader>
        <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-18.5rem)]">
          {isLoading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>{isExtracting ? 'Extrayendo texto de la imagen...' : isSummarizing ? 'Resumiendo el material...' : 'Cargando...'}</p>
              <p className="text-sm">Esto puede tardar unos momentos.</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : summary ? (
            <ScrollArea className="h-[calc(100vh-22rem)] pr-4" onScroll={handleScroll}>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={CombinedMarkdownComponents}>
                  {summary}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          ) : resourceContent ? (
            <ScrollArea className="h-[calc(100vh-22rem)] pr-4" onScroll={handleScroll}>
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={CombinedMarkdownComponents}>
                  {resourceContent}
                </ReactMarkdown>
              </article>
            </ScrollArea>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <BookCopy className="h-12 w-12" />
              <p className="text-lg font-semibold">Tu conocimiento, simplificado.</p>
              <p>Selecciona un recurso o sube una imagen para comenzar.</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);
StudyContentDisplay.displayName = 'StudyContentDisplay';
