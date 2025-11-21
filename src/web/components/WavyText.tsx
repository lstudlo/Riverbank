import { motion } from "motion/react"

interface WavyTextProps {
    text: string
    className?: string
    delay?: number
}

export function WavyText({ text, className = "", delay = 0 }: WavyTextProps) {
    const letters = text.split('')

    return (
        <span className={className}>
            {letters.map((letter, index) => (
                <motion.span
                    key={`${letter}-${index}`}
                    className="inline-block"
                    animate={{
                        y: [0, -2, 0],
                    }}
                    transition={{
                        y: {
                            duration: 2,
                            repeat: Infinity,
                            delay: delay + index * 0.05,
                            ease: "easeInOut"
                        },
                    }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </motion.span>
            ))}
        </span>
    )
}
