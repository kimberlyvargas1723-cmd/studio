/**
 * Página de Aprendizaje Adaptativo con Sistema de Rating
 * Centraliza las recomendaciones personalizadas de JvairyX con calificación 1-5
 */

'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';


import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Brain, Star, Target, BookOpen, Video, Lightbulb, CheckCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { AdaptiveLearningDashboard } from '@/components/ml-kit-integration';
import { JvairyXVideoRecommendations } from '@/components/educational-videos';
import { RecommendationRatingComponent, RatingStatsComponent } from '@/components/recommendation-rating';
import { collection, getDocs, query, where, orderBy, limit, serverTimestamp, addDoc } from 'firebase/firestore';

interface Recommendation {
  id: string;
  type: 'topic' | 'video' | 'quiz' | 'study_method';
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence: number;
  reasoning: string;
  timestamp: Date;
  rating?: number;
  helpfulness?: boolean;
}

export default function AdaptiveLearningPage() {
  const [user] = useAuthState(auth);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [showRating, setShowRating] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    setLoadingRecommendations(true);
    try {
      // Simulate loading recommendations from Firestore
      // In production, this would call the Genkit flow
      const mockRecommendations: Recommendation[] = [
        {
          id: 'rec-1',
          type: 'topic',
          title: 'Psicología Cognitiva Avanzada',
          description: 'Enfócate en procesos de memoria y atención. Tu rendimiento en estos temas puede mejorar significativamente.',
          difficulty: 'medium',
          confidence: 0.87,
          reasoning: 'Basado en tu historial, tienes 87% de probabilidades de éxito en este tema.',
          timestamp: new Date()
        },
        {
          id: 'rec-2',
          type: 'video',
          title: 'Video: Procesos Mentales - Psicología al Día',
          description: 'Explicación completa de los procesos cognitivos con ejemplos prácticos de psicología clínica.',
          difficulty: 'medium',
          confidence: 0.92,
          reasoning: 'Video altamente recomendado para tu nivel intermedio y estilo de aprendizaje visual.',
          timestamp: new Date()
        },
        {
          id: 'rec-3',
          type: 'quiz',
          title: 'Quiz de Estadística Aplicada',
          description: 'Refuerza conceptos de estadística con 15 preguntas adaptadas a tu nivel actual.',
          difficulty: 'easy',
          confidence: 0.95,
          reasoning: 'Necesitas práctica en métodos cuantitativos. Este quiz te ayudará a consolidar bases.',
          timestamp: new Date()
        },
        {
          id: 'rec-4',
          type: 'study_method',
          title: 'Técnica Pomodoro para Psicología',
          description: 'Estudia en bloques de 25 minutos con pausas. Ideal para retener información compleja.',
          difficulty: 'easy',
          confidence: 0.89,
          reasoning: 'Tu patrón de estudio muestra que rindes mejor en sesiones cortas e intensas.',
          timestamp: new Date()
        }
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  const handleRecommendationRating = async (recommendationId: string, rating: number, helpfulness: boolean) => {
    try {
      // Save rating to Firestore
      await addDoc(collection(db, 'recommendationRatings'), {
        recommendationId,
        userId: user?.uid,
        rating,
        helpfulness,
        timestamp: serverTimestamp()
      });

      // Update local state
      setRecommendations(prev => prev.map(rec =>
        rec.id === recommendationId
          ? { ...rec, rating, helpfulness }
          : rec
      ));

      setShowRating(null);
    } catch (error) {
      console.error('Error saving recommendation rating:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topic': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'study_method': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Aprendizaje Adaptativo" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
                <p className="text-muted-foreground">
                  Inicia sesión para recibir recomendaciones personalizadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Aprendizaje Adaptativo" />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Aprendizaje Adaptativo con JvairyX</h1>
              <p className="text-muted-foreground">
                Recomendaciones personalizadas basadas en tu rendimiento y estilo de aprendizaje
              </p>
            </div>
            <Badge variant="outline" className="text-sm">
              <Brain className="h-4 w-4 mr-1" />
              IA Adaptativa
            </Badge>
          </div>

          <Tabs defaultValue="recommendations" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      Recomendaciones de JvairyX
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Basadas en tu historial de estudio y rendimiento
                    </p>
                  </CardHeader>
                  <CardContent>
                    <AdaptiveLearningDashboard />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-600" />
                      Sistema de Rating
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Califica las recomendaciones para mejorar la precisión
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RatingStatsComponent userId={user.uid} />
                  </CardContent>
                </Card>
              </div>

              {/* Individual Recommendations */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recomendaciones Personalizadas</h2>

                {loadingRecommendations ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendations.map((rec) => (
                      <Card key={rec.id} className="relative">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(rec.type)}
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowRating(showRating === rec.id ? null : rec.id)}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(rec.difficulty)}>
                              {rec.difficulty}
                            </Badge>
                            <Badge className={getConfidenceColor(rec.confidence)}>
                              {Math.round(rec.confidence * 100)}% confianza
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rec.description}
                          </p>
                          <p className="text-xs text-blue-600 mb-3">
                            {rec.reasoning}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {rec.timestamp.toLocaleDateString()}
                            </span>
                            {rec.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{rec.rating}/5</span>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        {showRating === rec.id && (
                          <div className="border-t p-4">
                            <RecommendationRatingComponent
                              recommendationId={rec.id}
                              recommendation={rec.description}
                              type={rec.type}
                              difficulty={rec.difficulty}
                              onRatingSubmit={(rating) => handleRecommendationRating(rec.id, rating.rating, rating.helpfulness)}
                            />
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tu Progreso</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nivel actual:</span>
                      <Badge className="bg-blue-100 text-blue-800">Intermedio</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sesiones completadas:</span>
                      <Badge variant="outline">47</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tiempo de estudio:</span>
                      <Badge variant="outline">2.5h/día</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rating promedio:</span>
                      <Badge className="bg-green-100 text-green-800">4.7/5</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Áreas de Mejora</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Estadística:</span>
                        <Badge className="bg-orange-100 text-orange-800">Media</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Neurociencia:</span>
                        <Badge className="bg-green-100 text-green-800">Fuerte</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Psicología Social:</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Mejorando</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Estilo de Aprendizaje</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Visual:</span>
                        <Badge className="bg-blue-100 text-blue-800">85%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Auditivo:</span>
                        <Badge variant="outline">45%</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Kinestésico:</span>
                        <Badge variant="outline">30%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-4">
              <JvairyXVideoRecommendations
                userLevel="intermediate"
                topic="psicología"
                learningStyle="visual"
              />
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas Detalladas de Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <RatingStatsComponent userId={user.uid} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Impacto de tus Ratings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Mejora de Precisión</h4>
                      <p className="text-sm text-muted-foreground">
                        Tus ratings ayudan a JvairyX a mejorar sus recomendaciones en un 15% promedio.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Personalización</h4>
                      <p className="text-sm text-muted-foreground">
                        La IA se adapta mejor a tu estilo de aprendizaje con cada rating.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Contenido Relevante</h4>
                      <p className="text-sm text-muted-foreground">
                        Recibes más recomendaciones útiles y menos irrelevantes.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Feedback Loop</h4>
                      <p className="text-sm text-muted-foreground">
                        Cada calificación mejora la experiencia de todos los estudiantes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
