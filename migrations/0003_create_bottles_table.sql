-- Create bottles table for message exchange
CREATE TABLE IF NOT EXISTS bottles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT NOT NULL,
  nickname TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Index for filtering by status (active vs reported)
CREATE INDEX IF NOT EXISTS idx_bottles_status ON bottles(status);
