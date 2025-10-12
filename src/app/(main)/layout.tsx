// src/app/(main)/layout.tsx
'use client';

import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { ChatWidget } from '@/components/chat-widget';

/**
 * The main layout for the authenticated part of the application.
 * It includes the sidebar, the main content area, and the chat widget.
 * This structure wraps all pages inside the (main) route group.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const [quizFeedback, setQuizFeedback] = React.useState<'correct' | 'incorrect' | null>(null);

    const handleQuizFeedback = (result: 'correct' | 'incorrect') => {
        setQuizFeedback(result);
        // Reset after a short delay to allow the animation to play
        setTimeout(() => setQuizFeedback(null), 1500); 
    };
    
    // We need to clone the children to pass down the onQuizFeedback prop.
    // This is a common pattern for passing props from a layout to its children.
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore - a bit of a hack to pass props down, but effective
            return React.cloneElement(child, { onQuizFeedback: handleQuizFeedback });
        }
        return child;
    });

    return (
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
          {childrenWithProps}
        </SidebarInset>
        <ChatWidget feedback={quizFeedback} />
      </SidebarProvider>
    );
}
