// src/app/schedule/page.tsx
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
import { Check, Dot, Loader2, CalendarIcon } from 'lucide-react';
import { getPerformanceData } from '@/lib/services';
import { generateStudyPlanAction } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { StudyPlanOutput } from '@/ai/schemas';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const EXAM_DATE_KEY = 'examDate';

/**
 * Renderiza la página "Mi Horario Inteligente".
 * Este componente interactivo permite al usuario seleccionar una fecha de examen.
 * Al seleccionarla, dispara una Acción de Servidor para generar un plan de estudio
 * semanal personalizado, basado en los datos de rendimiento históricos del usuario
 * obtenidos de localStorage. Recuerda la fecha seleccionada para futuras visitas.
 */
export default function SchedulePage() {
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [studyPlan, setStudyPlan] = useState<StudyPlanOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Efecto para inicializar el estado del lado del cliente y cargar la fecha de examen guardada.
   */
  useEffect(() => {
    setIsClient(true);
    const savedDate = localStorage.getItem(EXAM_DATE_KEY);
    if (savedDate) {
      const date = new Date(savedDate);
      // Solo usa la fecha guardada si todavía está en el futuro.
      if (date > today) {
        setExamDate(date);
        handleGenerateStudyPlan(date);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Dispara la generación de un plan de estudio.
   * @param {Date} date - La fecha de examen seleccionada.
   */
  const handleGenerateStudyPlan = async (date: Date) => {
    setLoading(true);
    setError(null);
    setStudyPlan(null);

    localStorage.setItem(EXAM_DATE_KEY, date.toISOString());
    const daysUntilExam = differenceInDays(date, today);
    if (daysUntilExam < 1) {
      setError('Por favor, selecciona una fecha futura para el examen.');
      setLoading(false);
      return;
    }

    try {
      const performanceData = getPerformanceData();
      const result = await generateStudyPlanAction({ performanceData, daysUntilExam });
      
      if (result.error) throw new Error(result.error);
      setStudyPlan(result.plan!);

    } catch (e: any) {
      console.error(e);
      setError(e.message || 'No se pudo generar el plan de estudio. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Callback para cuando el usuario selecciona una nueva fecha de examen del calendario.
   * @param {Date | undefined} date - La fecha recién seleccionada.
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
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        <Card>
          <CardHeader>
             <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="font-headline">Tu Plan de Estudio Personalizado</CardTitle>
                  <CardDescription>
                    {examDate
                      ? `Plan generado para tu examen el ${format(examDate, "PPP", { locale: es })}.`
                      : 'Selecciona una fecha de examen para que Vairyx cree tu ruta de estudio.'}
                  </CardDescription>
                </div>
                {isClient && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !examDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {examDate ? format(examDate, "PPP", { locale: es }) : <span>Selecciona la fecha del examen</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={examDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => date < today}
                        locale={es}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
             </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
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
                      <div className="mt-3 space-y-3 border-l-2 border-primary/20 ml-2">
                        {week.tasks.map((day, dayIndex) => (
                          <div key={dayIndex} className="relative flex items-start gap-4 pl-8">
                             <div className="absolute -left-[1.1rem] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                                {day.date}
                            </div>
                            <div className="flex-1 rounded-md border p-3 bg-card hover:border-primary/50 transition-all">
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
                      <div className="flex flex-col items-center gap-3">
                        <CalendarIcon className="h-12 w-12" />
                        <p className="text-lg font-semibold">Tu plan de estudio personalizado aparecerá aquí.</p>
                         <p>Empieza por seleccionar la fecha de tu examen.</p>
                      </div>
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
