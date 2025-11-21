import { motion } from "motion/react";

type Bottle2DProps = {
  isSending: boolean;
  isReceiving: boolean;
};

export function Bottle2D({ isSending, isReceiving }: Bottle2DProps) {
  // Determine animation state key for remounting
  const animationKey = isSending ? "sending" : isReceiving ? "receiving" : "idle";

  // Use viewport-relative positions (vw units via calc)
  const getInitialLeft = () => {
    if (isSending) return "50%"; // Start center
    if (isReceiving) return "-10%"; // Start off-screen left
    return "50%"; // Idle at center
  };

  const getAnimateLeft = () => {
    if (isSending) return "110%"; // Exit to right
    if (isReceiving) return "50%"; // Come to center
    return "50%"; // Stay center
  };

  return (
    <motion.div
      key={animationKey}
      className="absolute top-1/2"
      style={{ marginLeft: "-28px", marginTop: "-42px" }} // Center the 56x84 bottle
      initial={{ left: getInitialLeft() }}
      animate={{
        left: getAnimateLeft(),
        rotate: [0, 5, -5, 3, -3, 0],
      }}
      transition={{
        left: { duration: 1.5, ease: "easeInOut" },
        rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      {/* 2D SVG Bottle - larger size */}
      <motion.svg
        width="56"
        height="84"
        viewBox="0 0 32 48"
        fill="none"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Bottle body */}
        <path
          d="M8 18C8 16 10 14 10 14V12C10 11 11 10 12 10H20C21 10 22 11 22 12V14C22 14 24 16 24 18V42C24 44 22 46 20 46H12C10 46 8 44 8 42V18Z"
          fill="#2d5a27"
          fillOpacity="0.85"
          stroke="#1a3d17"
          strokeWidth="1"
        />
        {/* Bottle neck */}
        <rect x="13" y="4" width="6" height="6" rx="1" fill="#2d5a27" stroke="#1a3d17" strokeWidth="0.5" />
        {/* Cork */}
        <rect x="13.5" y="1" width="5" height="4" rx="1" fill="#8b6914" />
        {/* Glass shine */}
        <path
          d="M11 20C11 20 11 38 11 40C11 41 12 42 12 42"
          stroke="white"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Paper inside */}
        <rect x="14" y="22" width="4" height="16" rx="1" fill="#f5f0e6" transform="rotate(5 16 30)" />
      </motion.svg>
    </motion.div>
  );
}
