import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@/hooks/use-theme'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </ThemeProvider>
  ),
})
