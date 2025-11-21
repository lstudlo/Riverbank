-- Migration number: 0002 	 2025-11-20T20:49:52.528Z

ALTER TABLE todos ADD COLUMN completed INTEGER DEFAULT 0;
ALTER TABLE todos ADD COLUMN updated_at INTEGER DEFAULT (unixepoch());

CREATE INDEX idx_todos_completed ON todos(completed);
