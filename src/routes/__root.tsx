import { Suspense, lazy } from "react"
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/hooks/use-theme'

const DevPanel = import.meta.env.DEV
	? lazy(async () => {
		const mod = await import("@/components/dev-panel")
		return { default: mod.DevPanel }
	})
	: null

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Outlet />
      {DevPanel ? (
        <Suspense fallback={null}>
          <DevPanel />
        </Suspense>
      ) : null}
    </ThemeProvider>
  ),
})
