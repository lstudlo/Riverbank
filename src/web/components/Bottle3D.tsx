import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

type BottleModelProps = {
	isSending: boolean;
	isReceiving: boolean;
};

function BottleModel({ isSending, isReceiving }: BottleModelProps) {
	const groupRef = useRef<THREE.Group>(null);
	const targetX = useRef(0);
	const currentX = useRef(0);

	// Determine target position based on state
	if (isSending) {
		targetX.current = 8; // Drift right and out
	} else if (isReceiving) {
		targetX.current = 0; // Come to center
		currentX.current = -8; // Start from left
	} else {
		targetX.current = 0;
	}

	useFrame((_, delta) => {
		if (!groupRef.current) return;

		// Smooth lerp to target position
		currentX.current = THREE.MathUtils.lerp(
			currentX.current,
			targetX.current,
			delta * 2
		);
		groupRef.current.position.x = currentX.current;
	});

	return (
		<Float
			speed={2}
			rotationIntensity={0.3}
			floatIntensity={0.5}
			floatingRange={[-0.1, 0.1]}
		>
			<group ref={groupRef} rotation={[0, 0, Math.PI / 6]}>
				{/* Bottle body */}
				<mesh position={[0, 0, 0]}>
					<cylinderGeometry args={[0.15, 0.2, 0.6, 16]} />
					<meshStandardMaterial
						color="#2d5a27"
						transparent
						opacity={0.8}
						roughness={0.2}
						metalness={0.1}
					/>
				</mesh>

				{/* Bottle neck */}
				<mesh position={[0, 0.4, 0]}>
					<cylinderGeometry args={[0.06, 0.1, 0.25, 12]} />
					<meshStandardMaterial
						color="#2d5a27"
						transparent
						opacity={0.8}
						roughness={0.2}
						metalness={0.1}
					/>
				</mesh>

				{/* Cork */}
				<mesh position={[0, 0.58, 0]}>
					<cylinderGeometry args={[0.055, 0.055, 0.1, 8]} />
					<meshStandardMaterial color="#8b6914" roughness={0.9} />
				</mesh>

				{/* Paper inside (message) */}
				<mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.2]}>
					<boxGeometry args={[0.08, 0.3, 0.02]} />
					<meshStandardMaterial color="#f5f0e6" roughness={0.8} />
				</mesh>
			</group>
		</Float>
	);
}

type Bottle3DProps = {
	isSending: boolean;
	isReceiving: boolean;
};

export function Bottle3D({ isSending, isReceiving }: Bottle3DProps) {
	return (
		<Canvas
			camera={{ position: [0, 0, 5], fov: 30 }}
			style={{ background: "transparent" }}
			gl={{ alpha: true }}
		>
			<ambientLight intensity={0.6} />
			<directionalLight position={[5, 5, 5]} intensity={0.8} />
			<pointLight position={[-3, 2, 2]} intensity={0.4} color="#87ceeb" />

			<BottleModel isSending={isSending} isReceiving={isReceiving} />
		</Canvas>
	);
}
