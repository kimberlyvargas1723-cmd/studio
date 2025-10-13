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
import { studyAssistantAction } from '@/app/actions';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Define la estructura de un único mensaje en el historial del chat.
 * @param {'user' | 'model'} role - El remitente del mensaje.
 * @param {string} content - El contenido textual del mensaje.
 * @param {string} [youtubeQuery] - Una consulta de búsqueda opcional para YouTube.
 */
type Message = {
  role: 'user' | 'model';
  content: string;
  youtubeQuery?: string;
};

/**
 * Define las props para el componente ChatWidget.
 */
type ChatWidgetProps = {
    /** Estado para activar una animación de feedback en el ícono de Vairyx. */
    feedback?: 'correct' | 'incorrect' | null;
    /** El estilo de aprendizaje del usuario para pasarlo al flujo de IA. */
    learningStyle?: string;
};

/**
 * Renderiza un widget de chat flotante e interactivo con el asistente de IA, Vairyx.
 *
 * Este componente funciona como un botón de acción flotante que, al ser presionado,
 * abre un popover con una interfaz de chat completa. Permite al usuario conversar
 * con Vairyx desde cualquier página de la aplicación, manteniendo el contexto de la conversación.
 *
 * @param {ChatWidgetProps} props - Props para controlar el feedback visual y el estilo de aprendizaje.
 */
export function ChatWidget({ feedback, learningStyle }: ChatWidgetProps) {
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
   * Desplaza la vista del chat hacia el final para mostrar el mensaje más reciente.
   * Se ejecuta cada vez que el historial de mensajes cambia.
   */
  const scrollToBottom = () => {
    // Este es un workaround para obtener el div del viewport desde el componente ScrollArea de Radix.
    const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Usamos un pequeño timeout para asegurar que el DOM se haya actualizado antes de hacer scroll.
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen]);
  
  /**
   * Maneja el envío de un mensaje del usuario al asistente de IA.
   * Añade el mensaje del usuario al historial, limpia el input, y llama al flujo
   * de Genkit `studyAssistant` para obtener una respuesta.
   * @param {React.FormEvent} e - El evento del formulario.
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepara el historial para el flujo de IA.
      const history = messages.map(msg => ({ role: msg.role, content: msg.content }));
      // Llama al flujo de IA con la consulta actual, el historial y el estilo de aprendizaje.
      const result = await studyAssistantAction({ query: input, history, learningStyle });
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      const modelMessage: Message = {
        role: 'model',
        content: result.response!,
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
                    className="transition-transform duration-300 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring rounded-full focus-visible:ring-offset-2"
                    aria-label="Abrir chat de Vairyx"
                >
                    <VairyxIcon className="h-28 w-28" feedback={feedback} />
                </button>
            </PopoverTrigger>
            <PopoverContent
                side="top"
                align="end"
                className="w-[90vw] max-w-md flex flex-col p-0 mb-2 h-[70vh] rounded-xl"
                onOpenAutoFocus={(e) => e.preventDefault()} // Previene que el popover "robe" el foco al abrirse.
            >
                {/* Cabecera del Chat */}
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
                
                 {/* Contenido del Chat (Mensajes) */}
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
                                    'max-w-xs md:max-w-sm rounded-xl px-4 py-3 shadow-sm',
                                    {
                                    'rounded-br-none bg-primary text-primary-foreground': message.role === 'user',
                                    'rounded-bl-none bg-muted': message.role === 'model',
                                    }
                                )}
                                >
                                <div className="prose prose-sm dark:prose-invert max-w-none text-current whitespace-pre-wrap">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                                </div>
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
                    {/* Input para enviar mensajes */}
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
