// src/components/study-content-display.tsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Save, BookCopy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CombinedMarkdownComponents } from '@/components/markdown-components';
import type { StudyResource } from '@/lib/types';

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
    return (
      <Card ref={ref} className="w-full lg:w-2/3">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
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
        </CardHeader>
        <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
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
            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={CombinedMarkdownComponents}>
                  {summary}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          ) : resourceContent ? (
            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
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
