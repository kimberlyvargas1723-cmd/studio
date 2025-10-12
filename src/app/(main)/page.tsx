// src/app/(main)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * The main entry point of the app after a user is authenticated.
 * This component checks if the user has completed the onboarding process.
 * If not, it redirects them to the '/onboarding' page.
 * If onboarding is complete, it redirects them to the '/dashboard' page.
 */
export default function InitialPage() {
  const router = useRouter();

  useEffect(() => {
      // Check for onboarding status.
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
