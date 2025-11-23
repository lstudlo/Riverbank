import { WavyText } from "@/components/wavy-text";
import { BanIcon, HeartIcon } from "raster-react";

interface ReceivedBottle {
	id: string;
	id_asc: number;
	message: string;
	nickname: string | null;
	country: string | null;
	like_count: number;
	report_count: number;
}

interface BottleCardProps {
	bottle: ReceivedBottle;
	likedBottles: Set<string>;
	reportedBottles: Set<string>;
	onLike: (bottleId: string) => void;
	onReport: (bottleId: string) => void;
	wavyTextDelay?: number;
	className?: string;
}

export function BottleCard({
	bottle,
	likedBottles,
	reportedBottles,
	onLike,
	onReport,
	wavyTextDelay = 0,
	className = "",
}: BottleCardProps) {
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
				<button
					onClick={() => onLike(bottle.id)}
					disabled={likedBottles.has(bottle.id)}
					className={`flex items-center gap-1 transition-colors p-1 ${likedBottles.has(bottle.id) ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
					title="Like this message"
				>
					<HeartIcon size={16} className={`size-4 ${likedBottles.has(bottle.id) ? 'fill-current' : ''}`} />
					{bottle.like_count > 0 && (
						<span className="text-xs">{bottle.like_count}</span>
					)}
				</button>

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
