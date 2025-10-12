// src/components/chat-widget.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { studyAssistant } from '@/ai/flows/study-assistant';
import { Loader2, Send, Youtube, Sparkles, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const RobotIcon = () => (
  <div className="relative h-28 w-28">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      className="h-full w-full robot-float"
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
      <line
        x1="50"
        y1="15"
        x2="50"
        y2="5"
        stroke="hsl(var(--primary) / 0.5)"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="5"
        r="3"
        fill="hsl(var(--accent))"
        className="robot-antenna-light"
      />
      <rect
        x="30"
        y="15"
        width="40"
        height="30"
        rx="8"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <g className="robot-eye" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <circle cx="43" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
        <circle cx="57" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
      </g>
      <rect
        x="20"
        y="45"
        width="60"
        height="40"
        rx="10"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      {/* Arms */}
      <rect x="10" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
      <rect x="80" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />

      <rect x="35" y="55" width="30" height="20" rx="3" fill="hsl(var(--background))" />
      <path
        d="M 48 60 L 50 55 L 52 60 L 55 62 L 52 64 L 50 69 L 48 64 L 45 62 Z"
        fill="hsl(var(--accent))"
        filter="url(#glow)"
      />
    </svg>
  </div>
);

type Message = {
  role: 'user' | 'model';
  content: string;
  youtubeQuery?: string;
};

const motivationalMessages = [
    "¡Sigue así, Kimberly! Tu esfuerzo dará frutos.",
    "¡Vas muy bien! Cada paso te acerca a tu meta.",
    "No te rindas. Pocas personas logran lo que tú estás haciendo.",
    "¡Confío en ti! Tienes todo para triunfar.",
    "Recuerda por qué empezaste. ¡Adelante!",
];

/**
 * Renders an animated, interactive chat widget featuring the AI assistant, Vairyx.
 * This component acts as a floating action button that opens a popover chat window.
 * It manages the conversation state, calls the AI flow, and displays motivational messages periodically.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        '¡Hola, Kimberly! Soy Vairyx. Hazme una pregunta o haz clic aquí para ir a la página del asistente.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMotivation, setActiveMotivation] = useState<string | null>(null);
  const motivationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();


  /**
   * Shows a random motivational message in a speech bubble next to the robot.
   * The message disappears after a few seconds.
   */
  const showMotivation = () => {
    // This logic is now handled by the assistant page, but kept for potential future use
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setActiveMotivation(motivationalMessages[randomIndex]);

    if (motivationTimeoutRef.current) {
        clearTimeout(motivationTimeoutRef.current);
    }

    motivationTimeoutRef.current = setTimeout(() => {
        setActiveMotivation(null);
    }, 5000); // Message stays for 5 seconds
  };
  
  const handleOpenAssistantPage = () => {
      router.push('/assistant');
      setIsOpen(false);
  }


  return (
    <>
    {/* Robot Trigger and Motivation Bubble */}
    <div className="fixed bottom-0 right-4 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="transition-transform duration-300 hover:scale-110"
                    aria-label="Abrir chat de Vairyx"
                >
                    <RobotIcon />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-sm flex flex-col p-0"
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={handleOpenAssistantPage}>
                        <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-headline text-md">Vairyx</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Message */}
                 <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        ¿Necesitas ayuda? Habla conmigo en la página del Asistente de IA.
                    </p>
                    <Button className="mt-4" onClick={handleOpenAssistantPage}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Ir al Asistente
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    </div>
    </>
  );
}
