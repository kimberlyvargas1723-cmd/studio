// src/app/onboarding/page.tsx
'use client';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';
import { DiagnosticQuiz } from '@/components/diagnostic-quiz';
import { VairyxIcon } from '@/components/VairyxIcon';

/**
 * Gestiona el proceso de onboarding de múltiples pasos para nuevos usuarios.
 * 
 * Esta página sirve como la pantalla de bienvenida inicial para Kimberly. Introduce al
 * asistente de IA, Vairyx, y explica el propósito del quiz de diagnóstico.
 * 
 * @returns El JSX para el paso actual en el proceso de onboarding.
 */
export default function OnboardingPage() {
  // Estado para gestionar el paso actual del proceso de onboarding.
  // Paso 1: Mensaje de bienvenida.
  // Paso 2: Quiz de diagnóstico.
  const [step, setStep] = useState(1);

  // Si el usuario procede al paso 2, renderiza el componente DiagnosticQuiz.
  if (step === 2) {
    return <DiagnosticQuiz />;
  }

  // Renderiza la pantalla de bienvenida inicial (Paso 1).
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
        {/* El ícono animado del asistente de IA */}
        <VairyxIcon className="h-40 w-40" />
        
        {/* Mensaje de bienvenida e introducción de Vairyx */}
        <div className="mt-8 max-w-2xl animate-fade-in-up">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-primary md:text-5xl">
                ¡Bienvenida a PsicoGuía, Kimberly!
            </h1>
            <blockquote className="mt-6 border-l-2 pl-6 italic text-lg text-muted-foreground">
                "Soy Vairyx, tu asistente de IA personal. He sido creado para ayudarte a conquistar tu examen de admisión a la Facultad de Psicología de la UANL. Juntos, vamos a identificar tus áreas de oportunidad y a practicar hasta que te sientas completamente segura."
            </blockquote>
        </div>

        {/* Llamada a la acción para iniciar el quiz de diagnóstico */}
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
