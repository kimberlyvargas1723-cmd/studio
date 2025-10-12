// src/components/chat-widget.tsx
'use client';
import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { VairyxIcon } from './VairyxIcon';

/**
 * Renders an animated, interactive chat widget featuring the AI assistant, Vairyx.
 * This component acts as a floating action button that opens a popover.
 * The popover serves as a direct link to the main AI Assistant page.
 */
export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleOpenAssistantPage = () => {
      router.push('/assistant');
      setIsOpen(false);
  }


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
                className="w-[90vw] max-w-sm flex flex-col p-0 mb-2"
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
  );
}
