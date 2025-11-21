# Change: Update Visual Design System

## Why
Shift the visual language from the current river blue/teal palette to a strict monochrome aesthetic. The new direction emphasizes elegant minimalism with ink black, vellum off-white, and subtle slate grays—evoking handwritten letters and deliberate, graceful motion.

## What Changes
- **BREAKING** Color palette: Replace river blues (#1a2a3a, #2a4a5a) and teal accents (#2dd4bf) with strict monochrome (ink black #0a0a0a, vellum #faf9f6, slate grays)
- **Typography**: High-contrast pairing with Classical Serif (Playfair Display) for messages and Geometric Sans-serif for UI elements
- **Motion**: Slower, more graceful animations—ink spreading, leaf floating downstream (currently 0.5-0.8s → longer durations)
- **Atmosphere**: Minimal/silent sound design consideration (optional future enhancement)

## Impact
- Affected specs:
  - `visual-design` (NEW) - Core design system tokens and patterns
- Affected code:
  - `src/web/index.css` - Complete color/typography/animation overhaul
  - `src/web/App.tsx` - Update all color/font class references
  - Potentially add Google Fonts import for Playfair Display
