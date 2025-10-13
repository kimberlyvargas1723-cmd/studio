// src/components/flashcards-tab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Definimos el tipo Flashcard directamente aquí para simplicidad.
type Flashcard = {
  question: string;
  answer: string;
};

/**
 * La pestaña del "Gimnasio Mental" para practicar con flashcards.
 * Esta pestaña recupera un mazo de flashcards desde `sessionStorage`,
 * permitiendo al usuario practicar con ellas de manera interactiva.
 * Si no hay un mazo, muestra un mensaje de bienvenida.
 */
export function FlashcardsTab() {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClient, setIsClient] = useState(false);

  /**
   * Efecto para cargar el mazo de flashcards desde sessionStorage
   * solo en el lado del cliente.
   */
  useEffect(() => {
    setIsClient(true);
    const storedDeck = sessionStorage.getItem('flashcardDeck');
    if (storedDeck) {
      try {
        const parsedDeck = JSON.parse(storedDeck);
        setDeck(parsedDeck);
      } catch (error) {
        console.error("Error parsing flashcard deck from sessionStorage:", error);
      }
    }
  }, []);

  // Handlers para la navegación y la interacción con las tarjetas
  const handleNextCard = () => {
    setIsFlipped(false); // Siempre voltea a la cara de la pregunta
    setCurrentCardIndex((prev) => Math.min(prev + 1, deck.length - 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };
  
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleRestart = () => {
      setIsFlipped(false);
      setCurrentCardIndex(0);
  }

  // Si no estamos en el cliente o no hay mazo, muestra un estado inicial o de carga.
  if (!isClient || deck.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
          <Card className="w-full max-w-lg mt-6">
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Layers className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-headline text-2xl">Sala de Flashcards</CardTitle>
                <CardDescription className="mt-2">
                  Aquí podrás practicar con los mazos de flashcards que generes. La repetición activa es clave para la memoria a largo plazo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Para empezar, ve a la sección de "Temas de Estudio", resume un texto con la IA y luego presiona "Crear Flashcards". ¡Tu nuevo mazo aparecerá aquí listo para estudiar!
              </p>
              <Button asChild>
                <Link href="/study">
                  Ir a Temas de Estudio
                </Link>
              </Button>
            </CardContent>
          </Card>
      </div>
    );
  }
  
  const currentCard = deck[currentCardIndex];
  const progress = ((currentCardIndex + 1) / deck.length) * 100;

  // Renderiza la interfaz de práctica de flashcards
  return (
    <div className="flex w-full flex-col items-center justify-center">
        <Card className="w-full max-w-2xl mt-6">
          <CardHeader>
            <CardTitle>Practicando: Mazo de {deck.length} tarjetas</CardTitle>
            <CardDescription>Tarjeta {currentCardIndex + 1} de {deck.length}</CardDescription>
             <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent className="min-h-[250px] flex items-center justify-center">
            <div
                className="w-full h-full perspective-1000"
                onClick={handleFlipCard}
            >
                <div 
                    className={cn(
                        "relative w-full h-full min-h-[250px] transform-style-3d transition-transform duration-700 cursor-pointer",
                        isFlipped && "rotate-y-180"
                    )}
                >
                    {/* Cara de la pregunta */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg border-2 p-6 text-center bg-card">
                        <p className="text-xl font-semibold">{currentCard.question}</p>
                    </div>
                    {/* Cara de la respuesta */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center rounded-lg border-2 p-6 text-center bg-secondary rotate-y-180">
                         <p className="text-lg">{currentCard.answer}</p>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .backface-hidden { backface-visibility: hidden; }
            `}</style>
          </CardContent>
          <CardFooter className="flex-col gap-4">
             <Button onClick={handleFlipCard} variant="outline" className="w-full">
                {isFlipped ? 'Ver Pregunta' : 'Mostrar Respuesta'}
            </Button>
            <div className="grid grid-cols-2 gap-4 w-full">
                 <Button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
                    <ArrowLeft className="mr-2"/> Anterior
                </Button>
                <Button onClick={handleNextCard} disabled={currentCardIndex === deck.length - 1}>
                    Siguiente <ArrowRight className="ml-2"/>
                </Button>
            </div>
            {currentCardIndex === deck.length - 1 && (
                <Button onClick={handleRestart} className="w-full">
                    <RotateCw className="mr-2"/> Volver a empezar
                </Button>
            )}
          </CardFooter>
        </Card>
    </div>
  );
}
