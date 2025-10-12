
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { Book, ExternalLink, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveSummary as saveSummaryToStorage } from '@/lib/services';
import { summarizeContentAction, extractTextFromImageAction } from '@/app/actions';
import { StudyContent } from '@/components/study-content';

/**
 * The main container component for the Study page.
 * It manages the state for the entire study experience, including resource selection,
 * content fetching, summarization, and image text extraction.
 * It now loads the Psychometric Guide by default.
 */
export default function StudyPage() {
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

  // On initial load, fetch and display the psychometric study guide.
  useEffect(() => {
    const fetchPsychometricGuide = async () => {
      const psychometricResource = studyResources.find(r => r.source === 'guia-psicometrico.md');
      if (psychometricResource) {
        handleResourceSelect(psychometricResource);
      }
    };
    fetchPsychometricGuide();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Scrolls the content card into view.
   */
  const scrollContentIntoView = () => {
    // Scrolls to the top of the main content area, useful on mobile.
    contentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /**
   * Handles the selection of a study resource from the list.
   * It fetches internal markdown content or provides instructions for external links.
   * @param {StudyResource} resource - The resource that was selected.
   */
  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);
    scrollContentIntoView();

    if (resource.type === 'internal') {
      setIsLoading(true);
      try {
        const response = await fetch(`/${resource.source}`);
        if (!response.ok) throw new Error(`Network response was not ok, status: ${response.status}`);
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
      window.open(resource.source, '_blank');
      setResourceContent(`Se está abriendo el recurso externo en una nueva pestaña. La IA no puede resumir PDFs o enlaces externos directamente, pero puedes subir una captura de pantalla del contenido si deseas un resumen.`);
      setIsLoading(false);
    }
  };

  /**
   * Triggers the AI summarization process for the currently displayed content
   * by calling a server action.
   */
  const handleSummarizeContent = async () => {
    if (!resourceContent) return;

    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    try {
      const result = await summarizeContentAction(resourceContent);
      if (result.error) throw new Error(result.error);
      setSummary(result.summary!);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'No se pudo generar el resumen del contenido.');
    } finally {
      setIsSummarizing(false);
    }
  };

  /**
   * Saves the generated summary to the user's local storage and shows a confirmation toast.
   */
  const handleSaveSummary = () => {
    if (!summary || !selectedResource) return;
    saveSummaryToStorage({ id: Date.now().toString(), title: `Resumen de: ${selectedResource.title}`, content: summary, originalUrl: selectedResource.source, createdAt: new Date().toISOString() });
    toast({ title: 'Resumen Guardado', description: 'Puedes encontrar tus resúmenes en la sección "Mis Resúmenes".' });
  };

  /**
   * Handles the image upload event, reads the image as a data URL,
   * and calls the server action to extract text from it.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
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

      try {
        const result = await extractTextFromImageAction(imageUrl);
        if (result.error) throw new Error(result.error);
        setResourceContent(result.textContent!);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'No se pudo extraer el texto de la imagen.');
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const isLoadingAny = isLoading || isSummarizing || isExtracting;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Temas de Estudio" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
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
                  <Button key={resource.source} variant="ghost" className="w-full justify-start text-left h-auto" onClick={() => handleResourceSelect(resource)} disabled={isLoadingAny}>
                    {resource.type === 'internal' ? <Book className="h-5 w-5 mr-3 text-muted-foreground" /> : <ExternalLink className="h-5 w-5 mr-3 text-muted-foreground" />}
                    <div className="flex flex-col"><span>{resource.title}</span><span className="text-xs text-muted-foreground">{resource.category}</span></div>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div ref={contentCardRef} className="w-full lg:w-2/3">
            <StudyContent
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
        </div>
      </main>
    </div>
  );
}
