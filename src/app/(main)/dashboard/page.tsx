// src/app/(main)/dashboard/page.tsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, BarChart3, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { AdmissionChecklist } from '@/components/admission-checklist';
import { analyzePerformanceAndAdapt } from '@/ai/flows/personalized-feedback-adaptation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const featureCards = [
  {
    title: 'Material de Estudio',
    description: 'Resume y estudia desde los enlaces oficiales de la UANL.',
    href: '/study',
    icon: BookOpen,
    imgId: 'study-card',
  },
  {
    title: 'Práctica con Quizzes',
    description: 'Pon a prueba tus conocimientos con preguntas de práctica.',
    href: '/practice',
    icon: Target,
    imgId: 'practice-card',
  },
  {
    title: 'Mide tu Progreso',
    description: 'Monitorea tu desempeño y enfócate en tus áreas débiles.',
    href: '/progress',
    icon: BarChart3,
    imgId: 'progress-card',
  },
  {
    title: 'Mi Horario',
    description: 'Genera un plan de estudio semanal y personalizado con IA.',
    href: '/schedule',
    icon: Sparkles,
    imgId: 'assistant-card',
  },
];

type Greeting = {
  feedback: string;
  adaptedQuestionTopic: string;
};

/**
 * Renders the main dashboard of the application.
 * It now fetches a personalized greeting and recommendation for Kimberly based on her learning style.
 */
export default function DashboardPage({ learningStyle }: { learningStyle?: string }) {
  const [greeting, setGreeting] = useState<Greeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const heroImage: ImagePlaceholder | undefined = PlaceHolderImages.find(
    (img) => img.id === 'dashboard-hero'
  );

  useEffect(() => {
    async function fetchGreeting() {
      setIsLoading(true);
      try {
        const result = await analyzePerformanceAndAdapt({ 
          question: 'dashboard_greeting',
          studentAnswer: '',
          correctAnswer: '',
          topic: 'General',
          learningStyle: learningStyle
        });
        setGreeting(result);
      } catch (error) {
        console.error("Failed to fetch greeting:", error);
        setGreeting({ // Fallback greeting
          feedback: '¡Bienvenida de nuevo, Kimberly! ¿Lista para estudiar?',
          adaptedQuestionTopic: ''
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchGreeting();
  }, [learningStyle]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="relative flex flex-col items-start justify-end overflow-hidden rounded-xl border-none shadow-lg">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>
          <div className="relative z-10 p-6 md:p-8 text-white">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full mt-4" />
                <Skeleton className="h-10 w-48 mt-6" />
              </>
            ) : (
              <>
                <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
                  ¡Hola de nuevo, Kimberly!
                </h2>
                <p className="mt-2 max-w-2xl text-lg text-white/90" dangerouslySetInnerHTML={{ __html: greeting?.feedback ?? '' }} />
                {greeting?.adaptedQuestionTopic && (
                  <Button asChild className="mt-6">
                    <Link href="/study">
                      Empezar a estudiar {greeting.adaptedQuestionTopic} <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </Card>

        {/* Admission Checklist */}
        <AdmissionChecklist />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => {
            const cardImage: ImagePlaceholder | undefined = PlaceHolderImages.find(
              (img) => img.id === feature.imgId
            );
            return (
              <Link key={feature.title} href={feature.href} passHref>
                <Card className="group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border-none text-white transition-all hover:scale-[1.02] hover:shadow-2xl">
                  {cardImage && (
                    <Image
                      src={cardImage.imageUrl}
                      alt={cardImage.description}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint={cardImage.imageHint}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                  <CardHeader className="relative z-10">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 p-2 text-white backdrop-blur-sm">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="font-headline text-xl tracking-tight">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-white/80">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
