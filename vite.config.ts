import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import TanStackRouterVite from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin";

function clientManualChunks(id: string) {
	if (!id.includes("node_modules")) {
		return;
	}

	if (
		id.includes("/react/") ||
		id.includes("/react-dom/") ||
		id.includes("/scheduler/")
	) {
		return "react-vendor";
	}

	if (id.includes("/@tanstack/react-router/")) {
		return "router-vendor";
	}

	if (id.includes("/motion/")) {
		return "motion-vendor";
	}

	if (id.includes("/@radix-ui/") || id.includes("/@floating-ui/")) {
		return "radix-vendor";
	}

	if (id.includes("/raster-react/")) {
		return "icons-vendor";
	}

	if (
		id.includes("/zustand/") ||
		id.includes("/react-hook-form/") ||
		id.includes("/@hookform/resolvers/") ||
		id.includes("/zod/")
	) {
		return "form-state-vendor";
	}
}

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
