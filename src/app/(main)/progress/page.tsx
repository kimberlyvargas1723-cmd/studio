// src/app/(main)/progress/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { initialPerformance } from '@/lib/data';
import type { PerformanceData, Feedback } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, BookX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getFeedbackHistory, getPerformanceData } from '@/lib/services';

/**
 * Renders the progress page, which displays the user's performance on quizzes
 * through a bar chart and shows a history of feedback provided by the AI.
 */
export default function ProgressPage() {
    const [performance, setPerformance] = useState<PerformanceData[]>(initialPerformance);
    const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);

    useEffect(() => {
        // On component mount, load performance data and feedback history from localStorage
        // to ensure the user's progress is always up-to-date.
        setFeedbackHistory(getFeedbackHistory());
        setPerformance(getPerformanceData());
    }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mi Progreso" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Rendimiento por Tema</CardTitle>
            <CardDescription>
              Visualiza tus aciertos y errores en los quizzes para identificar áreas de mejora en tu preparación para Psicología.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="topic" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                   />
                  <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="correct" stackId="a" fill="hsl(var(--primary))" name="Correctas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="incorrect" stackId="a" fill="hsl(var(--destructive) / 0.5)" name="Incorrectas" radius={[0, 0, 0, 0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
           <CardHeader>
             <CardTitle className="font-headline">Historial de Retroalimentación</CardTitle>
            <CardDescription>
              Revisa las últimas sugerencias de la IA para guiar tu estudio.
            </CardDescription>
           </CardHeader>
            <CardContent>
                 {feedbackHistory.length > 0 ? (
                     <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-4">
                            {feedbackHistory.map((item, index) => (
                                <div key={index} className="rounded-md border p-4">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-muted-foreground">
                                           Sesión del {new Date(item.timestamp).toLocaleString()}
                                        </p>
                                        <Badge variant="secondary">{item.topic}</Badge>
                                    </div>
                                    <p className="font-semibold mt-2 text-primary flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4"/>
                                        Sugerencia de la IA
                                    </p>
                                    <p className="text-sm mt-1">{item.feedback}</p>
                                    <p className="text-sm mt-2"><strong>Área de mejora:</strong> {item.areasForImprovement}</p>
                                </div>
                            ))}
                        </div>
                     </ScrollArea>
                 ) : (
                    <div className="text-center text-muted-foreground p-8">
                        <BookX className="h-12 w-12 mx-auto mb-4 text-accent" />
                        <p>Completa un quiz para ver tu historial de retroalimentación aquí.</p>
                    </div>
                 )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
