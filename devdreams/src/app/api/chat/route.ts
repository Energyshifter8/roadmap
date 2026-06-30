import { Pinecone } from "@pinecone-database/pinecone";
import Groq from "groq-sdk";
import { type NextRequest, NextResponse } from "next/server";

function getPineconeApiKey(): string {
  const key = process.env.PINECONE_API_KEY;
  if (!key) throw new Error("Missing PINECONE_API_KEY");
  return key;
}

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("Missing GROQ_API_KEY");
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
        ? `Чи DevDreams платформын AI туслах. Дараах roadmap topic-уудын мэдээллийг ашиглан хэрэглэгчийн асуултад Монгол хэлээр товч, тодорхой хариулна. Зөвхөн өгөгдсөн context-д тулгуурлан хариул. Context-д байхгүй зүйлийг өөрөөр зохиож хариулахгүй.\n\nContext:\n${context}`
        : `You are the DevDreams platform AI assistant. Using the following roadmap topic information, answer the user's question concisely and clearly. Only base your answer on the given context. Don't make up information not in the context.\n\nContext:\n${context}`;

    const groq = new Groq({ apiKey: getGroqApiKey() });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      max_tokens: 500,
      temperature: 0.5,
    });

    const answer =
      completion.choices[0]?.message?.content ??
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
