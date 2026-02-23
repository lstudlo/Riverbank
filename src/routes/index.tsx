import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense, useEffect, useState } from "react";
import { River } from "@/components/river";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MessageCompositionForm } from "@/components/message-composition-form";
import { ErrorAlert } from "@/components/error-alert";
import { useConsentStore } from "@/stores/consent-store";

const HowItWorksDialog = lazy(async () => {
	const mod = await import("@/components/how-it-works-dialog");
	return { default: mod.HowItWorksDialog };
});

const CommunityGuidelinesDialog = lazy(async () => {
	const mod = await import("@/components/community-guidelines-dialog");
	return { default: mod.CommunityGuidelinesDialog };
});

const FalsePositiveDialog = lazy(async () => {
	const mod = await import("@/components/false-positive-dialog");
	return { default: mod.FalsePositiveDialog };
});

const ReceivedBottlesDisplay = lazy(async () => {
	const mod = await import("@/components/received-bottles-display");
	return { default: mod.ReceivedBottlesDisplay };
});

function preloadHomeDialogs() {
	void import("@/components/how-it-works-dialog");
	void import("@/components/community-guidelines-dialog");
	void import("@/components/false-positive-dialog");
}

function preloadReceivedBottlesUI() {
	void import("@/components/received-bottles-display");
}

export const Route = createFileRoute('/')({
	component: App,
})

type ReceivedBottle = {
	id: string;
	id_asc: number;
	message: string;
	nickname: string | null;
	country: string | null;
	emoji_reactions: string;
	report_count: number;
};

type ThrowResponse = {
	sent: boolean;
	received: ReceivedBottle[];
	error?: string;
};

