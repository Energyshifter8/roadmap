import Anthropic from "@anthropic-ai/sdk";
import { Pinecone } from "@pinecone-database/pinecone";
import { type NextRequest, NextResponse } from "next/server";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { query, locale } = await req.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    const indexName =
      process.env.PINECONE_INDEX_NAME ?? "llama-text-embed-v2-index";
    const index = pc.index(indexName);

    const searchResult = await index.searchRecords({
      query: {
        topK: 5,
        inputs: { text: query },
      },
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
        ? `Чи DevDreams платформын AI туслах. Дараах roadmap topic-уудын мэдээллийг ашиглан хэрэглэгчийн асуултад Монгол хэлээр товч, тодорхой хариулна. Зөвхөн өгөгдсэн context-д тулгуурлан хариул. Context-д байхгүй зүйлийг өөрөөр зохиож хариулахгүй.\n\nContext:\n${context}`
        : `You are the DevDreams platform AI assistant. Using the following roadmap topic information, answer the user's question concisely and clearly. Only base your answer on the given context. Don't make up information not in the context.\n\nContext:\n${context}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: query }],
    });

    const answerBlock = response.content.find((b) => b.type === "text");
    const answer =
      answerBlock?.type === "text" ? answerBlock.text : "No answer generated.";

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
