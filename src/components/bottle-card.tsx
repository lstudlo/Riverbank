import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { WavyText } from "@/components/wavy-text";
import { BanIcon, SmileIcon } from "raster-react";

interface ReceivedBottle {
	id: string;
	id_asc: number;
	message: string;
	nickname: string | null;
	country: string | null;
	emoji_reactions: string;
	report_count: number;
}

interface BottleCardProps {
	bottle: ReceivedBottle;
	reactedBottles: Map<string, Set<string>>; // bottleId -> Set of emojis user reacted with
	reportedBottles: Set<string>;
	onReact: (bottleId: string, emoji: string) => void;
	onReport: (bottleId: string) => void;
	wavyTextDelay?: number;
	className?: string;
}

// Available emojis for reactions
const AVAILABLE_EMOJIS = ["❤️", "👍", "😊", "🎉", "😮", "😢", "😂", "🔥", "👏", "🙌"];

export function BottleCard({
	bottle,
	reactedBottles,
	reportedBottles,
	onReact,
	onReport,
	wavyTextDelay = 0,
	className = "",
}: BottleCardProps) {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
	const pickerRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);

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

	// Parse emoji reactions
	let reactions: Record<string, number> = {};
	try {
		reactions = JSON.parse(bottle.emoji_reactions);
	} catch (e) {
		reactions = {};
	}

	const userReactions = reactedBottles.get(bottle.id) || new Set<string>();

	const handleEmojiSelect = (emoji: string) => {
		onReact(bottle.id, emoji);
		setShowEmojiPicker(false);
	};

	const handleReactionClick = (emoji: string) => {
		onReact(bottle.id, emoji);
	};

	const toggleEmojiPicker = () => {
		if (!showEmojiPicker && buttonRef.current) {
			const rect = buttonRef.current.getBoundingClientRect();
			setPickerPosition({
				top: rect.top - 8, // Position above button with spacing
				left: rect.left,
			});
		}
		setShowEmojiPicker(!showEmojiPicker);
	};

	// Get reactions sorted by count
	const sortedReactions = Object.entries(reactions)
		.filter(([_, count]) => count > 0)
		.sort(([, a], [, b]) => b - a);

	// Close picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				pickerRef.current &&
				!pickerRef.current.contains(event.target as Node) &&
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node)
			) {
				setShowEmojiPicker(false);
			}
		};

		if (showEmojiPicker) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showEmojiPicker]);

	return (
		<article
			className={className}
			aria-label={`Message in bottle number ${bottle.id_asc}`}
		>
			<div className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex justify-between items-center">
				<span>Bottle #{bottle.id_asc}</span>
			</div>

			<p className="font-serif text-lg text-foreground leading-relaxed mb-3">
				<WavyText text={bottle.message} delay={wavyTextDelay} />
			</p>

			<footer className="text-sm text-muted-foreground italic mb-3">
				{formatSender(bottle)}
			</footer>

			<div className="flex justify-end mb-3">
				{!reportedBottles.has(bottle.id) ? (
					<button
						onClick={() => onReport(bottle.id)}
						className="text-muted-foreground hover:text-red-600 transition-colors p-1"
						title="Report inappropriate content"
					>
						<BanIcon size={16} className="size-4" />
					</button>
				) : (
					<span className="text-xs text-muted-foreground">Reported</span>
				)}
			</div>

			{/* Reaction capsules - Discord style */}
			<div className="flex flex-wrap items-center gap-1.5">
				{sortedReactions.map(([emoji, count]) => (
					<button
						key={emoji}
						onClick={() => handleReactionClick(emoji)}
						className={`
							inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-sm
							border-2 transition-all
							${
								userReactions.has(emoji)
									? "border-primary bg-primary/10 text-primary"
									: "border-border bg-background text-muted-foreground hover:border-primary/50"
							}
						`}
						title={
							userReactions.has(emoji)
								? `Remove ${emoji} reaction`
								: `React with ${emoji}`
						}
					>
						<span>{emoji}</span>
						<span className="text-xs font-medium">{count}</span>
					</button>
				))}

				{/* Add reaction button with picker */}
				<button
					ref={buttonRef}
					onClick={toggleEmojiPicker}
					className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
					title="Add reaction"
				>
					<SmileIcon size={14} className="opacity-40" />
					<span className="text-sm">+</span>
				</button>
				{showEmojiPicker &&
					createPortal(
						<div
							ref={pickerRef}
							className="fixed z-[9999] bg-muted border-4 border-primary rounded-none shadow-[8px_8px_0px_0px_oklch(50%_0_0)] dark:shadow-[8px_8px_0px_0px_oklch(75%_0_0)] p-4"
							style={{
								top: `${pickerPosition.top}px`,
								left: `${pickerPosition.left}px`,
								transform: "translateY(-100%)",
							}}
						>
							<div className="text-xs text-primary uppercase tracking-wider font-bold mb-3 border-b-2 border-primary pb-2">
								Pick a Reaction
							</div>
							<div className="grid grid-cols-5 gap-2">
								{AVAILABLE_EMOJIS.map((emoji) => (
									<button
										key={emoji}
										onClick={() => handleEmojiSelect(emoji)}
										className="text-2xl hover:bg-background p-2 rounded-none transition-all hover:scale-110 border-2 border-transparent hover:border-primary"
										title={`React with ${emoji}`}
									>
										{emoji}
									</button>
								))}
							</div>
						</div>,
						document.body
					)}
			</div>
		</article>
	);
}
