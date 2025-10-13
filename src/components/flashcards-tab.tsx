// src/components/flashcards-tab.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { defaultFlashcardDeck } from '@/lib/flashcard-decks';

// Definimos el tipo Flashcard directamente aquí para simplicidad.
type Flashcard = {
  question: string;
  answer: string;
};

/**
 * La pestaña del "Gimnasio Mental" para practicar con flashcards.
 * Esta pestaña implementa una lógica de carga híbrida:
 * 1. Prioriza cargar un mazo recién generado por el usuario desde `sessionStorage`.
 * 2. Si no existe, carga un mazo pre-hecho de "Fundamentos" para asegurar que la sección nunca esté vacía.
 */
export function FlashcardsTab() {
  const [deck, setDeck] = useState<Flashcard[]>([]);
  const [deckTitle, setDeckTitle] = useState('Mazo de Flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isClient, setIsClient] = useState(false);

  /**
   * Efecto para cargar el mazo de flashcards desde sessionStorage o usar el mazo por defecto.
   * Se ejecuta solo en el lado del cliente.
   */
  useEffect(() => {
    setIsClient(true);
    const storedDeckData = sessionStorage.getItem('flashcardDeck');
    if (storedDeckData) {
      try {
        const parsedData = JSON.parse(storedDeckData);
        setDeck(parsedData.deck);
        setDeckTitle(parsedData.title || 'Mazo Recién Creado');
        // Limpiamos el session storage para que la próxima vez cargue el mazo por defecto si no se genera uno nuevo.
        sessionStorage.removeItem('flashcardDeck');
      } catch (error) {
        console.error("Error parsing flashcard deck from sessionStorage:", error);
        // Si hay un error, carga el mazo por defecto.
        setDeck(defaultFlashcardDeck.deck);
        setDeckTitle(defaultFlashcardDeck.title);
      }
    } else {
        // Si no hay nada en sessionStorage, carga el mazo por defecto.
        setDeck(defaultFlashcardDeck.deck);
        setDeckTitle(defaultFlashcardDeck.title);
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

  // Muestra un estado de carga mientras se determina si estamos en el cliente.
  if (!isClient) {
    return (
        <Card className="w-full max-w-lg mt-6 min-h-[400px] flex items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin" />
        </Card>
    )
  }

  // Si después de la carga inicial, no hay mazo, muestra un mensaje de error/guía.
  if (deck.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
          <Card className="w-full max-w-lg mt-6">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Sala de Flashcards</CardTitle>
                <CardDescription>Error: No se pudo cargar el mazo de flashcards.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                Puedes generar tu propio mazo desde la sección de "Temas de Estudio".
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
            <CardTitle>{deckTitle}</CardTitle>
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
