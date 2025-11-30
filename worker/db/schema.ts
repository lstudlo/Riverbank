import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const bottles = sqliteTable("bottles", {
	id: text("id").primaryKey(),
	id_asc: integer("id_asc").notNull(),
	message: text("message").notNull(),
	nickname: text("nickname"),
	country: text("country"),
	ip: text("ip"),
	status: text("status").notNull().default("active"),
	emoji_reactions: text("emoji_reactions").notNull().default("{}"),
	report_count: integer("report_count").notNull().default(0),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Bottle = typeof bottles.$inferSelect;
export type NewBottle = typeof bottles.$inferInsert;

export const falsePositiveReports = sqliteTable("false_positive_reports", {
	id: text("id").primaryKey(),
	message: text("message").notNull(),
	nickname: text("nickname"),
	country: text("country"),
	ip: text("ip"),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type FalsePositiveReport = typeof falsePositiveReports.$inferSelect;
export type NewFalsePositiveReport = typeof falsePositiveReports.$inferInsert;
