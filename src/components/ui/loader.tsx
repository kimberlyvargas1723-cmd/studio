// src/components/ui/loader.tsx
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  text?: string;
}

/**
 * Un componente de carga reutilizable para mostrar un spinner y texto opcional.
 * @param {LoaderProps} props - Propiedades para personalizar el loader.
 */
export function Loader({ className, text }: LoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 text-muted-foreground", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p>{text}</p>}
    </div>
  );
}
