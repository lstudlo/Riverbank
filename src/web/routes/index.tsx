import { createFileRoute } from '@tanstack/react-router'
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
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { River } from "@/components/river";
import { WavyText } from "@/components/wavy-text";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Flag, Send, Heart, ChevronUp, ChevronDown } from "lucide-react";
import countriesData from "@/lib/data/countries.json";
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
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [showGuidelines, setShowGuidelines] = useState(false);

	const charsRemaining = 300 - message.length;
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
			<Header />

			{/* Main Content */}
			<main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-lg">
					{/* Tagline */}
					<p className="text-foreground text-xs text-center mb-6">
						Bottle a thought. Let it drift.
					</p>

					{/* Composition Area */}
					<motion.div
						className="rounded-lg mb-6"
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
								onChange={(e) => setMessage(e.target.value.slice(0, 300))}
								onFocus={() => {
									if (!hasAcceptedGuidelines) {
										setShowGuidelines(true);
									}
								}}
								disabled={loading}
								className="font-serif text-foreground bg-background dark:bg-background border-0 shadow-none resize-none min-h-[120px]"
							/>

							<div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
								<span className="text-muted-foreground">
									{message.trim().length < minChars && message.trim().length > 0 && (
										<span className="text-amber-600">Min {minChars} chars</span>
									)}
									{message.trim().length >= 151 && <span className="text-green-600">3 bottles</span>}
									{message.trim().length >= 61 && message.trim().length < 151 && <span className="text-blue-600">2 bottles</span>}
									{message.trim().length >= minChars && message.trim().length < 61 && <span>1 bottle</span>}
								</span>
								<span className={charsRemaining < 30 ? "text-red-600" : ""}>
									{message.length} / 300
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
										<SelectValue placeholder="Country / Region (optional)" />
									</SelectTrigger>
									<SelectContent>
										{countriesData.map(c => (
											<SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>
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
								disabled={loading || !canSubmit}
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

					{/* Received Bottles */}
					<AnimatePresence>
						{showReceivedBottle && receivedBottles.length > 0 && (
							receivedBottles.length === 1 ? (
								// Single bottle - show without carousel
								<motion.div
									key="received-bottle-single"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{
										duration: 1.2,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									{receivedBottles.map((bottle) => (
										<div
											key={bottle.id}
											className="bg-muted rounded-lg p-4 border-[1px]"
										>
											<div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex justify-between items-center">
												<span>Bottle #{bottle.id_asc}</span>
											</div>

											<p className="font-serif text-lg text-foreground leading-relaxed mb-3">
												<WavyText text={bottle.message} delay={0} />
											</p>

											<div className="text-sm text-muted-foreground italic mb-3">
												{formatSender(bottle)}
											</div>

											<div className="flex justify-between items-center">
												<button
													onClick={() => likeBottle(bottle.id)}
													disabled={likedBottles.has(bottle.id)}
													className={`flex items-center gap-1 transition-colors p-1 ${likedBottles.has(bottle.id) ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
													title="Like this message"
												>
													<Heart className={`w-4 h-4 ${likedBottles.has(bottle.id) ? 'fill-current' : ''}`} />
													{bottle.like_count > 0 && (
														<span className="text-xs">{bottle.like_count}</span>
													)}
												</button>

												{!reportedBottles.has(bottle.id) ? (
													<button
														onClick={() => reportBottle(bottle.id)}
														className="text-muted-foreground hover:text-red-600 transition-colors p-1"
														title="Report inappropriate content"
													>
														<Flag className="w-4 h-4" />
													</button>
												) : (
													<span className="text-xs text-muted-foreground">Reported</span>
												)}
											</div>
										</div>
									))}
								</motion.div>
							) : (
								// Multiple bottles - use carousel
								<motion.div
									key="received-bottles-carousel"
									initial={{ opacity: 0, y: 40 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -30 }}
									transition={{
										duration: 1.2,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									<Carousel
										orientation="vertical"
										opts={{
											align: "start",
											loop: false,
										}}
										setApi={setCarouselApi}
										className="w-full"
									>
										<CarouselContent className="-mt-1 h-[280px]">
											{receivedBottles.map((bottle, index) => (
												<CarouselItem key={bottle.id} className="pt-1">
													<motion.div
														className="bg-muted rounded-lg p-4 border-[1px]"
														initial={{ opacity: 0, scale: 0.96 }}
														animate={{ opacity: 1, scale: 1 }}
														transition={{
															duration: 0.8,
															delay: index * 0.15,
															ease: [0.22, 1, 0.36, 1],
														}}
													>
														<div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex justify-between items-center">
															<span>Bottle #{bottle.id_asc}</span>
														</div>

														<p className="font-serif text-lg text-foreground leading-relaxed mb-3">
															<WavyText text={bottle.message} delay={index * 0.1} />
														</p>

														<div className="text-sm text-muted-foreground italic mb-3">
															{formatSender(bottle)}
														</div>

														<div className="flex justify-between items-center">
															<button
																onClick={() => likeBottle(bottle.id)}
																disabled={likedBottles.has(bottle.id)}
																className={`flex items-center gap-1 transition-colors p-1 ${likedBottles.has(bottle.id) ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
																title="Like this message"
															>
																<Heart className={`w-4 h-4 ${likedBottles.has(bottle.id) ? 'fill-current' : ''}`} />
																{bottle.like_count > 0 && (
																	<span className="text-xs">{bottle.like_count}</span>
																)}
															</button>

															{!reportedBottles.has(bottle.id) ? (
																<button
																	onClick={() => reportBottle(bottle.id)}
																	className="text-muted-foreground hover:text-red-600 transition-colors p-1"
																	title="Report inappropriate content"
																>
																	<Flag className="w-4 h-4" />
																</button>
															) : (
																<span className="text-xs text-muted-foreground">Reported</span>
															)}
														</div>
													</motion.div>
												</CarouselItem>
											))}
										</CarouselContent>
									</Carousel>
									{/* Custom navigation buttons at bottom */}
									<div className="flex justify-center items-center gap-4 mt-4">
										<Button
											variant="outline"
											size="icon"
											onClick={() => carouselApi?.scrollPrev()}
											disabled={!carouselApi?.canScrollPrev()}
											className="rounded-full"
										>
											<ChevronUp className="h-4 w-4" />
											<span className="sr-only">Previous bottle</span>
										</Button>
										<Button
											variant="outline"
											size="icon"
											onClick={() => carouselApi?.scrollNext()}
											disabled={!carouselApi?.canScrollNext()}
											className="rounded-full"
										>
											<ChevronDown className="h-4 w-4" />
											<span className="sr-only">Next bottle</span>
										</Button>
									</div>
								</motion.div>
							)
						)}
					</AnimatePresence>

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

			{/* River Visualization with Footer */}
			<div className="relative shrink-0">
				<River isSending={showThrowAnimation} isReceiving={showReceiveAnimation} />

				<Footer />
			</div>

			{/* Community Guidelines Dialog */}
			<AlertDialog open={showGuidelines} onOpenChange={setShowGuidelines}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className='text-center'>Community Guidelines</AlertDialogTitle>
						<AlertDialogDescription className="space-y-3 text-left">
							<p className={"mb-6 text-center px-4"}>
								<a href="/" className="underline hover:text-foreground text-primary p-0.5 transition-colors">Riverbank</a> is a quiet place where unspoken thoughts drift between strangers, connected by flows of the river,
							</p>
							<p className="font-medium text-primary text-center">We promote:</p>
							<ul className="list-disc list-inside space-y-1 ml-2 text-center">
								<li>Kindness and empathy</li>
								<li>Thoughtful reflections and genuine connections</li>
								<li>Respectful and constructive communication</li>
								<li>Cultural understanding and openness</li>
							</ul>
							<p className="font-medium text-red-400 text-center">We do not tolerate:</p>
							<ul className="list-disc list-inside space-y-1 ml-2 text-center">
								<li>Hate speech, harassment, or discrimination</li>
								<li>Scams, spam, or fraudulent content</li>
								<li>Personal attacks or threats</li>
								<li>Explicit or inappropriate content</li>
							</ul>
							<p className="flex justify-center text-xs text-primary mt-8">
								By continuing, you agree to our{"  "}
								<a href="/terms" className="underline hover:text-foreground text-red-400 px-1.5 transition-colors">Terms of Service</a>
								and
								<a href="/privacy" className="underline hover:text-foreground text-red-400 px-1.5 transition-colors">Privacy Policy</a>
							</p>
						</AlertDialogDescription>
					</AlertDialogHeader>
          <AlertDialogAction
							className=''
							onClick={() => {
								acceptGuidelines();
								setShowGuidelines(false);
							}}
						>
							Accept
						</AlertDialogAction>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default App;
