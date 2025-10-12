// src/app/(main)/layout.tsx
'use client';

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
    return (
      <SidebarProvider>
        <MainSidebar />
        <SidebarInset>
          {children}
        </SidebarInset>
        <ChatWidget />
      </SidebarProvider>
    );
}
