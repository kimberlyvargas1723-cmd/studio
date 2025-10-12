// src/app/(auth)/login/page.tsx
'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { Github, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GoogleIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
        />
        <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
        />
        <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
        />
        <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
        />
    </svg>
);


/**
 * Renders the login page for the application.
 * It provides a simple interface for users to sign in, currently supporting Google authentication.
 * It handles the loading state during the sign-in process and redirects the user upon success.
 */
export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // On successful sign-in, the auth listener in the layout will handle the redirect.
      router.push('/');
    } catch (error) {
      console.error('Failed to sign in', error);
      // Optionally: show a toast message to the user on failure.
      setIsSigningIn(false);
    }
  };
  
  const isLoading = loading || isSigningIn;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 h-16 w-16 text-primary">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 120"
                aria-label="Vairyx, tu asistente de IA"
                >
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                    </filter>
                </defs>
                <style>{`.robot-eye { animation: blink 4s infinite; } @keyframes blink { 0%, 95%, 100% { opacity: 1; } 97%, 99% { opacity: 0; } }`}</style>
                <line x1="50" y1="15" x2="50" y2="5" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
                <circle cx="50" cy="5" r="3" fill="hsl(var(--accent))" />
                <rect x="30" y="15" width="40" height="30" rx="8" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
                <g className="robot-eye">
                    <circle cx="43" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
                    <circle cx="57" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
                </g>
                <rect x="20" y="45" width="60" height="40" rx="10" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
                <rect x="10" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
                <rect x="80" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
                <rect x="35" y="55" width="30" height="20" rx="3" fill="hsl(var(--background))" />
                <path d="M 48 60 L 50 55 L 52 60 L 55 62 L 52 64 L 50 69 L 48 64 L 45 62 Z" fill="hsl(var(--accent))" filter="url(#glow)" />
            </svg>
        </div>
        <h1 className="font-headline text-3xl font-bold">Bienvenida a PsicoGuía</h1>
        <p className="mt-2 text-muted-foreground">Inicia sesión para acceder a tu plan de estudio.</p>
        <div className="mt-6">
          <Button onClick={handleLogin} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            <span>Continuar con Google</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
