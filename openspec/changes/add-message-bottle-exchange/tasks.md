## 1. Database Schema
- [x] 1.1 Create bottles table schema (id, message, nickname, country, status, created_at)
- [x] 1.2 Generate and run D1 migration
- [x] 1.3 Add Drizzle schema definition in `src/worker/db/`

## 2. API Endpoints
- [x] 2.1 Create `POST /api/bottles/throw` endpoint (accept message + metadata, return random bottle)
- [x] 2.2 Implement random bottle selection query (exclude own, exclude reported)
- [x] 2.3 Add basic profanity filter middleware
- [x] 2.4 Create `POST /api/bottles/:id/report` endpoint

## 3. Frontend - Core UI
- [x] 3.1 Create bottle exchange route at `/` (replace todo demo)
- [x] 3.2 Build message composition component (textarea, char counter, nickname, country selector)
- [x] 3.3 Build received bottle display card component
- [x] 3.4 Implement throw button with API integration

## 4. Frontend - Visual Design
- [x] 4.1 Set up color palette CSS variables (river blue, paper white, teal)
- [x] 4.2 Configure typography (serif for messages, sans-serif for UI)
- [x] 4.3 Add drift/float animation for received bottles
- [x] 4.4 Style composition area with atmospheric theme

## 5. Frontend - Interactions
- [x] 5.1 Implement "no bottles yet" empty state
- [x] 5.2 Add report button to received bottle card
- [x] 5.3 Add throw animation feedback
- [x] 5.4 Handle loading and error states

## 6. Validation & Polish
- [x] 6.1 Test exchange flow end-to-end
- [x] 6.2 Verify profanity filter blocks common terms
- [x] 6.3 Test report flow removes bottle from pool
- [x] 6.4 Verify character limit enforcement
