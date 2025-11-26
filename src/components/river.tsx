import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { Bottle2D } from "./bottle-2d";

type RiverProps = {
	isSending: boolean;
	isReceiving: boolean;
};

export function River({ isSending, isReceiving }: RiverProps) {
	// Motion values for jagged wave animation
	const waveOffset1 = useMotionValue(0);
	const waveOffset2 = useMotionValue(0);
	const waveOffset3 = useMotionValue(0);

	// Helper function to create triangular/jagged wave pattern
	const createJaggedWave = (
		offset: number,
		baseY: number,
		amplitude: number,
		wavelength: number,
		segmentWidth: number
	) => {
		const points: string[] = [];
		const width = 1200;
		const segments = Math.ceil(width / segmentWidth);

		// Create a continuous triangular wave function
		const triangleWave = (x: number) => {
			const normalized = ((x - offset * 50) / wavelength) % 1;
			const wrapped = normalized < 0 ? normalized + 1 : normalized;

			// Triangular wave: goes 0 -> 1 -> 0
			if (wrapped < 0.5) {
				return wrapped * 2; // 0 to 1
			} else {
				return 2 - wrapped * 2; // 1 to 0
			}
		};

		for (let i = 0; i <= segments; i++) {
			const x = i * segmentWidth;
			const waveValue = triangleWave(x);
			const y = baseY + (waveValue - 0.5) * 2 * amplitude;

			points.push(`${Math.min(x, width)},${y}`);
		}

		// Create path with straight lines (jagged)
		const pathData = points.map((point, i) =>
			i === 0 ? `M${point}` : `L${point}`
		).join(' ');

		return {
			fill: `${pathData} L1200,144 L0,144 Z`,
			stroke: pathData
		};
	};

	// Helper to create just the top outline path for stroke
	const createWaveOutline = (
		offset: number,
		baseY: number,
		amplitude: number,
		wavelength: number,
		segmentWidth: number
	) => {
		const points: string[] = [];
		const width = 1200;
		const segments = Math.ceil(width / segmentWidth);

		const triangleWave = (x: number) => {
			const normalized = ((x - offset * 50) / wavelength) % 1;
			const wrapped = normalized < 0 ? normalized + 1 : normalized;
			if (wrapped < 0.5) {
				return wrapped * 2;
			} else {
				return 2 - wrapped * 2;
			}
		};

		for (let i = 0; i <= segments; i++) {
			const x = i * segmentWidth;
			const waveValue = triangleWave(x);
			const y = baseY + (waveValue - 0.5) * 2 * amplitude;
			points.push(`${Math.min(x, width)},${y}`);
		}

		return points.map((point, i) =>
			i === 0 ? `M${point}` : `L${point}`
		).join(' ');
	};

	// Transform motion values into jagged wave path data
	const wavePath1 = useTransform(waveOffset1, (offset) =>
		createJaggedWave(offset, 48, 12, 300, 100).fill
	);

	const wavePath2 = useTransform(waveOffset2, (offset) =>
		createJaggedWave(offset, 56, 8, 250, 80).fill
	);

	const wavePath3 = useTransform(waveOffset3, (offset) =>
		createJaggedWave(offset, 64, 6, 350, 120).fill
	);

	// Create stroke paths (just the top outline)
	const waveStroke1 = useTransform(waveOffset1, (offset) =>
		createWaveOutline(offset, 48, 12, 300, 100)
	);

	const waveStroke2 = useTransform(waveOffset2, (offset) =>
		createWaveOutline(offset, 56, 8, 250, 80)
	);

	const waveStroke3 = useTransform(waveOffset3, (offset) =>
		createWaveOutline(offset, 64, 6, 350, 120)
	);

	// Animate waves continuously with different speeds
	// Each wave animates through exactly one wavelength cycle for seamless looping
	useEffect(() => {
		const anim1 = animate(waveOffset1, [0, 300 / 50], {
			duration: 4,
			repeat: Infinity,
			ease: "linear",
		});

		const anim2 = animate(waveOffset2, [0, 250 / 50], {
			duration: 6,
			repeat: Infinity,
			ease: "linear",
		});

		const anim3 = animate(waveOffset3, [0, 350 / 50], {
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
		<div className="relative w-full h-56 overflow-hidden">
			{/* Back wave layer (behind bottle) */}
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 1200 144"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
						<stop offset="40%" stopColor="#3b82f6" stopOpacity="0.3" />
						<stop offset="100%" stopColor="#2563eb" stopOpacity="0.5" />
					</linearGradient>
				</defs>
				{/* Back wave - behind the bottle */}
				<motion.path d={wavePath1} fill="url(#riverGradient)" />
				{/* Back wave outline/border */}
				<motion.path
					d={waveStroke1}
					fill="none"
					stroke="#1e40af"
					strokeWidth="2"
					strokeOpacity="0.5"
				/>
			</svg>

			{/* 2D Floating bottle - in the middle layer */}
			<div className="absolute inset-0 pointer-events-none">
				<Bottle2D isSending={isSending} isReceiving={isReceiving} />
			</div>

			{/* Front wave layers (in front of bottle) */}
			<svg
				className="absolute inset-0 w-full h-full pointer-events-none"
				viewBox="0 0 1200 144"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="riverGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#60a5fa" stopOpacity="0.6" />
						<stop offset="100%" stopColor="#2563eb" stopOpacity="0.75" />
					</linearGradient>
				</defs>
				{/* Middle wave - slightly in front */}
				<motion.path d={wavePath2} fill="url(#riverGradient2)" opacity={0.75} />
				{/* Middle wave outline/border */}
				<motion.path
					d={waveStroke2}
					fill="none"
					stroke="#1e40af"
					strokeWidth="2"
					strokeOpacity="0.6"
				/>
				{/* Front wave - most in front */}
				<motion.path d={wavePath3} fill="url(#riverGradient)" opacity={1} />
				{/* Front wave outline/border */}
				<motion.path
					d={waveStroke3}
					fill="none"
					stroke="#1e40af"
					strokeWidth="2.5"
					strokeOpacity="0.7"
				/>
			</svg>
		</div>
	);
}
