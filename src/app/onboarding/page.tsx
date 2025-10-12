// src/app/onboarding/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BrainCircuit, Loader2 } from 'lucide-react';
import { DiagnosticQuiz } from '@/components/diagnostic-quiz';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';


const RobotIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 120"
    className="h-32 w-32 robot-float"
    aria-label="Vairyx, tu asistente de IA"
  >
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <line x1="50" y1="15" x2="50" y2="5" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
    <circle cx="50" cy="5" r="3" fill="hsl(var(--accent))" className="robot-antenna-light" />
    <rect x="30" y="15" width="40" height="30" rx="8" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
    <g className="robot-eye">
        <circle cx="43" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
        <circle cx="57" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
    </g>
    <rect x="20" y="45" width="60" height="40" rx="10" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
    <rect x="10" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
    <rect x="80" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
    <rect x="35" y="55" width="30" height="20" rx="3" fill="hsl(var(--background))" />
    <path d="M 48 60 L 50 55 L 52 60 L 55 62 L 52 64 L 50 69 L 48 64 L 45 62 Z" fill="hsl(var(--accent))" filter="url(#glow)" />
  </svg>
);


/**
 * Manages the multi-step onboarding process for new users.
 * It ensures the user is authenticated before starting the process.
 * It starts with a welcome screen and proceeds to a diagnostic quiz.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If auth is done loading and there's no user, they shouldn't be here.
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Show a loader while authentication is in progress
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Only render the onboarding flow if there is a user
  if (user) {
    if (step === 2) {
      return <DiagnosticQuiz />;
    }

    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
          <RobotIcon />
          <h1 className="mt-8 font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
              ¡Bienvenida a PsicoGuía, Kimberly!
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Soy Vairyx, tu asistente de IA personal. He sido creado para ayudarte a conquistar tu examen de admisión a la Facultad de Psicología de la UANL.
          </p>
          <p className="mt-2 max-w-2xl text-lg text-muted-foreground">
              Juntos, vamos a identificar tus áreas de oportunidad, crear un plan de estudio y practicar hasta que te sientas completamente segura.
          </p>
          <div className="mt-10">
              <h2 className="font-headline text-2xl font-semibold">Primer Paso: Diagnóstico</h2>
              <p className="mt-2 text-muted-foreground">
                  Comenzaremos con un breve quiz para entender tu nivel actual. ¡No te preocupes, esto es solo para ayudarnos a empezar!
              </p>
              <Button size="lg" className="mt-6" onClick={() => setStep(2)}>
                  Comenzar Quiz de Diagnóstico
                  <BrainCircuit className="ml-2 h-5 w-5" />
              </Button>
          </div>
      </div>
    );
  }

  // Fallback while waiting for user data or redirect
  return (
     <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
  );
}
