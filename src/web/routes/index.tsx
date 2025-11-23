import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { River } from "@/components/river";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AboutSection } from "@/components/about-section";
import { MessageCompositionForm } from "@/components/message-composition-form";
import { ErrorAlert } from "@/components/error-alert";
import { ReceivedBottlesDisplay } from "@/components/received-bottles-display";
import { CommunityGuidelinesDialog } from "@/components/community-guidelines-dialog";
import { FalsePositiveDialog } from "@/components/false-positive-dialog";
import { useConsentStore } from "@/stores/consent-store";

export const Route = createFileRoute('/')({
	component: App,
})

type ReceivedBottle = {
	id: string;
	id_asc: number;
	message: string;
	nickname: string | null;
	country: string | null;
	like_count: number;
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
	const [likedBottles, setLikedBottles] = useState<Set<string>>(new Set());
	const [reportedBottles, setReportedBottles] = useState<Set<string>>(new Set());
	const [showGuidelines, setShowGuidelines] = useState(false);
	const [showFalsePositiveDialog, setShowFalsePositiveDialog] = useState(false);
	const [submittingFalsePositive, setSubmittingFalsePositive] = useState(false);

	// Set document title
	useEffect(() => {
		document.title = "Riverbank - Bottle a thought. Let it drift.";
	}, []);

	const minChars = 15;
	const canSubmit = message.trim().length >= minChars;

	const throwBottle = async () => {
		if (!message.trim() || !canSubmit) return;

		setError(null);
		setLoading(true);
		setLikedBottles(new Set());
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

	const likeBottle = async (bottleId: string) => {
		try {
			const response = await fetch(`/api/bottles/${bottleId}/like`, {
				method: "POST",
			});

			if (response.ok) {
				const data = await response.json();
				setLikedBottles(prev => new Set([...prev, bottleId]));
				// Update the like count in the bottles array
				setReceivedBottles(prev => prev.map(b =>
					b.id === bottleId ? { ...b, like_count: data.like_count } : b
				));
			}
		} catch (err) {
			console.error("Failed to like bottle:", err);
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
		<div className="min-h-screen bg-background font-sans flex flex-col transition-colors">
			<Header />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-lg">
					{/* SEO: Main heading (visually hidden but accessible to search engines and screen readers) */}
					<h1 className="sr-only">Riverbank - Share Messages in Digital Bottles</h1>

					{/* Tagline */}
					<p className="text-foreground/50 text-md text-center mb-6">
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
					<ReceivedBottlesDisplay
						receivedBottles={receivedBottles}
						showReceivedBottle={showReceivedBottle}
						likedBottles={likedBottles}
						reportedBottles={reportedBottles}
						onLike={likeBottle}
						onReport={reportBottle}
					/>

					{/* Community Guidelines */}
					{receivedBottles.length === 0 && !loading && message === "" && (
						<div className="text-center">
							<button
								onClick={() => setShowGuidelines(true)}
								className="text-muted-foreground/50 text-xs hover:text-muted-foreground transition-colors underline"
							>
								Community Guidelines
							</button>
						</div>
					)}
				</div>
			</main>

			{/* About Section for AEO */}
			<AboutSection />

			{/* River Visualization with Footer */}
			<div className="relative shrink-0">
				<River isSending={showThrowAnimation} isReceiving={showReceiveAnimation} />

				<Footer />
			</div>

			{/* Community Guidelines Dialog */}
			<CommunityGuidelinesDialog
				open={showGuidelines}
				onOpenChange={setShowGuidelines}
				onAccept={() => {
					acceptGuidelines();
					setShowGuidelines(false);
				}}
			/>

			{/* False Positive Report Dialog */}
			<FalsePositiveDialog
				open={showFalsePositiveDialog}
				onOpenChange={setShowFalsePositiveDialog}
				message={message}
				nickname={nickname}
				country={country}
				submitting={submittingFalsePositive}
				onSubmit={submitFalsePositiveReport}
			/>
		</div>
	);
}

export default App;
