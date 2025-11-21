## ADDED Requirements

### Requirement: Message Drafting
The system SHALL allow users to compose a text-only message with a maximum of 280 characters.

#### Scenario: User drafts a valid message
- **WHEN** user enters text up to 280 characters
- **THEN** the message is accepted for submission

#### Scenario: User exceeds character limit
- **WHEN** user attempts to enter more than 280 characters
- **THEN** the system prevents additional input and displays remaining character count

### Requirement: Bottle Throwing
The system SHALL accept a user's message and store it in the bottle pool when the user "throws" their bottle.

#### Scenario: User throws a bottle
- **WHEN** user submits a valid message (1-280 chars)
- **THEN** the message is stored in the bottles pool with optional nickname and country origin
- **AND** the message is immediately available for other users to receive

#### Scenario: User attempts to throw empty message
- **WHEN** user attempts to submit with no message content
- **THEN** the system rejects the submission with validation error

### Requirement: Bottle Receiving
The system SHALL deliver exactly one random bottle from the pool to the user immediately after they throw their bottle.

#### Scenario: User receives a bottle after throwing
- **WHEN** user successfully throws their bottle
- **THEN** the system returns one random bottle from the pool (excluding their own just-thrown bottle)
- **AND** the received bottle includes message content, optional nickname, and country origin

#### Scenario: Pool has no other bottles
- **WHEN** user throws a bottle but the pool contains no other messages
- **THEN** the system returns a friendly "no bottles yet" message indicating they are among the first

### Requirement: Law of Exchange
The system SHALL NOT allow users to receive bottles without first contributing a message.

#### Scenario: User attempts to receive without giving
- **WHEN** a request is made to receive a bottle without a corresponding throw
- **THEN** the system rejects the request

### Requirement: Bottle Metadata
Each bottle SHALL store optional sender metadata: nickname (max 30 chars) and country of origin.

#### Scenario: Bottle with full metadata
- **WHEN** user throws a bottle with nickname "wanderer" and country "Japan"
- **THEN** the stored bottle includes both metadata fields

#### Scenario: Bottle with no metadata
- **WHEN** user throws a bottle without nickname or country
- **THEN** the stored bottle has null/empty metadata fields
