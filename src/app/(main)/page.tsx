import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Target, CalendarDays, BarChart3 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Header } from '@/components/header';

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
    title: 'Crea tu Horario',
    description: 'Organiza tu tiempo y planea tus sesiones de estudio.',
    href: '/schedule',
    icon: CalendarDays,
    imgId: 'schedule-card',
  },
  {
    title: 'Mide tu Progreso',
    description: 'Monitorea tu desempeño y enfócate en tus áreas débiles.',
    href: '/progress',
    icon: BarChart3,
    imgId: 'progress-card',
  },
];

export default function DashboardPage() {
  const heroImage: ImagePlaceholder | undefined = PlaceHolderImages.find(
    (img) => img.id === 'dashboard-hero'
  );

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Card className="relative flex flex-col items-start justify-end overflow-hidden rounded-xl">
          <div className="absolute inset-0 z-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="relative z-10 p-6 md:p-8 text-white">
            <h2 className="font-headline text-3xl md:text-5xl font-bold">
              Prepárate para Psicología UANL 2025
            </h2>
            <p className="mt-2 max-w-xl text-lg text-white/90">
              Tu asistente inteligente para conquistar el examen de admisión de Psicología. Empieza a estudiar de forma más inteligente.
            </p>
            <Button asChild className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/study">
                Empezar a Estudiar <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((feature) => {
             const cardImage: ImagePlaceholder | undefined = PlaceHolderImages.find(
                (img) => img.id === feature.imgId
              );
            return (
            <Link key={feature.title} href={feature.href} passHref>
              <Card className="flex flex-col h-full hover:border-primary transition-colors duration-300 group">
                <CardHeader className="flex-row items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                   <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )})}
        </div>
      </main>
    </div>
  );
}
