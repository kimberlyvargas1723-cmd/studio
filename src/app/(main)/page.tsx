// src/app/(main)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';

/**
 * The main entry point of the app after a user is authenticated.
 * This component checks if the user has completed the onboarding process.
 * If not, it redirects them to the '/onboarding' page.
 * If onboarding is complete, it redirects them to the '/dashboard' page.
 */
export default function InitialPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Check for onboarding status only if the user is authenticated.
      const onboardingComplete = localStorage.getItem(`onboardingComplete_${user.uid}`);
      if (onboardingComplete === 'true') {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [user, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
