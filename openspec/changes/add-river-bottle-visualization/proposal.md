# Change: Add River and Bottle Visualization

## Why
The current interface lacks visual representation of the core "message bottle drifting on river" metaphor. Adding animated river and bottle visuals will make the experience more immersive and authentic, reinforcing the conceptual model of messages drifting between users.

## What Changes
- Add animated SVG river (sine-wave style) at bottom of viewport
- Add floating bottle icon (Lucide) with bobbing animation
- Bottle animates left-to-center when receiving, center-to-right when sending
- Restructure layout: header (48px) + main content (center) + river section (bottom) + footer (48px)
- Add fixed header with "Riverbank" branding
- Add fixed footer with copyright and terms links

## Impact
- Affected code:
  - `src/web/App.tsx` - Layout restructure, animation states
  - `src/web/index.css` - New keyframes for bottle float, river animation
  - New component: `src/web/components/River.tsx` - River + bottle visualization
- No API changes
- No database changes
