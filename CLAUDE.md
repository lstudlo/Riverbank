# Riverbank Project Configuration Reference

This document provides configuration reference for the Cloudflare + React + Hono.js project with TailwindCSS, shadcn/ui, and TanStack Router.

## Project Structure

```
riverbank/
├── src/
│   ├── web/              # React frontend application
│   │   ├── routes/       # TanStack Router file-based routes
│   │   ├── components/   # React components
│   │   │   └── ui/       # shadcn/ui components
│   │   ├── lib/          # Utility functions
│   │   ├── hooks/        # Custom React hooks
│   │   ├── App.tsx       # Main app component
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Global styles (TailwindCSS)
│   └── worker/           # Hono.js API (Cloudflare Workers)
├── public/               # Static assets
└── components.json       # shadcn/ui configuration
```

## Technology Stack

### Core Technologies
- **React 19** - UI library
- **Vite 6** - Build tool and dev server
- **TypeScript 5.8** - Type safety
- **Hono.js 4.8** - API framework for Cloudflare Workers
- **Cloudflare Workers** - Serverless deployment platform

### Styling & UI
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Icon library (used by shadcn/ui)

### Routing
- **TanStack Router v1** - Type-safe file-based routing
- **TanStack Router Devtools** - Route debugging tools

## Configuration Files

### Vite Configuration (`vite.config.ts`)

```typescript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/web/routes",
      generatedRouteTree: "./src/web/routeTree.gen.ts",
    }),
    react(),
    cloudflare(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/web"),
    },
  },
});
```

**Important Notes:**
- TanStack Router plugin MUST be placed before the React plugin
- Path alias `@` points to `src/web` directory (non-conventional setup)
- TailwindCSS uses the new v4 Vite plugin

### TypeScript Configuration

#### `tsconfig.json`
Project references with path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/web/*"]
    }
  }
}
```

#### `tsconfig.app.json`
Frontend-specific configuration:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/web/*"]
    }
  },
  "include": ["src/web"]
}
```

### shadcn/ui Configuration (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/web/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Key Points:**
- CSS file path: `src/web/index.css` (not the default `src/index.css`)
- All aliases use `@/` prefix which maps to `src/web/`
- Style: "new-york" variant
- Base color: neutral

## TailwindCSS Setup

### Import Statement (`src/web/index.css`)
```css
@import "tailwindcss";
```

TailwindCSS v4 uses a single import statement instead of the traditional directives.

## TanStack Router Setup

### Directory Structure
```
src/web/routes/
├── __root.tsx      # Root layout with Outlet
└── index.tsx       # Home page (/)
```

### Root Route (`src/web/routes/__root.tsx`)
```typescript
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

### Index Route (`src/web/routes/index.tsx`)
```typescript
import { createFileRoute } from '@tanstack/react-router'
import App from '../App'

export const Route = createFileRoute('/')({
  component: App,
})
```

### Router Initialization (`src/web/main.tsx`)
```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

### Generated Files
- `src/web/routeTree.gen.ts` - Auto-generated route tree (DO NOT EDIT)
- Added to `.gitignore`
- Marked as read-only in VSCode settings

## Adding shadcn/ui Components

Use the shadcn CLI to add components:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
# etc.
```

Components will be added to `src/web/components/ui/` and can be imported using the `@/` alias:

```typescript
import { Button } from "@/components/ui/button"
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type check
tsc

# Lint code
npm run lint

# Deploy to Cloudflare
npm run deploy

# Cloudflare type generation
npm run cf-typegen
```

## Path Aliases

The `@/` alias maps to `src/web/`:

```typescript
// Import examples
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import App from "@/App"
```

## Important Considerations

### Non-Conventional Structure
This is NOT a standard React project. It's a Cloudflare template with:
- React frontend in `src/web/`
- Hono.js API in `src/worker/`
- All path aliases point to `src/web/` (not `src/`)

### TailwindCSS v4
- Uses new Vite plugin: `@tailwindcss/vite`
- Single `@import "tailwindcss"` instead of three directives
- No `tailwind.config.js` needed for basic setup

### TanStack Router
- File-based routing in `src/web/routes/`
- Auto-generates `routeTree.gen.ts` (excluded from version control)
- Router plugin MUST come before React plugin in Vite config
- Includes devtools for debugging routes

### shadcn/ui
- Components installed to `src/web/components/ui/`
- Uses path aliases with `@/` prefix
- Utility function in `src/web/lib/utils.ts`
- New York style variant with neutral base color

## VSCode Settings

The `.vscode/settings.json` includes:
- Readonly protection for `routeTree.gen.ts`
- Search exclusion for generated files
- Watcher exclusion to improve performance

## Dependencies

### Production Dependencies
```json
{
  "hono": "4.8.2",
  "react": "19.0.0",
  "react-dom": "19.0.0",
  "@tanstack/react-router": "^1.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

### Development Dependencies
```json
{
  "@cloudflare/vite-plugin": "^1.15.1",
  "@tanstack/router-plugin": "^1.x",
  "@tanstack/router-devtools": "^1.x",
  "@tailwindcss/vite": "^4.x",
  "tailwindcss": "^4.x",
  "@vitejs/plugin-react": "5.0.0",
  "@types/node": "24.0.4",
  "vite": "^6.0.0",
  "typescript": "5.8.3"
}
```

## Quick Reference

### Creating New Routes
1. Create a new file in `src/web/routes/`
   - `about.tsx` → `/about`
   - `blog/index.tsx` → `/blog`
   - `blog/$postId.tsx` → `/blog/:postId`

2. Export a Route using `createFileRoute`:
```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutComponent,
})

function AboutComponent() {
  return <div>About page</div>
}
```

### Using TailwindCSS
```tsx
// Classes work as expected with TailwindCSS v4
<div className="flex items-center justify-center p-4 bg-gray-100">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
```

### Using shadcn/ui Components
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <Button variant="default">Click me</Button>
    </Card>
  )
}
```

## Troubleshooting

### Path alias not working
- Ensure `baseUrl` and `paths` are set in both `tsconfig.json` and `tsconfig.app.json`
- Check that `@` resolves to `./src/web` in `vite.config.ts`
- Restart TypeScript server in VSCode

### TailwindCSS styles not applying
- Verify `@import "tailwindcss"` is in `src/web/index.css`
- Check that `tailwindcss()` plugin is in Vite config
- Ensure `index.css` is imported in `main.tsx`

### Router not working
- Verify TanStack Router plugin is BEFORE React plugin
- Check that `routeTree.gen.ts` was generated
- Ensure route files export `Route` using `createFileRoute`

### shadcn/ui components not found
- Check that `components.json` has correct paths
- Verify path aliases are configured correctly
- Run `npx shadcn@latest add <component>` to install components

---

**Last Updated:** 2025-11-21
**Claude Code Configuration Session**
