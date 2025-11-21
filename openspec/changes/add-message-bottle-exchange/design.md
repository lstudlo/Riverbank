## Context
Riverbank is a new Cloudflare Workers + D1 + React project. The message bottle exchange is the core feature—a digital "throw a bottle, receive a bottle" experience emphasizing anonymity and serendipity.

**Constraints:**
- Cloudflare D1 as sole database (SQLite-based, no complex queries)
- Serverless execution (no persistent connections or state)
- Must handle "cold start" scenario (pool has zero bottles initially)

## Goals / Non-Goals

**Goals:**
- Simple, single-transaction exchange: throw → receive in one API call
- Atmospheric, minimal UI with fluid animations
- Basic safety (profanity filter, report mechanism)

**Non-Goals:**
- User accounts or authentication (fully anonymous)
- Message threading or replies
- Real-time features (WebSockets)
- Advanced moderation dashboard (simple flag-and-remove for MVP)

## Decisions

### Decision: Single atomic exchange endpoint
The `/api/bottles/throw` endpoint handles both storing the new bottle AND returning a random one in a single request.

**Why:** Enforces the "Law of Exchange" at the API level. No separate endpoints that could be abused to receive without giving.

**Alternative considered:** Separate `/throw` and `/receive` endpoints with session tracking. Rejected because it adds complexity and session management without clear benefit.

### Decision: Random selection via SQL RANDOM()
Use D1's `ORDER BY RANDOM() LIMIT 1` to select bottles.

**Why:** Simple, works for MVP scale, no need for external randomness service.

**Trade-off:** Not cryptographically random, may have performance issues at very large scale. Acceptable for MVP.

### Decision: Client-side profanity filter list
Ship a static word list with the API, filter on submission.

**Why:** Fast, no external dependencies, easy to update.

**Alternative considered:** External moderation API (Perspective, etc.). Rejected for MVP due to latency and cost.

### Decision: Soft-delete for reported bottles
Reported bottles get `status = 'reported'` rather than being deleted.

**Why:** Allows potential future review, prevents accidental data loss, simple WHERE clause filter.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Pool abuse (spam) | Rate limiting (future), profanity filter, report mechanism |
| Empty pool UX | Friendly "no bottles yet" message; seed with starter bottles if needed |
| Large pool performance | Monitor query times; add index on (status, created_at) if needed |

## Data Model

```sql
CREATE TABLE bottles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  nickname TEXT,
  country TEXT,
  status TEXT DEFAULT 'active',  -- 'active' | 'reported'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bottles_status ON bottles(status);
```

## API Design

```
POST /api/bottles/throw
Body: { message: string, nickname?: string, country?: string }
Response: { sent: true, received: { id, message, nickname, country } | null }

POST /api/bottles/:id/report
Response: { reported: true }
```

## Open Questions
- Should we add rate limiting in MVP? (Leaning no—add if abuse observed)
- Seed initial bottles or let users organically build pool? (Prefer organic)
