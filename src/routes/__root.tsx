import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/hooks/use-theme'
import { DevPanel } from '@/components/dev-panel'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Outlet />
      <DevPanel />
    </ThemeProvider>
  ),
})
