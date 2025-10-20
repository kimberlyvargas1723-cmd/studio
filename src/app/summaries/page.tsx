// src/app/summaries/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SavedSummary } from '@/lib/types';
import { FileText, Trash2, BookX, ArrowLeft, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getSavedSummaries, deleteSummaryFromStorage } from '@/lib/services';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

/**
 * El contenido principal de la página de resúmenes.
 * Se separa en un componente hijo para poder usar el hook `useSearchParams`
 * dentro de un `<Suspense>`.
 */
function SummariesPageContent() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<SavedSummary | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  /**
   * Efecto para cargar los resúmenes guardados desde localStorage al montar el componente.
   * También selecciona un resumen si se provee un `id` en la URL.
   */
  useEffect(() => {
    const savedSummaries = getSavedSummaries();
    setSummaries(savedSummaries);

    const summaryIdFromUrl = searchParams.get('id');
    if (summaryIdFromUrl) {
      const summaryToSelect = savedSummaries.find(s => s.id === summaryIdFromUrl);
      setSelectedSummary(summaryToSelect || null);
    } else if (savedSummaries.length > 0) {
      // Si no hay id en la URL, selecciona el primer resumen de la lista.
      setSelectedSummary(savedSummaries[0]);
    }
  }, [searchParams]);

  /**
   * Maneja la eliminación de un resumen.
   * Llama al servicio para eliminarlo del localStorage, actualiza el estado local
   * y ajusta el resumen seleccionado.
   * @param {string} summaryId - El ID del resumen a eliminar.
   */
  const handleDelete = (summaryId: string) => {
    const updatedSummaries = deleteSummaryFromStorage(summaryId);
    setSummaries(updatedSummaries);
    
    // Si el resumen eliminado era el que estaba seleccionado, selecciona el primero de la nueva lista.
    if (selectedSummary?.id === summaryId) {
      setSelectedSummary(updatedSummaries.length > 0 ? updatedSummaries[0] : null);
    }
    // Redirige para limpiar el query param `id` si es que existía.
    router.replace('/summaries');
  }

  // Vista para cuando no hay resúmenes guardados.
  if (summaries.length === 0) {
    return (
      <main className="flex flex-1 items-center justify-center text-center p-4">
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="font-headline">Aún no tienes resúmenes</CardTitle>
                <CardDescription>Cuando generes un resumen con IA en la sección de "Temas de Estudio", aparecerán aquí para que puedas revisarlos cuando quieras.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                    <BookX className="h-16 w-16" />
                    <Button asChild>
                      <Link href="/study">
                        <ArrowLeft className="mr-2" />
                        Ir a Temas de Estudio
                      </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      </main>
    );
  }

  // Vista principal con la lista de resúmenes y el contenido del seleccionado.
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
      {/* Columna de la lista de resúmenes */}
      <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="font-headline">Resúmenes Guardados</CardTitle>
          <CardDescription>
            Aquí están todos los resúmenes que has generado con la IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] lg:h-[calc(100vh-20rem)]">
            <div className="space-y-2">
              {summaries.map((summary) => (
                <Button
                  key={summary.id}
                  variant={selectedSummary?.id === summary.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto"
                  onClick={() => setSelectedSummary(summary)}
                >
                  <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                  <div className="flex flex-col flex-1 truncate">
                    <span className="truncate font-medium">{summary.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(summary.createdAt).toLocaleString()}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Columna del contenido del resumen seleccionado */}
      <Card className="w-full lg:w-2/3">
        {selectedSummary ? (
          <>
          <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                      <CardTitle className="font-headline">{selectedSummary.title}</CardTitle>
                      <CardDescription>
                          Resumen generado el {new Date(selectedSummary.createdAt).toLocaleDateString()}.
                      </CardDescription>
                  </div>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" aria-label="Eliminar resumen">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente
                          tu resumen guardado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(selectedSummary.id)}>
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </div>
          </CardHeader>
          <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)]">
              <ScrollArea className="h-full pr-4">
                <article className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {selectedSummary.content}
                  </ReactMarkdown>
                </article>
              </ScrollArea>
          </CardContent>
          </>
        ) : (
          <CardContent className="min-h-[60vh] lg:min-h-[calc(100vh-16rem)] flex items-center justify-center">
               <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <FileText className="h-12 w-12" />
                  <p className="text-lg font-semibold">Selecciona un resumen.</p>
                  <p>Elige un resumen de la lista para ver su contenido aquí.</p>
              </div>
          </CardContent>
        )}
      </Card>
    </main>
  );
}

/**
 * Renderiza la página que muestra todos los resúmenes guardados por el usuario.
 * Utiliza Suspense para manejar los parámetros de búsqueda de la URL en el cliente
 * de forma segura y evitar errores de hidratación en Next.js.
 */
export default function SummariesPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mis Resúmenes" />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }>
        <SummariesPageContent />
      </Suspense>
    </div>
  );
}
