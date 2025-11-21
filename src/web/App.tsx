import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { River } from "@/components/River";
import { WavyText } from "@/components/WavyText";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/components/user-button";
import { Flag, Send } from "lucide-react";

type ReceivedBottle = {
	id: string;
	id_asc: number;
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
	const [showReceivedBottle, setShowReceivedBottle] = useState(false);
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
		setReportSuccess(false);

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
			setShowThrowAnimation(false);

			if (data.received) {
				// Store data first (won't render yet)
				setReceivedBottle(data.received);

				// Small delay before receive animation starts
				await new Promise(resolve => setTimeout(resolve, 200));
				setShowReceiveAnimation(true);

				// Wait for bottle to reach center before showing UI (sync with 3s animation)
				await new Promise(resolve => setTimeout(resolve, 2800));
				setShowReceivedBottle(true);

				// Reset receive animation state shortly after
				setTimeout(() => setShowReceiveAnimation(false), 500);
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
		<div className="min-h-screen bg-background font-sans flex flex-col transition-colors">
			{/* Fixed Header */}
			<header className="h-12 flex items-center justify-between border-b border-border shrink-0 px-4">
				<ThemeToggle />
				<h1 className="text-xl font-serif font-light text-foreground tracking-wide">
					Riverbank
				</h1>
				<UserButton />
			</header>

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-lg">
					{/* Tagline */}
					<p className="text-muted-foreground text-sm text-center mb-8">
						Throw a thought, receive a thought
					</p>

					{/* Composition Area */}
					<motion.div
						className="rounded-lg mb-8"
						animate={{
							opacity: showThrowAnimation ? 0.4 : 1,
							y: showThrowAnimation ? -10 : 0,
							scale: showThrowAnimation ? 0.98 : 1,
						}}
						transition={{
							duration: 0.8,
							ease: [0.25, 0.1, 0.25, 1],
						}}
					>
						<div className="p-2 border-[1px] rounded-t-xl">
							<Textarea
								placeholder="Write your message..."
								value={message}
								onChange={(e) => setMessage(e.target.value.slice(0, 256))}
								disabled={loading}
								className="font-serif text-foreground bg-background dark:bg-background border-0 shadow-none resize-none min-h-[120px]"
							/>
							
							<div className="flex justify-end items-center text-xs text-muted-foreground mt-2">
							<span className={charsRemaining < 30 ? "text-red-600" : ""}>
								{message.length} / {charsRemaining}
							</span>
							</div>
						</div>
						
						<div className={"border-[1px] border-t-0 rounded-b-xl h-20 flex flex-col"}>
							
							<div className="flex">
								<Input
									type="text"
									placeholder="Nickname (optional)"
									value={nickname}
									onChange={(e) => setNickname(e.target.value.slice(0, 30))}
									disabled={loading}
									className="flex-1 rounded-none text-sm shadow-none border-0 border-b-[1px] border-r-[1px] bg-background border-border text-foreground placeholder:text-muted-foreground"
								/>
								<Select value={country} onValueChange={setCountry} disabled={loading}>
									<SelectTrigger className="flex-1 rounded-none border-0 border-b-[1px] text-sm shadow-none bg-background border-border text-foreground">
										<SelectValue placeholder="Country (optional)" />
									</SelectTrigger>
									<SelectContent>
										{COUNTRIES.filter(c => c).map(c => (
											<SelectItem key={c} value={c}>{c}</SelectItem>
										))}
									</SelectContent>
								</Select>
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
								variant={"outline"}
								disabled={loading || !message.trim()}
								className="transition-all flex-1 rounded-xl rounded-t-none"
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
					</motion.div>

					{/* Received Bottle */}
					<AnimatePresence>
						{showReceivedBottle && receivedBottle && (
							<motion.div
								key="received-bottle"
								className="bg-muted rounded-lg p-6 border-[1px]"
								initial={{ opacity: 0, y: 40, scale: 0.96 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -30, scale: 0.96 }}
								transition={{
									duration: 1.2,
									ease: [0.22, 1, 0.36, 1],
									opacity: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
								}}
							>
								<div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex justify-between items-center">
									<span>A bottle washed ashore</span>
									<span>#{receivedBottle.id_asc}</span>
								</div>

								<p className="font-serif text-xl text-foreground leading-relaxed mb-4">
									<WavyText text={receivedBottle.message} />
								</p>

								<div className="flex justify-between items-center">
									<span className="text-sm text-muted-foreground italic">
										{formatSender(receivedBottle)}
									</span>

									{!reportSuccess ? (
										<button
											onClick={reportBottle}
											className="text-muted-foreground hover:text-red-600 transition-colors p-2"
											title="Report inappropriate content"
										>
											<Flag className="w-4 h-4" />
										</button>
									) : (
										<span className="text-xs text-muted-foreground">Reported</span>
									)}
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Empty pool state */}
					{receivedBottle === null && !loading && message === "" && (
						<div className="text-center text-muted-foreground text-sm">
							<p className="mb-2">No bottles in the river yet.</p>
							<p>Be the first to cast your thoughts into the current.</p>
						</div>
					)}
				</div>
			</main>

			{/* River Visualization with Footer */}
			<div className="relative shrink-0">
				<River isSending={showThrowAnimation} isReceiving={showReceiveAnimation} />

				{/* Footer overlaid on river */}
				<footer className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-transparent">
					<div className="flex items-center gap-4 text-background text-xs">
						<span>&copy; {new Date().getFullYear()} Riverbank</span>
						<span className="opacity-60">|</span>
						<a href="/terms" className="hover:opacity-80 transition-opacity">Terms</a>
						<a href="/privacy" className="hover:opacity-80 transition-opacity">Privacy</a>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;
