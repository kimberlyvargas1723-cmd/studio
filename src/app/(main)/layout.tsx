
// src/app/(main)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { ChatWidget } from '@/components/chat-widget';
import { getLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';


/**
 * El layout principal para la parte autenticada de la aplicación.
 * 
 * Este componente envuelve todas las páginas dentro de la ruta (main) y es responsable de:
 * 1.  Renderizar la estructura de la interfaz de usuario, incluyendo la barra lateral (`MainSidebar`), 
 *     el área de contenido principal (`SidebarInset`), y el widget de chat flotante (`ChatWidget`).
 * 2.  Gestionar y propagar estado global a nivel de layout:
 *     -   `learningStyle`: Obtiene el estilo de aprendizaje del usuario desde `localStorage` al cargar,
 *         y lo pasa como prop a las páginas hijas.
 *     -   `quizFeedback`: Mantiene un estado temporal ('correct' o 'incorrect') para activar
 *         animaciones en el `ChatWidget` cuando el usuario responde un quiz.
 * 3.  Pasar props a sus componentes hijos (las páginas) usando un patrón de `React.cloneElement`.
 * 
 * @param {{ children: React.ReactNode }} props - El componente de página que Next.js renderizará dentro de este layout.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    // Estado para el feedback visual inmediato tras responder una pregunta del quiz.
    const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
    // Estado para almacenar el estilo de aprendizaje del usuario (ej. 'V', 'A', 'R', 'K').
    const [learningStyle, setLearningStyle] = useState<string | undefined>(undefined);

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
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
          {childrenWithProps}
        </SidebarInset>
        <ChatWidget feedback={quizFeedback} learningStyle={learningStyle} />
      </SidebarProvider>
    );
}
