import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Bottle3D } from "./bottle-3d";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type River3DProps = {
  isSending: boolean;
  isReceiving: boolean;
};

function AnimatedWaterPlane({ yPosition, zPosition, color, opacity, speed }: {
  yPosition: number;
  zPosition: number;
  color: string;
  opacity: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime() * speed;
    }
  });

  // Custom shader for animated waves
  const vertexShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Create wave effect
      float wave1 = sin(pos.x * 0.5 + time) * 0.3;
      float wave2 = sin(pos.x * 0.3 - time * 0.7) * 0.2;
      float wave3 = cos(pos.x * 0.7 + time * 0.5) * 0.15;

      pos.z = wave1 + wave2 + wave3;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform vec3 color;
    uniform float opacity;
    varying vec2 vUv;

    void main() {
      gl_FragColor = vec4(color, opacity);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, yPosition, zPosition]} rotation={[-Math.PI / 2.3, 0, 0]}>
      <planeGeometry args={[30, 8, 64, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          color: { value: new THREE.Color(color) },
          opacity: { value: opacity }
        }}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function WaterSurface() {
  return (
    <group>
      {/* Main water body - base layer */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2.3, 0, 0]}>
        <planeGeometry args={[30, 10, 1, 1]} />
        <meshStandardMaterial
          color="#2a5f8f"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated wave layers */}
      <AnimatedWaterPlane
        yPosition={-1.2}
        zPosition={2}
        color="#3a7faf"
        opacity={0.4}
        speed={0.3}
      />
      <AnimatedWaterPlane
        yPosition={-1.0}
        zPosition={0}
        color="#4a9fcf"
        opacity={0.5}
        speed={0.5}
      />
      <AnimatedWaterPlane
        yPosition={-0.8}
        zPosition={-2}
        color="#5aafdf"
        opacity={0.6}
        speed={0.4}
      />
    </group>
  );
}

function Scene({ isSending, isReceiving }: River3DProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 3, -3]} intensity={0.6} color="#ffffff" />
      <hemisphereLight intensity={0.4} groundColor="#1a3a5a" color="#87ceeb" />

      {/* Environment for glass reflections */}
      <Environment preset="sunset" />

      {/* Water surface with animated waves */}
      <WaterSurface />

      {/* 3D Bottle */}
      <Bottle3D isSending={isSending} isReceiving={isReceiving} />
    </>
  );
}

export function River3D({ isSending, isReceiving }: River3DProps) {
  return (
    <div className="relative w-full h-56 overflow-hidden bg-gradient-to-b from-transparent via-blue-950/10 to-blue-900/20">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 45 }}
        shadows
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <Scene isSending={isSending} isReceiving={isReceiving} />
      </Canvas>
    </div>
  );
}
