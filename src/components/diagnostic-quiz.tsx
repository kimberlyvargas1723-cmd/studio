// src/components/diagnostic-quiz.tsx
'use client';

import { useRouter } from 'next/navigation';
import { saveLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';
import { LearningStyleQuiz } from '@/components/learning-style-quiz';
import { useUser } from '@/firebase';

/**
 * Un componente contenedor específicamente para el quiz de diagnóstico inicial del onboarding.
 * 
 * Sus principales responsabilidades son:
 * 1. Renderizar el componente reutilizable `LearningStyleQuiz`.
 * 2. Definir lo que sucede *después* de que se completa el quiz en el contexto del onboarding:
 *    - Guardar la estrategia de aprendizaje generada en localStorage.
 *    - Marcar el onboarding como completado en localStorage.
 *    - Redirigir al usuario al dashboard principal.
 * 
 * Este componente actúa como un "anfitrión" para el quiz durante la primera experiencia del usuario.
 */
export function DiagnosticQuiz() {
  const router = useRouter();
  const { user } = useUser();

  /**
   * Callback pasado al `LearningStyleQuiz`.
   * Esta función se ejecuta una vez que el usuario completa el quiz y la IA
   * ha generado su estrategia de aprendizaje personalizada.
   * @param {LearningStrategy} strategy - El objeto de estrategia devuelto por el flujo de IA.
   */
  const handleFinishOnboarding = async (strategy: LearningStrategy) => {
    if (!user) return;
    // Persiste la estrategia de aprendizaje del usuario en Firestore.
    await saveLearningStrategy(user.uid, strategy);
    // Establece una bandera para indicar que el proceso de onboarding está completo.
    localStorage.setItem('onboardingComplete', 'true');
    // Redirige al usuario al dashboard para comenzar a usar la aplicación.
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      {/* Renderiza el componente de quiz reutilizable con el manejador específico para el onboarding */}
      <LearningStyleQuiz 
        onFinish={handleFinishOnboarding}
        title="Diagnóstico de Estilo de Aprendizaje"
        description="Elige la opción que mejor te describa para cada situación."
        finishButtonText="Generar mi Estrategia y Empezar"
      />
    </div>
  );
}
