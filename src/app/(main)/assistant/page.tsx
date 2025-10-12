// src/app/(main)/assistant/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { studyAssistant } from '@/ai/flows/study-assistant';
import { Loader2, Send, Sparkles, Youtube } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'model';
  content: string;
  youtubeQuery?: string;
};

/**
 * Renders the AI Assistant page, providing a full-screen chat interface
 * for students to get study guidance and resource recommendations from Vairyx.
 */
export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: '¡Hola, Kimberly! Soy Vairyx, tu asistente de estudio personal. ¿En qué tema te puedo ayudar a profundizar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    <div className="flex h-screen w-full flex-col">
      <Header title="Asistente IA" />
      <main className="flex-1 overflow-hidden p-4 md:p-8">
        <Card className="flex h-full w-full flex-col">
          <CardHeader>
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarFallback>V</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="font-headline text-xl">Vairyx</CardTitle>
                    <CardDescription>Tu compañero de estudio personal para el examen de admisión.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn('flex items-start gap-4', {
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
                        'max-w-xl rounded-xl px-4 py-3',
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
                   <div className="flex items-start gap-3">
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
          </CardContent>
          <div className="border-t p-4 bg-background/95 backdrop-blur-sm">
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Habla con Vairyx sobre un tema, pide un quiz, o solicita una explicación..."
                disabled={isLoading}
                autoComplete="off"
                className="pr-12"
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      </main>
    </div>
  );
}
