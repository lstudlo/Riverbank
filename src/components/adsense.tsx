import { useEffect } from "react";

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
		try {
			// Initialize AdSense ads
			// @ts-expect-error - adsbygoogle is loaded via external script
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (error) {
			console.error("AdSense error:", error);
		}
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
