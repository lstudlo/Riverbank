import { motion, AnimatePresence } from "motion/react";

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
          style={{ marginLeft: "-28px", marginTop: "-42px" }}
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
          style={{ marginLeft: "-28px", marginTop: "-42px" }}
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
          style={{ marginLeft: "-28px", marginTop: "-42px" }}
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
  return (
    <motion.svg
      width="56"
      height="84"
      viewBox="0 0 32 48"
      fill="none"
      className="dark:invert"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Cork - pixel style */}
      <rect x="13" y="2" width="2" height="2" fill="#000000" />
      <rect x="15" y="2" width="2" height="2" fill="#000000" />
      <rect x="17" y="2" width="2" height="2" fill="#000000" />
      <rect x="13" y="4" width="2" height="2" fill="#000000" />
      <rect x="15" y="4" width="2" height="2" fill="#000000" />
      <rect x="17" y="4" width="2" height="2" fill="#000000" />

      {/* Neck - pixel style */}
      <rect x="12" y="6" width="2" height="2" fill="#1a1a1a" />
      <rect x="14" y="6" width="2" height="2" fill="#000000" />
      <rect x="16" y="6" width="2" height="2" fill="#000000" />
      <rect x="18" y="6" width="2" height="2" fill="#1a1a1a" />

      <rect x="12" y="8" width="2" height="2" fill="#1a1a1a" />
      <rect x="14" y="8" width="2" height="2" fill="#000000" />
      <rect x="16" y="8" width="2" height="2" fill="#000000" />
      <rect x="18" y="8" width="2" height="2" fill="#1a1a1a" />

      <rect x="12" y="10" width="2" height="2" fill="#1a1a1a" />
      <rect x="14" y="10" width="2" height="2" fill="#000000" />
      <rect x="16" y="10" width="2" height="2" fill="#000000" />
      <rect x="18" y="10" width="2" height="2" fill="#1a1a1a" />

      {/* Shoulder - pixel style */}
      <rect x="10" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="12" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="14" y="12" width="2" height="2" fill="#000000" />
      <rect x="16" y="12" width="2" height="2" fill="#000000" />
      <rect x="18" y="12" width="2" height="2" fill="#1a1a1a" />
      <rect x="20" y="12" width="2" height="2" fill="#1a1a1a" />

      <rect x="9" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="11" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="13" y="14" width="2" height="2" fill="#000000" />
      <rect x="15" y="14" width="2" height="2" fill="#000000" />
      <rect x="17" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="14" width="2" height="2" fill="#1a1a1a" />
      <rect x="21" y="14" width="2" height="2" fill="#1a1a1a" />

      {/* Body - pixel style with paper inside */}
      <rect x="9" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="11" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="13" y="16" width="2" height="2" fill="#000000" />
      <rect x="15" y="16" width="2" height="2" fill="#e5e5e5" />
      <rect x="17" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="16" width="2" height="2" fill="#1a1a1a" />
      <rect x="21" y="16" width="2" height="2" fill="#1a1a1a" />

      {[18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38].map(y => (
        <g key={y}>
          <rect x="9" y={y} width="2" height="2" fill="#1a1a1a" />
          <rect x="11" y={y} width="2" height="2" fill="#1a1a1a" />
          <rect x="13" y={y} width="2" height="2" fill="#000000" />
          <rect x="15" y={y} width="2" height="2" fill="#e5e5e5" />
          <rect x="17" y={y} width="2" height="2" fill="#1a1a1a" />
          <rect x="19" y={y} width="2" height="2" fill="#1a1a1a" />
          <rect x="21" y={y} width="2" height="2" fill="#1a1a1a" />
        </g>
      ))}

      {/* Bottom - pixel style */}
      <rect x="9" y="40" width="2" height="2" fill="#1a1a1a" />
      <rect x="11" y="40" width="2" height="2" fill="#1a1a1a" />
      <rect x="13" y="40" width="2" height="2" fill="#000000" />
      <rect x="15" y="40" width="2" height="2" fill="#000000" />
      <rect x="17" y="40" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="40" width="2" height="2" fill="#1a1a1a" />
      <rect x="21" y="40" width="2" height="2" fill="#1a1a1a" />

      <rect x="10" y="42" width="2" height="2" fill="#1a1a1a" />
      <rect x="12" y="42" width="2" height="2" fill="#1a1a1a" />
      <rect x="14" y="42" width="2" height="2" fill="#000000" />
      <rect x="16" y="42" width="2" height="2" fill="#000000" />
      <rect x="18" y="42" width="2" height="2" fill="#1a1a1a" />
      <rect x="20" y="42" width="2" height="2" fill="#1a1a1a" />

      <rect x="11" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="13" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="15" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="17" y="44" width="2" height="2" fill="#1a1a1a" />
      <rect x="19" y="44" width="2" height="2" fill="#1a1a1a" />
    </motion.svg>
  );
}
