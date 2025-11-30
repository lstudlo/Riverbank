import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import ReactGA from "react-ga4";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Initialize Google Analytics
const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
ReactGA.initialize(GA_TRACKING_ID, {
	gtagOptions: {
		debug_mode: import.meta.env.MODE === "development",
	},
});

// Create a new router instance
const router = createRouter({ routeTree });

// Track page views on route changes
router.subscribe("onLoad", ({ toLocation }) => {
	ReactGA.send({
		hitType: "pageview",
		page: toLocation.href,
		title: document.title,
	});
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PostHogProvider
			apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
			options={{
				api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
				defaults: '2025-05-24',
				capture_exceptions: true,
				debug: import.meta.env.MODE === "development",
			}}
		>
			<RouterProvider router={router} />
		</PostHogProvider>
	</StrictMode>,
);