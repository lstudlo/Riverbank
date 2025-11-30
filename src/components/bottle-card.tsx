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
	reactedBottles: Map<string, string>;
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

	const hasReacted = reactedBottles.has(bottle.id);
	const userReaction = reactedBottles.get(bottle.id);

	const handleEmojiSelect = (emoji: string) => {
		onReact(bottle.id, emoji);
		setShowEmojiPicker(false);
	};

	// Get total reactions count
	const totalReactions = Object.values(reactions).reduce((sum, count) => sum + count, 0);

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

			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					{!hasReacted ? (
						<div className="relative" ref={pickerRef}>
							<button
								onClick={() => setShowEmojiPicker(!showEmojiPicker)}
								className="flex items-center gap-1 transition-colors p-1 text-muted-foreground hover:text-primary"
								title="React with emoji"
							>
								<span className="text-sm">😊</span>
								{totalReactions > 0 && (
									<span className="text-xs">{totalReactions}</span>
								)}
							</button>
							{showEmojiPicker && (
								<div className="absolute left-0 bottom-full mb-1 z-50 bg-background border-2 border-primary rounded-sm shadow-md p-2">
									<div className="grid grid-cols-5 gap-1">
										{AVAILABLE_EMOJIS.map((emoji) => (
											<button
												key={emoji}
												onClick={() => handleEmojiSelect(emoji)}
												className="text-lg hover:bg-muted p-1 rounded transition-colors"
												title={`React with ${emoji}`}
											>
												{emoji}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="flex items-center gap-1 p-1 text-primary">
							<span className="text-sm">{userReaction}</span>
							{totalReactions > 0 && (
								<span className="text-xs">{totalReactions}</span>
							)}
						</div>
					)}
				</div>

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
