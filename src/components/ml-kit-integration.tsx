/**
 * ML Kit Integration Components for PsicoGuía
 * Provides AI-powered educational features using Firebase ML Kit
 */

'use client';

import React, { useState, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Brain, Eye, TrendingUp } from 'lucide-react';
import { useTextRecognition, useImageLabeling, useAdaptiveLearning, usePerformancePrediction } from '@/lib/ml-kit-config';

export function TextRecognitionComponent() {
  const [user] = useAuthState(auth);
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  const { recognizeText, result, isProcessing } = useTextRecognition();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    if (cameraRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = cameraRef.current.videoWidth;
      canvas.height = cameraRef.current.videoHeight;
      canvas.getContext('2d')?.drawImage(cameraRef.current, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg');
      setImage(imageData);

      // Process with ML Kit
      const imageDataObj = new ImageData(
        new Uint8ClampedArray(canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data || []),
        canvas.width,
        canvas.height
      );

      await recognizeText(imageDataObj);
    }
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Reconocimiento de Texto con IA
        </CardTitle>
        <p className="text-muted-foreground">
          Escanea notas manuscritas y conviértelas en texto searchable
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Subir Imagen
          </Button>
          <Button onClick={openCamera} variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Cámara
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {isCameraOpen && (
          <div className="space-y-2">
            <video ref={cameraRef} autoPlay className="w-full rounded-md" />
            <Button onClick={handleCameraCapture} disabled={isProcessing}>
              {isProcessing ? 'Procesando...' : 'Capturar y Analizar'}
            </Button>
            <Button onClick={() => setIsCameraOpen(false)} variant="outline">
              Cerrar Cámara
            </Button>
          </div>
        )}

        {image && !isCameraOpen && (
          <div className="space-y-2">
            <img src={image} alt="Captured" className="w-full rounded-md" />
            <Button onClick={async () => {
              if (image) {
                const img = new Image();
                img.onload = async () => {
                  const canvas = document.createElement('canvas');
                  canvas.width = img.width;
                  canvas.height = img.height;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    await recognizeText(imageData);
                  }
                };
                img.src = image;
              }
            }} disabled={isProcessing}>
              {isProcessing ? 'Analizando...' : 'Extraer Texto'}
            </Button>
          </div>
        )}

        {result && (
          <div className="border rounded-md p-4 bg-muted">
            <h4 className="font-medium mb-2">Texto Extraído:</h4>
            <p className="text-sm">{result}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AdaptiveLearningDashboard() {
  const [user] = useAuthState(auth);
  const { getPersonalizedRecommendation, recommendation, isProcessing } = useAdaptiveLearning();

  const handleGetRecommendation = async () => {
    if (user) {
      await getPersonalizedRecommendation(user.uid);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Recomendaciones Adaptativas con IA
        </CardTitle>
        <p className="text-muted-foreground">
          Recibe sugerencias personalizadas basadas en tu rendimiento
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button onClick={handleGetRecommendation} disabled={isProcessing}>
          {isProcessing ? 'Analizando tu progreso...' : 'Obtener Recomendación'}
        </Button>

        {recommendation && (
          <div className="border rounded-md p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Recomendación Personalizada</span>
            </div>
            <p className="text-sm text-blue-700">{recommendation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function PerformancePredictor() {
  const [user] = useAuthState(auth);
  const [quizId, setQuizId] = useState('');
  const { predictExamPerformance, prediction, isProcessing } = usePerformancePrediction();

  const handlePredict = async () => {
    if (user && quizId) {
      await predictExamPerformance(user.uid, quizId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Predicción de Rendimiento con IA
        </CardTitle>
        <p className="text-muted-foreground">
          Predice tu rendimiento en exámenes antes de tomarlos
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="ID del Examen"
            value={quizId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuizId(e.target.value)}
          />
          <Button onClick={handlePredict} disabled={isProcessing || !quizId}>
            {isProcessing ? 'Prediciendo...' : 'Predecir'}
          </Button>
        </div>

        {prediction && (
          <div className="border rounded-md p-4 bg-green-50 border-green-200">
            <h4 className="font-medium mb-2">Predicción de Rendimiento:</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Badge variant="outline">Puntaje Estimado</Badge>
                <p className="text-lg font-bold text-green-800">{prediction.predictedScore}%</p>
              </div>
              <div>
                <Badge variant="outline">Confianza</Badge>
                <p className="text-lg font-bold text-green-800">{Math.round(prediction.confidence * 100)}%</p>
              </div>
              <div>
                <Badge variant="outline">Tiempo de Preparación</Badge>
                <p className="text-lg font-bold text-green-800">{prediction.recommendedPrepTime} min</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
