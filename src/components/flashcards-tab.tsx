// src/components/flashcards-tab.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft, ArrowRight, RotateCw, Loader2, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { allFlashcardDecks, type Flashcard, type FlashcardDeck } from '@/lib/flashcard-decks';

/**
 * Componente para la práctica activa con un mazo de flashcards seleccionado.
 */
function FlashcardPlayer({ deck, onBack }: { deck: FlashcardDeck, onBack: () => void }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reinicia el estado si el mazo cambia
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [deck]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => Math.min(prev + 1, deck.deck.length - 1));
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
  };
  
  const currentCard = deck.deck[currentCardIndex];
  const progress = ((currentCardIndex + 1) / deck.deck.length) * 100;

  return (
    <Card className="w-full max-w-2xl mt-6 animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-headline">{deck.title}</CardTitle>
            <CardDescription>Tarjeta {currentCardIndex + 1} de {deck.deck.length}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2" /> Volver a selección
          </Button>
        </div>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      <CardContent className="min-h-[250px] flex items-center justify-center">
        <div className="w-full h-full perspective-1000" onClick={handleFlipCard}>
          <div className={cn(
              "relative w-full h-full min-h-[250px] transform-style-3d transition-transform duration-700 cursor-pointer",
              isFlipped && "rotate-y-180"
          )}>
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
            <ArrowLeft className="mr-2" /> Anterior
          </Button>
          <Button onClick={handleNextCard} disabled={currentCardIndex === deck.deck.length - 1}>
            Siguiente <ArrowRight className="ml-2" />
          </Button>
        </div>
        {currentCardIndex === deck.deck.length - 1 && (
          <Button onClick={handleRestart} className="w-full">
            <RotateCw className="mr-2" /> Volver a empezar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

/**
 * La pestaña "Sala de Flashcards" del Gimnasio Mental.
 * Ahora muestra una selección de mazos pre-hechos y un mazo generado dinámicamente.
 */
export function FlashcardsTab() {
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);
  const [generatedDeck, setGeneratedDeck] = useState<FlashcardDeck | null>(null);
  const [isClient, setIsClient] = useState(false);

  /**
   * Efecto para cargar el mazo generado dinámicamente desde sessionStorage.
   * Se ejecuta solo en el cliente.
   */
  useEffect(() => {
    setIsClient(true);
    const storedDeckData = sessionStorage.getItem('flashcardDeck');
    if (storedDeckData) {
      try {
        const parsedData = JSON.parse(storedDeckData);
        setGeneratedDeck({
          id: 'generated',
          title: parsedData.title || 'Mazo Recién Creado',
          description: 'Flashcards que acabas de generar desde la sección de estudio.',
          deck: parsedData.deck,
        });
        // Limpiamos sessionStorage para que el mazo no persista entre visitas.
        sessionStorage.removeItem('flashcardDeck');
      } catch (error) {
        console.error("Error parsing flashcard deck from sessionStorage:", error);
      }
    }
  }, []);

  if (!isClient) {
    return (
      <Card className="w-full max-w-4xl border-none shadow-none min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  // Si hay un mazo activo, muestra el reproductor de flashcards.
  if (activeDeck) {
    return <FlashcardPlayer deck={activeDeck} onBack={() => setActiveDeck(null)} />;
  }

  // Si no hay mazo activo, muestra la pantalla de selección de mazos.
  return (
    <Card className="w-full max-w-4xl border-none shadow-none">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Layers className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Sala de Flashcards</CardTitle>
        <CardDescription>
          Selecciona un mazo de flashcards para empezar tu entrenamiento de memoria activa.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {generatedDeck && (
            <Card className="border-primary border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-primary"><BookOpen /> {generatedDeck.title}</CardTitle>
                    <CardDescription>{generatedDeck.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => setActiveDeck(generatedDeck)}>
                        Practicar este mazo
                    </Button>
                </CardContent>
            </Card>
        )}
        {allFlashcardDecks.map(deck => (
            <Card key={deck.id} className="hover:border-primary/50 transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><BookOpen /> {deck.title}</CardTitle>
                    <CardDescription>{deck.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button variant="secondary" className="w-full" onClick={() => setActiveDeck(deck)}>
                        Practicar Mazo
                    </Button>
                </CardContent>
            </Card>
        ))}
      </CardContent>
    </Card>
  );
}
