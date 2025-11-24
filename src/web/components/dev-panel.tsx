import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon, CheckIcon, CircleAlertIcon } from "raster-react";

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
		<div className="fixed bottom-4 right-4 z-50">
			{isExpanded ? (
				<Card className="w-80 border-2 border-orange-500 shadow-lg">
					<CardHeader className="pb-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<InfoIcon size={20} className="text-orange-500" />
								<CardTitle className="text-lg">Dev Tools</CardTitle>
							</div>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(false)}
								className="h-6 w-6 p-0"
							>
								×
							</Button>
						</div>
						<CardDescription>Generate fake bottle messages for testing</CardDescription>
					</CardHeader>
					<CardContent className="space-y-3">
						<Button
							onClick={generateFakeData}
							disabled={isGenerating}
							className="w-full"
							variant="default"
						>
							{isGenerating ? (
								<>
									<InfoIcon size={16} className="mr-2 animate-spin" />
									Generating...
								</>
							) : (
								<>
									Generate 10 Bottles
								</>
							)}
						</Button>

						{result && (
							<div
								className={`flex items-start gap-2 rounded-md border p-3 text-sm ${
									result.success
										? "border-green-500 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100"
										: "border-red-500 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100"
								}`}
							>
								{result.success ? (
									<CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
								) : (
									<CircleAlertIcon size={16} className="mt-0.5 flex-shrink-0" />
								)}
								<p className="flex-1">{result.message}</p>
							</div>
						)}

						<p className="text-xs text-muted-foreground">
							Uses Cloudflare AI (GPT-OSS-20B) to generate authentic-sounding messages
						</p>
					</CardContent>
				</Card>
			) : (
				<Button
					onClick={() => setIsExpanded(true)}
					size="icon"
					className="h-12 w-12 rounded-full border-2 border-orange-500 bg-background shadow-lg hover:bg-accent"
					title="Open Dev Tools"
				>
					<InfoIcon size={20} className="text-orange-500" />
				</Button>
			)}
		</div>
	);
}
