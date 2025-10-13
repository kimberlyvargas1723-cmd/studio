import type {Config} from 'tailwindcss';

/**
 * Configuración de Tailwind CSS para la aplicación PsicoGuía.
 *
 * Esta configuración define el sistema de diseño de la aplicación, incluyendo:
 * - Modo oscuro ('class').
 * - Rutas de contenido para el escaneo de clases de Tailwind.
 * - Tema personalizado con fuentes, colores y animaciones.
 */
export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Define las familias de fuentes personalizadas utilizadas en la aplicación.
      fontFamily: {
        body: ['var(--font-pt-sans)', 'sans-serif'], // Fuente principal para el cuerpo del texto.
        headline: ['var(--font-pt-sans)', 'sans-serif'], // Fuente para títulos y cabeceras.
      },
      // Define la paleta de colores personalizada usando variables CSS HSL.
      // Esto permite un temizado fácil y consistente.
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        // Colores específicos para gráficos (recharts).
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Colores específicos para la barra lateral.
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      // Personaliza el radio de los bordes.
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // Define keyframes para animaciones personalizadas.
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        // Animación para el feedback visual del quiz.
        'feedback-flash': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '0.75' },
        },
        // Animaciones para el ícono del robot Vairyx.
        'robot-float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' },
        },
        'robot-shadow': {
            '0%, 100%': { transform: 'scale(1)', opacity: '0.2' },
            '50%': { transform: 'scale(0.85)', opacity: '0.1' },
        },
        'robot-antenna-blink': {
            '0%, 100%': { opacity: '1' },
            '50%': { opacity: '0.5' },
        },
        'robot-eye-move': {
            '0%, 40%': { transform: 'translateX(0)' },
            '50%, 70%': { transform: 'translateX(2.5px)' },
            '80%, 100%': { transform: 'translateX(0)' },
        },
        // Animación para la aparición de elementos de la UI.
        'fade-in-up': {
            from: { opacity: '0', transform: 'translateY(10px)' },
            to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Asocia los keyframes a nombres de clases de animación utilizables.
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'feedback-flash': 'feedback-flash 0.5s ease-out',
        'robot-float': 'robot-float 4s ease-in-out infinite',
        'robot-shadow': 'robot-shadow 4s ease-in-out infinite',
        'robot-antenna-blink': 'robot-antenna-blink 2.5s ease-in-out infinite',
        'robot-eye-move': 'robot-eye-move 7s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
    },
  },
  // Añade plugins de Tailwind para funcionalidades extra.
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
} satisfies Config;
