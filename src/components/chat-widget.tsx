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

const RobotIcon = ({ isOpen }: { isOpen: boolean }) => (
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
        '¡Hola, Kimberly! Soy Vairyx, tu asistente de estudio. ¿Cómo puedo ayudarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMotivation, setActiveMotivation] = useState<string | null>(null);
  const motivationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Shows a random motivational message in a speech bubble next to the robot.
   * The message disappears after a few seconds.
   */
  const showMotivation = () => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setActiveMotivation(motivationalMessages[randomIndex]);

    if (motivationTimeoutRef.current) {
        clearTimeout(motivationTimeoutRef.current);
    }

    motivationTimeoutRef.current = setTimeout(() => {
        setActiveMotivation(null);
    }, 5000); // Message stays for 5 seconds
  };
  
  // Periodically show motivational messages when the chat is closed.
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isOpen) {
        // Show a message every 30 seconds
        interval = setInterval(showMotivation, 30000);
    }
    return () => {
        clearInterval(interval);
        if (motivationTimeoutRef.current) {
            clearTimeout(motivationTimeoutRef.current);
        }
    };
  }, [isOpen]);


  /**
   * Handles sending a message from the user to the AI assistant.
   * It updates the message history and calls the AI flow.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      const result = await studyAssistant({ query: input, history });

      const modelMessage: Message = {
        role: 'model',
        content: result.response,
        youtubeQuery: result.youtubeSearchQuery,
      };
      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      const errorMessage: Message = {
        role: 'model',
        content:
          'Lo siento, Kimberly, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    {/* Robot Trigger and Motivation Bubble */}
    <div className="fixed bottom-0 right-4 z-50">
        {activeMotivation && !isOpen && (
            <div className="absolute bottom-full right-0 mb-2 w-max max-w-xs rounded-lg bg-background border p-3 shadow-lg animate-fade-in-up">
                <p className="text-sm text-foreground">{activeMotivation}</p>
                 <div className="absolute bottom-[-10px] right-8 h-0 w-0 border-x-8 border-x-transparent border-t-[10px] border-t-border" />
            </div>
        )}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="transition-transform duration-300 hover:scale-110"
                    aria-label="Abrir chat de Vairyx"
                >
                    <RobotIcon isOpen={isOpen} />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-md h-[70vh] flex flex-col p-0"
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border-2 border-primary">
                        <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-headline text-lg">Vairyx</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn('flex items-start gap-3', {
                        'justify-end': message.role === 'user',
                        })}
                    >
                        {message.role === 'model' && (
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn('max-w-sm rounded-xl px-4 py-2.5', {
                            'rounded-br-none bg-primary text-primary-foreground':
                            message.role === 'user',
                            'rounded-bl-none bg-muted': message.role === 'model',
                        })}
                        >
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                        {message.youtubeQuery && (
                            <Button
                            variant="outline"
                            size="sm"
                            className="mt-2.5 bg-white hover:bg-gray-100 text-gray-800"
                            asChild
                            >
                            <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                                message.youtubeQuery
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Youtube className="mr-2 h-4 w-4 text-red-600" />
                                Buscar en YouTube
                            </a>
                            </Button>
                        )}
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border">
                        <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="max-w-lg rounded-xl rounded-bl-none bg-muted px-4 py-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Pensando...
                        </div>
                        </div>
                    </div>
                    )}
                </div>
                </ScrollArea>

                {/* Input Form */}
                <div className="border-t p-4">
                    <form onSubmit={handleSendMessage} className="relative">
                        <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Habla con Vairyx..."
                        disabled={isLoading}
                        autoComplete="off"
                        className="pr-12"
                        />
                        <Button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        size="icon"
                        className="absolute right-1.5 top-1/2 h-7 w-7 -translate-y-1/2"
                        >
                        <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    </div>
    </>
  );
}
