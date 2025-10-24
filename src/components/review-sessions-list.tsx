/**
 * Review Sessions List Component
 * Enhanced with adaptive recommendations and proactive suggestions
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Plus, Clock, Star, User, TrendingUp, Lightbulb, AlertCircle } from 'lucide-react';
import ReviewSessionComponent from './review-session';

interface ReviewSession {
  id: string;
  topic: string;
  difficulty: string;
  student: string;
  expert: string;
  status: 'waiting' | 'active' | 'completed';
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
  rating?: number;
}

interface UserMemory {
  pastSessions: { topic: string; difficulty: string; rating: number; date: string }[];
  preferences: { style: string; weaknesses: string[]; strengths: string[] };
  currentLevel: number;
  recommendedTopics: string[];
  suggestedDifficulty: string;
}

const availableTopics = [
  'Psicología Cognitiva',
  'Psicoanálisis',
  'Psicología Social',
  'Neurociencia',
  'Psicología del Desarrollo',
  'Terapia Cognitivo-Conductual',
  'Psicología Clínica',
  'Metodología de la Investigación'
];

const difficulties = [
  { value: 'beginner', label: 'Principiante' },
  { value: 'intermediate', label: 'Intermedio' },
  { value: 'advanced', label: 'Avanzado' }
];

export function ReviewSessionsList() {
  const [user] = useAuthState(auth);
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [userMemory, setUserMemory] = useState<UserMemory | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Load user memory and generate recommendations
  useEffect(() => {
    if (!user) return;

    const loadUserMemory = async () => {
      const memoryRef = doc(db, 'userMemory', user.uid);
      const snapshot = await getDoc(memoryRef);

      if (snapshot.exists()) {
        const memory = snapshot.data() as UserMemory;
        setUserMemory(memory);
        setRecommendations(generateRecommendations(memory));
      } else {
        // Initialize default memory
        const defaultMemory: UserMemory = {
          pastSessions: [],
          preferences: { style: 'visual', weaknesses: [], strengths: [] },
          currentLevel: 1,
          recommendedTopics: ['Psicología Cognitiva', 'Neurociencia'],
          suggestedDifficulty: 'beginner'
        };
        setUserMemory(defaultMemory);
        setRecommendations(generateRecommendations(defaultMemory));
      }
    };

    loadUserMemory();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const sessionsRef = ref('reviewSessions');

    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const sessionsData = snapshot.val();
      if (sessionsData) {
        const sessionsList = Object.entries(sessionsData)
          .map(([id, session]: [string, any]) => ({ id, ...session }))
          .filter((session: ReviewSession) => session.student === user.uid)
          .sort((a: ReviewSession, b: ReviewSession) => b.createdAt - a.createdAt);
        setSessions(sessionsList);
      } else {
        setSessions([]);
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const generateRecommendations = (memory: UserMemory): string[] => {
    const recommendations: string[] = [];

    // Based on weaknesses
    if (memory.weaknesses.length > 0) {
      recommendations.push(`Refuerza ${memory.weaknesses[0]} - necesitas más práctica`);
    }

    // Based on recent performance
    const recentSessions = memory.pastSessions
      .filter(s => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (recentSessions.length > 0) {
      const avgRating = recentSessions.reduce((sum, s) => sum + s.rating, 0) / recentSessions.length;
      if (avgRating < 3) {
        recommendations.push(`Considera bajar la dificultad a ${memory.suggestedDifficulty}`);
      } else if (avgRating >= 4) {
        recommendations.push(`¡Excelente progreso! Puedes subir a ${memory.suggestedDifficulty === 'beginner' ? 'intermediate' : 'advanced'}`);
      }
    }

    // Based on level progression
    if (memory.currentLevel >= 3 && !memory.pastSessions.some(s => s.topic === 'Psicología Clínica')) {
      recommendations.push('Explora Psicología Clínica para profundizar');
    }

    // Proactive suggestions
    if (memory.pastSessions.length === 0) {
      recommendations.push('Comienza con Psicología Cognitiva - es fundamental');
    }

    return recommendations;
  };

  const getRecommendedDifficulty = (): string => {
    if (!userMemory) return 'beginner';

    // Adaptive difficulty based on performance
    const recentSessions = userMemory.pastSessions
      .filter(s => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (recentSessions.length >= 3) {
      const avgRating = recentSessions.reduce((sum, s) => sum + s.rating, 0) / recentSessions.length;
      if (avgRating >= 4.5) return 'advanced';
      if (avgRating >= 3.5) return 'intermediate';
    }

    return userMemory.suggestedDifficulty || 'beginner';
  };

  const createSession = async () => {
    if (!selectedTopic || !selectedDifficulty || !user) return;

    const sessionsRef = ref('reviewSessions');
    const newSessionRef = push(sessionsRef);

    await set(newSessionRef, {
      topic: selectedTopic,
      difficulty: selectedDifficulty,
      student: user.uid,
      expert: 'ai-expert-' + selectedTopic.toLowerCase().replace(/\s+/g, '-'),
      status: 'waiting',
      createdAt: serverTimestamp(),
    });

    setSelectedTopic('');
    setSelectedDifficulty('');
    setIsCreateDialogOpen(false);
  };

  if (selectedSession) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setSelectedSession(null)}
          className="mb-4"
        >
          ← Back to Sessions
        </Button>
        <ReviewSessionComponent sessionId={selectedSession} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sesiones de Repaso</h2>
          <p className="text-muted-foreground">
            Platica con expertos de IA sobre temas específicos
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sesión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Iniciar Nueva Sesión de Repaso</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tema</label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige un tema" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTopics.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                        {userMemory?.recommendedTopics.includes(topic) && (
                          <Badge variant="secondary" className="ml-2">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Recomendado
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Dificultad</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige la dificultad" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff.value} value={diff.value}>
                        {diff.label}
                        {getRecommendedDifficulty() === diff.value && (
                          <Badge variant="secondary" className="ml-2">
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Sugerido
                          </Badge>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={createSession}
                  disabled={!selectedTopic || !selectedDifficulty}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Lightbulb className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-700">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center text-muted-foreground">
          Cargando sesiones...
        </div>
      ) : sessions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Hay Sesiones de Repaso</h3>
              <p className="text-muted-foreground mb-4">
                ¡Inicia una sesión para repasar con un experto de IA!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  {session.topic}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {difficulties.find(d => d.value === session.difficulty)?.label}
                  </Badge>
                  <Badge variant={
                    session.status === 'active' ? 'default' :
                    session.status === 'completed' ? 'secondary' : 'outline'
                  }>
                    {session.status === 'active' ? 'En Progreso' :
                     session.status === 'completed' ? 'Completada' : 'Esperando'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Dr. Expert</span>
                    </div>
                    {session.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-sm">{session.rating}/5</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setSelectedSession(session.id)}
                    variant={session.status === 'active' ? 'default' : 'outline'}
                  >
                    {session.status === 'active' ? 'Continuar' : 'Ver Sesión'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSessionsList;
