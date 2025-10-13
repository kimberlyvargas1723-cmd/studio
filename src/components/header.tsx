
// src/components/header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/components/ui/sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Una colección de citas motivacionales para inspirar al usuario durante sus estudios.
const motivationalQuotes = [
  'Cada pregunta es un paso más hacia tu meta.',
  '¡Sigue adelante, estás construyendo tu futuro!',
  'La constancia es la clave del éxito. ¡No te detengas!',
  'Confía en tu proceso y en tu capacidad.',
  'Hoy es un gran día para aprender algo nuevo.',
  'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
  'Tu dedicación de hoy es la victoria de mañana.'
];

/**
 * Renderiza una cabecera de página personalizada y dinámica.
 * 
 * Este componente cumple varias funciones:
 * 1.  Muestra un título estático pasado como prop para identificar la página actual.
 * 2.  Presenta un saludo personalizado y dependiente de la hora del día (ej. "Buenos días, Kimberly").
 * 3.  Muestra una cita motivacional aleatoria para fomentar un ambiente de estudio positivo.
 * 4.  Incluye el `SidebarTrigger`, que es el botón para abrir/cerrar la barra lateral en dispositivos móviles.
 * 
 * @param {{ title: string }} props - Las props del componente.
 * @param {string} props.title - El título que se mostrará en la cabecera.
 */
export function Header({title}: {title: string}) {
  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');
  const { isMobile } = useSidebar();
  const userName = 'Kimberly'; // Nombre del usuario para personalización.

  /**
   * Efecto que se ejecuta una vez al montar el componente en el cliente.
   * Se encarga de establecer el saludo basado en la hora del día y de seleccionar
   * una cita motivacional al azar.
   */
  useEffect(() => {
    // Determina el saludo apropiado según la hora local.
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

    // Selecciona una cita aleatoria del array `motivationalQuotes`.
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
       {/* El trigger de la barra lateral solo se muestra en vistas móviles. */}
       {isMobile && <SidebarTrigger />}
        <div className="flex flex-col">
           <h1 className="text-lg font-semibold md:text-2xl font-headline text-primary">{title}</h1>
           {/* La cita motivacional se oculta en pantallas pequeñas para ahorrar espacio. */}
           <p className="text-xs text-muted-foreground hidden md:block">
            {quote}
          </p>
        </div>
    </header>
  );
}
