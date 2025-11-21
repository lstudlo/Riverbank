## ADDED Requirements

### Requirement: Monochrome Color Palette
The visual design SHALL use a strict monochrome palette with no vibrant accent colors.

#### Scenario: Primary colors defined
- **WHEN** the design system is referenced
- **THEN** it provides ink black (#0a0a0a), vellum off-white (#faf9f6), and subtle slate grays as the only colors

#### Scenario: No vibrant accents
- **WHEN** any UI element requires emphasis or interaction feedback
- **THEN** it uses contrast, typography weight, or grayscale variation rather than colored accents

---

### Requirement: High-Contrast Typography
The design system SHALL pair a classical serif typeface for message content with a geometric sans-serif for UI elements.

#### Scenario: Message typography
- **WHEN** user-authored message content is displayed
- **THEN** it renders in a classical serif typeface (e.g., Playfair Display) to evoke handwritten letters

#### Scenario: UI typography
- **WHEN** interface elements (buttons, labels, navigation) are rendered
- **THEN** they use a geometric sans-serif typeface for clarity and modern contrast

---

### Requirement: Graceful Motion Design
Animations SHALL feel weightless and deliberate, with timing that evokes natural phenomena like ink spreading on paper or a leaf floating downstream.

#### Scenario: Entry animations
- **WHEN** a received bottle appears on screen
- **THEN** it animates in slowly (1.2s+) with gentle easing, suggesting it drifted ashore

#### Scenario: Exit animations
- **WHEN** a composed message is sent
- **THEN** it animates out gracefully (0.8s+), as if carried away by a current

#### Scenario: Ambient motion
- **WHEN** content is at rest
- **THEN** any idle animations (float, drift) use slow, subtle movement (3s+ cycles)
