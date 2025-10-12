// src/app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { DiagnosticQuiz } from '@/components/diagnostic-quiz';
import { VairyxIcon } from '@/components/VairyxIcon';


/**
 * Manages the multi-step onboarding process for new users.
 * It features a dynamic, conversational welcome from the AI assistant, Vairyx,
 * before proceeding to a diagnostic psychometric simulation.
 */
export default function OnboardingPage() {
  const [step, setStep] = useState(1);


  if (step === 2) {
    return <DiagnosticQuiz />;
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        <VairyxIcon className="h-40 w-40" />
        <div className="mt-8 max-w-2xl animate-fade-in-up">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                ¡Bienvenida a PsicoGuía, Kimberly!
            </h1>
            <blockquote className="mt-6 border-l-2 pl-6 italic text-lg text-muted-foreground">
                "Soy Vairyx, tu asistente de IA personal. He sido creado para ayudarte a conquistar tu examen de admisión a la Facultad de Psicología de la UANL. Juntos, vamos a identificar tus áreas de oportunidad y a practicar hasta que te sientas completamente segura."
            </blockquote>
        </div>

        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
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
