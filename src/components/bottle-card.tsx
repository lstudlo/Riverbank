import { useState, useRef, useEffect } from "react";
import { WavyText } from "@/components/wavy-text";
import { BanIcon } from "raster-react";

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
	const pickerRef = useRef<HTMLDivElement>(null);

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

	// Get reactions sorted by count
	const sortedReactions = Object.entries(reactions)
		.filter(([_, count]) => count > 0)
		.sort(([, a], [, b]) => b - a);

	// Close picker when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
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

			{/* Reaction capsules - Discord style */}
			<div className="flex flex-wrap items-center gap-1.5 mb-3">
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
				<div className="relative" ref={pickerRef}>
					<button
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						className="inline-flex items-center justify-center size-7 rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all"
						title="Add reaction"
					>
						<span className="text-sm">+</span>
					</button>
					{showEmojiPicker && (
						<div className="absolute left-0 bottom-full mb-2 z-50 bg-background border-2 border-primary rounded-md shadow-lg p-3 min-w-[240px]">
							<div className="grid grid-cols-5 gap-2">
								{AVAILABLE_EMOJIS.map((emoji) => (
									<button
										key={emoji}
										onClick={() => handleEmojiSelect(emoji)}
										className="text-2xl hover:bg-muted p-2 rounded-md transition-all hover:scale-110"
										title={`React with ${emoji}`}
									>
										{emoji}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-end">
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
		</article>
	);
}
