// src/app/(main)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/main-sidebar';
import { useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { ChatWidget } from '@/components/chat-widget';

/**
 * The main layout for the authenticated part of the application.
 * It includes the sidebar, the main content area, and handles authentication checks.
 * If a user is not authenticated, it redirects them to the login page.
 * It shows a loading spinner while authentication status is being determined.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // While checking for authentication, show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If a user is authenticated, render the main app layout.
  if (user) {
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
  
  // Return null or a loader while redirecting
  return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
}
