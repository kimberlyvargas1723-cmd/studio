// src/components/study-content-container.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { Book, ExternalLink, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveSummary } from '@/lib/services';
import { summarizeContentAction, extractTextFromImageAction } from '@/app/actions';
import { StudyContentDisplay } from '@/components/study-content-display';

type StudyContentContainerProps = {
  learningStyle?: string;
};

/**
 * A container component that manages the state and logic for the study page.
 * It handles resource selection, content fetching, summarization, and image text extraction,
 * passing the necessary data and handlers to the `StudyContentDisplay` component.
 * It now also receives the learning style and handles navigation on summary save.
 */
export function StudyContentContainer({ learningStyle }: StudyContentContainerProps) {
  const [selectedResource, setSelectedResource] = useState<StudyResource | null>(null);
  const [resourceContent, setResourceContent] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentCardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const psychometricResource = studyResources.find(r => r.source === 'guia-psicometrico.md');
    if (psychometricResource && !selectedResource) {
      handleResourceSelect(psychometricResource);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollContentIntoView = () => {
    contentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);
    scrollContentIntoView();

    if (resource.type === 'internal') {
      setIsLoading(true);
      try {
        const response = await fetch(`/lecturas/${resource.source}`);
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo encontrar el recurso de estudio.`);
        const content = await response.text();
        setResourceContent(content);
      } catch (e: any) {
        console.error('Failed to fetch internal resource:', e);
        setError(e.message || 'No se pudo cargar el contenido del recurso.');
        setResourceContent(null);
      } finally {
        setIsLoading(false);
      }
    } else {
      window.open(resource.source, '_blank');
      setResourceContent(`Se está abriendo el recurso externo en una nueva pestaña. La IA no puede resumir PDFs o enlaces externos directamente, pero puedes subir una captura de pantalla del contenido si deseas un resumen.`);
      setIsLoading(false);
    }
  };

  const handleSummarizeContent = async () => {
    if (!resourceContent) return;
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    const contentToSummarize = `data:text/markdown;charset=utf-8,${encodeURIComponent(resourceContent)}`;
    const result = await summarizeContentAction({ url: contentToSummarize, learningStyle });
    
    if (result.error) {
      setError(result.error);
    } else {
      setSummary(result.summary!);
    }
    setIsSummarizing(false);
  };

  const handleSaveSummary = () => {
    if (!summary || !selectedResource) return;
    const newSummaryId = Date.now().toString();
    saveSummary({ 
        id: newSummaryId, 
        title: `Resumen de: ${selectedResource.title}`, 
        content: summary, 
        originalUrl: selectedResource.source, 
        createdAt: new Date().toISOString() 
    });
    toast({ title: 'Resumen Guardado', description: 'Tu resumen ha sido guardado exitosamente.' });
    router.push(`/summaries?id=${newSummaryId}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const imageUrl = event.target?.result as string;
      if (!imageUrl) return;

      setIsExtracting(true);
      setError(null);
      setSummary(null);
      setResourceContent(null);
      setSelectedResource({ title: 'Apuntes Subidos', category: 'OCR', type: 'internal', source: file.name });
      scrollContentIntoView();

      const result = await extractTextFromImageAction(imageUrl);
      
      if (result.error) {
        setError(result.error);
      } else {
        setResourceContent(result.textContent!);
      }
      setIsExtracting(false);
    };
    reader.readAsDataURL(file);
  };

  const isLoadingAny = isLoading || isSummarizing || isExtracting;

  return (
    <>
      <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="font-headline">Recursos de Estudio</CardTitle>
          <CardDescription>Selecciona un tema, un enlace, o sube tus apuntes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)]">
            <div className="space-y-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              <Button variant="outline" className="w-full justify-start text-left h-auto" onClick={() => fileInputRef.current?.click()} disabled={isLoadingAny}>
                <Upload className="h-5 w-5 mr-3 text-muted-foreground" />
                <div className="flex flex-col"><span>Subir Apuntes (Imagen)</span><span className="text-xs text-muted-foreground">Extraer texto con IA</span></div>
              </Button>
              {studyResources.map((resource) => (
                <Button key={resource.source} variant={selectedResource?.source === resource.source ? "secondary" : "ghost"} className="w-full justify-start text-left h-auto" onClick={() => handleResourceSelect(resource)} disabled={isLoadingAny}>
                  {resource.type === 'internal' ? <Book className="h-5 w-5 mr-3 text-muted-foreground" /> : <ExternalLink className="h-5 w-5 mr-3 text-muted-foreground" />}
                  <div className="flex flex-col"><span>{resource.title}</span><span className="text-xs text-muted-foreground">{resource.category}</span></div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <StudyContentDisplay
        ref={contentCardRef}
        selectedResource={selectedResource}
        resourceContent={resourceContent}
        summary={summary}
        isLoading={isLoadingAny}
        isSummarizing={isSummarizing}
        isExtracting={isExtracting}
        error={error}
        onSummarize={handleSummarizeContent}
        onSaveSummary={handleSaveSummary}
      />
    </>
  );
}
