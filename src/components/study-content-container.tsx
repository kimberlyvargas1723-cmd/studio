// src/components/study-content-container.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { saveSummary } from '@/lib/services';
import { summarizeContentAction, extractTextFromImageAction, generateFlashcardsAction } from '@/app/actions';
import { StudyResourceSelector } from '@/components/study-resource-selector';
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
 * de servidor para resumir, extraer texto y generar flashcards, y la persistencia de los resúmenes.
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
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const contentCardRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /**
   * Efecto que selecciona un recurso por defecto al cargar la página.
   * Esto asegura que el usuario vea contenido relevante inmediatamente,
   * pero solo si no ha seleccionado ya un recurso.
   */
  useEffect(() => {
    // Solo establece un recurso por defecto si el usuario no ha seleccionado uno todavía.
    if (!selectedResource) {
      const defaultResource = studyResources.find(r => r.source === 'guia-psicometrico.md');
      if (defaultResource) {
        handleResourceSelect(defaultResource);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Desplaza la vista para que la tarjeta de contenido principal sea visible.
   * Útil en dispositivos móviles después de seleccionar un recurso.
   */
  const scrollContentIntoView = () => {
    if (window.innerWidth < 1024) { // Solo en móvil/tablet
      contentCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
    scrollContentIntoView();

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
   * @param {string} imageUrl - El Data URI de la imagen subida.
   * @param {File} file - El objeto de archivo original para obtener el nombre.
   */
  const handleImageExtraction = async (imageUrl: string, file: File) => {
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
  
    /**
   * Llama a la acción de servidor para generar flashcards a partir del resumen.
   */
  const handleGenerateFlashcards = async () => {
    if (!summary || !selectedResource) return;
    setIsGeneratingFlashcards(true);
    
    const result = await generateFlashcardsAction({
      content: summary,
      topic: selectedResource.title,
    });
    
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error al crear flashcards', description: result.error });
    } else {
      toast({ title: '¡Flashcards Creadas!', description: 'Tu nuevo mazo está listo para practicar en el Gimnasio Mental.' });
      // TODO: Guardar las flashcards generadas y redirigir al usuario
      // a la página de práctica de flashcards cuando esté implementada.
      console.log(result.flashcards);
      router.push('/flashcards');
    }
    
    setIsGeneratingFlashcards(false);
  };


  const isLoadingAny = isLoading || isSummarizing || isExtracting || isGeneratingFlashcards;

  return (
    <>
      <StudyResourceSelector 
        resources={studyResources}
        selectedResource={selectedResource}
        onResourceSelect={handleResourceSelect}
        onImageExtraction={handleImageExtraction}
        isLoading={isLoadingAny}
      />
      <StudyContentDisplay
        ref={contentCardRef}
        selectedResource={selectedResource}
        resourceContent={resourceContent}
        summary={summary}
        isLoading={isLoadingAny}
        isSummarizing={isSummarizing}
        isExtracting={isExtracting}
        isGeneratingFlashcards={isGeneratingFlashcards}
        error={error}
        onSummarize={handleSummarizeContent}
        onSaveSummary={handleSaveSummary}
        onGenerateFlashcards={handleGenerateFlashcards}
      />
    </>
  );
}
