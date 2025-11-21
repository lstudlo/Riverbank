## ADDED Requirements

### Requirement: Profanity Filtering
The system SHALL filter submitted messages for basic profanity before storing in the bottle pool.

#### Scenario: Message contains profanity
- **WHEN** user submits a message containing words from the profanity filter list
- **THEN** the system rejects the message with a friendly error asking them to revise

#### Scenario: Clean message submission
- **WHEN** user submits a message without profanity
- **THEN** the message passes the filter and is stored normally

### Requirement: Report Mechanism
The system SHALL allow users to report inappropriate received messages.

#### Scenario: User reports a bottle
- **WHEN** user clicks the report button on a received bottle
- **THEN** the bottle is flagged for review and removed from the active pool
- **AND** user receives confirmation that the report was submitted

### Requirement: Reported Message Handling
The system SHALL remove reported messages from circulation.

#### Scenario: Message reaches report threshold
- **WHEN** a bottle receives a report
- **THEN** the bottle status is set to "reported" and it is excluded from random selection
