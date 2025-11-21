import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, desc, ne, and, sql } from "drizzle-orm";
import { getDb, todos, bottles, type Bottle } from "./db";

// Basic profanity word list
const PROFANITY_LIST = [
	"fuck", "shit", "ass", "bitch", "damn", "cunt", "dick", "cock", "pussy",
	"bastard", "whore", "slut", "nigger", "faggot", "retard"
];

function containsProfanity(text: string): boolean {
	const lowerText = text.toLowerCase();
	return PROFANITY_LIST.some(word => {
		const regex = new RegExp(`\\b${word}\\b`, "i");
		return regex.test(lowerText);
	});
}

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

// ============================================
// Bottle Exchange API
// ============================================

// Throw a bottle and receive one in return
app.post("/api/bottles/throw", async (c) => {
	const db = getDb(c.env.DB);
	const { message, nickname, country } = await c.req.json<{
		message: string;
		nickname?: string;
		country?: string;
	}>();

	// Validate message
	if (!message || message.trim() === "") {
		return c.json({ error: "Message is required" }, 400);
	}

	const trimmedMessage = message.trim();
	if (trimmedMessage.length > 280) {
		return c.json({ error: "Message must be 280 characters or less" }, 400);
	}

	// Check for profanity
	if (containsProfanity(trimmedMessage)) {
		return c.json({ error: "Please revise your message - it contains inappropriate content" }, 400);
	}

	// Validate nickname if provided
	const trimmedNickname = nickname?.trim() || null;
	if (trimmedNickname && trimmedNickname.length > 30) {
		return c.json({ error: "Nickname must be 30 characters or less" }, 400);
	}

	// Insert the new bottle
	const insertedBottle = await db.insert(bottles).values({
		message: trimmedMessage,
		nickname: trimmedNickname,
		country: country?.trim() || null,
		status: "active",
	}).returning();

	const newBottleId = insertedBottle[0].id;

	// Get a random bottle (exclude the one just thrown and reported ones)
	const randomBottle = await db
		.select()
		.from(bottles)
		.where(and(
			eq(bottles.status, "active"),
			ne(bottles.id, newBottleId)
		))
		.orderBy(sql`RANDOM()`)
		.limit(1);

	const received: Omit<Bottle, "status" | "created_at"> | null = randomBottle.length > 0
		? {
			id: randomBottle[0].id,
			message: randomBottle[0].message,
			nickname: randomBottle[0].nickname,
			country: randomBottle[0].country,
		}
		: null;

	return c.json({ sent: true, received });
});

// Report a bottle
app.post("/api/bottles/:id/report", async (c) => {
	const db = getDb(c.env.DB);
	const id = Number(c.req.param("id"));

	if (isNaN(id)) {
		return c.json({ error: "Invalid bottle ID" }, 400);
	}

	const result = await db.update(bottles)
		.set({ status: "reported" })
		.where(eq(bottles.id, id))
		.returning();

	if (result.length === 0) {
		return c.json({ error: "Bottle not found" }, 404);
	}

	return c.json({ reported: true });
});

export default app;
