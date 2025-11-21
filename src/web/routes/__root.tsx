import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/hooks/use-theme'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  ),
})
