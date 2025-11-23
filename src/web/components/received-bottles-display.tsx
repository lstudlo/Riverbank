import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	type CarouselApi,
} from "@/components/ui/carousel";
import { ChevronUpIcon, ChevronDownIcon } from "raster-react";
import { BottleCard } from "@/components/bottle-card";

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
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();

	return (
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
						className="relative z-10"
					>
						{receivedBottles.map((bottle) => (
							<BottleCard
								key={bottle.id}
								bottle={bottle}
								likedBottles={likedBottles}
								reportedBottles={reportedBottles}
								onLike={onLike}
								onReport={onReport}
								wavyTextDelay={0}
								className="bg-muted rounded-none p-4 border-4 border-primary shadow-[6px_6px_0px_0px_oklch(50%_0_0)] dark:shadow-[6px_6px_0px_0px_oklch(75%_0_0)]"
							/>
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
						className="relative z-10"
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
											initial={{ opacity: 0, scale: 0.96 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{
												duration: 0.8,
												delay: index * 0.15,
												ease: [0.22, 1, 0.36, 1],
											}}
										>
											<BottleCard
												bottle={bottle}
												likedBottles={likedBottles}
												reportedBottles={reportedBottles}
												onLike={onLike}
												onReport={onReport}
												wavyTextDelay={index * 0.1}
												className="border-2 border-primary rounded-none p-4 font-bold shadow-[6px_6px_0px_0px_oklch(0%_0_0)] dark:shadow-[6px_6px_0px_0px_oklch(100%_0_0)]"
											/>
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
								className=""
							>
								<ChevronUpIcon size={16} className="size-4" />
								<span className="sr-only">Previous bottle</span>
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={() => carouselApi?.scrollNext()}
								disabled={!carouselApi?.canScrollNext()}
								className=""
							>
								<ChevronDownIcon size={16} className="size-4" />
								<span className="sr-only">Next bottle</span>
							</Button>
						</div>
					</motion.div>
				)
			)}
		</AnimatePresence>
	);
}
