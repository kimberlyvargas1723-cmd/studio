'use client';
import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { initialPerformance } from '@/lib/data';

export default function ProgressPage() {
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
                <BarChart data={initialPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                 <div className="text-center text-muted-foreground p-8">
                    <p>Completa un quiz para ver tu historial de retroalimentación aquí.</p>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
