import { Header } from '@/components/header';
import { PracticeQuiz } from '@/components/practice-quiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function PracticePage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Práctica" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="quiz" className="w-full max-w-4xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz">Quiz Interactivo</TabsTrigger>
            <TabsTrigger value="generate">Generar Preguntas (Próximamente)</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <div className="flex justify-center mt-4">
              <PracticeQuiz />
            </div>
          </TabsContent>
          <TabsContent value="generate">
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="font-headline">Generador de Preguntas</CardTitle>
                <CardDescription>
                  Esta función utilizará el contenido que resumas para crear nuevas preguntas.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
                <Lightbulb className="h-12 w-12 mb-4 text-accent" />
                <p className="text-lg font-semibold">Función en desarrollo</p>
                <p>¡Vuelve pronto para generar preguntas ilimitadas con IA!</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
