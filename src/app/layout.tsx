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
import { getLearningStrategy, getUserProfile } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';
import { FirebaseClientProvider, useUser } from '@/firebase';

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
 * 2.  Renderizar la estructura de la UI condicionalmente.
 * 3.  Gestionar y propagar estado global.
 * 4.  Envolver la aplicación en el `FirebaseClientProvider`.
 */
function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [learningStyle, setLearningStyle] = useState<string | undefined>(undefined);
    const pathname = usePathname();

    const isAuthPage = pathname === '/onboarding' || pathname === '/login';

    /**
     * Efecto que se ejecuta para leer el estilo de aprendizaje guardado en Firestore.
     */
    useEffect(() => {
        async function fetchStrategy() {
            if (user) {
                const strategy: LearningStrategy | null = await getLearningStrategy(user.uid);
                if (strategy) {
                    setLearningStyle(strategy.style.charAt(0));
                }
            }
        }
        fetchStrategy();
    }, [user]);

    const handleQuizFeedback = (result: 'correct' | 'incorrect') => {
        setQuizFeedback(result);
        setTimeout(() => setQuizFeedback(null), 1500); 
    };
    
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, { 
                onQuizFeedback: handleQuizFeedback,
                learningStyle: learningStyle,
            });
        }
        return child;
    });

    return (
        <SidebarProvider>
            {!isAuthPage && (
            <>
                <MainSidebar />
                <ChatWidget feedback={quizFeedback} learningStyle={learningStyle} />
            </>
            )}
            <SidebarInset>
            {childrenWithProps}
            </SidebarInset>
        </SidebarProvider>
    );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('font-body antialiased', ptSans.variable)}>
        <FirebaseClientProvider>
          <AppLayout>{children}</AppLayout>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
