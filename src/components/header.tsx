// src/components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Array of motivational quotes for the user
const motivationalQuotes = [
  'Cada pregunta es un paso más hacia tu meta.',
  '¡Sigue adelante, estás construyendo tu futuro!',
  'La constancia es la clave del éxito. ¡No te detengas!',
  'Confía en tu proceso y en tu capacidad.',
  'Hoy es un gran día para aprender algo nuevo.',
];

/**
 * A personalized and dynamic header component.
 * It displays a title for the current page and a motivational quote.
 * It also includes the sidebar trigger for mobile view.
 * @param {{title: string}} props - The title of the page.
 */
export function Header({title}: {title: string}) {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');
  const { isMobile } = useSidebar();
  const userName = 'Kimberly'; // Personalized user name

  useEffect(() => {
    // Set the greeting based on the time of day
    const hour = new Date().getHours();
    let timeOfDayGreeting = 'Hola';
    if (hour < 12) {
      timeOfDayGreeting = 'Buenos días';
    } else if (hour < 19) {
      timeOfDayGreeting = 'Buenas tardes';
    } else {
      timeOfDayGreeting = 'Buenas noches';
    }
    setGreeting(`${timeOfDayGreeting}, ${userName}`);

    // Select a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       {isMobile && <SidebarTrigger />}
        <div className="flex flex-col">
           <h1 className="text-lg font-semibold md:text-2xl font-headline text-primary">{title}</h1>
           <p className="text-xs text-muted-foreground hidden md:block">
            {quote}
          </p>
        </div>
    </header>
  );
}
