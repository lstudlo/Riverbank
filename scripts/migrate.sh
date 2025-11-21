#!/bin/bash

# Auto-detect and run pending D1 migrations
# Usage: ./scripts/migrate.sh [local|uat|production]

set -e

ENV="${1:-local}"
MIGRATIONS_DIR="./migrations"

# Build wrangler command based on environment
case "$ENV" in
  local)
    WRANGLER_ARGS="--local"
    ;;
  uat)
    WRANGLER_ARGS="--env uat --remote"
    ;;
  production)
    WRANGLER_ARGS="--env production --remote"
    ;;
  *)
    echo "Unknown environment: $ENV"
    echo "Usage: $0 [local|uat|production]"
    exit 1
    ;;
esac

echo "Running migrations for environment: $ENV"

# Create migrations tracking table if it doesn't exist
echo "Ensuring _migrations table exists..."
wrangler d1 execute DB $WRANGLER_ARGS --command "CREATE TABLE IF NOT EXISTS _migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  applied_at TEXT DEFAULT (datetime('now'))
);"

# Get list of applied migrations
echo "Checking applied migrations..."
APPLIED=$(wrangler d1 execute DB $WRANGLER_ARGS --command "SELECT name FROM _migrations ORDER BY name;" --json 2>/dev/null | grep -o '"name":"[^"]*"' | cut -d'"' -f4 || echo "")

# Get all migration files sorted
MIGRATION_FILES=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATION_FILES" ]; then
  echo "No migration files found in $MIGRATIONS_DIR"
  exit 0
fi

PENDING_COUNT=0
for FILE in $MIGRATION_FILES; do
  FILENAME=$(basename "$FILE")

  # Check if this migration was already applied
  if echo "$APPLIED" | grep -q "^${FILENAME}$"; then
    echo "✓ Already applied: $FILENAME"
  else
    echo "→ Applying: $FILENAME"
    wrangler d1 execute DB $WRANGLER_ARGS --file="$FILE"

    # Record the migration
    wrangler d1 execute DB $WRANGLER_ARGS --command "INSERT INTO _migrations (name) VALUES ('$FILENAME');"

    echo "✓ Applied: $FILENAME"
    ((PENDING_COUNT++))
  fi
done

if [ $PENDING_COUNT -eq 0 ]; then
  echo "No pending migrations."
else
  echo "Applied $PENDING_COUNT migration(s)."
fi
