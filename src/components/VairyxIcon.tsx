// src/components/VairyxIcon.tsx

import { cn } from "@/lib/utils";

/**
 * A reusable, animated SVG component for the AI assistant, Vairyx.
 * This component includes the visual design and animations for the robot.
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
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="vairyx-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "hsl(var(--primary) / 0.8)" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} />
        </linearGradient>
      </defs>

      {/* --- Antenna --- */}
      <line x1="50" y1="12" x2="50" y2="2" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <circle cx="50" cy="4" r="3" fill="hsl(var(--accent))" className="animate-robot-antenna-blink" />

      {/* --- Head --- */}
      <rect x="32" y="12" width="36" height="28" rx="8" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <g className="animate-robot-eye-move" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="43" cy="26" r="3.5" fill="hsl(var(--primary-foreground))" />
        <circle cx="57" cy="26" r="3.5" fill="hsl(var(--primary-foreground))" />
      </g>

      {/* --- Body --- */}
      <rect x="25" y="40" width="50" height="42" rx="10" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border))" strokeWidth="1.5" />
      
      {/* Arms */}
      <rect x="16" y="45" width="9" height="22" rx="4.5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="1.5" />
      <rect x="75" y="45" width="9" height="22" rx="4.5" fill="hsl(var(--accent))" stroke="hsl(var(--border))" strokeWidth="1.5" />

      {/* Core */}
      <rect x="38" y="52" width="24" height="18" rx="3" fill="hsl(var(--background))" />
      <path
        d="M 48 57 L 50 53 L 52 57 L 54 58 L 52 59 L 50 63 L 48 59 L 46 58 Z"
        fill="hsl(var(--accent))"
        filter="url(#vairyx-glow)"
      />
    </svg>
    {/* --- Shadow --- */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black rounded-full animate-robot-shadow" />
  </div>
);
