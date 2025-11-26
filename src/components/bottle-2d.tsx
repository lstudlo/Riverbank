import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { useState, useRef, useEffect } from "react";

type Bottle2DProps = {
  isSending: boolean;
  isReceiving: boolean;
};

export function Bottle2D({ isSending, isReceiving }: Bottle2DProps) {
  // Determine which bottle state to show
  const state = isSending ? "sending" : isReceiving ? "receiving" : "idle";

  return (
    <AnimatePresence>
      {state === "sending" && (
        <motion.div
          key="sending"
          className="absolute top-1/2"
          style={{ marginLeft: "-40px", marginTop: "-60px" }}
          initial={{ left: "50%" }}
          animate={{ left: "120%", rotate: [0, 5, -5, 3, -3, 0] }}
          exit={{ left: "120%", opacity: 0 }}
          transition={{
            left: { duration: 3, ease: [0.25, 0.1, 0.25, 1] },
            rotate: { duration: 3, ease: "easeInOut" },
            opacity: { duration: 0.1 }
          }}
        >
          <BottleSVG />
        </motion.div>
      )}

      {state === "receiving" && (
        <motion.div
          key="receiving"
          className="absolute top-1/2"
          style={{ marginLeft: "-40px", marginTop: "-60px" }}
          initial={{ left: "-20%", opacity: 1 }}
          animate={{ left: "50%", rotate: [0, 5, -5, 3, -3, 0] }}
          exit={{ left: "50%", opacity: 0 }}
          transition={{
            left: { duration: 3, ease: [0.25, 0.1, 0.25, 1] },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            opacity: { duration: 0.3 }
          }}
        >
          <BottleSVG />
        </motion.div>
      )}

      {state === "idle" && (
        <motion.div
          key="idle"
          className="absolute top-1/2"
          style={{ marginLeft: "-40px", marginTop: "-60px" }}
          initial={{ left: "50%", opacity: 0 }}
          animate={{ left: "50%", opacity: 1, rotate: [0, 5, -5, 3, -3, 0] }}
          exit={{ left: "50%", opacity: 0 }}
          transition={{
            left: { duration: 0.5 },
            opacity: { duration: 0.5 },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <BottleSVG />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BottleSVG() {
  const bottleRef = useRef<SVGSVGElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for physics-based movement
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smooth return to center
  const springX = useSpring(x, { stiffness: 100, damping: 25, mass: 1 });
  const springY = useSpring(y, { stiffness: 100, damping: 25, mass: 1 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bottleRef.current || !isHovered) return;

      const rect = bottleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate vector from cursor to bottle center
      const deltaX = centerX - e.clientX;
      const deltaY = centerY - e.clientY;

      // Calculate distance from cursor to bottle
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      // Maximum effective radius for push force (pixels)
      const maxRadius = 150;

      if (distance === 0) {
        // Directly on center, no force
        x.set(0);
        y.set(0);
        return;
      }

      // Normalize direction vector
      const dirX = deltaX / distance;
      const dirY = deltaY / distance;

      // Calculate push force using smooth falloff
      let forceMagnitude = 0;
      if (distance < maxRadius) {
        // Smoother falloff using cubic easing
        const normalizedDistance = distance / maxRadius;
        const easing = 1 - Math.pow(normalizedDistance, 3);
        forceMagnitude = easing * 50;
      }

      // Apply force in direction away from cursor (or return to center if outside range)
      x.set(dirX * forceMagnitude);
      y.set(dirY * forceMagnitude);
    };

    if (isHovered) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovered, x, y]);

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Return to center with spring animation
    x.set(0);
    y.set(0);
  };

  return (
    <motion.svg
      ref={bottleRef}
      width="80"
      height="120"
      viewBox="0 0 40 60"
      fill="none"
      className="dark:invert cursor-pointer pointer-events-auto"
      style={{
        x: springX,
        y: isHovered ? springY : undefined,
      }}
      animate={
        isHovered
          ? {}
          : { y: [0, -6, 0] }
      }
      transition={{
        y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cork - pixel style with depth */}
      <rect x="16" y="2" width="2" height="2" fill="#000000" />
      <rect x="18" y="2" width="2" height="2" fill="#000000" />
      <rect x="20" y="2" width="2" height="2" fill="#000000" />
      <rect x="22" y="2" width="2" height="2" fill="#000000" />
      <rect x="16" y="4" width="2" height="2" fill="#000000" />
      <rect x="18" y="4" width="2" height="2" fill="#000000" />
      <rect x="20" y="4" width="2" height="2" fill="#000000" />
      <rect x="22" y="4" width="2" height="2" fill="#1a1a1a" />
      <rect x="16" y="6" width="2" height="2" fill="#000000" />
      <rect x="18" y="6" width="2" height="2" fill="#000000" />
      <rect x="20" y="6" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="6" width="2" height="2" fill="#1a1a1a" />

      {/* Neck - pixel style with depth */}
      <rect x="14" y="8" width="2" height="2" fill="#000000" />
      <rect x="16" y="8" width="2" height="2" fill="#000000" />
      <rect x="18" y="8" width="2" height="2" fill="#000000" />
      <rect x="20" y="8" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="8" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="8" width="2" height="2" fill="#333333" />

      <rect x="14" y="10" width="2" height="2" fill="#000000" />
      <rect x="16" y="10" width="2" height="2" fill="#000000" />
      <rect x="18" y="10" width="2" height="2" fill="#000000" />
      <rect x="20" y="10" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="10" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="10" width="2" height="2" fill="#333333" />

      <rect x="14" y="12" width="2" height="2" fill="#000000" />
      <rect x="16" y="12" width="2" height="2" fill="#000000" />
      <rect x="18" y="12" width="2" height="2" fill="#000000" />
      <rect x="20" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="12" width="2" height="2" fill="#333333" />

      <rect x="14" y="14" width="2" height="2" fill="#000000" />
      <rect x="16" y="14" width="2" height="2" fill="#000000" />
      <rect x="18" y="14" width="2" height="2" fill="#000000" />
      <rect x="20" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="14" width="2" height="2" fill="#333333" />

      {/* Shoulder - pixel style with depth */}
      <rect x="12" y="16" width="2" height="2" fill="#000000" />
      <rect x="14" y="16" width="2" height="2" fill="#000000" />
      <rect x="16" y="16" width="2" height="2" fill="#000000" />
      <rect x="18" y="16" width="2" height="2" fill="#000000" />
      <rect x="20" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="16" width="2" height="2" fill="#333333" />
      <rect x="26" y="16" width="2" height="2" fill="#333333" />

      <rect x="10" y="18" width="2" height="2" fill="#000000" />
      <rect x="12" y="18" width="2" height="2" fill="#000000" />
      <rect x="14" y="18" width="2" height="2" fill="#000000" />
      <rect x="16" y="18" width="2" height="2" fill="#000000" />
      <rect x="18" y="18" width="2" height="2" fill="#000000" />
      <rect x="20" y="18" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="18" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="18" width="2" height="2" fill="#333333" />
      <rect x="26" y="18" width="2" height="2" fill="#333333" />
      <rect x="28" y="18" width="2" height="2" fill="#4d4d4d" />

      {/* Body - pixel style with depth and vertical paper */}
      {/* Repeating body rows with vertical paper note */}
      {[
        { y: 20, paper: [16, 18, 20] },
        { y: 22, paper: [16, 18, 20] },
        { y: 24, paper: [16, 18, 20] },
        { y: 26, paper: [16, 18, 20] },
        { y: 28, paper: [16, 18, 20] },
        { y: 30, paper: [16, 18, 20] },
        { y: 32, paper: [16, 18, 20] },
        { y: 34, paper: [16, 18, 20] },
        { y: 36, paper: [16, 18, 20] },
        { y: 38, paper: [16, 18, 20] },
        { y: 40, paper: [16, 18, 20] },
        { y: 42, paper: [16, 18, 20] },
      ].map(({ y, paper }) => (
        <g key={y}>
          <rect x="10" y={y} width="2" height="2" fill="#000000" />
          <rect x="12" y={y} width="2" height="2" fill="#000000" />
          <rect x="14" y={y} width="2" height="2" fill="#000000" />
          <rect x="16" y={y} width="2" height="2" fill={paper.includes(16) ? "#ffffff" : "#000000"} />
          <rect x="18" y={y} width="2" height="2" fill={paper.includes(18) ? "#ffffff" : "#000000"} />
          <rect x="20" y={y} width="2" height="2" fill={paper.includes(20) ? "#ffffff" : "#1a1a1a"} />
          <rect x="22" y={y} width="2" height="2" fill={paper.includes(22) ? "#ffffff" : "#1a1a1a"} />
          <rect x="24" y={y} width="2" height="2" fill={paper.includes(24) ? "#ffffff" : "#333333"} />
          <rect x="26" y={y} width="2" height="2" fill="#333333" />
          <rect x="28" y={y} width="2" height="2" fill="#4d4d4d" />
        </g>
      ))}

      {/* Bottom - pixel style with flat, rounded base */}
      <rect x="10" y="44" width="2" height="2" fill="#000000" />
      <rect x="12" y="44" width="2" height="2" fill="#000000" />
      <rect x="14" y="44" width="2" height="2" fill="#000000" />
      <rect x="16" y="44" width="2" height="2" fill="#000000" />
      <rect x="18" y="44" width="2" height="2" fill="#000000" />
      <rect x="20" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="44" width="2" height="2" fill="#333333" />
      <rect x="26" y="44" width="2" height="2" fill="#333333" />
      <rect x="28" y="44" width="2" height="2" fill="#4d4d4d" />

      {/* Rounded sides */}
      <rect x="10" y="46" width="2" height="2" fill="#000000" />
      <rect x="12" y="46" width="2" height="2" fill="#000000" />
      <rect x="14" y="46" width="2" height="2" fill="#000000" />
      <rect x="16" y="46" width="2" height="2" fill="#000000" />
      <rect x="18" y="46" width="2" height="2" fill="#000000" />
      <rect x="20" y="46" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="46" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="46" width="2" height="2" fill="#333333" />
      <rect x="26" y="46" width="2" height="2" fill="#333333" />
      <rect x="28" y="46" width="2" height="2" fill="#4d4d4d" />

      <rect x="10" y="48" width="2" height="2" fill="#000000" />
      <rect x="12" y="48" width="2" height="2" fill="#000000" />
      <rect x="14" y="48" width="2" height="2" fill="#000000" />
      <rect x="16" y="48" width="2" height="2" fill="#000000" />
      <rect x="18" y="48" width="2" height="2" fill="#000000" />
      <rect x="20" y="48" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="48" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="48" width="2" height="2" fill="#333333" />
      <rect x="26" y="48" width="2" height="2" fill="#333333" />
      <rect x="28" y="48" width="2" height="2" fill="#4d4d4d" />

      {/* Start rounding bottom corners */}
      <rect x="12" y="50" width="2" height="2" fill="#000000" />
      <rect x="14" y="50" width="2" height="2" fill="#000000" />
      <rect x="16" y="50" width="2" height="2" fill="#000000" />
      <rect x="18" y="50" width="2" height="2" fill="#000000" />
      <rect x="20" y="50" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="50" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="50" width="2" height="2" fill="#333333" />
      <rect x="26" y="50" width="2" height="2" fill="#333333" />

      {/* Flat bottom with rounded corners */}
      <rect x="14" y="52" width="2" height="2" fill="#000000" />
      <rect x="16" y="52" width="2" height="2" fill="#000000" />
      <rect x="18" y="52" width="2" height="2" fill="#000000" />
      <rect x="20" y="52" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="52" width="2" height="2" fill="#1a1a1a" />
      <rect x="24" y="52" width="2" height="2" fill="#333333" />

      {/* Bottom edge */}
      <rect x="16" y="54" width="2" height="2" fill="#000000" />
      <rect x="18" y="54" width="2" height="2" fill="#000000" />
      <rect x="20" y="54" width="2" height="2" fill="#1a1a1a" />
      <rect x="22" y="54" width="2" height="2" fill="#1a1a1a" />
    </motion.svg>
  );
}
