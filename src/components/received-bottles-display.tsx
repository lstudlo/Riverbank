import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronUpIcon, ChevronDownIcon } from "raster-react";
import { BottleCard } from "@/components/bottle-card";
import { cn } from "@/lib/utils";

interface ReceivedBottle {
	id: string;
	id_asc: number;
	message: string;
	nickname: string | null;
	country: string | null;
	like_count: number;
	report_count: number;
}

interface ReceivedBottlesDisplayProps {
	receivedBottles: ReceivedBottle[];
	showReceivedBottle: boolean;
	likedBottles: Set<string>;
	reportedBottles: Set<string>;
	onLike: (bottleId: string) => void;
	onReport: (bottleId: string) => void;
}

export function ReceivedBottlesDisplay({
	receivedBottles,
	showReceivedBottle,
	likedBottles,
	reportedBottles,
	onLike,
	onReport,
}: ReceivedBottlesDisplayProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const totalBottles = receivedBottles.length;
	const isSingleBottle = totalBottles === 1;

	// Reset index when bottles change
	useEffect(() => {
		setCurrentIndex(0);
	}, [receivedBottles.length]);

	const goToPrevious = () => {
		if (currentIndex > 0) {
			setCurrentIndex(currentIndex - 1);
		}
	};

	const goToNext = () => {
		if (currentIndex < totalBottles - 1) {
			setCurrentIndex(currentIndex + 1);
		}
	};

	const goToIndex = (index: number) => {
		setCurrentIndex(index);
	};

	const canScrollPrev = currentIndex > 0;
	const canScrollNext = currentIndex < totalBottles - 1;

	return (
		<AnimatePresence>
			{showReceivedBottle && receivedBottles.length > 0 && (
				<motion.div
					key="received-bottles-container"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -30 }}
					transition={{
						duration: 1.2,
						ease: [0.22, 1, 0.36, 1],
					}}
					className="relative z-10 flex items-start gap-3 max-w-full"
				>
					{/* Main box frame with clipped content */}
					<div className="relative flex-1 bg-muted border-4 border-primary rounded-none shadow-[6px_6px_0px_0px_oklch(50%_0_0)] dark:shadow-[6px_6px_0px_0px_oklch(75%_0_0)] overflow-hidden h-[200px]">
						<div className="relative w-full h-full overflow-y-auto">
							<AnimatePresence mode="wait" initial={false}>
								<motion.div
									key={receivedBottles[currentIndex]?.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{
										duration: 0.4,
										ease: [0.22, 1, 0.36, 1],
									}}
									className="p-4"
								>
									<BottleCard
										bottle={receivedBottles[currentIndex]}
										likedBottles={likedBottles}
										reportedBottles={reportedBottles}
										onLike={onLike}
										onReport={onReport}
										wavyTextDelay={0}
										className="border-0 shadow-none"
									/>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Navigation controls on the right side */}
					<div className="flex flex-col items-center justify-between gap-2 h-[200px] shrink-0">
						{/* Up chevron */}
						<Button
							variant="outline"
							size="icon"
							onClick={goToPrevious}
							disabled={!canScrollPrev || isSingleBottle}
							className={cn(
								"rounded-none border-2 border-primary h-8 w-8",
								(!canScrollPrev || isSingleBottle) && "opacity-30"
							)}
						>
							<ChevronUpIcon size={16} className="size-4" />
							<span className="sr-only">Previous bottle</span>
						</Button>

						{/* Dots navigation */}
						<div className="flex flex-col items-center justify-center gap-2 flex-1 py-2">
							{receivedBottles.map((_, index) => (
								<button
									key={index}
									onClick={() => goToIndex(index)}
									disabled={isSingleBottle}
									className={cn(
										"w-2 h-2 rounded-full transition-all duration-300",
										index === currentIndex
											? "bg-primary scale-125"
											: "bg-muted-foreground/30 hover:bg-muted-foreground/50",
										isSingleBottle && "opacity-30 cursor-default"
									)}
									aria-label={`Go to bottle ${index + 1}`}
								/>
							))}
						</div>

						{/* Down chevron */}
						<Button
							variant="outline"
							size="icon"
							onClick={goToNext}
							disabled={!canScrollNext || isSingleBottle}
							className={cn(
								"rounded-none border-2 border-primary h-8 w-8",
								(!canScrollNext || isSingleBottle) && "opacity-30"
							)}
						>
							<ChevronDownIcon size={16} className="size-4" />
							<span className="sr-only">Next bottle</span>
						</Button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
