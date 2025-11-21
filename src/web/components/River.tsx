import { Wine } from "lucide-react";

type RiverProps = {
	isSending: boolean;
	isReceiving: boolean;
};

export function River({ isSending, isReceiving }: RiverProps) {
	const getBottleClass = () => {
		if (isSending) return "animate-bottle-drift-out";
		if (isReceiving) return "animate-bottle-drift-in";
		return "bottle-center";
	};

	return (
		<div className="relative w-full h-24 overflow-hidden">
			{/* River SVG - sine wave pattern */}
			<svg
				className="absolute inset-0 w-full h-full"
				viewBox="0 0 1200 96"
				preserveAspectRatio="none"
			>
				<defs>
					<linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
						<stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.1" />
						<stop offset="50%" stopColor="#525252" stopOpacity="0.3" />
						<stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.5" />
					</linearGradient>
				</defs>

				{/* Animated wave paths */}
				<path
					className="animate-wave"
					d="M0,48 Q150,20 300,48 T600,48 T900,48 T1200,48 L1200,96 L0,96 Z"
					fill="url(#riverGradient)"
				/>
				<path
					className="animate-wave-slow"
					d="M0,56 Q150,36 300,56 T600,56 T900,56 T1200,56 L1200,96 L0,96 Z"
					fill="url(#riverGradient)"
					opacity="0.5"
				/>
			</svg>

			{/* Floating bottle */}
			<div
				className={`absolute top-4 transition-all duration-1000 ease-in-out ${getBottleClass()}`}
			>
				<div className="animate-bottle-bob">
					<Wine
						className="w-8 h-8 text-vellum rotate-45 drop-shadow-lg"
						strokeWidth={1.5}
					/>
				</div>
			</div>
		</div>
	);
}
