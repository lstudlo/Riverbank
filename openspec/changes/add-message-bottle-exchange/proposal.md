# Change: Add Message Bottle Exchange

## Why
Create a digital "message in a bottle" experience where users exchange anonymous thoughts with strangers. The core value is serendipitous human connection through the constraint of reciprocity—you must give to receive.

## What Changes
- **Core Exchange Loop**: Draft a message (≤280 chars), throw it into the river, instantly receive a random bottle from the pool
- **Law of Exchange**: Users cannot receive without first contributing a message
- **Atmospheric UI**: Deep river blues (#1a2a3a), paper whites (#f0f0f0), teal accents; serif for messages, sans-serif for UI; fluid drift animations
- **Ephemeral Identity**: Optional nickname, country origin selector, no sent items history
- **Safety Layer**: Basic profanity filter, report button to remove inappropriate messages

## Impact
- Affected specs:
  - `bottle-exchange` (NEW) - Core exchange mechanics and API
  - `bottle-ui` (NEW) - Visual design and interaction patterns
  - `bottle-moderation` (NEW) - Safety and content moderation
- Affected code:
  - `src/worker/index.ts` - New API endpoints for bottle exchange
  - `src/worker/db/` - New schema for bottles table
  - `src/web/routes/` - New route for bottle exchange page
  - `src/web/components/` - Bottle UI components
