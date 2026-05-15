# Empório LeleCute - Project Structure

## Directory Layout

```
emporiolelecute/
├── .kiro/                    # Kiro AI assistant configuration
│   └── steering/            # Steering documents (this folder)
├── .lovable/                # Lovable.dev project configuration
├── src/
│   ├── assets/              # Static assets (images, logos)
│   ├── components/          # Reusable UI components
│   │   ├── admin/           # Admin-specific components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React Context providers
│   ├── data/                # Static data and constants
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page-level components (routes)
│   │   └── admin/           # Admin page routes
│   ├── App.tsx              # Main app component with routing
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles and design system
├── public/                  # Static files served directly
├── docs/                    # Documentation files
├── .env                     # Environment variables (not committed)
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript root config
├── tsconfig.app.json        # App-specific TypeScript config
├── tsconfig.node.json       # Node-specific TypeScript config
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── components.json          # shadcn/ui configuration
├── postcss.config.js        # PostCSS configuration
└── eslint.config.js         # ESLint configuration
```

## Key Directories Explained

### `/src/components`
Contains reusable UI components. Components are organized as:
- **Root level**: General-purpose components (e.g., `Header.tsx`, `Footer.tsx`, `ProductCard.tsx`)
- **`/admin`**: Admin panel components (image uploaders, editors, panels)
- **`/ui`**: shadcn/ui components (buttons, cards, dialogs, etc.)

**Component Pattern**:
```typescript
// Component.tsx
export function ComponentName({ props }: Props) {
  return <div>...</div>;
}
```

### `/src/pages`
Contains page-level components that correspond to routes. Pages are lazy-loaded for performance.

**Page Pattern**:
```typescript
// PageName.tsx
export function PageName() {
  return <div>Page content</div>;
}
```

### `/src/lib`
Utility functions and helpers:
- `analytics.ts` - Analytics tracking
- `image.ts` - Image optimization utilities
- `lazyWithRetry.ts` - Lazy loading with retry logic
- `utils.ts` - Shared utility functions (e.g., `cn()` for class merging)

### `/src/contexts`
React Context providers for global state:
- `CartContext.tsx` - Shopping cart state management

### `/src/hooks`
Custom React hooks for reusable logic.

### `/src/integrations`
External service integrations (Supabase, tracking pixels, etc.).

## Routing Structure

### Public Routes
- `/` - Homepage
- `/sobre` - About
- `/contato` - Contact
- `/depoimentos` - Testimonials
- `/ocasioes` - Occasions
- `/orcamento` - Quote request
- `/produtos` - Product catalog
- `/produtos/:slug` - Individual product page
- `/carrinho` - Shopping cart
- `/envio` - Shipping information
- `/rastrear` - Order tracking
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog post
- `/lembrancinhas-[occasion]` - Occasion-specific landing pages

### Admin Routes (all under `/admin`)
- `/admin` - Dashboard
- `/admin/pedidos` - Orders
- `/admin/clientes` - Customers
- `/admin/produtos` - Products
- `/admin/produtos/novo` - New product form
- `/admin/produtos/:id` - Edit product form
- `/admin/categorias` - Categories
- `/admin/ocasioes` - Occasions
- `/admin/tags` - Tags
- `/admin/importar` - Import data
- `/admin/paginas` - Pages
- `/admin/paginas/nova` - New page form
- `/admin/paginas/:id` - Edit page form
- `/admin/menus` - Menus
- `/admin/faqs` - FAQs
- `/admin/blocos` - Homepage blocks
- `/admin/configuracoes` - Settings
- `/admin/seo` - SEO management
- `/admin/instagram` - Instagram scheduling
- `/admin/usuarios` - User management
- `/admin/auditoria` - Audit log

## State Management Patterns

### Client-Side State
- **Cart**: `CartContext` with localStorage persistence
- **UI State**: Component-local state with `useState`

### Server-Side State
- **TanStack Query**: For API data fetching and caching
- **Query config**: 5min stale time, 30min GC time

## Styling Conventions

### Design System
- **Colors**: Coral/salmon primary (`--primary`), warm grays for text
- **Typography**: Quicksand (display), DM Sans (body)
- **Spacing**: Tailwind defaults with custom container padding (2rem)
- **Shadows**: Soft, medium, and card shadow tokens

### CSS Variables
Defined in `index.css` under `:root` and `.dark` for theme support.

### Component Styling
1. Use Tailwind utility classes
2. Use `cn()` from `@/lib/utils` for conditional classes
3. Define custom animations in `index.css`
4. Use CSS-in-JS `@layer` for component-specific styles

## Code Organization Principles

### Lazy Loading
All pages and admin components use `lazy()` for code splitting:
```typescript
const PageName = lazy(() => import("./pages/PageName"));
```

Admin components use `lazyWithRetry()` for resilience:
```typescript
const AdminComponent = lazyWithRetry(
  () => import("./pages/admin/AdminComponent"),
  "AdminComponent"
);
```

### Error Handling
- **AdminErrorBoundary**: Catches errors in admin panel
- **StaleBundleOverlay**: Notifies users of new deployments

### Analytics
- Page tracking via `usePageTracking` hook
- Dynamic tracking scripts via `TrackingScripts` component

## Build Output
- Hashed filenames for cache busting
- Entry chunks: `assets/[name]-[hash].js`
- Asset chunks: `assets/[name]-[hash].[ext]`