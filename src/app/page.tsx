// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useUser } from '@/firebase';
import { getLearningStrategy } from '@/lib/services';

/**
 * El punto de entrada principal de la aplicación.
 * Este componente ahora actúa como un guardia de enrutamiento basado en la autenticación.
 * 
 * - Si el usuario no está autenticado, lo redirige a la página de '/login'.
 * - Si el usuario está autenticado, verifica si ha completado el onboarding.
 *   - Si no, lo envía a '/onboarding'.
 *   - Si sí, lo redirige al dashboard.
 */
export default function InitialPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // No hacer nada mientras se verifica el estado de autenticación.
    if (loading) {
      return;
    }

    // Si no hay usuario después de cargar, redirigir a la página de login.
    if (!user) {
      router.replace('/login');
      return;
    }

    // Si hay un usuario, verificar si ha completado el onboarding (tiene una estrategia guardada).
    getLearningStrategy(user.uid).then(strategy => {
        if (strategy) {
            // Si tiene estrategia, va al dashboard.
            router.replace('/dashboard');
        } else {
            // Si no tiene estrategia, va al onboarding.
            router.replace('/onboarding');
        }
    });

  }, [user, loading, router]);

  /**
   * Renderiza un spinner de carga mientras se procesa la lógica de redirección.
   */
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-4 text-muted-foreground">Cargando tu sesión...</p>
    </div>
  );
}
