import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import TanStackRouterVite from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite(),
		react(),
		tailwindcss(),
		cloudflare()
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
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