CREATE TABLE `bottles` (
	`id` text PRIMARY KEY NOT NULL,
	`id_asc` integer NOT NULL,
	`message` text NOT NULL,
	`nickname` text,
	`country` text,
	`ip` text,
	`status` text DEFAULT 'active' NOT NULL,
	`like_count` integer DEFAULT 0 NOT NULL,
	`report_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);