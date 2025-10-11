'use client';
import { useState } from 'react';
import { addDays, format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { studyResources } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type StudyDay = {
  date: Date;
  task: string;
  category: string;
};

export default function SchedulePage() {
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [studyPlan, setStudyPlan] = useState<StudyDay[]>([]);

  const generateStudyPlan = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysUntilExam = differenceInDays(date, today);

    if (daysUntilExam < 1) {
      setStudyPlan([]);
      return;
    }

    const plan: StudyDay[] = [];
    // Distribute resources over the available days
    for (let i = 0; i < daysUntilExam; i++) {
      const resource = studyResources[i % studyResources.length];
      const taskDate = addDays(today, i);
      plan.push({
        date: taskDate,
        task: `Repasar: ${resource.title}`,
        category: resource.category,
      });
    }
     // Add a final review day
    if (daysUntilExam > 0) {
      plan.push({
        date: date,
        task: '¡Día del Examen! Repaso final y descanso.',
        category: 'Examen',
      });
    }


    setStudyPlan(plan);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      date.setHours(0,0,0,0)
      setExamDate(date);
      generateStudyPlan(date);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mi Horario" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 lg:flex-row">
        <Card className="w-full lg:w-1/3">
          <CardHeader>
            <CardTitle className="font-headline">Selecciona tu Fecha de Examen</CardTitle>
            <CardDescription>
              La IA generará un plan de estudio personalizado para ti.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={examDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date()}
              locale={es}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        <Card className="w-full lg:w-2/3">
          <CardHeader>
            <CardTitle className="font-headline">Tu Plan de Estudio</CardTitle>
            <CardDescription>
              {examDate
                ? `Plan generado para tu examen el ${format(examDate, "PPP", { locale: es })}.`
                : 'Selecciona una fecha para ver tu plan.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {studyPlan.length > 0 ? (
                <div className="space-y-4">
                  {studyPlan.map((day, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                          {format(day.date, 'd')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(day.date, 'MMM', { locale: es })}
                        </div>
                      </div>
                      <div className="flex-1 rounded-md border p-4">
                        <p className="font-semibold">{day.task}</p>
                        <Badge variant="secondary" className="mt-2">{day.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <p>Tu plan de estudio aparecerá aquí.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
