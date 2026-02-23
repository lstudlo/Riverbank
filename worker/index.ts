import { Hono } from "hono";
import { cors } from "hono/cors";
import { eq, ne, and, sql, max } from "drizzle-orm";
import { getDb, bottles, falsePositiveReports, type Bottle } from "./db";
import { nanoid } from "nanoid";
import devRoutes from "./dev-routes";

// Helper to get client IP address
function getClientIP(c: any): string {
	return c.req.header("CF-Connecting-IP")
		|| c.req.header("X-Forwarded-For")?.split(",")[0]?.trim()
		|| "unknown";
}

// URL/hyperlink detection to prevent scam sites
function containsURL(text: string): boolean {
	const urlPatterns = [
		/https?:\/\//i,  // http:// or https://
		/www\./i,        // www.
		/\.(com|org|net|edu|gov|io|co|app|dev|xyz|info|biz|me|ai|tech|online|site|store|shop|blog|tv|cc|link|click|ly|gl|bit|tinyurl)\b/i  // common TLDs
	];
	return urlPatterns.some(pattern => pattern.test(text));
}

// AI content moderation using Llama 3.1
async function moderateContent(ai: Ai, content: string): Promise<{ safe: boolean }> {
	try {
		//@ts-ignore
		const response = await ai.run("@cf/meta/llama-3.1-8b-instruct-fp8-fast", {
			messages: [
				{
					role: "system",
					content: "You are a content moderator. Return only '1' only if you fully sure the context of the content contains hate, violence, spam, scam, or PII. Return only '0' if it is safe. Output the integer only, nothing else."
				},
				{
					role: "user",
					content: `Evaluate: ${content}`
				}
			]
		}) as any;

		const result = typeof response === "string" ? response : String(response?.response || "");
		console.log({ safe: result.trim() !== "1" });
		return { safe: result.trim() !== "1" };
	} catch (error) {
		console.error("AI moderation failed:", error);
		return { safe: true };
	}
}

const app = new Hono<{ Bindings: Env }>();

// Enable CORS with specific origins
app.use("/*", cors({
	origin: (origin) => {
		// Allow localhost for development
		if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
			return origin;
		}
		// Allow production domains
		if (origin === "https://riverbank.day" || origin === "https://uat-riverbank-day.workers.dev") {
			return origin;
		}
		// Deny all other origins
		return null;
	},
	allowMethods: ["POST", "GET", "OPTIONS"],
	credentials: true,
}));

// ============================================
// Bottle Exchange API
// ============================================

// Throw a bottle and receive one in return
// Rate limit: 5 requests per minute per IP
app.post("/api/bottles/throw", async (c) => {
	// Rate limiting check
	const { success } = await c.env.THROW_RATE_LIMITER.limit({ key: getClientIP(c) });
	if (!success) {
		return c.json({ error: "Too many requests. Please try again later." }, 429);
	}
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

	// Validate nickname if provided
	const trimmedNickname = nickname?.trim() || null;
	if (trimmedNickname && trimmedNickname.length > 30) {
		return c.json({ error: "Nickname must be 30 characters or less" }, 400);
	}

	// AI content moderation (combine message and nickname)
	const contentToModerate = trimmedNickname
		? `Message: ${trimmedMessage}\nNickname: ${trimmedNickname}`
		: trimmedMessage;

	const moderation = await moderateContent(c.env.AI, contentToModerate);
	if (!moderation.safe) {
		return c.json({ error: "Your content contains inappropriate content and cannot be sent" }, 400);
	}

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
		ip: getClientIP(c),
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
		emoji_reactions: bottle.emoji_reactions,
		report_count: bottle.report_count,
	}));

	return c.json({ sent: true, received });
});

// Report a bottle (increment report_count)
// Rate limit: 20 reports per minute per IP
app.post("/api/bottles/:id/report", async (c) => {
	// Rate limiting check
	const { success } = await c.env.ACTION_RATE_LIMITER.limit({ key: `report:${getClientIP(c)}` });
	if (!success) {
		return c.json({ error: "Too many requests. Please try again later." }, 429);
	}
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

// React to a bottle with an emoji (toggle behavior)
// Rate limit: 20 reactions per minute per IP
app.post("/api/bottles/:id/react", async (c) => {
	// Rate limiting check
	const { success } = await c.env.ACTION_RATE_LIMITER.limit({ key: `react:${getClientIP(c)}` });
	if (!success) {
		return c.json({ error: "Too many requests. Please try again later." }, 429);
	}
	const db = getDb(c.env.DB);
	const id = c.req.param("id");
	const body = await c.req.json<{ emoji: string; action?: "add" | "remove" }>();
	const { emoji, action = "add" } = body;

	if (!id) {
		return c.json({ error: "Invalid bottle ID" }, 400);
	}

	if (!emoji || typeof emoji !== "string") {
		return c.json({ error: "Invalid emoji" }, 400);
	}

	// Get the current bottle
	const currentBottle = await db.select().from(bottles).where(eq(bottles.id, id)).limit(1);

	if (currentBottle.length === 0) {
		return c.json({ error: "Bottle not found" }, 404);
	}

	// Parse existing reactions
	let reactions: Record<string, number> = {};
	try {
		reactions = JSON.parse(currentBottle[0].emoji_reactions);
	} catch (e) {
		reactions = {};
	}

	const currentCount = reactions[emoji] || 0;

	// Toggle behavior based on action
	if (action === "add") {
		reactions[emoji] = currentCount + 1;
	} else if (action === "remove") {
		// Decrement but never go below 0
		reactions[emoji] = Math.max(0, currentCount - 1);
		// Clean up zero counts
		if (reactions[emoji] === 0) {
			delete reactions[emoji];
		}
	}

	// Update the bottle
	const result = await db.update(bottles)
		.set({ emoji_reactions: JSON.stringify(reactions) })
		.where(eq(bottles.id, id))
		.returning();

	return c.json({ reacted: true, emoji_reactions: result[0].emoji_reactions, action });
});

// Report false positive (message wrongly flagged as inappropriate)
// Rate limit: 5 reports per minute per IP
app.post("/api/false-positive", async (c) => {
	// Rate limiting check
	const { success } = await c.env.FALSE_POSITIVE_RATE_LIMITER.limit({ key: getClientIP(c) });
	if (!success) {
		return c.json({ error: "Too many requests. Please try again later." }, 429);
	}
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

	// Insert the false positive report
	await db.insert(falsePositiveReports).values({
		id: nanoid(),
		message: message.trim(),
		nickname: nickname?.trim() || null,
		country: country?.trim() || null,
		ip: getClientIP(c),
	});

	return c.json({ submitted: true });
});

// ============================================
// Development-only API (DO NOT USE IN PRODUCTION)
// Mount dev routes under /api/dev ONLY in development/uat
// ============================================
app.use("/api/dev/*", async (c, next) => {
	// Block in production
	if (c.env.ENVIRONMENT === "production") {
		return c.json({ error: "Dev endpoints are not available in production" }, 403);
	}
	await next();
});
app.route("/api/dev", devRoutes);

export default app;
