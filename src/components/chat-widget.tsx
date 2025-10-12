'use client';

import { useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { studyAssistant } from '@/ai/flows/study-assistant';
import { Loader2, Send, Sparkles, Youtube, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

type Message = {
  role: 'user' | 'model';
  content: string;
  youtubeQuery?: string;
};

/**
 * A custom SVG component for the animated robot character "Vairyx".
 * This component includes CSS-driven animations for floating, blinking, and a pulsing antenna light.
 */
const RobotIcon = () => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 120"
    className="h-24 w-24 robot-float"
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
    {/* Antenna */}
    <line x1="50" y1="15" x2="50" y2="5" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
    <circle cx="50" cy="5" r="3" fill="hsl(var(--accent))" className="robot-antenna-light" />
    
    {/* Head */}
    <rect x="30" y="15" width="40" height="30" rx="8" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Eyes */}
    <g className="robot-eye">
        <circle cx="43" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
        <circle cx="57" cy="30" r="4" fill="hsl(var(--primary-foreground))" />
    </g>

    {/* Body */}
    <rect x="20" y="45" width="60" height="40" rx="10" fill="hsl(var(--primary))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Arms */}
    <rect x="10" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
    <rect x="80" y="50" width="10" height="25" rx="5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="2" />
    
    {/* Screen on body with a sparkle */}
    <rect x="35" y="55" width="30" height="20" rx="3" fill="hsl(var(--background))" />
    <path d="M 48 60 L 50 55 L 52 60 L 55 62 L 52 64 L 50 69 L 48 64 L 45 62 Z" fill="hsl(var(--accent))" filter="url(#glow)" />
  </svg>
);

const encouragingMessages = [
    '¡Vas muy bien, Kimberly!',
    '¡Tu esfuerzo dará frutos!',
    'No te rindas, ¡estás más cerca de tu meta!',
    'Pocas personas logran lo que tú estás haciendo.',
    'Cada día de estudio es un paso más hacia tu sueño.',
    '¡Confío en ti!'
];

/**
 * Renders a floating chat widget that provides AI assistance.
 * It's accessible from an animated robot button in the bottom-right corner of the screen.
 * The widget also displays encouraging messages periodically when closed.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        '¡Hola, Kimberly! Soy Vairyx. Pregúntame lo que necesites sobre tus estudios.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMessage, setActiveMessage] = useState<string | null>(null);

  /**
   * Effect to cycle through encouraging messages when the chat is closed.
   * This creates the feeling that the assistant is proactively motivating the user.
   */
  useEffect(() => {
    if (isOpen) {
      setActiveMessage(null);
      return;
    };

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * encouragingMessages.length);
      setActiveMessage(encouragingMessages[randomIndex]);
      
      // The message will be visible for the duration of the CSS animation (5s)
      // Then it's cleared to allow a new message to be shown after the next interval.
      setTimeout(() => {
        setActiveMessage(null);
      }, 5000);

    }, 15000); // Show a new message every 15 seconds

    return () => clearInterval(intervalId);
  }, [isOpen]);

  /**
   * Handles sending a message from the user to the AI assistant.
   * It updates the message history, calls the AI flow, and handles the response.
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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="fixed bottom-0 right-4 z-50 transition-transform duration-300 hover:scale-110"
          aria-label="Abrir chat de Vairyx"
        >
          {activeMessage && !isOpen && (
            <div className="absolute bottom-24 right-0 w-48">
              <div className="speech-bubble relative rounded-lg bg-primary text-primary-foreground p-3 text-sm shadow-lg">
                {activeMessage}
                <div className="absolute bottom-[-8px] right-6 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-primary"></div>
              </div>
            </div>
          )}
          {isOpen ? (
             <div className="h-28 w-28 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground flex items-center justify-center">
                    <X className="h-6 w-6" />
                </div>
            </div>
          ) : (
            <RobotIcon />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[380px] rounded-xl shadow-2xl p-0 border-none mr-4 mb-2"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex h-[600px] w-full flex-col bg-card">
           <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h3 className="font-headline text-lg">Vairyx</h3>
              </div>
              <p className="text-sm text-muted-foreground">Tu asistente de estudio personal.</p>
           </div>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6 pr-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', {
                    'justify-end': message.role === 'user',
                  })}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border">
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-xs rounded-xl px-4 py-3 text-sm whitespace-pre-wrap',
                      {
                        'rounded-br-none bg-primary text-primary-foreground':
                          message.role === 'user',
                        'rounded-bl-none bg-muted': message.role === 'model',
                      }
                    )}
                  >
                    <p>{message.content}</p>
                    {message.youtubeQuery && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-3 bg-white hover:bg-gray-100 text-gray-800"
                            asChild
                        >
                            <a 
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(message.youtubeQuery)}`} 
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
                          <AvatarFallback>IA</AvatarFallback>
                      </Avatar>
                      <div className="max-w-lg rounded-xl px-4 py-3 rounded-bl-none bg-muted">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Pensando...
                          </div>
                      </div>
                  </div>
              )}
            </div>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pregúntame algo..."
                disabled={isLoading}
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
