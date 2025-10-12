// src/components/chat-widget.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { X, Send, Loader2, Youtube } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { VairyxIcon } from './VairyxIcon';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { studyAssistant } from '@/ai/flows/study-assistant';
import { cn } from '@/lib/utils';


type Message = {
  role: 'user' | 'model';
  content: string;
  youtubeQuery?: string;
};

/**
 * Renders an animated, interactive chat widget featuring the AI assistant, Vairyx.
 * This component acts as a floating action button that opens a popover containing
 * a full-featured chat interface, making Vairyx accessible from anywhere in the app.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '¡Hola, Kimberly! Soy Vairyx. ¿En qué te puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the chat view to the bottom to show the latest message.
   */
  const scrollToBottom = () => {
    // This is a workaround to get the underlying div from the ScrollArea component
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);
  
  /**
   * Handles sending a message from the user to the AI assistant.
   * It updates the message history and calls the AI flow.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      const result = await studyAssistant({ query: input, history });
      
      const modelMessage: Message = {
        role: 'model',
        content: result.response,
        youtubeQuery: result.youtubeSearchQuery,
      };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      const errorMessage: Message = {
        role: 'model',
        content: 'Lo siento, Kimberly, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="transition-transform duration-300 hover:scale-110"
                    aria-label="Abrir chat de Vairyx"
                >
                    <VairyxIcon className="h-28 w-28" />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-md flex flex-col p-0 mb-2 h-[70vh] rounded-xl"
                onOpenAutoFocus={(e) => e.preventDefault()} // Prevents focus stealing
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b p-3">
                    <div className="flex items-center gap-3">
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
                
                 {/* Chat Content */}
                 <div className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn('flex items-start gap-4 animate-fade-in-up', {
                                    'justify-end': message.role === 'user'
                                })}
                            >
                                {message.role === 'model' && (
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback>V</AvatarFallback>
                                </Avatar>
                                )}
                                <div
                                className={cn(
                                    'max-w-xs md:max-w-sm rounded-xl px-4 py-3',
                                    {
                                    'rounded-br-none bg-primary text-primary-foreground': message.role === 'user',
                                    'rounded-bl-none bg-muted': message.role === 'model',
                                    }
                                )}
                                >
                                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
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
                                <div className="flex items-start gap-3 animate-fade-in-up">
                                        <Avatar className="h-8 w-8 border">
                                            <AvatarFallback>V</AvatarFallback>
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
                    <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
                        <form onSubmit={handleSendMessage} className="relative">
                        <Input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Habla con Vairyx..."
                            disabled={isLoading}
                            autoComplete="off"
                            className="pr-12"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Send className="h-4 w-4" />
                        </Button>
                        </form>
                    </div>
                 </div>
            </PopoverContent>
        </Popover>
    </div>
  );
}
