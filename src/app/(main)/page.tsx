// src/app/(main)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * The main entry point of the app after a user is authenticated.
 * This component acts as a router guard, checking if the user has completed 
 * the onboarding process by verifying a flag in localStorage.
 * 
 * - If onboarding is complete, it redirects the user to their main '/dashboard'.
 * - If onboarding is not complete, it sends them to the '/onboarding' page to start.
 * 
 * This ensures users always start at the right place in their journey.
 */
export default function InitialPage() {
  const router = useRouter();

  /**
   * Effect to check onboarding status and perform redirection.
   * Runs once when the component mounts.
   */
  useEffect(() => {
      // Check localStorage for the 'onboardingComplete' flag.
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      
      if (onboardingComplete === 'true') {
        // If onboarding is done, go to the main dashboard.
        router.replace('/dashboard');
      } else {
        // Otherwise, start the onboarding process.
        router.replace('/onboarding');
      }
  }, [router]);

  /**
   * Renders a loading spinner while the redirection logic is being processed.
   * This provides visual feedback to the user that something is happening.
   */
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
