/**
 * Integración de Videos Educativos de YouTube
 * Incluye canales famosos de LATAM como JulioProfe, Khan Academy Español,
 * Psicología al Día, Neurociencia para Todos, y UANL Oficial
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Video, Play, ExternalLink, Star, Clock, Users, BookOpen, Brain, Calculator } from 'lucide-react';
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { RecommendationRatingComponent } from './recommendation-rating';

interface EducationalVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string; // YouTube video ID
  channel: string;
  channelName: string;
  duration: string;
  views: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  tags: string[];
  rating: number;
  thumbnailUrl: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  language: 'es' | 'en';
  relevanceScore: number; // For recommendation algorithm
}

interface VideoRecommendationProps {
  userLevel?: string;
  topic?: string;
  learningStyle?: string;
  maxResults?: number;
}

// Curated list of educational YouTube channels in Spanish/LATAM
const EDUCATIONAL_CHANNELS = {
  'juliprofe': {
    name: 'JulioProfe',
    description: 'Matemáticas y física explicadas de forma clara',
    country: 'Colombia',
    topics: ['matemáticas', 'física', 'estadística', 'cálculo'],
    url: 'https://youtube.com/@JulioProfe'
  },
  'khanacademy-es': {
    name: 'Khan Academy en Español',
    description: 'Educación gratuita de calidad mundial',
    country: 'Internacional',
    topics: ['matemáticas', 'ciencias', 'humanidades', 'programación'],
    url: 'https://youtube.com/@KhanAcademyEspanol'
  },
  'psicologia-aldia': {
    name: 'Psicología al Día',
    description: 'Contenido especializado en psicología',
    country: 'México',
    topics: ['psicología', 'psicoanálisis', 'terapia', 'salud mental'],
    url: 'https://youtube.com/@PsicologiaAlDia'
  },
  'neurociencia-todos': {
    name: 'Neurociencia para Todos',
    description: 'Neurociencia aplicada de forma accesible',
    country: 'Argentina',
    topics: ['neurociencia', 'cerebro', 'cognición', 'biología'],
    url: 'https://youtube.com/@NeurocienciaParaTodos'
  },
  'uanl-oficial': {
    name: 'UANL Oficial',
    description: 'Contenido oficial de la Universidad Autónoma de Nuevo León',
    country: 'México',
    topics: ['psicología', 'admision', 'universidad', 'academia'],
    url: 'https://youtube.com/@UANLOficial'
  },
  'academiainternet': {
    name: 'Academia Internet',
    description: 'Explicaciones educativas de alta calidad',
    country: 'España',
    topics: ['psicología', 'filosofía', 'sociología', 'ciencias sociales'],
    url: 'https://youtube.com/@AcademiaInternet'
  }
};

// Sample videos database (in production, this would be in Firestore)
const SAMPLE_VIDEOS: EducationalVideo[] = [
  {
    id: 'juliprofe-estadistica-1',
    title: 'Estadística Básica para Psicología - Introducción',
    description: 'Conceptos fundamentales de estadística aplicados a la investigación psicológica',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder - would be real video ID
    channel: 'juliprofe',
    channelName: 'JulioProfe',
    duration: '15:30',
    views: '125K',
    difficulty: 'beginner',
    topics: ['estadística', 'psicología', 'investigación'],
    tags: ['estadística básica', 'psicología', 'métodos cuantitativos'],
    rating: 4.8,
    thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    learningStyle: 'visual',
    language: 'es',
    relevanceScore: 95
  },
  {
    id: 'psicologia-aldia-cognitiva',
    title: 'Psicología Cognitiva: Procesos Mentales',
    description: 'Explicación completa de los procesos cognitivos básicos',
    youtubeId: '9bZkp7q19f0',
    channel: 'psicologia-aldia',
    channelName: 'Psicología al Día',
    duration: '22:15',
    views: '89K',
    difficulty: 'intermediate',
    topics: ['psicología cognitiva', 'procesos mentales', 'atención'],
    tags: ['cognición', 'memoria', 'atención', 'percepción'],
    rating: 4.6,
    thumbnailUrl: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
    learningStyle: 'visual',
    language: 'es',
    relevanceScore: 92
  },
  {
    id: 'neurociencia-cerebro',
    title: 'El Cerebro Humano: Estructura y Funciones',
    description: 'Anatomía y funciones del cerebro para estudiantes de psicología',
    youtubeId: 'fJ9rUzIMcZQ',
    channel: 'neurociencia-todos',
    channelName: 'Neurociencia para Todos',
    duration: '18:45',
    views: '156K',
    difficulty: 'intermediate',
    topics: ['neurociencia', 'anatomía', 'cerebro', 'funciones cognitivas'],
    tags: ['anatomía cerebral', 'lobulos', 'sistema nervioso', 'neurobiología'],
    rating: 4.7,
    thumbnailUrl: 'https://img.youtube.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    learningStyle: 'visual',
    language: 'es',
    relevanceScore: 90
  },
  {
    id: 'uanl-admision',
    title: 'Guía de Admisión UANL 2024 - Psicología',
    description: 'Todo lo que necesitas saber para ingresar a Psicología UANL',
    youtubeId: 'hTWKbfoikeg',
    channel: 'uanl-oficial',
    channelName: 'UANL Oficial',
    duration: '12:30',
    views: '45K',
    difficulty: 'beginner',
    topics: ['admision uanl', 'psicología', 'proceso de admisión'],
    tags: ['uanl', 'admision', 'psicología', 'requisitos'],
    rating: 4.5,
    thumbnailUrl: 'https://img.youtube.com/vi/hTWKbfoikeg/maxresdefault.jpg',
    learningStyle: 'reading',
    language: 'es',
    relevanceScore: 98
  },
  {
    id: 'khan-psicologia-social',
    title: 'Psicología Social: Influencia y Comportamiento',
    description: 'Principios básicos de la psicología social con ejemplos reales',
    youtubeId: 'o8BkzvP20RE',
    channel: 'khanacademy-es',
    channelName: 'Khan Academy en Español',
    duration: '16:20',
    views: '78K',
    difficulty: 'intermediate',
    topics: ['psicología social', 'comportamiento', 'influencia social'],
    tags: ['psicología social', 'comportamiento grupal', 'influencia', 'normas sociales'],
    rating: 4.4,
    thumbnailUrl: 'https://img.youtube.com/vi/o8BkzvP20RE/maxresdefault.jpg',
    learningStyle: 'visual',
    language: 'es',
    relevanceScore: 88
  }
];

// Utility function for difficulty colors (global scope)
const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-yellow-100 text-yellow-800';
    case 'advanced': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function VideoRecommendationComponent({
  userLevel = 'intermediate',
  topic = 'psicología',
  learningStyle = 'visual',
  maxResults = 6
}: VideoRecommendationProps) {
  const [user] = useAuthState(auth);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<EducationalVideo[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading videos
    setTimeout(() => {
      setVideos(SAMPLE_VIDEOS);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by user level and topic
    filtered = filtered.filter(video =>
      video.difficulty === userLevel &&
      video.topics.some(t => t.toLowerCase().includes(topic.toLowerCase())) &&
      video.learningStyle === learningStyle
    );

    // Filter by channel
    if (selectedChannel !== 'all') {
      filtered = filtered.filter(video => video.channel === selectedChannel);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(video => video.difficulty === selectedDifficulty);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort by relevance score
    filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);

    setFilteredVideos(filtered.slice(0, maxResults));
  }, [videos, userLevel, topic, learningStyle, selectedChannel, selectedDifficulty, searchTerm, maxResults]);

  const getChannelInfo = (channel: string) => {
    return EDUCATIONAL_CHANNELS[channel as keyof typeof EDUCATIONAL_CHANNELS];
  };

  const trackVideoView = async (video: EducationalVideo) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'videoViews'), {
        userId: user.uid,
        videoId: video.id,
        videoTitle: video.title,
        channel: video.channel,
        topic: topic,
        difficulty: video.difficulty,
        learningStyle: video.learningStyle,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  const openVideo = (video: EducationalVideo) => {
    trackVideoView(video);
    window.open(`https://youtube.com/watch?v=${video.youtubeId}`, '_blank');
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-muted-foreground">Cargando videos educativos...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Videos Educativos Recomendados
        </CardTitle>
        <p className="text-muted-foreground">
          Contenido curado de los mejores canales educativos de LATAM
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar videos..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedChannel} onValueChange={setSelectedChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los canales</SelectItem>
              {Object.entries(EDUCATIONAL_CHANNELS).map(([key, channel]) => (
                <SelectItem key={key} value={key}>
                  {channel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Dificultad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="beginner">Principiante</SelectItem>
              <SelectItem value="intermediate">Intermedio</SelectItem>
              <SelectItem value="advanced">Avanzado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Video Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => {
            const channelInfo = getChannelInfo(video.channel);

            return (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button onClick={() => openVideo(video)} size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Ver Video
                    </Button>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className={getDifficultyColor(video.difficulty)}>
                      {video.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3">
                  <h3 className="font-medium text-sm mb-1 line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">
                      {video.channelName}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {channelInfo?.country}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {video.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {video.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {video.rating}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {video.topics.slice(0, 2).map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No se encontraron videos para los filtros seleccionados.</p>
            <p className="text-sm">Intenta cambiar los filtros o buscar otros términos.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for JvairyX video recommendations with rating integration
export function JvairyXVideoRecommendations({
  userLevel,
  topic,
  learningStyle
}: VideoRecommendationProps) {
  const [user] = useAuthState(auth);
  const [showRating, setShowRating] = useState<string | null>(null);
  const [videos, setVideos] = useState<EducationalVideo[]>([]);

  useEffect(() => {
    // Get personalized video recommendations
    const personalizedVideos = SAMPLE_VIDEOS
      .filter(video =>
        video.difficulty === userLevel &&
        video.topics.some(t => t.toLowerCase().includes(topic?.toLowerCase() || '')) &&
        video.learningStyle === learningStyle
      )
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3);

    setVideos(personalizedVideos);
  }, [userLevel, topic, learningStyle]);

  const handleVideoRating = async (videoId: string, rating: number, helpfulness: boolean) => {
    if (!user) return;

    try {
      await addDoc(collection(db, 'videoRecommendations'), {
        userId: user.uid,
        videoId,
        rating,
        helpfulness,
        topic: topic || 'general',
        difficulty: userLevel || 'intermediate',
        learningStyle: learningStyle || 'visual',
        timestamp: serverTimestamp()
      });

      setShowRating(null);
    } catch (error) {
      console.error('Error saving video rating:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">
          Videos recomendados por JvairyX para {topic}
        </h3>
      </div>

      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="flex">
            <div className="relative w-48 h-32 flex-shrink-0">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="sm" onClick={() => window.open(`https://youtube.com/watch?v=${video.youtubeId}`, '_blank')}>
                  <Play className="h-4 w-4 mr-1" />
                  Ver
                </Button>
              </div>
            </div>

            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium mb-1">{video.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {video.channelName} • {video.duration} • {video.views} vistas
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRating(showRating === video.id ? null : video.id)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {video.description}
              </p>

              <div className="flex flex-wrap gap-1">
                <Badge className={getDifficultyColor(video.difficulty)}>
                  {video.difficulty}
                </Badge>
                {video.topics.map((topic) => (
                  <Badge key={topic} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {showRating === video.id && (
            <div className="border-t p-4">
              <RecommendationRatingComponent
                recommendationId={video.id}
                recommendation={`Video: ${video.title}`}
                type="video"
                difficulty={video.difficulty === 'beginner' ? 'easy' : video.difficulty === 'intermediate' ? 'medium' : 'hard'}
                onRatingSubmit={(rating) => handleVideoRating(video.id, rating.rating, rating.helpfulness)}
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
