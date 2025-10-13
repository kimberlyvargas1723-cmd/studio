// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { PT_Sans } from 'next/font/google';

const ptSans = PT_Sans({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-pt-sans'
});


export const metadata: Metadata = {
  title: 'UANL Prep AI - Psicología 2025',
  description: 'Tu asistente de IA para prepararte para el examen de admisión de Psicología 2025 en la UANL.',
};

/**
 * RootLayout is the main layout of the application. It applies global styles,
 * fonts, and essential components like the Toaster.
 * This ensures a consistent look and feel across all pages.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('font-body antialiased', ptSans.variable)}>
          {children}
        <Toaster />
      </body>
    </html>
  );
}
