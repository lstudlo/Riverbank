import { useState } from "react";
import { Button } from "@/components/ui/button";

export function DevPanel() {
	const [isGenerating, setIsGenerating] = useState(false);
	const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	// Only show in development mode
	if (import.meta.env.MODE !== "development") {
		return null;
	}

	const generateFakeData = async () => {
		setIsGenerating(true);
		setResult(null);

		try {
			const response = await fetch("/api/dev/generate-bottles", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setResult({
					success: true,
					message: `Successfully generated ${data.generated} fake bottles!`,
				});
			} else {
				setResult({
					success: false,
					message: data.error || "Failed to generate fake data",
				});
			}
		} catch (error) {
			setResult({
				success: false,
				message: error instanceof Error ? error.message : "Network error",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="fixed bottom-4 left-4 z-50">
			{isExpanded ? (
				<div className="w-64 border border-border bg-background p-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold">Dev Tools</span>
						<button
							onClick={() => setIsExpanded(false)}
							className="text-muted-foreground hover:text-foreground"
						>
							×
						</button>
					</div>

					<Button
						onClick={generateFakeData}
						disabled={isGenerating}
						className="w-full"
						variant="outline"
					>
						{isGenerating ? "Generating..." : "Generate 10 Bottles"}
					</Button>

					{result && (
						<p className="text-xs text-muted-foreground">
							{result.message}
						</p>
					)}
				</div>
			) : (
				<button
					onClick={() => setIsExpanded(true)}
					className="px-3 py-2 text-xs border border-border bg-background hover:bg-accent"
					title="Open Dev Tools"
				>
					DEV
				</button>
			)}
		</div>
	);
}
