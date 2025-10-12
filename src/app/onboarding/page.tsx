// src/app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { DiagnosticQuiz } from '@/components/diagnostic-quiz';
import { VairyxIcon } from '@/components/VairyxIcon';


/**
 * Manages the multi-step onboarding process for new users.
 * It starts with a welcome screen and proceeds to a diagnostic psychometric simulation
 * to gauge the user's initial skill level.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);


  if (step === 2) {
    return <DiagnosticQuiz />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <VairyxIcon className="h-40 w-40" />
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
            <h2 className="font-headline text-2xl font-semibold">Primer Paso: Simulación Psicométrica</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                El examen psicométrico es tu primer filtro. Comenzaremos con una breve simulación para entender tu nivel actual en razonamiento lógico, series y analogías. ¡Esto es clave para empezar con el pie derecho!
            </p>
            <Button size="lg" className="mt-6" onClick={() => setStep(2)}>
                Comenzar Simulación
                <BrainCircuit className="ml-2 h-5 w-5" />
            </Button>
        </div>
    </div>
  );
}
