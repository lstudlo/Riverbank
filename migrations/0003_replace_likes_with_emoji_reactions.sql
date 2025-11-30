-- Add emoji_reactions column
ALTER TABLE `bottles` ADD COLUMN `emoji_reactions` text DEFAULT '{}' NOT NULL;

-- Drop like_count column
ALTER TABLE `bottles` DROP COLUMN `like_count`;
