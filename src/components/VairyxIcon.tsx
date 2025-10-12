// src/components/VairyxIcon.tsx

import { cn } from "@/lib/utils";

/**
 * A reusable, animated SVG component for the AI assistant, Vairyx.
 * This component includes the visual design and animations for the robot,
 * featuring a professional, Ironman-inspired aesthetic with 3D-like shading and highlights.
 * @param {React.SVGProps<SVGSVGElement>} props - Standard SVG props.
 */
export const VairyxIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <div className={cn("relative", props.className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 125"
      className="w-full h-full animate-robot-float z-10 relative"
      aria-label="Vairyx, tu asistente de IA"
    >
      <defs>
        <filter id="vairyx-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="vairyx-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary) / 0.7)" }} />
        </linearGradient>
         <linearGradient id="vairyx-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--accent))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--accent) / 0.7)" }} />
        </linearGradient>
      </defs>

      {/* --- Body --- */}
      <path d="M50 45 C 38 45, 30 55, 30 65 L 30 90 Q 30 100, 40 100 L 60 100 Q 70 100, 70 90 L 70 65 C 70 55, 62 45, 50 45 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M50 45 C 40 45, 35 53, 35 62 L 65 62 C 65 53, 60 45, 50 45 Z" fill="hsl(var(--primary) / 0.5)" />
      
      {/* --- Arms --- */}
      {/* Right Arm */}
      <path d="M70 68 L 78 63 L 78 80 L 70 85 Z" fill="hsl(var(--primary) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M 68 55 L 75 50 L 82 55 L 75 62 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M 75 50 L 78 52 L 75 62 L 72 60 Z" fill="hsl(var(--primary) / 0.4)" />
      
      {/* Left Arm */}
      <path d="M30 68 L 22 63 L 22 80 L 30 85 Z" fill="hsl(var(--primary) / 0.8)" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M 32 55 L 25 50 L 18 55 L 25 62 Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1" />
      <path d="M 25 50 L 22 52 L 25 62 L 28 60 Z" fill="hsl(var(--primary) / 0.4)" />
      
      {/* --- Head --- */}
      <path d="M 50 15 C 35 15, 30 25, 30 30 L 30 50 L 70 50 L 70 30 C 70 25, 65 15, 50 15 Z" fill="url(#vairyx-accent-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5"/>
      <path d="M 50 15 C 40 15, 35 23, 35 28 L 65 28 C 65 23, 60 15, 50 15 Z" fill="hsl(var(--accent) / 0.5)" />
      <rect x="37" y="35" width="26" height="7" rx="2" fill="hsl(var(--background))" filter="url(#vairyx-glow)" />

      {/* --- Arc Reactor --- */}
      <circle cx="50" cy="72" r="12" fill="hsl(var(--primary) / 0.9)" stroke="hsl(var(--border))" strokeWidth="1" />
      <circle cx="50" cy="72" r="9" fill="hsl(var(--background))" />
      <circle cx="50" cy="72" r="7" fill="hsl(var(--accent))" filter="url(#vairyx-glow)" />
      <path d="M 50 63 L 47 70 L 50 71 L 53 70 Z" fill="hsl(var(--background) / 0.5)" />
    </svg>
    {/* --- Shadow --- */}
    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black rounded-full animate-robot-shadow" />
  </div>
);
