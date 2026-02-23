import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

function scheduleIdleTask(task: () => void) {
	if ("requestIdleCallback" in window) {
		window.requestIdleCallback(() => task(), { timeout: 2000 });
		return;
	}

	window.setTimeout(task, 0);
}

function initAnalytics() {
	const gaTrackingId = import.meta.env.VITE_GA_TRACKING_ID;
	const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;
	const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST;

	if (!gaTrackingId && !posthogKey) {
		return;
	}

	scheduleIdleTask(async () => {
		const tasks: Promise<unknown>[] = [];

		if (gaTrackingId) {
			tasks.push(
				import("react-ga4").then(({ default: ReactGA }) => {
					ReactGA.initialize(gaTrackingId, {
						gtagOptions: {
							debug_mode: import.meta.env.DEV,
						},
					});

					ReactGA.send({
						hitType: "pageview",
						page: window.location.pathname + window.location.search + window.location.hash,
						title: document.title,
					});

					router.subscribe("onLoad", ({ toLocation }) => {
						ReactGA.send({
							hitType: "pageview",
							page: toLocation.href,
							title: document.title,
						});
					});
				}),
			);
		}

		if (posthogKey && posthogHost) {
			tasks.push(
				import("posthog-js").then(({ default: posthog }) => {
					posthog.init(posthogKey, {
						api_host: posthogHost,
						defaults: "2025-05-24",
						capture_exceptions: true,
						debug: import.meta.env.DEV,
					});
				}),
			);
		}

		await Promise.all(tasks);
	});
}

// Register the router instance for type safety
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

initAnalytics();
