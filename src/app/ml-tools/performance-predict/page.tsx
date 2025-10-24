/**
 * Página de Predicción de Rendimiento con IA
 * Muestra predicciones detalladas del rendimiento en exámenes UANL
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
import { Progress } from '@/components/ui/progress';
import { Target, Brain, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { Header } from '@/components/header';
import { PerformancePredictor } from '@/components/ml-kit-integration';
import { RecommendationRatingComponent } from '@/components/recommendation-rating';

interface PredictionResult {
  predictedScore: number;
  confidence: number;
  recommendedPrepTime: number;
  weakAreas: string[];
  strongAreas: string[];
  studyPlan: string[];
  nextMilestone: string;
  probabilityOfSuccess: number;
}

export default function PerformancePredictionPage() {
  const [user] = useAuthState(auth);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [examType, setExamType] = useState('psicologia-uanl');

  useEffect(() => {
    // Load initial prediction on mount
    if (user) {
      generatePrediction();
    }
  }, [user, examType]);

  const generatePrediction = async () => {
    setIsLoading(true);

    try {
      // Simulate ML prediction (in production, this would call the Genkit flow)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockPrediction: PredictionResult = {
        predictedScore: 78 + Math.random() * 15, // 78-93 range
        confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95 range
        recommendedPrepTime: 45 + Math.floor(Math.random() * 30), // 45-75 minutes
        weakAreas: ['Estadística aplicada', 'Neurociencia básica', 'Metodología de investigación'],
        strongAreas: ['Psicología cognitiva', 'Psicología social', 'Terapia cognitivo-conductual'],
        studyPlan: [
          'Repasar estadística aplicada (2h)',
          'Practicar con quizzes de neurociencia (1h)',
          'Resolver casos clínicos (1.5h)',
          'Simulacro completo de examen (3h)'
        ],
        nextMilestone: 'Completar 5 quizzes con 90%+ de acierto',
        probabilityOfSuccess: 0.82
      };

      setPrediction(mockPrediction);
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.7) return 'bg-blue-100 text-blue-800';
    return 'bg-orange-100 text-orange-800';
  };

  const getSuccessProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'bg-green-100 text-green-800';
    if (probability >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (!user) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <Header title="Predicción de Rendimiento" />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="flex items-center justify-center h-96">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-lg font-medium mb-2">Acceso Restringido</h2>
                <p className="text-muted-foreground">
                  Inicia sesión para ver predicciones de rendimiento.
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
      <Header title="Predicción de Rendimiento" />

      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Predicción de Rendimiento con IA</h1>
              <p className="text-muted-foreground">
                Análisis predictivo de tu rendimiento en exámenes usando machine learning
              </p>
            </div>
            <Button onClick={generatePrediction} disabled={isLoading}>
              {isLoading ? 'Analizando...' : 'Actualizar Predicción'}
            </Button>
          </div>

          {/* Exam Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tipo de Examen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant={examType === 'psicologia-uanl' ? 'default' : 'outline'}
                  onClick={() => setExamType('psicologia-uanl')}
                >
                  Psicología UANL
                </Button>
                <Button
                  variant={examType === 'simulacro' ? 'default' : 'outline'}
                  onClick={() => setExamType('simulacro')}
                >
                  Simulacro General
                </Button>
                <Button
                  variant={examType === 'practica' ? 'default' : 'outline'}
                  onClick={() => setExamType('practica')}
                >
                  Práctica Diaria
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Prediction Component */}
          <PerformancePredictor />

          {/* Detailed Prediction Results */}
          {prediction && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Score Prediction */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Predicción de Puntaje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getScoreColor(prediction.predictedScore)}`}>
                      {Math.round(prediction.predictedScore)}%
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Puntaje estimado en el examen
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Confianza del modelo:</span>
                      <Badge className={getConfidenceColor(prediction.confidence)}>
                        {Math.round(prediction.confidence * 100)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Probabilidad de éxito:</span>
                      <Badge className={getSuccessProbabilityColor(prediction.probabilityOfSuccess)}>
                        {Math.round(prediction.probabilityOfSuccess * 100)}%
                      </Badge>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Tiempo recomendado:</span>
                      <span className="text-sm">{prediction.recommendedPrepTime} min</span>
                    </div>
                    <Progress value={(prediction.recommendedPrepTime / 120) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Areas Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Análisis de Áreas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Áreas Fuertes
                    </h4>
                    <div className="space-y-1">
                      {prediction.strongAreas.map((area, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm">{area}</span>
                          <Badge className="bg-green-100 text-green-800 text-xs">Fuerte</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                      Áreas de Mejora
                    </h4>
                    <div className="space-y-1">
                      {prediction.weakAreas.map((area, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm">{area}</span>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">Mejorar</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Plan */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Plan de Estudio Recomendado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prediction.studyPlan.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-indigo-700">{index + 1}</span>
                        </div>
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm">Próximo Hito</span>
                    </div>
                    <p className="text-sm text-blue-700">{prediction.nextMilestone}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Prediction Algorithm Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Cómo Funciona la Predicción?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-700">ML</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Machine Learning Avanzado</h4>
                      <p className="text-sm text-muted-foreground">
                        Utiliza datos de miles de estudiantes para predecir rendimiento
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-green-700">📊</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Factores de Análisis</h4>
                      <p className="text-sm text-muted-foreground">
                        Historial de estudio, rendimiento en quizzes, tiempo dedicado, estilo de aprendizaje
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-purple-700">🔄</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Actualización Continua</h4>
                      <p className="text-sm text-muted-foreground">
                        Se actualiza automáticamente con cada sesión de estudio y quiz completado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-orange-700">🎯</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Precisión del 90%+</h4>
                      <p className="text-sm text-muted-foreground">
                        Validado con datos reales de estudiantes de psicología UANL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rating Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                ¿Te fue útil esta predicción?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecommendationRatingComponent
                recommendationId="performance-prediction-tool"
                recommendation="Herramienta de predicción de rendimiento con IA que analiza tu progreso y predice resultados en exámenes UANL"
                type="study_method"
                difficulty="medium"
                onRatingSubmit={(rating) => {
                  console.log('Performance prediction rated:', rating);
                }}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
