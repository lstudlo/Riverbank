import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, ne, and, sql, max } from "drizzle-orm";
import { getDb, bottles, type Bottle } from "./db";
import { nanoid } from "nanoid";

// URL/hyperlink detection to prevent scam sites
function containsURL(text: string): boolean {
	const urlPatterns = [
		/https?:\/\//i,  // http:// or https://
		/www\./i,        // www.
		/\.(com|org|net|edu|gov|io|co|app|dev|xyz|info|biz|me|ai|tech|online|site|store|shop|blog|tv|cc|link|click|ly|gl|bit|tinyurl)\b/i  // common TLDs
	];
	return urlPatterns.some(pattern => pattern.test(text));
}

// AI content moderation using Llama Guard 3-8B
async function moderateContent(ai: Ai, message: string): Promise<{ safe: boolean; categories?: string[] }> {
	try {
		const response = await ai.run("@cf/openai/gpt-oss-20b", {
			messages: [
				{
					role: "user",
					content: message
				}
			]
		}) as { response?: string };

		const responseText = (response.response || "").trim().toLowerCase();

		if (responseText.startsWith("safe")) {
			return { safe: true };
		}

		// Parse unsafe categories (format: "unsafe\nS1,S2,...")
		const lines = responseText.split("\n");
		const categories = lines.length > 1 ? lines[1].split(",").map(c => c.trim()) : [];

		// Check if any flagged category is in our blocked list
		// Blocked: S1, S2, S3, S4, S5, S7, S10, S11, S12
		const blockedCategories = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11", "s12"];
		const hasBlockedCategory = categories.some(cat => blockedCategories.includes(cat.toLowerCase()));

		return {
			safe: !hasBlockedCategory,
			categories: categories
		};
	} catch (error) {
		// Fail open: if AI is unavailable, allow the message through
		console.error("AI moderation failed:", error);
		return { safe: true };
	}
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS for local development
app.use("/*", cors());

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
	if (trimmedMessage.length < 15) {
		return c.json({ error: "Message must be at least 15 characters" }, 400);
	}
	if (trimmedMessage.length > 300) {
		return c.json({ error: "Message must be 300 characters or less" }, 400);
	}

	// Determine how many bottles to receive based on message length
	let bottlesToReceive = 1;
	if (trimmedMessage.length >= 151) {
		bottlesToReceive = 3;
	} else if (trimmedMessage.length >= 61) {
		bottlesToReceive = 2;
	}

	// Check for URLs/hyperlinks (fast-fail to prevent scam sites)
	if (containsURL(trimmedMessage)) {
		return c.json({ error: "Messages with links are not allowed" }, 400);
	}

	// AI content moderation
	const moderation = await moderateContent(c.env.AI, trimmedMessage);

	console.log(moderation)

	if (!moderation.safe) {
		return c.json({ error: "Your message contains inappropriate content and cannot be sent" }, 400);
	}

	// Validate nickname if provided
	const trimmedNickname = nickname?.trim() || null;
	if (trimmedNickname && trimmedNickname.length > 30) {
		return c.json({ error: "Nickname must be 30 characters or less" }, 400);
	}

	// Get client IP address
	const clientIp = c.req.header("CF-Connecting-IP")
		|| c.req.header("X-Forwarded-For")?.split(",")[0]?.trim()
		|| null;

	// Get next id_asc value
	const maxResult = await db.select({ maxId: max(bottles.id_asc) }).from(bottles);
	const nextIdAsc = (maxResult[0]?.maxId ?? 0) + 1;

	// Insert the new bottle
	const insertedBottle = await db.insert(bottles).values({
		id: nanoid(),
		id_asc: nextIdAsc,
		message: trimmedMessage,
		nickname: trimmedNickname,
		country: country?.trim() || null,
		ip: clientIp,
		status: "active",
	}).returning();

	const newBottleId = insertedBottle[0].id;

	// Get random bottles (exclude the one just thrown and reported ones)
	const randomBottles = await db
		.select()
		.from(bottles)
		.where(and(
			eq(bottles.status, "active"),
			ne(bottles.id, newBottleId)
		))
		.orderBy(sql`RANDOM()`)
		.limit(bottlesToReceive);

	const received: Array<Omit<Bottle, "status" | "created_at" | "ip">> = randomBottles.map(bottle => ({
		id: bottle.id,
		id_asc: bottle.id_asc,
		message: bottle.message,
		nickname: bottle.nickname,
		country: bottle.country,
		like_count: bottle.like_count,
		report_count: bottle.report_count,
	}));

	return c.json({ sent: true, received });
});

// Report a bottle (increment report_count)
app.post("/api/bottles/:id/report", async (c) => {
	const db = getDb(c.env.DB);
	const id = c.req.param("id");

	if (!id) {
		return c.json({ error: "Invalid bottle ID" }, 400);
	}

	const result = await db.update(bottles)
		.set({ report_count: sql`report_count + 1` })
		.where(eq(bottles.id, id))
		.returning();

	if (result.length === 0) {
		return c.json({ error: "Bottle not found" }, 404);
	}

	return c.json({ reported: true, report_count: result[0].report_count });
});

// Like a bottle (increment like_count)
app.post("/api/bottles/:id/like", async (c) => {
	const db = getDb(c.env.DB);
	const id = c.req.param("id");

	if (!id) {
		return c.json({ error: "Invalid bottle ID" }, 400);
	}

	const result = await db.update(bottles)
		.set({ like_count: sql`like_count + 1` })
		.where(eq(bottles.id, id))
		.returning();

	if (result.length === 0) {
		return c.json({ error: "Bottle not found" }, 404);
	}

	return c.json({ liked: true, like_count: result[0].like_count });
});

export default app;
