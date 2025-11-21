## ADDED Requirements

### Requirement: Visual Design System
The system SHALL implement an atmospheric minimalist design using the riverbank palette.

#### Scenario: Color palette application
- **WHEN** the bottle exchange page loads
- **THEN** the UI uses deep river blue (#1a2a3a) as primary background
- **AND** paper white (#f0f0f0) for content areas
- **AND** teal as accent color for interactive elements

### Requirement: Typography Hierarchy
The system SHALL use distinct typography for human messages versus system UI.

#### Scenario: Message display typography
- **WHEN** a bottle message is displayed
- **THEN** the message text uses a serif font family

#### Scenario: UI element typography
- **WHEN** buttons, labels, and system text are displayed
- **THEN** they use a sans-serif font family

### Requirement: Fluid Motion Design
The system SHALL animate messages and interactions with fluid, drift-like motion.

#### Scenario: Received bottle animation
- **WHEN** user receives a bottle after throwing
- **THEN** the bottle content floats/drifts into view (not instant pop)

#### Scenario: Bottle throw animation
- **WHEN** user throws their bottle
- **THEN** a visual indication shows the message drifting away

### Requirement: Message Composition Interface
The system SHALL provide a clear interface for drafting and sending bottles.

#### Scenario: Composition area display
- **WHEN** user is on the bottle exchange page
- **THEN** they see a text area for message, optional nickname field, country selector, character counter, and throw button

#### Scenario: Character counter feedback
- **WHEN** user types in the message area
- **THEN** a live counter shows remaining characters (280 - current length)

### Requirement: Received Bottle Display
The system SHALL display received bottles with their metadata in an atmospheric card format.

#### Scenario: Display bottle with metadata
- **WHEN** user receives a bottle with nickname and country
- **THEN** the message displays with sender info (e.g., "from wanderer in Japan")

#### Scenario: Display anonymous bottle
- **WHEN** user receives a bottle without metadata
- **THEN** the message displays as anonymous (e.g., "from a stranger")

### Requirement: Ephemeral Experience
The system SHALL NOT provide access to previously sent or received messages.

#### Scenario: No sent items
- **WHEN** user throws a bottle
- **THEN** there is no way to view or recall that sent message

#### Scenario: Session-only received bottle
- **WHEN** user receives a bottle
- **THEN** the bottle is visible only for the current session/interaction
