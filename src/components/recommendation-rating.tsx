/**
 * Sistema de Rating 1-5 para Recomendaciones de JvairyX
 * Permite a los usuarios calificar las recomendaciones de la IA
 * para mejorar la precisión y adaptación del sistema
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, ThumbsDown, BookOpen, Video, Brain, Target } from 'lucide-react';
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

interface RecommendationRating {
  id: string;
  recommendationId: string;
  userId: string;
  rating: number; // 1-5 stars
  helpfulness: boolean; // thumbs up/down
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'topic' | 'video' | 'quiz' | 'study_method';
  content: string; // the actual recommendation text
  timestamp: Date;
  userFeedback?: string; // optional user comments
}

// Helper function to calculate average rating
const calculateAverageRating = (ratings: RecommendationRating[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
  return sum / ratings.length;
};

interface RatingComponentProps {
  recommendationId: string;
  recommendation: string;
  type: 'topic' | 'video' | 'quiz' | 'study_method';
  difficulty?: 'easy' | 'medium' | 'hard';
  onRatingSubmit?: (rating: RecommendationRating) => void;
  showFeedback?: boolean;
}

export function RecommendationRatingComponent({
  recommendationId,
  recommendation,
  type,
  difficulty = 'medium',
  onRatingSubmit,
  showFeedback = true
}: RatingComponentProps) {
  const [user] = useAuthState(auth);
  const [rating, setRating] = useState<number>(0);
  const [helpfulness, setHelpfulness] = useState<boolean | null>(null);
  const [userFeedback, setUserFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'topic': return <BookOpen className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'quiz': return <Brain className="h-4 w-4" />;
      case 'study_method': return <Target className="h-4 w-4" />;
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

  const submitRating = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);

    try {
      const ratingData: RecommendationRating = {
        id: `${recommendationId}_${user.uid}_${Date.now()}`,
        recommendationId,
        userId: user.uid,
        rating,
        helpfulness: helpfulness || false,
        difficulty,
        type,
        content: recommendation,
        timestamp: new Date(),
        userFeedback: userFeedback.trim() || undefined
      };

      // Save to Firestore
      await addDoc(collection(db, 'recommendationRatings'), {
        ...ratingData,
        timestamp: serverTimestamp(),
        userFeedback: ratingData.userFeedback
      });

      // Update user preferences based on rating
      const userPrefsRef = doc(db, 'userPreferences', user.uid);
      const userPrefs = await getDoc(userPrefsRef);

      if (userPrefs.exists()) {
        const prefs = userPrefs.data();
        const updatedPrefs = {
          ...prefs,
          ratingHistory: [...(prefs.ratingHistory || []), ratingData],
          averageRating: calculateAverageRating([...(prefs.ratingHistory || []), ratingData]),
          preferredDifficulty: updatePreferredDifficulty([...(prefs.ratingHistory || []), ratingData], difficulty),
          feedbackCount: (prefs.feedbackCount || 0) + 1
        };
        await setDoc(userPrefsRef, updatedPrefs);
      } else {
        // Create new preferences document
        await setDoc(userPrefsRef, {
          userId: user.uid,
          ratingHistory: [ratingData],
          averageRating: rating,
          preferredDifficulty: difficulty,
          feedbackCount: 1,
          createdAt: serverTimestamp()
        });
      }

      setIsSubmitted(true);

      if (onRatingSubmit) {
        onRatingSubmit(ratingData);
      }

    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateAverageRating = (ratings: RecommendationRating[]): number => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return sum / ratings.length;
  };

  const updatePreferredDifficulty = (ratings: RecommendationRating[], currentDifficulty: string): string => {
    const recentRatings = ratings.slice(-5); // Last 5 ratings
    const avgRating = calculateAverageRating(recentRatings);

    if (avgRating >= 4.5) return 'hard';
    if (avgRating >= 3.5) return 'medium';
    return 'easy';
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-green-600 mb-2">
              <ThumbsUp className="h-8 w-8 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">
              ¡Gracias por tu feedback!
            </h3>
            <p className="text-sm text-green-600">
              JvairyX aprenderá de tu rating para darte mejores recomendaciones en el futuro.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(type)}
            Recomendación de JvairyX
          </CardTitle>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          {recommendation}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            ¿Qué tan útil te parece esta recomendación?
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="sm"
                onClick={() => setRating(star)}
                className="p-1"
              >
                <Star
                  className={`h-6 w-6 ${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </Button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>No útil</span>
            <span>Muy útil</span>
          </div>
        </div>

        {/* Thumbs Up/Down */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            ¿La seguirás?
          </label>
          <div className="flex gap-2">
            <Button
              variant={helpfulness === true ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpfulness(true)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Sí, la seguiré
            </Button>
            <Button
              variant={helpfulness === false ? "default" : "outline"}
              size="sm"
              onClick={() => setHelpfulness(false)}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              No, gracias
            </Button>
          </div>
        </div>

        {/* Optional Feedback */}
        {showFeedback && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Comentarios opcionales (ayúdanos a mejorar)
            </label>
            <textarea
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="¿Por qué diste este rating? ¿Cómo podemos mejorar las recomendaciones?"
              className="w-full p-3 border rounded-md text-sm resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            onClick={submitRating}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Rating'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook para obtener ratings del usuario
export function useRecommendationRatings(userId: string) {
  const [ratings, setRatings] = useState<RecommendationRating[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRatings = async () => {
      try {
        const ratingsRef = collection(db, 'recommendationRatings');
        const ratingsQuery = query(ratingsRef, where('userId', '==', userId));
        const snapshot = await getDocs(ratingsQuery);

        const ratingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as RecommendationRating[];

        setRatings(ratingsData);
        setAverageRating(calculateAverageRating(ratingsData));
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRatings();
  }, [userId]);

  return { ratings, averageRating, isLoading };
}

// Componente para mostrar estadísticas de ratings
export function RatingStatsComponent({ userId }: { userId: string }) {
  const { ratings, averageRating, isLoading } = useRecommendationRatings(userId);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Cargando estadísticas...</div>;
  }

  const totalRatings = ratings.length;
  const helpfulRatings = ratings.filter(r => r.helpfulness).length;
  const helpfulnessRate = totalRatings > 0 ? (helpfulRatings / totalRatings) * 100 : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Estadísticas de tus Ratings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span>Rating promedio:</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{averageRating.toFixed(1)}/5</span>
          </div>
        </div>

        <div className="flex justify-between">
          <span>Total de ratings:</span>
          <span className="font-medium">{totalRatings}</span>
        </div>

        <div className="flex justify-between">
          <span>Recomendaciones útiles:</span>
          <span className="font-medium">{helpfulnessRate.toFixed(0)}%</span>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            JvairyX usa tus ratings para personalizar mejor las recomendaciones.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
