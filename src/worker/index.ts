import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, desc } from "drizzle-orm";
import { getDb, todos, type Todo } from "./db";

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for local development
app.use("/*", cors());

// Get all todos
app.get("/api/todos", async (c) => {
	const db = getDb(c.env.DB);
	const results = await db.select().from(todos).orderBy(desc(todos.created_at));
	return c.json({ todos: results });
});

// Get a single todo
app.get("/api/todos/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const result = await db.select().from(todos).where(eq(todos.id, id));

	if (result.length === 0) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.json({ todo: result[0] });
});

// Create a new todo
app.post("/api/todos", async (c) => {
	const db = getDb(c.env.DB);
	const { title } = await c.req.json();

	if (!title || title.trim() === "") {
		return c.json({ error: "Title is required" }, 400);
	}

	const result = await db.insert(todos).values({
		title: title.trim(),
		completed: false,
	}).returning();

	return c.json({ todo: result[0] }, 201);
});

// Update a todo
app.put("/api/todos/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));
	const { title, completed } = await c.req.json();

	const updateData: Partial<typeof todos.$inferInsert> = {};

	if (title !== undefined) {
		updateData.title = title;
	}

	if (completed !== undefined) {
		updateData.completed = completed;
	}

	if (Object.keys(updateData).length === 0) {
		return c.json({ error: "No fields to update" }, 400);
	}

	updateData.updated_at = new Date();

	const result = await db.update(todos)
		.set(updateData)
		.where(eq(todos.id, id))
		.returning();

	if (result.length === 0) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.json({ todo: result[0] });
});

// Delete a todo
app.delete("/api/todos/:id", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));

	const result = await db.delete(todos).where(eq(todos.id, id)).returning();

	if (result.length === 0) {
		return c.json({ error: "Todo not found" }, 404);
	}

	return c.json({ success: true });
});

// Toggle todo completion
app.patch("/api/todos/:id/toggle", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));

	// First, get the current todo
	const current = await db.select().from(todos).where(eq(todos.id, id));

	if (current.length === 0) {
		return c.json({ error: "Todo not found" }, 404);
	}

	// Toggle the completed status
	const result = await db.update(todos)
		.set({
			completed: !current[0].completed,
			updated_at: new Date(),
		})
		.where(eq(todos.id, id))
		.returning();

	return c.json({ todo: result[0] });
});

export default app;
