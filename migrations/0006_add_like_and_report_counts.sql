-- Add like_count field to bottles table
ALTER TABLE bottles ADD COLUMN like_count INTEGER NOT NULL DEFAULT 0;

-- Add report_count field to bottles table
ALTER TABLE bottles ADD COLUMN report_count INTEGER NOT NULL DEFAULT 0;
