// src/app/layout.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { PT_Sans } from 'next/font/google';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { ChatWidget } from '@/components/chat-widget';
import { getLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-pt-sans'
});

/**
 * El layout raíz de la aplicación.
 * 
 * Este componente envuelve todas las páginas y es responsable de:
 * 1.  Aplicar estilos globales y fuentes.
 * 2.  Renderizar la estructura de la UI condicionalmente (ej. mostrar la barra lateral
 *     solo en las páginas principales, no en el onboarding).
 * 3.  Gestionar y propagar estado global como el estilo de aprendizaje y el feedback de los quizzes.
 * 4.  Pasar props a sus componentes hijos usando `React.cloneElement`.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Estado para el feedback visual inmediato tras responder una pregunta del quiz.
    const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
    // Estado para almacenar el estilo de aprendizaje del usuario (ej. 'V', 'A', 'R', 'K').
    const [learningStyle, setLearningStyle] = useState<string | undefined>(undefined);
    const pathname = usePathname();

    const isOnboardingPage = pathname === '/onboarding';

    /**
     * Efecto que se ejecuta una sola vez al montar el componente en el cliente.
     * Su propósito es leer el estilo de aprendizaje guardado en el `localStorage`
     * para personalizar la experiencia de la aplicación.
     */
    useEffect(() => {
        const strategy: LearningStrategy | null = getLearningStrategy();
        if (strategy) {
            // Solo necesitamos la primera letra para el código del estilo (V, A, R, K).
            setLearningStyle(strategy.style.charAt(0));
        }
    }, []);

    /**
     * Callback para manejar el resultado de una respuesta de un quiz.
     * Actualiza el estado `quizFeedback` para activar una animación en Vairyx
     * y luego lo resetea para que la animación pueda dispararse de nuevo en el futuro.
     * @param result - 'correct' si la respuesta fue correcta, 'incorrect' si no lo fue.
     */
    const handleQuizFeedback = (result: 'correct' | 'incorrect') => {
        setQuizFeedback(result);
        // Resetea el estado después de 1.5s para permitir que la animación se complete.
        setTimeout(() => setQuizFeedback(null), 1500); 
    };
    
    /**
     * Clona los componentes hijos (las páginas renderizadas por Next.js) para inyectarles props.
     * Este es un patrón común en Next.js para pasar estado o callbacks desde un layout a sus páginas.
     * Permite que las páginas hijas (ej. `PracticePage`) puedan llamar a `onQuizFeedback` o
     * acceder a `learningStyle` sin necesidad de un contexto de React más complejo.
     */
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore - Ignoramos el chequeo de TypeScript aquí porque estamos añadiendo props dinámicamente.
            return React.cloneElement(child, { 
                onQuizFeedback: handleQuizFeedback,
                learningStyle: learningStyle,
            });
        }
        return child;
    });

    return (
      <html lang="es" suppressHydrationWarning>
        <body className={cn('font-body antialiased', ptSans.variable)}>
          <SidebarProvider>
            {!isOnboardingPage && (
              <>
                <MainSidebar />
                <ChatWidget feedback={quizFeedback} learningStyle={learningStyle} />
              </>
            )}
            <SidebarInset>
              {childrenWithProps}
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </body>
      </html>
    );
}
