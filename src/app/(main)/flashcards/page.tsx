// src/app/(main)/flashcards/page.tsx
'use client';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers } from 'lucide-react';
import Link from 'next/link';

/**
 * La página principal del "Gimnasio Mental".
 * Por ahora, sirve como un marcador de posición que explica la función
 * y dirige a los usuarios a la sección de estudio para que puedan generar
 * sus primeros mazos de flashcards.
 */
export default function FlashcardsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Gimnasio Mental" />
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 text-center">
        <Card className="w-full max-w-lg">
           <CardHeader>
                <div className="flex flex-col items-center">
                    <Layers className="h-16 w-16 text-primary mb-4" />
                    <CardTitle className="font-headline text-2xl">Próximamente: Tu Gimnasio Mental</CardTitle>
                    <CardDescription className="mt-2">
                        Esta sección será tu centro de entrenamiento para la memoria. Aquí podrás practicar con todas las flashcards que generes a partir de tus resúmenes.
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground mb-6">
                    Por ahora, puedes empezar a crear tus mazos de flashcards desde la sección de "Temas de Estudio". Una vez que un texto es resumido por la IA, aparecerá la opción para convertirlo en tarjetas de memoria.
                </p>
                <Button asChild>
                    <Link href="/study">
                        Ir a Temas de Estudio y crear mi primer mazo
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
