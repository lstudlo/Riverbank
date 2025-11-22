CREATE TABLE `false_positive_reports` (
	`id` text PRIMARY KEY NOT NULL,
	`message` text NOT NULL,
	`nickname` text,
	`country` text,
	`ip` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
