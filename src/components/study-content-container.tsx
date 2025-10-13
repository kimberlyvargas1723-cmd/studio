// src/components/study-content-container.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { Book, ExternalLink, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { saveSummary } from '@/lib/services';
import { summarizeContentAction, extractTextFromImageAction } from '@/app/actions';
import { StudyContentDisplay } from '@/components/study-content-display';

/**
 * Define las props para el `StudyContentContainer`.
 * @param {string} [learningStyle] - El estilo de aprendizaje del usuario (ej. 'V', 'A', 'R', 'K').
 */
type StudyContentContainerProps = {
  learningStyle?: string;
};

/**
 * Un componente contenedor que gestiona toda la lógica de la página de estudio.
 * Maneja la selección de recursos, la carga de contenido, la llamada a las acciones
 * de servidor para resumir o extraer texto, y la persistencia de los resúmenes.
 *
 * @param {StudyContentContainerProps} props - Las props del componente.
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

  /**
   * Efecto que selecciona un recurso por defecto al cargar la página.
   * Esto asegura que el usuario vea contenido relevante inmediatamente.
   */
  useEffect(() => {
    const defaultResource = studyResources.find(r => r.source === 'guia-psicometrico.md');
    if (defaultResource && !selectedResource) {
      handleResourceSelect(defaultResource);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Desplaza la vista para que la tarjeta de contenido principal sea visible.
   * Útil en dispositivos móviles después de seleccionar un recurso.
   */
  const scrollContentIntoView = () => {
    contentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /**
   * Maneja la selección de un recurso de estudio.
   * Resetea el estado y carga el contenido del recurso seleccionado.
   * Si es un recurso interno (Markdown), lo carga con `fetch`.
   * Si es externo (URL), abre una nueva pestaña.
   * @param {StudyResource} resource - El recurso de estudio seleccionado.
   */
  const handleResourceSelect = async (resource: StudyResource) => {
    setSelectedResource(resource);
    setSummary(null);
    setError(null);
    setResourceContent(null);
    if (window.innerWidth < 1024) { // Solo en móvil/tablet
      scrollContentIntoView();
    }

    if (resource.type === 'internal') {
      setIsLoading(true);
      try {
        const response = await fetch(`/lecturas/${resource.source}`);
        if (!response.ok) throw new Error(`Error ${response.status}: No se pudo encontrar el recurso de estudio.`);
        const content = await response.text();
        setResourceContent(content);
      } catch (e: any) {
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

  /**
   * Llama a la acción de servidor para resumir el contenido actual.
   * Pasa el contenido y el estilo de aprendizaje del usuario.
   */
  const handleSummarizeContent = async () => {
    if (!resourceContent) return;
    setIsSummarizing(true);
    setError(null);
    setSummary(null);
    
    // El contenido se pasa como un Data URI para que Genkit lo pueda procesar.
    const contentToSummarize = `data:text/markdown;charset=utf-8,${encodeURIComponent(resourceContent)}`;
    const result = await summarizeContentAction({ url: contentToSummarize, learningStyle });
    
    if (result.error) {
      setError(result.error);
      toast({ variant: 'destructive', title: 'Error al resumir', description: result.error });
    } else {
      setSummary(result.summary!);
    }
    setIsSummarizing(false);
  };

  /**
   * Guarda el resumen generado en localStorage y redirige al usuario
   * a la página de resúmenes para ver el resumen que acaba de guardar.
   */
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

  /**
   * Maneja la subida de una imagen por parte del usuario.
   * Convierte la imagen a un Data URI y llama a la acción de servidor para extraer su texto.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio del input de archivo.
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

      const result = await extractTextFromImageAction(imageUrl);
      
      if (result.error) {
        setError(result.error);
        toast({ variant: 'destructive', title: 'Error de extracción', description: result.error });
      } else {
        setResourceContent(result.textContent!);
      }
      setIsExtracting(false);
    };
    reader.readAsDataURL(file);
    // Resetea el valor del input para poder subir el mismo archivo de nuevo.
    e.target.value = '';
  };

  const isLoadingAny = isLoading || isSummarizing || isExtracting;

  return (
    <>
      {/* Columna de selección de recursos */}
      <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="font-headline">Recursos de Estudio</CardTitle>
          <CardDescription>Selecciona un tema, un enlace, o sube tus apuntes.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)] pr-2">
            <div className="space-y-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
              <Button variant="outline" className="w-full justify-start text-left h-auto py-2" onClick={() => fileInputRef.current?.click()} disabled={isLoadingAny}>
                {isExtracting ? <Loader2 className="h-5 w-5 mr-3 animate-spin"/> : <Upload className="h-5 w-5 mr-3 text-muted-foreground" />}
                <div className="flex flex-col">
                  <span>Subir Apuntes (Imagen)</span>
                  <span className="text-xs text-muted-foreground">Extraer texto con IA</span>
                </div>
              </Button>
              {studyResources.map((resource) => (
                <Button key={resource.source} variant={selectedResource?.source === resource.source ? "secondary" : "ghost"} className="w-full justify-start text-left h-auto py-2" onClick={() => handleResourceSelect(resource)} disabled={isLoadingAny}>
                  {resource.type === 'internal' ? <Book className="h-5 w-5 mr-3 text-muted-foreground" /> : <ExternalLink className="h-5 w-5 mr-3 text-muted-foreground" />}
                  <div className="flex flex-col flex-1 truncate">
                    <span className="font-medium">{resource.title}</span>
                    <span className="text-xs text-muted-foreground">{resource.category}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Componente de visualización de contenido */}
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
