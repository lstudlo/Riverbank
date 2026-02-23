import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import TanStackRouterVite from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin";

const clientManualChunks = {
	// Core runtime
	"react-vendor": ["react", "react-dom", "react-dom/client"],
	"router-vendor": ["@tanstack/react-router"],

	// UI libraries
	"radix-vendor": [
		"@radix-ui/react-alert-dialog",
		"@radix-ui/react-checkbox",
		"@radix-ui/react-dialog",
		"@radix-ui/react-select",
		"@radix-ui/react-slot",
	],
	"motion-vendor": ["motion"],
	"icons-vendor": ["raster-react"],

	// Forms / local state
	"form-state-vendor": ["react-hook-form", "@hookform/resolvers", "zod", "zustand"],

	// Heavier feature libs
	"three-vendor": ["three", "@react-three/fiber", "@react-three/drei", "@react-spring/three"],
	"carousel-vendor": ["embla-carousel-react"],

	// Deferred analytics chunks
	"analytics-vendor": ["react-ga4", "posthog-js"],
} as const;

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({
			autoCodeSplitting: true,
		}),
		react(),
		tailwindcss(),
		cloudflare()
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	environments: {
		client: {
			build: {
				rollupOptions: {
					output: {
						manualChunks: clientManualChunks,
					},
				},
			},
		},
	},
	server: {
		hmr: {
			overlay: true,
		},
		watch: {
			usePolling: false,
		},
	},
})
