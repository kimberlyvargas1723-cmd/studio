// src/app/(main)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * El punto de entrada principal de la aplicación después de que un usuario se autentica.
 * Este componente actúa como un guardia de enrutamiento, verificando si el usuario ha completado
 * el proceso de onboarding al verificar una bandera en localStorage.
 * 
 * - Si el onboarding está completo, redirige al usuario a su dashboard principal '/dashboard'.
 * - Si el onboarding no está completo, lo envía a la página '/onboarding' para comenzar.
 * 
 * Esto asegura que los usuarios siempre comiencen en el lugar correcto de su viaje.
 */
export default function InitialPage() {
  const router = useRouter();

  /**
   * Efecto para verificar el estado de onboarding y realizar la redirección.
   * Se ejecuta una vez cuando el componente se monta.
   */
  useEffect(() => {
      // Verifica en localStorage la bandera 'onboardingComplete'.
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      
      if (onboardingComplete === 'true') {
        // Si el onboarding está hecho, ve al dashboard principal.
        router.replace('/dashboard');
      } else {
        // De lo contrario, comienza el proceso de onboarding.
        router.replace('/onboarding');
      }
  }, [router]);

  /**
   * Renderiza un spinner de carga mientras se procesa la lógica de redirección.
   * Esto proporciona feedback visual al usuario de que algo está sucediendo.
   */
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
