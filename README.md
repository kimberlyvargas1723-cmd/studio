# PsicoGuía: Asistente de Estudio para Psicología con IA

Este es un proyecto de Next.js que crea una aplicación de estudio adaptativo llamada PsicoGuía, diseñada para ayudar a los estudiantes a prepararse para su examen de admisión a la facultad de Psicología.

## Pila Tecnológica (Tech Stack)

-   **Framework Principal:** Next.js (con App Router)
-   **Lenguaje:** TypeScript
-   **UI:** React con Componentes de ShadCN UI
-   **Estilos:** Tailwind CSS
-   **Funcionalidades de IA:** Genkit (Google AI)
-   **Backend y Base de Datos:** Firebase (Authentication, Firestore, Realtime Database, Storage)

## Estructura del Proyecto

A continuación, una descripción de las carpetas clave para una rápida orientación:

-   **/src/app/**: Contiene todas las rutas y páginas principales de la aplicación.
    -   `layout.tsx`: El layout raíz que gestiona la estructura general.
    -   `page.tsx`: Punto de entrada que actúa como guardia de enrutamiento.
    -   `/dashboard`: La página principal del usuario.
    -   `/study`: La sección para leer y resumir material de estudio.
    -   `/practice`: El "Gimnasio Mental" con quizzes, flashcards y simulacros.
    -   `/progress`: Página para visualizar el rendimiento del usuario.
    -   `/schedule`: Generador de planes de estudio personalizados.
-   **/src/components/**: Componentes de React reutilizables.
    -   `/ui`: Componentes base de ShadCN (Button, Card, etc.).
    -   El resto son componentes de aplicación más complejos (ej. `header.tsx`, `chat-widget.tsx`).
-   **/src/lib/**: Lógica de negocio, tipos de datos y servicios.
    -   `services.ts`: Funciones para interactuar con Firebase y localStorage.
    -   `types.ts`: Definiciones de TypeScript para todo el proyecto.
    -   `data.ts`: Datos estáticos como la lista de temas de estudio.
-   **/src/firebase/**: Toda la configuración y hooks para la integración con Firebase.
    -   `index.ts`: Punto de entrada que inicializa Firebase.
    -   `provider.tsx`: Provee el contexto de Firebase a la aplicación.
    -   `auth/`, `firestore/`: Hooks personalizados para cada servicio.
-   **/src/ai/**: Lógica relacionada con la inteligencia artificial.
    -   `genkit.ts`: Configuración e inicialización del cliente de Genkit.
    -   `flows/`: Todos los flujos de IA (prompts y lógica) para resumir, generar preguntas, etc.
    -   `schemas.ts`: Esquemas de Zod para la validación de entradas y salidas de los flujos de IA.
-   **/public/lecturas/**: Archivos Markdown con el material de estudio.

## Cómo Colaborar

1.  **Revisa `src/lib/types.ts`** para entender los modelos de datos principales.
2.  **Examina `src/ai/schemas.ts` y `src/ai/flows/`** para ver cómo la IA está integrada.
3.  **Utiliza los servicios en `src/lib/services.ts`** para cualquier interacción con la base de datos.
4.  **Sigue la estructura de componentes** existente al crear nueva UI.
