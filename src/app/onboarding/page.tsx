// src/app/onboarding/page.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { DiagnosticQuiz } from '@/components/diagnostic-quiz';
import { VairyxIcon } from '@/components/VairyxIcon';

/**
 * Manages the multi-step onboarding process for new users.
 * 
 * This page serves as the initial welcome screen for Kimberly. It introduces the
 * AI assistant, Vairyx, and explains the purpose of the diagnostic quiz.
 * 
 * @returns The JSX for the current step in the onboarding process.
 */
export default function OnboardingPage() {
  // State to manage the current step of the onboarding process.
  // Step 1: Welcome message.
  // Step 2: Diagnostic quiz.
  const [step, setStep] = useState(1);

  // If the user proceeds to step 2, render the DiagnosticQuiz component.
  if (step === 2) {
    return <DiagnosticQuiz />;
  }

  // Render the initial welcome screen (Step 1).
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        {/* The animated AI assistant icon */}
        <VairyxIcon className="h-40 w-40" />
        
        {/* Welcome message and introduction from Vairyx */}
        <div className="mt-8 max-w-2xl animate-fade-in-up">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                ¡Bienvenida a PsicoGuía, Kimberly!
            </h1>
            <blockquote className="mt-6 border-l-2 pl-6 italic text-lg text-muted-foreground">
                "Soy Vairyx, tu asistente de IA personal. He sido creado para ayudarte a conquistar tu examen de admisión a la Facultad de Psicología de la UANL. Juntos, vamos a identificar tus áreas de oportunidad y a practicar hasta que te sientas completamente segura."
            </blockquote>
        </div>

        {/* Call to action to start the diagnostic quiz */}
        <div className="mt-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="font-headline text-2xl font-semibold">Primer Paso: Descubre tu Superpoder para Aprender</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Para crear el plan de estudio perfecto para ti, primero necesito entender cómo aprendes mejor. Este breve diagnóstico nos ayudará a descubrir tu estilo de aprendizaje único. ¡Es el secreto para estudiar de forma más inteligente, no más dura!
            </p>
            <Button size="lg" className="mt-6" onClick={() => setStep(2)}>
                Descubrir mi Estilo de Aprendizaje
                <BrainCircuit className="ml-2 h-5 w-5" />
            </Button>
        </div>
    </div>
  );
}
