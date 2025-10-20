// src/app/audio/page.tsx
'use client';
import { useState, useRef } from 'react';
import { Header } from '@/components/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Play, Volume2 } from 'lucide-react';
import { textToSpeechAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * A page for testing the Text-to-Speech (TTS) functionality.
 * Allows users to input text, generate audio using an AI flow, and play it back.
 * This serves as a proof-of-concept before integrating TTS into other parts of the app.
 */
export default function AudioPage() {
  const [text, setText] = useState('¡Hola, Kimberly! Soy Vairyx, tu tutor de IA. Esta es una prueba de mi nueva capacidad para convertir texto en audio. ¡Ahora puedes escuchar resúmenes y lecciones!');
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  /**
   * Handles the generation of speech by calling the server action.
   */
  const handleGenerateSpeech = async () => {
    if (!text.trim()) {
      toast({
        variant: 'destructive',
        title: 'Texto vacío',
        description: 'Por favor, introduce algún texto para generar el audio.',
      });
      return;
    }
    setIsLoading(true);
    setAudioDataUri(null);
    try {
      const result = await textToSpeechAction({ text });
      if (result.error) {
        throw new Error(result.error);
      }
      setAudioDataUri(result.audioDataUri!);
    } catch (error: any) {
      console.error('Failed to generate speech:', error);
      toast({
        variant: 'destructive',
        title: 'Error al generar audio',
        description: error.message || 'Ocurrió un problema inesperado. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Plays the generated audio.
   */
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Laboratorio de Audio" />
      <main className="flex flex-1 flex-col items-center gap-4 p-4 md:gap-8 md:p-8">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Volume2 />
              Prueba de Texto a Voz (TTS)
            </CardTitle>
            <CardDescription>
              Escribe cualquier texto y Vairyx lo convertirá en audio. Esta es una prueba de concepto para futuras funcionalidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe algo aquí..."
              rows={6}
              disabled={isLoading}
            />
            {audioDataUri && (
              <Alert className="bg-green-50 dark:bg-green-900/30 border-green-500/50">
                <AlertTitle className="font-semibold text-green-800 dark:text-green-300">¡Audio Generado!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  <div className="flex items-center justify-between mt-2">
                    <span>El audio está listo para ser reproducido.</span>
                    <Button size="sm" onClick={playAudio}>
                      <Play className="mr-2" />
                      Reproducir
                    </Button>
                  </div>
                  <audio ref={audioRef} src={audioDataUri} className="hidden" />
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleGenerateSpeech} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando audio...
                </>
              ) : (
                'Generar Audio con IA'
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
