import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { River } from "@/components/River";
import { Flag, Send } from "lucide-react";

type ReceivedBottle = {
	id: number;
	message: string;
	nickname: string | null;
	country: string | null;
};

type ThrowResponse = {
	sent: boolean;
	received: ReceivedBottle | null;
	error?: string;
};

const COUNTRIES = [
	"", "Argentina", "Australia", "Brazil", "Canada", "China", "France",
	"Germany", "India", "Italy", "Japan", "Mexico", "Netherlands", "New Zealand",
	"Norway", "Poland", "Portugal", "Russia", "South Korea", "Spain", "Sweden",
	"Switzerland", "Thailand", "Turkey", "Ukraine", "United Kingdom", "United States",
	"Vietnam"
];

function App() {
	const [message, setMessage] = useState("");
	const [nickname, setNickname] = useState("");
	const [country, setCountry] = useState("");
	const [receivedBottle, setReceivedBottle] = useState<ReceivedBottle | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showThrowAnimation, setShowThrowAnimation] = useState(false);
	const [showReceiveAnimation, setShowReceiveAnimation] = useState(false);
	const [reportSuccess, setReportSuccess] = useState(false);

	const charsRemaining = 280 - message.length;

	const throwBottle = async () => {
		if (!message.trim()) return;

		setError(null);
		setLoading(true);
		setShowThrowAnimation(true);
		setReceivedBottle(null);
		setReportSuccess(false);

		// Let throw animation play
		await new Promise(resolve => setTimeout(resolve, 500));

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
				return;
			}

			// Success - clear form and show received bottle
			setMessage("");
			setShowThrowAnimation(false);

			if (data.received) {
				setShowReceiveAnimation(true);
				setReceivedBottle(data.received);
			} else {
				setReceivedBottle(null);
			}
		} catch (err) {
			setError("Failed to connect to the river");
			setShowThrowAnimation(false);
		} finally {
			setLoading(false);
		}
	};

	const reportBottle = async () => {
		if (!receivedBottle) return;

		try {
			const response = await fetch(`/api/bottles/${receivedBottle.id}/report`, {
				method: "POST",
			});

			if (response.ok) {
				setReportSuccess(true);
			}
		} catch (err) {
			console.error("Failed to report bottle:", err);
		}
	};

	const formatSender = (bottle: ReceivedBottle) => {
		if (bottle.nickname && bottle.country) {
			return `from ${bottle.nickname} in ${bottle.country}`;
		}
		if (bottle.nickname) {
			return `from ${bottle.nickname}`;
		}
		if (bottle.country) {
			return `from a stranger in ${bottle.country}`;
		}
		return "from a stranger";
	};

	return (
		<div className="min-h-screen bg-ink font-sans flex flex-col">
			{/* Fixed Header */}
			<header className="h-12 flex items-center justify-center border-b border-ink-soft shrink-0">
				<h1 className="text-xl font-serif font-light text-vellum tracking-wide">
					Riverbank
				</h1>
			</header>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-lg">
					{/* Tagline */}
					<p className="text-slate-light text-sm text-center mb-8">
						Throw a thought, receive a thought
					</p>

					{/* Composition Area */}
					<div className={`bg-vellum rounded-lg p-6 mb-8 transition-opacity duration-500 ${showThrowAnimation ? 'animate-drift-out' : ''}`}>
						<Textarea
							placeholder="Write your message..."
							value={message}
							onChange={(e) => setMessage(e.target.value.slice(0, 280))}
							disabled={loading}
							className="font-serif text-lg text-ink border-0 bg-transparent resize-none min-h-[120px] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-light"
						/>

						<div className="flex justify-between items-center text-sm text-slate mt-2 mb-4">
							<span className={charsRemaining < 30 ? "text-red-600" : ""}>
								{charsRemaining} characters remaining
							</span>
						</div>

						{/* Optional metadata */}
						<div className="flex gap-3 mb-4">
							<Input
								type="text"
								placeholder="Nickname (optional)"
								value={nickname}
								onChange={(e) => setNickname(e.target.value.slice(0, 30))}
								disabled={loading}
								className="flex-1 text-sm bg-vellum-dark border-0 text-ink placeholder:text-slate-light"
							/>
							<select
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								disabled={loading}
								className="flex-1 text-sm bg-vellum-dark border-0 rounded-md px-3 py-2 text-ink"
							>
								<option value="">Country (optional)</option>
								{COUNTRIES.filter(c => c).map(c => (
									<option key={c} value={c}>{c}</option>
								))}
							</select>
						</div>

						{/* Error display */}
						{error && (
							<div className="text-red-700 text-sm mb-4 p-3 bg-red-50 rounded">
								{error}
							</div>
						)}

						{/* Throw button */}
						<Button
							onClick={throwBottle}
							disabled={loading || !message.trim()}
							className="w-full bg-ink hover:bg-ink-soft text-vellum font-medium py-6 text-lg transition-all"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<span className="animate-pulse">Drifting...</span>
								</span>
							) : (
								<span className="flex items-center gap-2">
									<Send className="w-5 h-5" />
									Throw into the river
								</span>
							)}
						</Button>
					</div>

					{/* Received Bottle */}
					{receivedBottle && (
						<div className={`bg-vellum rounded-lg p-6 ${showReceiveAnimation ? 'animate-drift-in' : ''}`}>
							<div className="text-xs text-slate uppercase tracking-wider mb-3">
								A bottle washed ashore
							</div>

							<p className="font-serif text-xl text-ink leading-relaxed mb-4 animate-float">
								{receivedBottle.message}
							</p>

							<div className="flex justify-between items-center">
								<span className="text-sm text-slate italic">
									{formatSender(receivedBottle)}
								</span>

								{!reportSuccess ? (
									<button
										onClick={reportBottle}
										className="text-slate-light hover:text-red-600 transition-colors p-2"
										title="Report inappropriate content"
									>
										<Flag className="w-4 h-4" />
									</button>
								) : (
									<span className="text-xs text-slate-light">Reported</span>
								)}
							</div>
						</div>
					)}

					{/* Empty pool state */}
					{receivedBottle === null && !loading && message === "" && (
						<div className="text-center text-slate-light text-sm">
							<p className="mb-2">No bottles in the river yet.</p>
							<p>Be the first to cast your thoughts into the current.</p>
						</div>
					)}
				</div>
			</main>

			{/* River Visualization */}
			<River isSending={showThrowAnimation} isReceiving={showReceiveAnimation} />

			{/* Fixed Footer */}
			<footer className="h-12 flex items-center justify-center border-t border-ink-soft shrink-0">
				<div className="flex items-center gap-4 text-slate text-xs">
					<span>&copy; {new Date().getFullYear()} Riverbank</span>
					<span className="text-slate-light">|</span>
					<a href="/terms" className="hover:text-vellum transition-colors">Terms</a>
					<a href="/privacy" className="hover:text-vellum transition-colors">Privacy</a>
				</div>
			</footer>
		</div>
	);
}

export default App;
