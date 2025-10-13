// src/components/study-resource-selector.tsx
'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Book, ExternalLink, Upload, Loader2 } from 'lucide-react';
import type { StudyResource } from '@/lib/types';

/**
 * Define las props para el `StudyResourceSelector`.
 * Este componente es de presentación y delega la lógica a su padre.
 */
type StudyResourceSelectorProps = {
  resources: StudyResource[];
  selectedResource: StudyResource | null;
  onResourceSelect: (resource: StudyResource) => void;
  onImageExtraction: (imageUrl: string, file: File) => void;
  isLoading: boolean;
};

/**
 * Un componente presentacional que muestra la lista de recursos de estudio
 * y el botón para subir imágenes.
 * @param {StudyResourceSelectorProps} props - Props para renderizar y manejar interacciones.
 */
export function StudyResourceSelector({ 
    resources, 
    selectedResource, 
    onResourceSelect, 
    onImageExtraction,
    isLoading 
}: StudyResourceSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Maneja la selección de un archivo de imagen.
   * Lee el archivo como Data URI y llama al callback `onImageExtraction`.
   * @param {React.ChangeEvent<HTMLInputElement>} e - El evento de cambio del input.
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      if (imageUrl) {
        onImageExtraction(imageUrl, file);
      }
    };
    reader.readAsDataURL(file);
    // Resetea el valor del input para poder subir el mismo archivo de nuevo.
    e.target.value = '';
  };

  return (
    <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
      <CardHeader>
        <CardTitle className="font-headline">Recursos de Estudio</CardTitle>
        <CardDescription>Selecciona un tema, un enlace, o sube tus apuntes.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)] pr-2">
          <div className="space-y-2">
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            <Button 
                variant="outline" 
                className="w-full justify-start text-left h-auto py-2" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={isLoading}
            >
              {isLoading && !selectedResource ? <Loader2 className="h-5 w-5 mr-3 animate-spin"/> : <Upload className="h-5 w-5 mr-3 text-muted-foreground" />}
              <div className="flex flex-col">
                <span>Subir Apuntes (Imagen)</span>
                <span className="text-xs text-muted-foreground">Extraer texto con IA</span>
              </div>
            </Button>
            {resources.map((resource) => (
              <Button 
                key={resource.source} 
                variant={selectedResource?.source === resource.source ? "secondary" : "ghost"} 
                className="w-full justify-start text-left h-auto py-2" 
                onClick={() => onResourceSelect(resource)} 
                disabled={isLoading}
              >
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
  );
}
