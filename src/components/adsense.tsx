import { useEffect } from "react";

declare global {
	interface Window {
		adsbygoogle?: unknown[];
	}
}

let adsenseScriptPromise: Promise<void> | null = null;

function ensureAdSenseScript() {
	if (typeof window === "undefined") {
		return Promise.resolve();
	}

	if (window.adsbygoogle) {
		return Promise.resolve();
	}

	if (adsenseScriptPromise) {
		return adsenseScriptPromise;
	}

	adsenseScriptPromise = new Promise<void>((resolve, reject) => {
		const existingScript = document.querySelector<HTMLScriptElement>('script[data-adsense-script="true"]');
		if (existingScript) {
			existingScript.addEventListener("load", () => resolve(), { once: true });
			existingScript.addEventListener("error", () => reject(new Error("Failed to load AdSense script")), { once: true });
			return;
		}

		const script = document.createElement("script");
		script.async = true;
		script.crossOrigin = "anonymous";
		script.dataset.adsenseScript = "true";
		script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5472148208256469";
		script.addEventListener("load", () => resolve(), { once: true });
		script.addEventListener("error", () => reject(new Error("Failed to load AdSense script")), { once: true });
		document.head.appendChild(script);
	});

	return adsenseScriptPromise;
}

interface AdSenseProps {
	/**
	 * Ad slot ID from Google AdSense
	 */
	slot: string;
	/**
	 * Ad format: auto, fluid, rectangle, vertical, horizontal
	 */
	format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
	/**
	 * Whether the ad should be responsive
	 */
	responsive?: boolean;
	/**
	 * Custom className for styling
	 */
	className?: string;
	/**
	 * Ad style (full-width-responsive recommended for responsive ads)
	 */
	style?: React.CSSProperties;
}

/**
 * Google AdSense component for displaying ads
 *
 * Usage:
 * ```tsx
 * <AdSense slot="1234567890" format="auto" responsive />
 * ```
 */
export function AdSense({
	slot,
	format = "auto",
	responsive = true,
	className = "",
	style = {},
}: AdSenseProps) {
	useEffect(() => {
		let cancelled = false;

		void ensureAdSenseScript()
			.then(() => {
				if (cancelled) {
					return;
				}

				(window.adsbygoogle = window.adsbygoogle || []).push({});
			})
			.catch((error) => {
				console.error("AdSense error:", error);
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<ins
			className={`adsbygoogle ${className}`.trim()}
			style={{
				display: "block",
				...style,
			}}
			data-ad-client="ca-pub-5472148208256469"
			data-ad-slot={slot}
			data-ad-format={format}
			data-full-width-responsive={responsive ? "true" : "false"}
		/>
	);
}
