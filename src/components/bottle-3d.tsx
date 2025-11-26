import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

type Bottle3DProps = {
  isSending: boolean;
  isReceiving: boolean;
};

export function Bottle3D({ isSending, isReceiving }: Bottle3DProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { viewport } = useThree();

  // Physics-based cursor interaction
  const cursorPositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });

  // Animation state
  const state = isSending ? "sending" : isReceiving ? "receiving" : "idle";

  // Spring animation for position based on state
  const [springs, api] = useSpring(() => ({
    position: [0, 0, 0] as [number, number, number],
    scale: 1,
    config: { tension: 120, friction: 20 }
  }));

  // Handle state transitions
  useEffect(() => {
    if (state === "sending") {
      // Move bottle to the right
      api.start({
        position: [viewport.width / 2 + 2, 0, 0],
        config: { duration: 3000 }
      });
    } else if (state === "receiving") {
      // Move bottle from left to center
      api.start({
        from: { position: [-viewport.width / 2 - 2, 0, 0] as [number, number, number] },
        to: { position: [0, 0, 0] as [number, number, number] },
        config: { duration: 3000 }
      });
    } else if (state === "idle") {
      // Return to center
      api.start({
        position: [0, 0, 0],
        config: { tension: 80, friction: 30 }
      });
    }
  }, [state, api, viewport.width]);

  // Handle cursor interaction
  useEffect(() => {
    if (!isHovered) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;

      cursorPositionRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  // Physics-based cursor repulsion animation
  useFrame((_, delta) => {
    if (!meshRef.current || state !== "idle") return;

    // Idle floating animation
    if (!isHovered) {
      const time = Date.now() * 0.001;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;

      // Smoothly reset velocity and target position
      velocityRef.current.x *= 0.95;
      velocityRef.current.y *= 0.95;
      targetPositionRef.current.x *= 0.95;
      targetPositionRef.current.y *= 0.95;

      return;
    }

    // Calculate vector from cursor to bottle
    const bottleWorldPos = meshRef.current.position;
    const cursorWorldX = cursorPositionRef.current.x * viewport.width / 2;
    const cursorWorldY = cursorPositionRef.current.y * viewport.height / 2;

    const deltaX = bottleWorldPos.x - cursorWorldX;
    const deltaY = bottleWorldPos.y - cursorWorldY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const maxRadius = 2.5;

    if (distance < maxRadius && distance > 0) {
      // Normalize direction
      const dirX = deltaX / distance;
      const dirY = deltaY / distance;

      // Calculate push force with smooth falloff
      const normalizedDistance = distance / maxRadius;
      const easing = 1 - Math.pow(normalizedDistance, 3);
      const forceMagnitude = easing * 0.8;

      // Apply force
      targetPositionRef.current.x = dirX * forceMagnitude;
      targetPositionRef.current.y = dirY * forceMagnitude;

      // Add velocity for smoother motion
      velocityRef.current.x += (targetPositionRef.current.x - meshRef.current.position.x) * delta * 5;
      velocityRef.current.y += (targetPositionRef.current.y - meshRef.current.position.y) * delta * 5;
    } else {
      // Return to center
      velocityRef.current.x += (0 - meshRef.current.position.x) * delta * 3;
      velocityRef.current.y += (0 - meshRef.current.position.y) * delta * 3;
    }

    // Apply damping
    velocityRef.current.x *= 0.9;
    velocityRef.current.y *= 0.9;

    // Update position
    meshRef.current.position.x += velocityRef.current.x * delta;
    meshRef.current.position.y += velocityRef.current.y * delta;
  });

  return (
    <animated.group
      ref={meshRef}
      position={springs.position as any}
      scale={springs.scale}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      {/* Cork */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.18, 0.3, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.4, 16]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.1}
          metalness={0}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.35, 0.35, 1.5, 32]} />
        <meshPhysicalMaterial
          color="#e0f7ff"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={1}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.5}
        />
      </mesh>

      {/* Paper inside bottle */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.8, 16]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} metalness={0} />
      </mesh>

      {/* Bottom rounded cap */}
      <mesh position={[0, -0.75, 0]} castShadow>
        <sphereGeometry args={[0.35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#e0f7ff"
          transparent
          opacity={0.2}
          roughness={0.05}
          metalness={0}
          transmission={0.95}
          thickness={1}
          envMapIntensity={1.5}
          clearcoat={1}
          clearcoatRoughness={0.05}
          ior={1.5}
        />
      </mesh>
    </animated.group>
  );
}
