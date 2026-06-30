import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { type NextRequest, NextResponse } from "next/server";

function getPineconeApiKey(): string {
  const key = process.env.PINECONE_API_KEY;
  if (!key) throw new Error("Missing PINECONE_API_KEY");
  return key;
}

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY");
  return key;
}

export async function POST(req: NextRequest) {
  try {
    const { query, locale } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const pc = new Pinecone({ apiKey: getPineconeApiKey() });
    const indexName =
      process.env.PINECONE_INDEX_NAME ?? "llama-text-embed-v2-index";
    const index = pc.index(indexName);

    const searchResult = await index.searchRecords({
      query: { topK: 5, inputs: { text: query } },
      fields: ["nodeId", "description", "resourceTitles", "resourceUrls"],
    });

    const matches = searchResult.result?.hits ?? [];

    if (matches.length === 0) {
      return NextResponse.json({
        answer:
          locale === "mn"
            ? "Уучлаарай, энэ асуултад хариулах мэдээлэл олдсонгүй."
            : "Sorry, I couldn't find relevant information for that question.",
        sources: [],
      });
    }

    const context = matches
      .map((m, i) => {
        const fields = m.fields as Record<string, unknown>;
        return `[${i + 1}] ${fields.nodeId}: ${fields.description}`;
      })
      .join("\n\n");

    const systemPrompt =
      locale === "mn"
        ? `Чи DevDreams платформын AI туслах. Дараах roadmap topic-уудын мэдээллийг ашиглан хэрэглэгчийн асуултад Монгол хэлээр товч, тодорхой хариулна. Зөвхөн өгөгдсэн context-д тулгуурлан хариул.\n\nContext:\n${context}`
        : `You are the DevDreams platform AI assistant. Using the following roadmap topic information, answer the user's question concisely and clearly. Only base your answer on the given context.\n\nContext:\n${context}`;

    const ai = new GoogleGenAI({ apiKey: getGeminiApiKey() });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: query,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 500,
      },
    });

    const answer =
      response.text ??
      (locale === "mn"
        ? "Хариулт үүсгэхэд алдаа гарлаа."
        : "Failed to generate answer.");

    const sources = matches.slice(0, 3).map((m) => {
      const fields = m.fields as Record<string, unknown>;
      return {
        nodeId: String(fields.nodeId ?? ""),
        score: m._score ?? 0,
      };
    });

    return NextResponse.json({ answer, sources });
  } catch (err) {
    console.error("[chat] error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
