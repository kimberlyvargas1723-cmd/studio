'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { studyResources } from '@/lib/data';
import type { StudyResource } from '@/lib/types';
import { Loader2, BookCopy, FileText, Save, Book, ExternalLink, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { saveSummary as saveSummaryToStorage } from '@/lib/services';
import { summarizeContentAction, extractTextFromImageAction } from '@/app/actions';
import { StrategyBlock, FinalTipBlock } from '@/components/markdown-components';

// Custom components mapping for ReactMarkdown
const markdownComponents = {
  p: StrategyBlock, // We will check inside StrategyBlock if it applies
  // To add more, we can chain them or create a resolver component.
  // For now, this is simple. Let's check for FinalTipBlock inside StrategyBlock
};

const CombinedMarkdownComponents = {
    p: ({ children }: { children?: React.ReactNode }) => {
        const childArray = React.Children.toArray(children);
        if (childArray.length > 0 && typeof childArray[0] === 'object' && 'props' in childArray[0]) {
            const textContent = childArray[0].props.children;
            if (typeof textContent === 'string') {
                if (textContent.startsWith('Estrategia:')) {
                    return <StrategyBlock>{children}</StrategyBlock>;
                }
                if (textContent.startsWith('Consejo Final:')) {
                    return <FinalTipBlock>{children}</FinalTipBlock>;
                }
            }
        }
        return <p>{children}</p>;
    },
};


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

  useEffect(() => {
    const fetchGuide = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/GUIA_DE_ESTUDIO.md');
        if (!response.ok) throw new Error('No se pudo cargar la guía de estudio.');
        const content = await response.text();
        setResourceContent(content);
        setSelectedResource({ title: 'Guía de Estudio Personalizada', category: 'Introducción', type: 'internal', source: 'GUIA_DE_ESTUDIO.md' });
      } catch (e) {
        console.error('Failed to fetch study guide:', e);
        setError('No se pudo cargar la guía de estudio inicial.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuide();
  }, []);

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

  const handleSaveSummary = () => {
    if (!summary || !selectedResource) return;
    saveSummaryToStorage({ id: Date.now().toString(), title: `Resumen de: ${selectedResource.title}`, content: summary, originalUrl: selectedResource.source, createdAt: new Date().toISOString() });
    toast({ title: 'Resumen Guardado', description: 'Puedes encontrar tus resúmenes en la sección "Mis Resúmenes".' });
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
                <Button key="guia-de-estudio" variant="ghost" className="w-full justify-start text-left h-auto" onClick={() => handleResourceSelect({title: 'Guía de Estudio Personalizada', category: 'Introducción', type: 'internal', source: 'GUIA_DE_ESTUDIO.md'})} disabled={isLoadingAny}>
                  <Book className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div className="flex flex-col"><span>Guía de Estudio</span><span className="text-xs text-muted-foreground">Introducción</span></div>
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

        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle className="font-headline">{selectedResource?.title || 'Contenido'}</CardTitle>
              </div>
              {summary && !isLoadingAny && (
                <Button variant="outline" size="sm" onClick={handleSaveSummary}><Save className="mr-2 h-4 w-4" />Guardar Resumen</Button>
              )}
              {resourceContent && !summary && !selectedResource?.title.includes('Guía') && (
                <Button variant="outline" size="sm" onClick={handleSummarizeContent} disabled={isSummarizing || isExtracting}>
                  {(isSummarizing || isExtracting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Resumir con IA
                </Button>
              )}
            </div>
            <CardDescription>{selectedResource ? `Recurso: ${selectedResource.title}` : 'Aquí aparecerá el contenido del recurso que elijas.'}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
            {isLoadingAny && (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>{isExtracting ? 'Extrayendo texto de la imagen...' : isSummarizing ? 'Resumiendo el material...' : 'Cargando...'}</p>
                <p className="text-sm">Esto puede tardar unos momentos.</p>
              </div>
            )}
            
            {error && !isLoadingAny && (
              <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
            )}

            {!isLoadingAny && !error && (
              summary ? (
                <ScrollArea className="h-[calc(100vh-20rem)]"><div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed"><ReactMarkdown remarkPlugins={[remarkGfm]} components={CombinedMarkdownComponents}>{summary}</ReactMarkdown></div></ScrollArea>
              ) : resourceContent ? (
                <ScrollArea className="h-[calc(100vh-20rem)]"><article className="prose prose-sm dark:prose-invert max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]} components={CombinedMarkdownComponents}>{resourceContent}</ReactMarkdown></article></ScrollArea>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground"><BookCopy className="h-12 w-12" /><p className="text-lg font-semibold">Tu conocimiento, simplificado.</p><p>Selecciona un recurso o sube una imagen para comenzar.</p></div>
              )
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
