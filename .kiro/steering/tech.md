# Empório LeleCute - Technology Stack

## Core Stack

### Frontend Framework
- **React 18.3.1** with TypeScript
- **Vite 5.4** as the build tool
- **React Router DOM 6.30.1** for routing
- **SWC** via `@vitejs/plugin-react-swc` for fast compilation

### UI Library
- **shadcn/ui** - Component library built on Radix UI primitives
- **Tailwind CSS 3.4** for styling with custom design system
- **Lucide React** for iconography
- **class-variance-authority** for component variant management
- **clsx** and **tailwind-merge** for conditional class names

### State Management
- **React Context API** - `CartContext` for cart state
- **TanStack Query (React Query) 5.83** for server state management
- **localStorage** for cart persistence

### Form Handling
- **React Hook Form 7.61** with Zod validation
- **@hookform/resolvers** for Zod integration

### Rich Text Editing
- **Tiptap 3.15** with Image and Link extensions

### Data Visualization
- **Recharts 2.15** for charts and graphs

### PDF Generation
- **jsPDF 4.2** and **jsPDF-AutoTable 5.0** for reports

### Drag & Drop
- **dnd-kit** for sortable lists and drag interactions

### Date Handling
- **date-fns 3.6** for date formatting and manipulation
- **react-day-picker 8.10** for calendar components

### Other Key Libraries
- **next-themes** for dark mode support
- **sonner** for toast notifications
- **vaul** for drawer components
- **embla-carousel-react** for carousels
- **cmdk** for command menus
- **input-otp** for one-time password inputs

## Build & Development

### Development Server
```bash
npm run dev
```
- Runs on port 8080
- Auto-reload enabled
- Component tagging in development mode

### Production Build
```bash
# Production build
npm run build

# Development mode build (for testing)
npm run build:dev

# Preview production build
npm run preview
```

### Code Quality
```bash
# Linting
npm run lint
```

## Build Configuration

### Vite Configuration
- **Port**: 8080
- **Alias**: `@` → `./src`
- **Output**: Hashed filenames for cache busting
- **Plugins**: React (SWC), Component tagger (development only)

### TypeScript Configuration
- **Strict mode**: Partially enabled (`strictNullChecks: false`)
- **Path aliases**: `@/*` → `./src/*`
- **Skip lib check**: Enabled

### Tailwind Configuration
- **Base color**: Slate
- **CSS variables**: Enabled
- **Design system**: Custom coral/salmon color palette
- **Typography**: Quicksand (display), DM Sans (body)
- **Plugins**: tailwindcss-animate

## Infrastructure & Integrations

### Backend Services
- **Supabase** for database and authentication
- **Cloudflare Workers** for edge functions and SEO optimization

### Deployment
- **Lovable.dev** platform for hosting
- Can be deployed via Lovable UI or Git push

## Project Structure Conventions

### Component Organization
- **`/src/components`** - Reusable UI components
- **`/src/components/ui`** - shadcn/ui components
- **`/src/components/admin`** - Admin-specific components
- **`/src/pages`** - Page-level components (routes)
- **`/src/contexts`** - React Context providers
- **`/src/hooks`** - Custom hooks
- **`/src/lib`** - Utility functions
- **`/src/data`** - Static data and constants

### Naming Conventions
- Components: PascalCase (e.g., `ProductCard.tsx`)
- Pages: PascalCase (e.g., `ProductPage.tsx`)
- Hooks: `useXxx` pattern (e.g., `useCart`)
- Contexts: `XxxContext.tsx` with `useXxx` hook
- Types: PascalCase (e.g., `CartItem`)

### Styling Approach
- Use Tailwind utility classes
- Custom CSS variables for design tokens
- CSS-in-JS via `@layer` directives in `index.css`
- Component-specific animations defined in `index.css`

## Environment Variables

- `.env` file for secrets (not committed to git)
- Supabase configuration
- Tracking pixel IDs
- Cloudflare worker configuration