function App() {
	const { hasAcceptedGuidelines, acceptGuidelines } = useConsentStore();
	const [message, setMessage] = useState("");
	const [nickname, setNickname] = useState("");
	const [country, setCountry] = useState("");
	const [receivedBottles, setReceivedBottles] = useState<ReceivedBottle[]>([]);
	const [showReceivedBottle, setShowReceivedBottle] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showThrowAnimation, setShowThrowAnimation] = useState(false);
	const [showReceiveAnimation, setShowReceiveAnimation] = useState(false);
	const [reactedBottles, setReactedBottles] = useState<Map<string, Set<string>>>(new Map());
	const [reportedBottles, setReportedBottles] = useState<Set<string>>(new Set());
	const [showGuidelines, setShowGuidelines] = useState(false);
	const [showFalsePositiveDialog, setShowFalsePositiveDialog] = useState(false);
	const [submittingFalsePositive, setSubmittingFalsePositive] = useState(false);
	const [showHowItWorks, setShowHowItWorks] = useState(false);

	// Set document title
	useEffect(() => {
		document.title = "Riverbank - Bottle a thought. Let it drift.";
	}, []);

	useEffect(() => {
		const preload = () => preloadHomeDialogs();
		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(preload, { timeout: 2000 });
			return () => window.cancelIdleCallback(id);
		}
		const timeoutId = window.setTimeout(preload, 0);
		return () => window.clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		const preload = () => preloadReceivedBottlesUI();
		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(preload, { timeout: 3000 });
			return () => window.cancelIdleCallback(id);
		}
		const timeoutId = window.setTimeout(preload, 250);
		return () => window.clearTimeout(timeoutId);
	}, []);

	const minChars = 15;
	const canSubmit = message.trim().length >= minChars;

	const throwBottle = async () => {
		if (!message.trim() || !canSubmit) return;
		preloadReceivedBottlesUI();

		setError(null);
		setLoading(true);
		setReactedBottles(new Map());
		setReportedBottles(new Set());

		// First, smoothly hide the received bottle if visible
		if (showReceivedBottle) {
			setShowReceivedBottle(false);
			// Wait for exit animation to complete
			await new Promise(resolve => setTimeout(resolve, 1200));
		}

		setShowThrowAnimation(true);
		setShowReceiveAnimation(false);

		try {
			const response = await fetch("/api/bottles/throw", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: message.trim(),
					nickname: nickname.trim() || undefined,
					country: country || undefined,
				}),
			});

			const data: ThrowResponse = await response.json();

			if (!response.ok) {
				setError(data.error || "Something went wrong");
				setShowThrowAnimation(false);
				setLoading(false);
				return;
			}

			// Success - clear form
			setMessage("");

			// Wait for throw animation to complete (3s exit animation)
			await new Promise(resolve => setTimeout(resolve, 3000));

			if (data.received && data.received.length > 0) {
				// Store data first (won't render yet)
				setReceivedBottles(data.received);

				// Start receive animation immediately to prevent idle state flash
				setShowReceiveAnimation(true);
				setShowThrowAnimation(false);

				// Wait for bottle to reach center before showing UI (sync with 3s animation)
				await new Promise(resolve => setTimeout(resolve, 2800));
				setShowReceivedBottle(true);

				// Reset receive animation state shortly after
				setTimeout(() => setShowReceiveAnimation(false), 500);
			} else {
				// No bottles received, just end the animation
				setShowThrowAnimation(false);
			}
		} catch (err) {
			setError("Failed to connect to the river");
			setShowThrowAnimation(false);
		} finally {
			setLoading(false);
		}
	};

	const reportBottle = async (bottleId: string) => {
		try {
			const response = await fetch(`/api/bottles/${bottleId}/report`, {
				method: "POST",
			});

			if (response.ok) {
				setReportedBottles(prev => new Set([...prev, bottleId]));
			}
		} catch (err) {
			console.error("Failed to report bottle:", err);
		}
	};

	const reactToBottle = async (bottleId: string, emoji: string) => {
		try {
			// Determine if we're adding or removing the reaction
			const userEmojis = reactedBottles.get(bottleId) || new Set<string>();
			const action = userEmojis.has(emoji) ? "remove" : "add";

			const response = await fetch(`/api/bottles/${bottleId}/react`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ emoji, action }),
			});

			if (response.ok) {
				const data = await response.json();
				// Update the local state to track which emojis the user has reacted with
				setReactedBottles(prev => {
					const newMap = new Map(prev);
					const currentUserEmojis = newMap.get(bottleId) || new Set<string>();
					const newUserEmojis = new Set(currentUserEmojis);

					// Toggle the emoji based on action
					if (action === "add") {
						newUserEmojis.add(emoji);
					} else {
						newUserEmojis.delete(emoji);
					}

					if (newUserEmojis.size > 0) {
						newMap.set(bottleId, newUserEmojis);
					} else {
						newMap.delete(bottleId);
					}

					return newMap;
				});
				// Update the emoji reactions in the bottles array
				setReceivedBottles(prev => prev.map(b =>
					b.id === bottleId ? { ...b, emoji_reactions: data.emoji_reactions } : b
				));
			}
		} catch (err) {
			console.error("Failed to react to bottle:", err);
		}
	};

	const submitFalsePositiveReport = async () => {
		setSubmittingFalsePositive(true);
		try {
			const response = await fetch("/api/false-positive", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					message: message.trim(),
					nickname: nickname.trim() || undefined,
					country: country || undefined,
				}),
			});

			if (response.ok) {
				setShowFalsePositiveDialog(false);
				// Optionally clear the error and allow retry
				setError(null);
			}
		} catch (err) {
			console.error("Failed to submit false positive report:", err);
		} finally {
			setSubmittingFalsePositive(false);
		}
	};

	return (
		<div className="h-screen bg-background font-sans flex flex-col transition-colors overflow-hidden">
			<Header onQuestionClick={() => setShowHowItWorks(true)} />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-2 overflow-auto">
				<div className="w-full max-w-lg">
					{/* SEO: Main heading (visually hidden but accessible to search engines and screen readers) */}
					<h1 className="sr-only">Riverbank - Share Messages in Digital Bottles</h1>

					{/* Tagline */}
						<p className="text-muted-foreground text-md text-center mb-4">
						Bottle a thought. Let it drift.
					</p>

					{/* Composition Area */}
					<MessageCompositionForm
						message={message}
						setMessage={setMessage}
						nickname={nickname}
						setNickname={setNickname}
						country={country}
						setCountry={setCountry}
						loading={loading}
						canSubmit={canSubmit}
						showThrowAnimation={showThrowAnimation}
						onThrow={throwBottle}
						onFocus={() => {
							if (!hasAcceptedGuidelines) {
								setShowGuidelines(true);
							}
						}}
					/>

					{/* Error Alert */}
					<ErrorAlert
						error={error}
						onReportError={() => setShowFalsePositiveDialog(true)}
					/>

					{/* Received Bottles */}
					{receivedBottles.length > 0 ? (
						<Suspense fallback={null}>
							<ReceivedBottlesDisplay
								receivedBottles={receivedBottles}
								showReceivedBottle={showReceivedBottle}
								reactedBottles={reactedBottles}
								reportedBottles={reportedBottles}
								onReact={reactToBottle}
								onReport={reportBottle}
							/>
						</Suspense>
					) : null}

					{/* Community Guidelines */}
					{receivedBottles.length === 0 && !loading && message === "" && (
						<div className="text-center">
							<button
								onClick={() => setShowGuidelines(true)}
								className="text-muted-foreground text-xs hover:text-foreground transition-colors underline"
							>
								Community Guidelines
							</button>
						</div>
					)}
				</div>
			</main>

			{/* River Visualization with Footer */}
			<div className="relative shrink-0 h-56">
				<River isSending={showThrowAnimation} isReceiving={showReceiveAnimation} />

				<Footer />
			</div>

			{/* How It Works Dialog */}
			{showHowItWorks ? (
				<Suspense fallback={null}>
					<HowItWorksDialog
						open={showHowItWorks}
						onOpenChange={setShowHowItWorks}
					/>
				</Suspense>
			) : null}

			{/* Community Guidelines Dialog */}
			{showGuidelines ? (
				<Suspense fallback={null}>
					<CommunityGuidelinesDialog
						open={showGuidelines}
						onOpenChange={setShowGuidelines}
						onAccept={() => {
							acceptGuidelines();
							setShowGuidelines(false);
						}}
					/>
				</Suspense>
			) : null}

			{/* False Positive Report Dialog */}
			{showFalsePositiveDialog ? (
				<Suspense fallback={null}>
					<FalsePositiveDialog
						open={showFalsePositiveDialog}
						onOpenChange={setShowFalsePositiveDialog}
						message={message}
						nickname={nickname}
						country={country}
						submitting={submittingFalsePositive}
						onSubmit={submitFalsePositiveReport}
					/>
				</Suspense>
			) : null}
		</div>
	);
}

export default App;
