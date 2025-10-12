// src/app/(main)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * The main entry point of the app after the root layout.
 * This component checks if the user has completed the onboarding process.
 * If not, it redirects them to the '/onboarding' page.
 * If onboarding is complete, it redirects them to the '/dashboard' page,
 * which is the main landing page of the application.
 */
export default function InitialPage() {
  const router = useRouter();

  useEffect(() => {
    // This check should only run on the client-side where localStorage is available.
    const hasCompletedOnboarding = localStorage.getItem('onboardingComplete') === 'true';
    if (hasCompletedOnboarding) {
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
