## 1. River Component
- [x] 1.1 Create `River.tsx` component with animated SVG sine-wave river
- [x] 1.2 Add floating bottle icon using Lucide's `Wine` icon
- [x] 1.3 Implement bottle bobbing (float up/down) animation

## 2. Bottle Direction Animations
- [x] 2.1 Add left-to-center animation for receiving bottle state
- [x] 2.2 Add center-to-right animation for sending bottle state
- [x] 2.3 Connect animations to App.tsx state (showThrowAnimation, showReceiveAnimation)

## 3. Layout Restructure
- [x] 3.1 Create fixed header (48px) with "Riverbank" text
- [x] 3.2 Create fixed footer (48px) with copyright and terms
- [x] 3.3 Position River component at bottom of viewport (above footer)
- [x] 3.4 Center message composition/display area in remaining space

## 4. CSS Animations
- [x] 4.1 Add `@keyframes bottle-bob` for vertical floating effect
- [x] 4.2 Add `@keyframes bottle-drift-in` for left-to-center motion
- [x] 4.3 Add `@keyframes bottle-drift-out` for center-to-right motion
- [x] 4.4 Add subtle river wave animation

## 5. Integration & Testing
- [x] 5.1 Wire up animation triggers from App.tsx throw/receive flow
- [x] 5.2 Build passes without errors
- [x] 5.3 Responsive layout structure (flex column with header/main/river/footer)
