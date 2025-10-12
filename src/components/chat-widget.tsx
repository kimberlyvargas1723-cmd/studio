'use client';

import { useState } from 'react';
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

// A custom icon for the chat widget trigger button.
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="m15.5 7.5 2.3 2.3" strokeWidth="1.5"></path>
      <path d="M18 10h.01"></path><path d="m7.5 15.5 2.3-2.3" strokeWidth="1.5"></path>
      <path d="M7 13h.01"></path>
    </svg>
  );

/**
 * Renders a floating chat widget that provides AI assistance.
 * It's accessible from a button in the bottom-right corner of the screen.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        '¡Hola, Kimberly! Soy PsicoGuía. Pregúntame lo que necesites sobre tus estudios.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        <Button
          variant="default"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
          aria-label="Abrir chat de PsicoGuía"
        >
          {isOpen ? <X className="h-6 w-6" /> : <ChatIcon />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        className="w-[380px] rounded-xl shadow-2xl p-0 border-none"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex h-[600px] w-full flex-col bg-card">
           <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h3 className="font-headline text-lg">PsicoGuía</h3>
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
