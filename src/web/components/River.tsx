import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { Bottle3D } from "./Bottle3D";

type RiverProps = {
	isSending: boolean;
	isReceiving: boolean;
};

export function River({ isSending, isReceiving }: RiverProps) {
	// Motion values for organic wave animation
	const waveOffset1 = useMotionValue(0);
	const waveOffset2 = useMotionValue(0);
	const waveOffset3 = useMotionValue(0);

	// Transform motion values into wave path data
	const wavePath1 = useTransform(waveOffset1, (offset) => {
		const amp = 12;
		const y1 = 48 + Math.sin(offset) * amp;
		const y2 = 48 + Math.sin(offset + 1) * amp;
		const y3 = 48 + Math.sin(offset + 2) * amp;
		return `M0,${y1} Q150,${y2 - 15} 300,${y1} T600,${y2} T900,${y3} T1200,${y1} L1200,96 L0,96 Z`;
	});

	const wavePath2 = useTransform(waveOffset2, (offset) => {
		const amp = 8;
		const y1 = 56 + Math.sin(offset) * amp;
		const y2 = 56 + Math.sin(offset + 1.5) * amp;
		const y3 = 56 + Math.sin(offset + 3) * amp;
		return `M0,${y1} Q150,${y2 - 10} 300,${y1} T600,${y2} T900,${y3} T1200,${y1} L1200,96 L0,96 Z`;
	});

	const wavePath3 = useTransform(waveOffset3, (offset) => {
		const amp = 6;
		const y1 = 64 + Math.sin(offset) * amp;
		const y2 = 64 + Math.sin(offset + 2) * amp;
		return `M0,${y1} Q200,${y2 - 5} 400,${y1} T800,${y2} T1200,${y1} L1200,96 L0,96 Z`;
	});

	// Animate waves continuously with different speeds
	useEffect(() => {
		const anim1 = animate(waveOffset1, [0, Math.PI * 2], {
			duration: 4,
			repeat: Infinity,
			ease: "linear",
		});

		const anim2 = animate(waveOffset2, [0, Math.PI * 2], {
			duration: 6,
			repeat: Infinity,
			ease: "linear",
		});

		const anim3 = animate(waveOffset3, [0, Math.PI * 2], {
			duration: 8,
			repeat: Infinity,
			ease: "linear",
		});

		return () => {
			anim1.stop();
			anim2.stop();
			anim3.stop();
		};
	}, [waveOffset1, waveOffset2, waveOffset3]);

	return (
		<div className="relative w-full h-24 overflow-hidden">
			{/* River SVG - animated wave patterns */}
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 1200 96"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.05" />
						<stop offset="50%" stopColor="#525252" stopOpacity="0.2" />
						<stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.4" />
					</linearGradient>
					<linearGradient
						id="riverGradient2"
						x1="0%"
						y1="0%"
						x2="0%"
						y2="100%"
					>
						<stop offset="0%" stopColor="#3a3a3a" stopOpacity="0.1" />
						<stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.3" />
					</linearGradient>
				</defs>

				{/* Multiple wave layers for depth */}
				<motion.path d={wavePath1} fill="url(#riverGradient)" />
				<motion.path d={wavePath2} fill="url(#riverGradient2)" opacity={0.6} />
				<motion.path d={wavePath3} fill="url(#riverGradient)" opacity={0.4} />
			</svg>

			{/* 3D Floating bottle */}
			<div className="absolute inset-0 pointer-events-none">
				<Bottle3D isSending={isSending} isReceiving={isReceiving} />
			</div>
		</div>
	);
}
