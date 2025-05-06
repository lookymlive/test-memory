# Test Memory

Una aplicación web para el entrenamiento de la memoria a través de diversas disciplinas.

## Descripción

Test Memory es una plataforma completa para el entrenamiento de la memoria que ofrece diferentes disciplinas de memorización:

- **Dígitos Decimales**: Memoriza secuencias de números.
- **Números Binarios**: Memoriza secuencias de dígitos binarios (0 y 1).
- **Matrices**: Memoriza patrones en matrices de diferentes tamaños.
- **Formas y Colores**: Mejora tu memoria asociativa con formas y colores.

Cada disciplina cuenta con diferentes niveles de dificultad y un sistema de puntuación para medir tu progreso.

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
- `/docs` - Documentación del proyecto
- `/memory-bank` - Documentación del contexto y progreso del proyecto

## Últimas Mejoras

### Página de Récords y Dashboard

- Implementación de página de récords personales con sistema de pestañas
- Visualización de récords mundiales de referencia
- Dashboard con estadísticas detalladas de entrenamiento
- Análisis de sesiones recientes y progreso del usuario
- Métricas clave de rendimiento por disciplina

### Mejoras Visuales

- Barras de progreso para indicar el tiempo restante en cada elemento
- Contadores de posición en las secuencias (ej: "Dígito 3 de 7")
- Animaciones mejoradas para las transiciones entre elementos
- Efectos visuales para destacar elementos activos
- Indicadores de tiempo para mejorar la percepción entre cambios

### Optimizaciones Técnicas

- Corrección de tipos en componentes de matrices
- Animaciones CSS para transiciones suaves
- Mejora en la presentación visual de cada disciplina
- Indicadores claros del estado actual del entrenamiento

## Documentación

Para más información detallada sobre el proyecto, consulta:

- [Docs](./docs): Documentación técnica y guías
- [Memory Bank](./memory-bank): Contexto del proyecto y seguimiento del progreso

## Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios importantes antes de enviar un pull request.

## Licencia

[MIT](LICENSE)
