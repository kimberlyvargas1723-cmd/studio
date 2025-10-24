/**
 * Página dedicada al Reconocimiento de Texto con ML Kit
 * Permite escanear notas manuscritas y convertirlas en material de estudio
 */

'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Download, BookOpen, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { TextRecognitionComponent } from '@/components/ml-kit-integration';
import { RecommendationRatingComponent } from '@/components/recommendation-rating';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ProcessedNote {
  id: string;
  originalText: string;
  extractedText: string;
  topics: string[];
  flashcards: Array<{ front: string; back: string }>;
  timestamp: Date;
  rating?: number;
}

export default function TextRecognitionPage() {
  const [user] = useAuthState(auth);
  const [processedNotes, setProcessedNotes] = useState<ProcessedNote[]>([]);
  const [selectedNote, setSelectedNote] = useState<ProcessedNote | null>(null);
  const [showRating, setShowRating] = useState(false);

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Reconocimiento de Texto" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
                <p className="text-muted-foreground">
                  Inicia sesión para escanear tus notas manuscritas.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const saveNoteAsStudyMaterial = async (note: ProcessedNote) => {
    try {
      await addDoc(collection(db, 'studyMaterials'), {
        userId: user.uid,
        type: 'extracted-notes',
        title: `Notas: ${note.topics.join(', ')}`,
        content: note.extractedText,
        originalText: note.originalText,
        topics: note.topics,
        flashcards: note.flashcards,
        timestamp: serverTimestamp()
      });

      // Update local state
      setProcessedNotes(prev => prev.map(n =>
        n.id === note.id ? { ...n, rating: 5 } : n
      ));
    } catch (error) {
      console.error('Error saving study material:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Reconocimiento de Texto IA" />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reconocimiento de Texto con IA</h1>
              <p className="text-muted-foreground">
                Escanea notas manuscritas y conviértelas en material de estudio digital
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              <Camera className="h-4 w-4 mr-1" />
              ML Kit Activo
            </Badge>
          </div>

          {/* Main Text Recognition Component */}
          <TextRecognitionComponent />

          {/* Features Explanation */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Extracción de Texto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Firebase ML Kit reconoce texto manuscrito con alta precisión,
                  incluso en diferentes estilos de escritura.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Flashcards Automáticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  JvairyX convierte el texto extraído en flashcards personalizadas
                  para reforzar el aprendizaje.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="h-5 w-5 text-purple-600" />
                  Análisis Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Identifica temas clave y genera quizzes adaptativos
                  basados en el contenido de tus notas.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle>¿Cómo Funciona?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-700">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Captura tu imagen</h4>
                    <p className="text-sm text-muted-foreground">
                      Toma una foto de tus notas manuscritas o sube una imagen desde tu dispositivo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-green-700">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Procesamiento ML</h4>
                    <p className="text-sm text-muted-foreground">
                      ML Kit analiza la imagen y extrae texto con tecnología de reconocimiento óptico.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-purple-700">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Análisis de JvairyX</h4>
                    <p className="text-sm text-muted-foreground">
                      La IA identifica conceptos clave y genera material de estudio personalizado.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-orange-700">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Material generado</h4>
                    <p className="text-sm text-muted-foreground">
                      Recibe flashcards, quizzes y resúmenes adaptados a tu nivel de aprendizaje.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Consejos para Mejores Resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">📷 Calidad de Imagen</h4>
                  <p className="text-sm text-muted-foreground">
                    Usa buena iluminación y enfoca claramente el texto.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">✍️ Legibilidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Escribe con letra clara y evita texto muy pequeño.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">📱 Estabilidad</h4>
                  <p className="text-sm text-muted-foreground">
                    Mantén el dispositivo estable al tomar la foto.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">🎯 Enfoque</h4>
                  <p className="text-sm text-muted-foreground">
                    Asegúrate de que todo el texto esté en el encuadre.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating System Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                ¿Te fue útil esta herramienta?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationRatingComponent
                recommendationId="text-recognition-tool"
                recommendation="Herramienta de reconocimiento de texto con IA para convertir notas manuscritas en material de estudio digital"
                type="study_method"
                difficulty="medium"
                onRatingSubmit={(rating) => {
                  console.log('Rating submitted:', rating);
                  setShowRating(false);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
