/**
 * Página principal de Herramientas de ML para PsicoGuía
 * Centraliza todas las funcionalidades de Machine Learning
 */

"use client";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Eye,
  TrendingUp,
  Video,
  BookOpen,
  Target,
  Star,
  BarChart3,
} from "lucide-react";
import { TextRecognitionComponent } from "@/components/ml-kit-integration";
import { AdaptiveLearningDashboard } from "@/components/ml-kit-integration";
import { PerformancePredictor } from "@/components/ml-kit-integration";
import { VideoRecommendationComponent } from "@/components/educational-videos";
import {
  RecommendationRatingComponent,
  RatingStatsComponent,
} from "@/components/recommendation-rating";
import { Header } from "@/components/header";

export default function MLToolsPage() {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Herramientas de IA" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
                <p className="text-muted-foreground mb-4">
                  Debes iniciar sesión para acceder a las herramientas de IA.
                </p>
                <Button>Iniciar Sesión</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Herramientas de IA" />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Herramientas de Inteligencia Artificial
            </h1>
            <p className="text-muted-foreground">
              Tecnología ML Kit y Genkit para un aprendizaje adaptativo
              personalizado
            </p>
          </div>
          <Badge variant="outline" className="text-sm">
            <Brain className="h-4 w-4 mr-1" />
            IA Activa
          </Badge>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="recognition"
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Reconocimiento
            </TabsTrigger>
            <TabsTrigger value="adaptive" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Adaptativo
            </TabsTrigger>
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Predicción
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    JvairyX - Tu Tutor IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Inteligencia artificial que se adapta a tu estilo de
                    aprendizaje y predice tu rendimiento en exámenes.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estado:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Precisión:</span>
                      <Badge variant="outline">95%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sesiones:</span>
                      <Badge variant="outline">247</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    ML Kit Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Procesamiento de imágenes y texto con machine learning para
                    análisis educativo avanzado.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Text Recognition:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Image Analysis:</span>
                      <Badge className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Face Detection:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Próximo
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Sistema de Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Califica las recomendaciones de JvairyX para mejorar la
                    precisión del sistema adaptativo.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tu rating promedio:</span>
                      <Badge variant="outline">4.7/5</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ratings enviados:</span>
                      <Badge variant="outline">23</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mejora:</span>
                      <Badge className="bg-green-100 text-green-800">
                        +15%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rating Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas de tus Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingStatsComponent userId={user.uid} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recognition" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">
                  Reconocimiento de Texto e Imágenes
                </h2>
              </div>

              <TextRecognitionComponent />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">¿Cómo funciona?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-700">
                        1
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Captura o sube una imagen</h4>
                      <p className="text-sm text-muted-foreground">
                        Usa la cámara de tu dispositivo o sube una imagen de
                        notas manuscritas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-700">
                        2
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Procesamiento con ML Kit</h4>
                      <p className="text-sm text-muted-foreground">
                        Firebase ML Kit analiza la imagen y extrae texto o
                        identifica conceptos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-700">
                        3
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Conversión a material de estudio
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        JvairyX convierte la información en flashcards, quizzes
                        y resúmenes personalizados
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="adaptive" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  Aprendizaje Adaptativo
                </h2>
              </div>

              <AdaptiveLearningDashboard />

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Sistema de Dificultad Dinámica
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      El algoritmo analiza tu rendimiento y ajusta
                      automáticamente la dificultad del contenido para un
                      aprendizaje óptimo.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tu nivel actual:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Intermedio
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Progreso reciente:</span>
                        <Badge className="bg-green-100 text-green-800">
                          +15%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Siguiente nivel:</span>
                        <Badge variant="outline">3 sesiones más</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Estadísticas de Aprendizaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Métricas detalladas de tu progreso y patrones de estudio
                      analizadas por machine learning.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Tiempo de estudio:</span>
                        <Badge variant="outline">2.5h/día</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Sesiones completadas:</span>
                        <Badge variant="outline">47</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Áreas fuertes:</span>
                        <Badge className="bg-green-100 text-green-800">
                          3/5
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="prediction" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-semibold">
                  Predicción de Rendimiento
                </h2>
              </div>

              <PerformancePredictor />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Algoritmo de Predicción
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-700">
                        ML
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Machine Learning Avanzado</h4>
                      <p className="text-sm text-muted-foreground">
                        Utiliza datos históricos de miles de estudiantes para
                        predecir tu rendimiento
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-700">
                        📊
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Factores de Análisis</h4>
                      <p className="text-sm text-muted-foreground">
                        Tiempo de estudio, consistencia, rendimiento en quizzes,
                        estilo de aprendizaje
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-700">
                        🎯
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Precisión del Modelo</h4>
                      <p className="text-sm text-muted-foreground">
                        90%+ de precisión en predicciones para estudiantes de
                        psicología UANL
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-red-600" />
                <h2 className="text-xl font-semibold">
                  Videos Educativos Recomendados
                </h2>
              </div>

              <VideoRecommendationComponent
                userLevel="intermediate"
                topic="psicología"
                learningStyle="visual"
                maxResults={9}
              />

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Canales Incluidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-medium">JP</span>
                      </div>
                      <div>
                        <h4 className="font-medium">JulioProfe</h4>
                        <p className="text-sm text-muted-foreground">
                          Matemáticas y física (Colombia)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-sm font-medium">KA</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Khan Academy Español</h4>
                        <p className="text-sm text-muted-foreground">
                          Educación gratuita (Internacional)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-medium">PS</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Psicología al Día</h4>
                        <p className="text-sm text-muted-foreground">
                          Psicología especializada (México)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-sm font-medium">UA</span>
                      </div>
                      <div>
                        <h4 className="font-medium">UANL Oficial</h4>
                        <p className="text-sm text-muted-foreground">
                          Universidad Autónoma de Nuevo León
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
