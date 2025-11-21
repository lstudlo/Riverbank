import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const todos = sqliteTable("todos", {
	id: text("id").primaryKey(),
	id_asc: integer("id_asc").notNull(),
	title: text("title").notNull(),
	completed: integer("completed", { mode: "boolean" }).notNull().default(false),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updated_at: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;

export const bottles = sqliteTable("bottles", {
	id: text("id").primaryKey(),
	id_asc: integer("id_asc").notNull(),
	message: text("message").notNull(),
	nickname: text("nickname"),
	country: text("country"),
	ip: text("ip"),
	status: text("status").notNull().default("active"),
	created_at: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Bottle = typeof bottles.$inferSelect;
export type NewBottle = typeof bottles.$inferInsert;
