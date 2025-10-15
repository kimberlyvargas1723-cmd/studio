// src/app/progress/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { PerformanceData, Feedback } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, BookX, Sparkles, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getFeedbackHistory, getPerformanceData } from '@/lib/services';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateProgressSummaryAction } from '@/app/actions';

/**
 * Renderiza la página "Mi Progreso".
 * Este componente visualiza los datos de rendimiento del usuario a través de gráficos y listas,
 * proporcionando información sobre su progreso de estudio. Obtiene el rendimiento histórico
 * y el feedback de localStorage, y también llama a una Acción de Servidor para generar un
 * nuevo resumen inteligente del estado actual del usuario a través de un flujo de IA.
 */
export default function ProgressPage() {
    const [performance, setPerformance] = useState<PerformanceData[]>([]);
    const [feedbackHistory, setFeedbackHistory] = useState<Feedback[]>([]);
    const [progressSummary, setProgressSummary] = useState<{summary: string; suggestion: string} | null>(null);
    const [isLoadingSummary, setIsLoadingSummary] = useState(true);

    /**
     * Al montar el componente, este efecto carga todos los datos necesarios:
     * 1. Obtiene los datos históricos de rendimiento (conteos de aciertos/errores) de localStorage.
     * 2. Obtiene el feedback pasado de la IA de localStorage.
     * 3. Si hay datos de rendimiento, llama a una Acción de Servidor para generar un resumen
     *    de progreso fresco impulsado por IA.
     */
    useEffect(() => {
        const perfData = getPerformanceData();
        setPerformance(perfData);
        setFeedbackHistory(getFeedbackHistory());

        // Solo genera un resumen si el usuario ha completado al menos un quiz.
        const hasPerformanceData = perfData.some(p => p.correct > 0 || p.incorrect > 0);
        if (hasPerformanceData) {
            generateProgressSummaryAction({ performanceData: perfData })
                .then(result => {
                    if (result.summary && result.suggestion) {
                        setProgressSummary({summary: result.summary, suggestion: result.suggestion});
                    }
                })
                .finally(() => setIsLoadingSummary(false));
        } else {
             setIsLoadingSummary(false);
        }
    }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Mi Progreso" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        
        {/* Tarjeta de Resumen de Progreso Inteligente */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader className="flex flex-row items-center gap-4">
                <Sparkles className="w-8 h-8 text-primary" />
                <div>
                <CardTitle className="font-headline">Análisis de Vairyx</CardTitle>
                <CardDescription>Tu tutor de IA ha analizado tu rendimiento.</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {isLoadingSummary ? (
                    <div className="flex items-center gap-3 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <p>Analizando tu progreso para generar un resumen...</p>
                    </div>
                ) : progressSummary ? (
                     <Alert className="border-primary/50">
                        <AlertTitle className="font-semibold">Resumen Inteligente</AlertTitle>
                        <AlertDescription>
                            <p className="mt-2">{progressSummary.summary}</p>
                            <p className="mt-2 font-medium">{progressSummary.suggestion}</p>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <p className="text-muted-foreground">Completa algunos quizzes para que Vairyx pueda analizar tu progreso y darte un resumen inteligente.</p>
                )}
            </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
            {/* Tarjeta del Gráfico de Rendimiento */}
            <Card>
            <CardHeader>
                <CardTitle className="font-headline">Rendimiento por Tema</CardTitle>
                <CardDescription>
                Visualiza tus aciertos y errores en los quizzes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performance.filter(p => p.correct > 0 || p.incorrect > 0)} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                        dataKey="topic" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
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
            {/* Tarjeta del Historial de Feedback */}
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
                        <div className="text-center text-muted-foreground p-8 h-full flex flex-col justify-center items-center">
                            <BookX className="h-12 w-12 mx-auto mb-4 text-accent" />
                            <p>Completa un quiz para ver tu historial de retroalimentación aquí.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
