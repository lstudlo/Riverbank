-- Migration: Add nanoid IDs to all entities
-- Rename current id to id_asc, add new id (TEXT) as primary key

-- ============================================
-- Migrate todos table
-- ============================================

-- Create new table with updated schema
CREATE TABLE todos_new (
  id TEXT PRIMARY KEY NOT NULL,
  id_asc INTEGER NOT NULL,
  title TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Copy existing data (generate placeholder IDs that will need to be updated)
INSERT INTO todos_new (id, id_asc, title, completed, created_at, updated_at)
SELECT
  'todo_' || id || '_' || hex(randomblob(8)) as id,
  id as id_asc,
  title,
  completed,
  created_at,
  updated_at
FROM todos;

-- Drop old table and rename new one
DROP TABLE todos;
ALTER TABLE todos_new RENAME TO todos;

-- Create index for id_asc lookups
CREATE INDEX IF NOT EXISTS idx_todos_id_asc ON todos(id_asc);

-- ============================================
-- Migrate bottles table
-- ============================================

-- Create new table with updated schema
CREATE TABLE bottles_new (
  id TEXT PRIMARY KEY NOT NULL,
  id_asc INTEGER NOT NULL,
  message TEXT NOT NULL,
  nickname TEXT,
  country TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);

-- Copy existing data
INSERT INTO bottles_new (id, id_asc, message, nickname, country, status, created_at)
SELECT
  'btl_' || id || '_' || hex(randomblob(8)) as id,
  id as id_asc,
  message,
  nickname,
  country,
  status,
  created_at
FROM bottles;

-- Drop old table and rename new one
DROP TABLE bottles;
ALTER TABLE bottles_new RENAME TO bottles;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_bottles_status ON bottles(status);
CREATE INDEX IF NOT EXISTS idx_bottles_id_asc ON bottles(id_asc);
