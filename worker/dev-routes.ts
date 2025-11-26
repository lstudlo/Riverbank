import { Hono } from "hono";
import { getDb, bottles } from "./db";
import { nanoid } from "nanoid";
import { max } from "drizzle-orm";

const devRoutes = new Hono<{ Bindings: Env }>();

// Generate fake bottles for development/testing
devRoutes.post("/generate-bottles", async (c) => {
	const db = getDb(c.env.DB);

	try {
		// Generate 10 fake bottles using AI
		const prompt = `You are a creative writer generating authentic message-in-a-bottle content.

Task: Generate 10 diverse, heartfelt message-in-a-bottle entries. Each should feel authentic and human. Include a variety of emotions: hope, nostalgia, dreams, confessions, gratitude, loneliness, joy, reflection, questions, and wishes.

Output ONLY valid JSON array with this exact structure (no markdown, no extra text):
[
  {"message": "string (20-250 chars)", "nickname": "string (3-20 chars)", "country": "string (country name)"},
  {"message": "string (20-250 chars)", "nickname": "string (3-20 chars)", "country": "string (country name)"},
  ...10 entries total
]

Requirements:
- Messages: 20-250 characters, emotional and authentic
- Nicknames: Creative but believable (e.g., "DreamChaser", "Luna", "WandererSoul")
- Countries: Mix of countries from different continents
- Vary the tone and content across all 10 messages
- Output ONLY the JSON array, nothing else`;

		// @ts-ignore
		const response = await c.env.AI.run("@cf/openai/gpt-oss-20b", {
			input: prompt
		}) as any;

		console.log("AI Response:", response);

		// Extract the text response from the AI response object
		let rawResponse = "";
		if (typeof response === "string") {
			rawResponse = response;
		} else if (response?.output && Array.isArray(response.output)) {
			// GPT-OSS-20B returns output as an array with message objects
			const messageOutput = response.output.find((item: any) => item.type === "message");
			if (messageOutput?.content && Array.isArray(messageOutput.content)) {
				// Extract text from content array (type can be 'text' or 'output_text')
				const textContent = messageOutput.content.find((c: any) => c.text);
				if (textContent?.text) {
					rawResponse = textContent.text;
				} else {
					console.error("No text found in message content:", messageOutput.content);
					return c.json({ error: "No text found in AI response", debug: JSON.stringify(response) }, 500);
				}
			} else {
				console.error("No content found in message output:", messageOutput);
				return c.json({ error: "No content in AI response", debug: JSON.stringify(response) }, 500);
			}
		} else if (response?.response) {
			rawResponse = String(response.response);
		} else if (response?.result?.response) {
			rawResponse = String(response.result.response);
		} else {
			console.error("Unexpected AI response format:", response);
			return c.json({ error: "AI returned unexpected response format", debug: JSON.stringify(response) }, 500);
		}

		// Clean up response (remove markdown code blocks if present)
		const cleanedResponse = rawResponse
			.replace(/```json\n?/g, "")
			.replace(/```\n?/g, "")
			.trim();

		console.log("Cleaned Response:", cleanedResponse);

		// Parse the AI response
		const generatedData = JSON.parse(cleanedResponse);

		if (!Array.isArray(generatedData) || generatedData.length === 0) {
			return c.json({ error: "AI did not generate valid data" }, 500);
		}

		// Get next id_asc value
		const maxResult = await db.select({ maxId: max(bottles.id_asc) }).from(bottles);
		let nextIdAsc = (maxResult[0]?.maxId ?? 0) + 1;

		// Insert all generated bottles
		const insertedBottles = [];
		for (const item of generatedData.slice(0, 10)) {
			const inserted = await db.insert(bottles).values({
				id: nanoid(),
				id_asc: nextIdAsc++,
				message: item.message.trim(),
				nickname: item.nickname?.trim() || null,
				country: item.country?.trim() || null,
				ip: "127.0.0.1", // Dev IP
				status: "active",
			}).returning();

			insertedBottles.push(inserted[0]);
		}

		return c.json({
			success: true,
			generated: insertedBottles.length,
			bottles: insertedBottles.map(b => ({
				id: b.id,
				message: b.message,
				nickname: b.nickname,
				country: b.country
			}))
		});

	} catch (error) {
		console.error("Fake data generation failed:", error);
		return c.json({
			error: "Failed to generate fake data",
			details: error instanceof Error ? error.message : String(error)
		}, 500);
	}
});

export default devRoutes;
