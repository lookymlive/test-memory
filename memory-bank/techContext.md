# Test Memory - Technical Context

## Technologies Used

### Core Framework and Language

- **Next.js 14**: React framework with App Router architecture
- **TypeScript**: For type-safe JavaScript development
- **React 18**: UI library

### Styling and UI

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI
- **Framer Motion**: Animation library
- **Next Themes**: Theme management (dark/light mode)

### Authentication and Database

- **Supabase**: Backend-as-a-Service platform
  - **Supabase Auth**: Authentication service
  - **Supabase Database**: PostgreSQL database
  - **Supabase Storage**: (Future implementation) For user avatars and assets
  - **Row Level Security (RLS)**: For data protection

### State Management and Forms

- **React Context API**: For global state management
- **Zustand**: For complex state management
- **React Hook Form**: Form handling
- **Zod**: Schema validation library
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Utilities

- **clsx/class-variance-authority**: For conditional class names
- **tailwind-merge**: For merging Tailwind CSS classes

## Development Setup

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Git

### Environment Variables

```psh
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url-placeholder
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-placeholder
```

⚠️ **IMPORTANTE: SEGURIDAD DE CLAVES** ⚠️

- NUNCA almacenes claves reales en la documentación o en el control de versiones
- Usa siempre valores de ejemplo o placeholders en la documentación
- Mantén las claves reales únicamente en archivos .env locales o en gestores de secretos

### Installation and Setup

1.Clone the repository

```bash
   git clone https://github.com/yourusername/test-memory.git
   cd test-memory
   ```

2.Install dependencies

```bash
   npm install
   ```

3.Start development server

```bash
   npm run dev
   ```

### Project Structure

```psh
test-memory/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Auth-related routes
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Registration page
│   │   ├── about/              # About page
│   │   ├── disciplines/        # Disciplines pages
│   │   ├── profile/            # User profile page
│   │   ├── records/            # Records and leaderboards
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (shadcn/ui)
│   │   ├── navbar.tsx          # Main navigation
│   │   ├── theme-provider.tsx  # Theme provider
│   │   └── theme-toggle.tsx    # Theme toggle button
│   └── lib/                    # Utilities and shared code
│       ├── auth-provider.tsx   # Authentication context
│       ├── supabase.ts         # Supabase client
│       └── utils.ts            # Helper functions
├── middleware.ts               # Next.js middleware (auth protection)
├── public/                     # Static assets
├── docs/                       # Documentation
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Project dependencies and scripts
└── README.md                   # Project README
```

## Technical Constraints

1. **Browser Compatibility**: Must support modern browsers (Edge, Chrome, Firefox, Safari)
2. **Mobile Responsiveness**: Must work on devices of all sizes
3. **Accessibility**: Must meet WCAG 2.1 Level AA standards
4. **Performance**: Must achieve >90 score on Lighthouse
5. **Security**: Must follow OWASP security guidelines

## Dependencies

### Production Dependencies

```json
{
  "@hookform/resolvers": "^3.3.4",
  "@radix-ui/react-avatar": "^1.0.4",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-icons": "^1.3.0",
  "@radix-ui/react-label": "^2.0.2",
  "@radix-ui/react-slot": "^1.2.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-toast": "^1.1.5",
  "@supabase/auth-helpers-nextjs": "^0.8.7",
  "@supabase/supabase-js": "^2.39.3",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "framer-motion": "^10.17.9",
  "next": "14.0.4",
  "next-themes": "^0.2.1",
  "react": "^18",
  "react-dom": "^18",
  "react-hook-form": "^7.49.3",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "zod": "^3.22.4",
  "zustand": "^4.4.7"
}
```

### Development Dependencies

```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10.0.1",
  "eslint": "^8",
  "eslint-config-next": "14.0.4",
  "postcss": "^8",
  "tailwindcss": "^3.3.0",
  "typescript": "^5"
}
```
