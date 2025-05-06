# Test Memory - Configuración del Proyecto

## Requisitos Previos

Para trabajar con el proyecto Test Memory, necesitarás:

- Node.js (versión 18.x o superior)
- npm o yarn
- Una cuenta en Supabase (gratuita para desarrollo)
- Opcional: Cuenta en Cloudinary (para gestión de imágenes)

## Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone <Uhttps://github.com/lookymlive/test-memory>
cd test-memory
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```psh
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu-url-de-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-de-supabase

# Cloudinary Configuration (opcional)
# NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu-cloud-name-de-cloudinary
```

⚠️ **IMPORTANTE: SEGURIDAD DE CLAVES** ⚠️

- NUNCA compartas tus claves privadas de Supabase o cualquier otro servicio
- NUNCA comprometas archivos .env con claves reales al control de versiones
- NUNCA incluyas claves reales en la documentación
- Usa siempre valores de ejemplo o placeholders en la documentación
- El archivo .env.local está incluido en .gitignore para evitar exposición accidental

## Ejecución del Proyecto

### Modo Desarrollo

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el servidor en `http://localhost:3000`

### Construcción para Producción

Para construir el proyecto para producción:

```bash
npm run build
```

Para ejecutar la versión de producción:

```bash
npm start
```

## Estructura del Proyecto

La estructura principal del proyecto es la siguiente:

```psh
/src
  /app                     # Rutas y páginas de la aplicación
    /(auth)                # Rutas de autenticación
    /disciplines           # Disciplinas de memoria
    /records               # Récords de usuarios
    /about                 # Página de información
    page.tsx               # Página principal
    layout.tsx             # Layout principal
    globals.css            # Estilos globales
  /components              # Componentes reutilizables
    /ui                    # Componentes de UI (shadcn/ui)
    navbar.tsx             # Barra de navegación
    theme-toggle.tsx       # Toggle de tema claro/oscuro
    theme-provider.tsx     # Proveedor del tema
  /lib                     # Utilidades y configuración
    utils.ts               # Funciones de utilidad
```

## Configuración de Supabase

El proyecto utiliza Supabase para la autenticación y la base de datos. La configuración ya está realizada con las siguientes características:

1. **Autenticación**: Sistema completo de autenticación con email/password
2. **Base de Datos**: Esquema de PostgreSQL con las siguientes tablas:
   - `profiles`: Perfiles de usuarios
   - `disciplines`: Disciplinas de memoria disponibles
   - `training_sessions`: Sesiones de entrenamiento
   - `records`: Récords de usuarios
   - `competitions`: Competiciones disponibles
   - `competition_results`: Resultados de competiciones

Para acceder al panel de control de Supabase:

1. Ve a [https://supabase.com](https://supabase.com)
2. Inicia sesión con tus credenciales
3. Selecciona el proyecto "test-memory"
