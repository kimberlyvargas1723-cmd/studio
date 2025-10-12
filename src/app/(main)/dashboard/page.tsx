// src/app/(main)/dashboard/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, BarChart3, Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Header } from '@/components/header';
import { AdmissionChecklist } from '@/components/admission-checklist';

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

/**
 * Renders the main dashboard of the application.
 * It displays a welcoming hero section, the new admission checklist,
 * and feature cards that navigate to the primary sections of the app.
 */
export default function DashboardPage() {
  const heroImage: ImagePlaceholder | undefined = PlaceHolderImages.find(
    (img) => img.id === 'dashboard-hero'
  );

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
            <h2 className="font-headline text-3xl md:text-5xl font-bold tracking-tighter">
              ¡Bienvenida, futura psicóloga Kimberly!
            </h2>
            <p className="mt-2 max-w-2xl text-lg text-white/90">
              Esta es tu central de estudio inteligente. Aquí tienes todo lo que necesitas para conquistar tu examen de admisión a Psicología UANL 2025.
            </p>
            <Button asChild className="mt-6">
              <Link href="/study">
                Empezar a Estudiar <ArrowRight className="ml-2" />
              </Link>
            </Button>
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
          )})}
        </div>
      </main>
    </div>
  );
}
