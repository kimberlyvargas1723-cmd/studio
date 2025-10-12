// src/app/(main)/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { ChatWidget } from '@/components/chat-widget';
import { getLearningStrategy } from '@/lib/services';
import type { LearningStrategy } from '@/lib/types';


/**
 * The main layout for the authenticated part of the application.
 * It includes the sidebar, the main content area, and the chat widget.
 * This structure wraps all pages inside the (main) route group.
 * It now also reads the learning style from localStorage and passes it down to children.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [learningStyle, setLearningStyle] = useState<string | undefined>(undefined);

    useEffect(() => {
        // Fetch the learning style from localStorage when the component mounts.
        const strategy: LearningStrategy | null = getLearningStrategy();
        if (strategy) {
            // We just need the first letter for the code (V, A, R, K)
            setLearningStyle(strategy.style.charAt(0));
        }
    }, []);


    const handleQuizFeedback = (result: 'correct' | 'incorrect') => {
        setQuizFeedback(result);
        // Reset after a short delay to allow the animation to play
        setTimeout(() => setQuizFeedback(null), 1500); 
    };
    
    // We need to clone the children to pass down the onQuizFeedback prop and learningStyle.
    // This is a common pattern for passing props from a layout to its children.
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore - a bit of a hack to pass props down, but effective
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
