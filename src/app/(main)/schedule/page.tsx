'use client';
import { useState, useEffect } from 'react';
import { addDays, format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, Dot, Loader2 } from 'lucide-react';
import { getPerformanceData } from '@/lib/services';
import { generateStudyPlanAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { StudyPlanOutput } from '@/ai/flows/generate-study-plan';

/**
 * Renders the dynamic schedule page. Allows the user to select an exam date,
 * which triggers an AI-powered process to generate a personalized weekly study plan
 * based on their performance data.
 */
export default function SchedulePage() {
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [studyPlan, setStudyPlan] = useState<StudyPlanOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Ensures component only renders on the client to prevent hydration mismatch.
    setIsClient(true);
  }, []);

  /**
   * Generates a study plan by calling a server action. It fetches the user's
   * performance data from local storage and sends it to the AI flow.
   * @param {Date} date - The selected exam date.
   */
  const handleGenerateStudyPlan = async (date: Date) => {
    setLoading(true);
    setError(null);
    setStudyPlan(null);

    const daysUntilExam = differenceInDays(date, today);
    if (daysUntilExam < 1) {
      setError('Por favor, selecciona una fecha futura para el examen.');
      setLoading(false);
      return;
    }

    try {
      const performanceData = getPerformanceData();
      const result = await generateStudyPlanAction({ performanceData, daysUntilExam });
      
      if (result.error) {
        throw new Error(result.error);
      }

      setStudyPlan(result.plan!);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'No se pudo generar el plan de estudio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the selection of a new exam date from the calendar.
   * @param {Date | undefined} date - The newly selected date.
   */
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(0, 0, 0, 0);
      setExamDate(date);
      handleGenerateStudyPlan(date);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mi Horario Inteligente" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row">
        <Card className="w-full lg:w-1/3 lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="font-headline">Tu Fecha de Examen</CardTitle>
            <CardDescription>
              Selecciona la fecha de tu examen para que la IA genere tu plan de estudio personalizado.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {isClient ? (
              <Calendar
                mode="single"
                selected={examDate}
                onSelect={handleDateSelect}
                disabled={(date) => date < today}
                locale={es}
                className="rounded-md border"
              />
            ) : (
              <Skeleton className="w-[280px] h-[330px] rounded-md" />
            )}
          </CardContent>
        </Card>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle className="font-headline">Tu Plan de Estudio Semanal</CardTitle>
            <CardDescription>
              {examDate
                ? `Plan generado para tu examen el ${format(examDate, "PPP", { locale: es })}.`
                : 'Selecciona una fecha para ver tu plan.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[60vh] lg:h-[calc(100vh-18rem)] pr-4">
              {loading && (
                <div className="flex flex-col items-center justify-center text-muted-foreground h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p>Vairyx está creando tu plan de estudio...</p>
                  <p className="text-sm">Analizando tu rendimiento para personalizar tu ruta.</p>
                </div>
              )}
              {error && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {studyPlan && studyPlan.plan.length > 0 ? (
                <div className="space-y-6">
                  {studyPlan.plan.map((week, weekIndex) => (
                    <div key={weekIndex}>
                      <h3 className="font-headline text-lg font-semibold text-primary">Semana {week.week}: {week.focus}</h3>
                      <div className="mt-3 space-y-3 border-l-2 border-primary pl-6 ml-2">
                        {week.tasks.map((day, dayIndex) => (
                          <div key={dayIndex} className="relative flex items-start gap-4">
                             <div className="absolute -left-[35px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                                {day.date}
                            </div>
                            <div className="flex-1 rounded-md border p-3 bg-card hover:border-primary transition-all">
                               <p className="font-semibold">{day.day}: {day.task}</p>
                               <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${day.isReview ? 'bg-secondary text-secondary-foreground' : 'bg-accent/20 text-accent-foreground'}`}>
                                    {day.isReview ? 'Repaso' : 'Tema Nuevo'}
                                </span>
                               <span className="text-xs text-muted-foreground">{day.topic}</span>
                               </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !loading && !error && (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-center p-8">
                    <p>Tu plan de estudio personalizado aparecerá aquí una vez que selecciones una fecha.</p>
                    </div>
                )
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
