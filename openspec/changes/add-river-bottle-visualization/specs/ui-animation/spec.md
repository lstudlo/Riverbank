## ADDED Requirements

### Requirement: River Visualization
The system SHALL display an animated river at the bottom of the viewport using an SVG sine-wave pattern.

#### Scenario: River displays on page load
- **WHEN** the user loads the application
- **THEN** an animated river graphic appears at the bottom of the viewport
- **AND** the river has a gentle flowing animation

### Requirement: Bottle Float Animation
The system SHALL display a bottle icon that bobs up and down to simulate floating on water.

#### Scenario: Bottle bobbing animation
- **WHEN** the bottle is visible on screen
- **THEN** the bottle continuously animates with a vertical bobbing motion
- **AND** the animation is smooth and subtle (3-5 second cycle)

### Requirement: Bottle Receive Animation
The system SHALL animate the bottle from left to center when receiving a message.

#### Scenario: Receiving message bottle
- **WHEN** the user receives a new bottle after throwing
- **THEN** the bottle icon animates from the left side toward the center
- **AND** the bottle maintains its bobbing animation during transit

### Requirement: Bottle Send Animation
The system SHALL animate the bottle from center to right when sending a message.

#### Scenario: Sending message bottle
- **WHEN** the user clicks "Throw into the river"
- **THEN** the bottle icon animates from center toward the right side
- **AND** the bottle maintains its bobbing animation during transit

### Requirement: Fixed Header
The system SHALL display a fixed 48px header at the top of the viewport with "Riverbank" branding.

#### Scenario: Header visibility
- **WHEN** the user views the application
- **THEN** a 48px tall header with "Riverbank" text is visible at the top
- **AND** the header remains fixed during scroll

### Requirement: Fixed Footer
The system SHALL display a fixed 48px footer at the bottom with copyright and terms links.

#### Scenario: Footer visibility
- **WHEN** the user views the application
- **THEN** a 48px tall footer with copyright and terms is visible at the bottom
- **AND** the footer remains fixed during scroll

### Requirement: Layout Structure
The system SHALL organize the page with header (top), main content (center), river (above footer), and footer (bottom).

#### Scenario: Vertical layout organization
- **WHEN** the user views the application
- **THEN** the message composition area is centered in the viewport
- **AND** the river visualization appears between the content and footer
- **AND** the header and footer each occupy 48px
