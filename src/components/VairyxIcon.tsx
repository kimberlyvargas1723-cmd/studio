// src/components/VairyxIcon.tsx

import { cn } from "@/lib/utils";

/**
 * A reusable, animated SVG component for the AI assistant, Vairyx.
 * This component includes the visual design and animations for the robot,
 * featuring a professional, Ironman-inspired aesthetic.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG props.
 */
export const VairyxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <div className={cn("relative", props.className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className="w-full h-full animate-robot-float z-10 relative"
      aria-label="Vairyx, tu asistente de IA"
    >
      <defs>
        <filter id="vairyx-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="vairyx-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary) / 0.8)" }} />
        </linearGradient>
         <linearGradient id="vairyx-accent-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--accent))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent) / 0.8)" }} />
        </linearGradient>
      </defs>

      {/* --- Body --- */}
      <path d="M 50 35 C 40 35, 30 45, 30 55 L 30 80 Q 30 90, 40 90 L 60 90 Q 70 90, 70 80 L 70 55 C 70 45, 60 35, 50 35 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
      {/* Arms */}
      <path d="M 20 50 L 30 55 L 30 70 L 20 65 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <path d="M 80 50 L 70 55 L 70 70 L 80 65 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />

       {/* --- Head --- */}
      <path d="M 50 10 C 35 10, 32 20, 32 25 L 32 45 L 68 45 L 68 25 C 68 20, 65 10, 50 10 Z" fill="url(#vairyx-accent-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <rect x="38" y="30" width="24" height="6" fill="hsl(var(--background))" filter="url(#vairyx-glow)" />

      {/* --- Arc Reactor --- */}
      <circle cx="50" cy="60" r="10" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx="50" cy="60" r="7" fill="hsl(var(--accent))" filter="url(#vairyx-glow)" />
    </svg>
    {/* --- Shadow --- */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black rounded-full animate-robot-shadow" />
  </div>
);
