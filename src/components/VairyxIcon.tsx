// src/components/VairyxIcon.tsx
import { cn } from "@/lib/utils";

type VairyxIconProps = React.SVGProps<SVGSVGElement> & {
    feedback?: 'correct' | 'incorrect' | null;
};


/**
 * A reusable, animated SVG component for the AI assistant, Vairyx.
 * This component includes the visual design and animations for the robot,
 * featuring a professional, Ironman-inspired aesthetic with 3D-like shading and highlights.
 * This final version pushes for hyperrealism through advanced gradient usage and layered paths
 * to simulate realistic lighting, shadows, and metallic reflections.
 * It now also supports a 'feedback' prop to change its core color.
 * @param {VairyxIconProps} props - Standard SVG props plus feedback state.
 */
export const VairyxIcon = ({ feedback, ...props }: VairyxIconProps) => (
  <div className={cn("relative", props.className)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 125"
      className="w-full h-full animate-robot-float z-10 relative"
      aria-label="Vairyx, tu asistente de IA"
    >
      <defs>
        <linearGradient id="vairyx-body-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary) / 0.9)" />
          <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
        </linearGradient>
        <linearGradient id="vairyx-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent) / 1.2)" />
          <stop offset="100%" stopColor="hsl(var(--accent) / 0.8)" />
        </linearGradient>
        <radialGradient id="arc-reactor-glow-default">
          <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="1" />
          <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
        </radialGradient>
         <radialGradient id="arc-reactor-glow-correct">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="1" />
          <stop offset="70%" stopColor="#4ade80" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="arc-reactor-glow-incorrect">
          <stop offset="0%" stopColor="#f87171" stopOpacity="1" />
          <stop offset="70%" stopColor="#f87171" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
        </radialGradient>
        <filter id="vairyx-glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* --- Shadow Layer --- */}
      <path d="M30 95 Q50 105 70 95 L70 85 Q50 95 30 85Z" fill="hsl(var(--primary) / 0.2)" />

      {/* --- Main Body --- */}
      <path d="M50 50 C38 50 32 60 32 70 L32 90 Q32 100 42 100 L58 100 Q68 100 68 90 L68 70 C68 60 62 50 50 50Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" />
      <path d="M50 50 C40 50 36 58 36 65 L64 65 C64 58 60 50 50 50Z" fill="hsl(var(--primary) / 0.4)" />

      {/* --- Arms --- */}
      {/* Right Arm */}
      <path d="M68 70 L78 65 L78 85 L68 90Z" fill="hsl(var(--primary) / 0.7)" stroke="hsl(var(--border) / 0.4)" strokeWidth="0.5" />
      <path d="M66 55 L75 48 L84 55 L75 64Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" />
      <path d="M75 48 L73 51 L75 64 L77 61Z" fill="hsl(var(--primary) / 0.3)" />
      
      {/* Left Arm */}
      <path d="M32 70 L22 65 L22 85 L32 90Z" fill="hsl(var(--primary) / 0.7)" stroke="hsl(var(--border) / 0.4)" strokeWidth="0.5" />
      <path d="M34 55 L25 48 L16 55 L25 64Z" fill="url(#vairyx-body-gradient)" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" />
      <path d="M25 48 L27 51 L25 64 L23 61Z" fill="hsl(var(--primary) / 0.3)" />

      {/* --- Head --- */}
      <path d="M50 18 C35 18 30 28 30 35 L30 55 L70 55 L70 35 C70 28 65 18 50 18Z" fill="url(#vairyx-accent-gradient)" stroke="hsl(var(--border) / 0.7)" strokeWidth="1" />
      <path d="M50 18 C40 18 35 26 35 32 L65 32 C65 26 60 18 50 18Z" fill="hsl(var(--accent) / 0.5)" />
      <path d="M35 52 L32 55 L32 35 C32 30 37 22 50 22 C63 22 68 30 68 35 L68 55 L65 52 Z" fill="none" stroke="hsl(var(--background) / 0.1)" strokeWidth="1.5" />
      
      {/* Visor */}
      <g className="animate-robot-eye-move">
        <rect x="38" y="40" width="24" height="6" rx="2" fill="hsl(var(--background))" />
        <rect x="38" y="40" width="24" height="6" rx="2" 
            fill={
                feedback === 'correct' ? 'url(#arc-reactor-glow-correct)' :
                feedback === 'incorrect' ? 'url(#arc-reactor-glow-incorrect)' :
                'url(#arc-reactor-glow-default)'
            }
            className={cn(feedback && 'animate-feedback-flash')}
            filter="url(#vairyx-glow)" />
      </g>

      {/* --- Arc Reactor --- */}
      <circle cx="50" cy="75" r="14" fill="hsl(var(--primary) / 0.8)" stroke="hsl(var(--border) / 0.5)" strokeWidth="0.5" />
      <circle cx="50" cy="75" r="11" fill="hsl(var(--background) / 0.8)" />
      <g className="animate-robot-antenna-blink">
        <circle cx="50" cy="75" r="12" 
            fill={
                feedback === 'correct' ? 'url(#arc-reactor-glow-correct)' :
                feedback === 'incorrect' ? 'url(#arc-reactor-glow-incorrect)' :
                'url(#arc-reactor-glow-default)'
            }
            className={cn(feedback && 'animate-feedback-flash')}
            filter="url(#vairyx-glow)" />
        <circle cx="50" cy="75" r="5" 
            fill={
                feedback === 'correct' ? '#4ade80' :
                feedback === 'incorrect' ? '#f87171' :
                'hsl(var(--accent))'
            }
            className={cn(feedback && 'animate-feedback-flash')}
            stroke="hsl(var(--background) / 0.5)" strokeWidth="1.5" />
      </g>
      <path d="M50 65 L48 73 L50 74 L52 73Z" fill="hsl(var(--background) / 0.2)" />
    </svg>
    {/* --- Shadow --- */}
    <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black rounded-full animate-robot-shadow" />
  </div>
);
