# Test Memory

Una aplicación web para el entrenamiento de la memoria a través de diversas disciplinas.

## Descripción

Test Memory es una plataforma completa para el entrenamiento de la memoria que ofrece diferentes disciplinas de memorización:

- **Dígitos Decimales**: Memoriza secuencias de números.
- **Números Binarios**: Memoriza secuencias de dígitos binarios (0 y 1).
- **Matrices**: Memoriza patrones en matrices de diferentes tamaños.
- **Formas y Colores**: Mejora tu memoria asociativa con formas y colores.

## Características

- **Autenticación de usuarios** con Supabase
- **Disciplinas de memoria** con diferentes niveles de dificultad
- **Interfaz visual mejorada** con indicadores de progreso y transiciones fluidas
- **Sistema de puntuación** para cada disciplina
- **Registros personales** para seguir tu progreso
- **Dashboard de estadísticas** con métricas de rendimiento
- **Modo oscuro/claro** para una mejor experiencia visual

## Tecnologías

- [Next.js 14](https://nextjs.org/) - Framework de React
- [TypeScript](https://www.typescriptlang.org/) - Superset tipado de JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utility-first
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI reutilizables
- [Supabase](https://supabase.io/) - Backend con autenticación y base de datos

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Navegar al directorio del proyecto
cd test-memory

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase

# Iniciar el servidor de desarrollo
npm run dev
```

## Estructura del Proyecto

- `/src` - Código fuente
  - `/app` - Componentes y páginas (Next.js App Router)
  - `/components` - Componentes reutilizables
  - `/lib` - Utilidades y configuración
- `/public` - Archivos estáticos
- `/docs` - Documentación técnica del proyecto
- `/memory-bank` - Documentación del contexto y progreso

## Estado Actual

- **Fase completada**: Configuración básica, autenticación, disciplinas de memoria, mejoras visuales
- **En progreso**: Estadísticas avanzadas, sistema de competiciones
- **Pendiente**: Despliegue, pruebas, optimizaciones finales

Consulta la documentación detallada en los directorios `/docs` y `/memory-bank` para más información sobre el proyecto, su estado actual y próximos pasos.

## Licencia

[MIT](LICENSE)
