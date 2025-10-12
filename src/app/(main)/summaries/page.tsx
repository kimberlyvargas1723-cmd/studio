// src/app/(main)/summaries/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { FileText, Trash2, BookX } from 'lucide-react';
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
import { getSavedSummaries, deleteSummary as deleteSummaryFromStorage } from '@/lib/services';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Renders the page that displays all summaries saved by the user.
 * It allows viewing and deleting saved summaries from local storage.
 */
export default function SummariesPage() {
  const [summaries, setSummaries] = useState<SavedSummary[]>([]);
  const [selectedSummary, setSelectedSummary] = useState<SavedSummary | null>(null);

  useEffect(() => {
    // Load summaries from storage when the component mounts and select the first one.
    const savedSummaries = getSavedSummaries();
    setSummaries(savedSummaries);
    if (savedSummaries.length > 0) {
      setSelectedSummary(savedSummaries[0]);
    }
  }, []);

  /**
   * Handles the deletion of a summary from local storage.
   * It updates the state to reflect the change and selects a new summary if needed.
   * @param {string} summaryId - The ID of the summary to delete.
   */
  const handleDelete = (summaryId: string) => {
    const updatedSummaries = deleteSummaryFromStorage(summaryId);
    setSummaries(updatedSummaries);
    
    // If the deleted summary was the selected one, select the next available summary or null.
    if (selectedSummary?.id === summaryId) {
      setSelectedSummary(updatedSummaries.length > 0 ? updatedSummaries[0] : null);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mis Resúmenes" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row lg:items-start">
        {/* Sidebar for listing saved summaries */}
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
                {summaries.length > 0 ? (
                  summaries.map((summary) => (
                  <Button
                    key={summary.id}
                    variant={selectedSummary?.id === summary.id ? "secondary" : "ghost"}
                    className="w-full justify-start text-left h-auto"
                    onClick={() => setSelectedSummary(summary)}
                  >
                    <FileText className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div className="flex flex-col flex-1 truncate">
                      <span className="truncate">{summary.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(summary.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </Button>
                  ))
                ) : (
                   <div className="flex h-48 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                    <BookX className="h-12 w-12" />
                    <p className="font-semibold">No hay resúmenes</p>
                    <p className="text-sm">Ve a "Temas de Estudio" para crear tu primero.</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main content area for displaying the selected summary */}
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
                <ScrollArea className="h-full">
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
                    <BookX className="h-12 w-12" />
                    <p className="text-lg font-semibold">No hay ningún resumen seleccionado.</p>
                    <p>Selecciona un resumen de la lista o crea uno nuevo en la sección de "Temas de Estudio".</p>
                </div>
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
