import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const sepIndex = trimmed.indexOf("=");
    if (sepIndex === -1) continue;
    const key = trimmed.slice(0, sepIndex).trim();
    let value = trimmed.slice(sepIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key) process.env[key] = value;
  }
}

async function main() {
  console.log("========================================");
  console.log("  DevDreams — Roadmap Embedder");
  console.log("========================================\n");

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("✖ Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    process.exit(1);
  }

  if (!getApps().length) {
    const saPath = resolve(__dirname, "../../firebase-admin.json");
    if (existsSync(saPath)) {
      const sa = JSON.parse(readFileSync(saPath, "utf-8"));
      initializeApp({ credential: cert(sa), projectId });
    } else {
      initializeApp({ projectId });
    }
  }
  const firestore = getFirestore();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const indexName = process.env.PINECONE_INDEX_NAME ?? "quickstart";

  console.log(`  Using Pinecone index: ${indexName}\n`);

  const existingIndexes = await pc.listIndexes();
  const exists = existingIndexes.indexes?.some((i) => i.name === indexName);

  if (!exists) {
    console.log(`  Creating index "${indexName}"...`);
    await pc.createIndex({
      name: indexName,
      dimension: 1536,
      metric: "cosine",
      spec: { serverless: { cloud: "aws", region: "us-east-1" } },
    });
    console.log("  ✓ Index created, waiting 10s for it to be ready...");
    await new Promise((r) => setTimeout(r, 10000));
  } else {
    console.log(`  ✓ Index "${indexName}" already exists`);
  }

  const index = pc.index(indexName);

  console.log("\n  Fetching all roadmap_details from Firestore...");
  const snapshot = await firestore.collection("roadmap_details").get();
  console.log(`  ✓ Found ${snapshot.size} documents\n`);

  if (snapshot.empty) {
    console.warn("⚠ No documents found. Run seedRoadmap.ts first.");
    process.exit(0);
  }

  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Array<{
    id: string;
    nodeId: string;
    description: string;
    resources: Array<{ title: string; url: string }>;
  }>;

  console.log("  Generating embeddings (batches of 20)...");
  const batchSize = 20;
  let processed = 0;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);

    const texts = batch.map((d) => `${d.nodeId}: ${d.description}`);

    const embeddingRes = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
    });

    const vectors = batch.map((d, idx) => ({
      id: d.id,
      values: embeddingRes.data[idx].embedding,
      metadata: {
        nodeId: d.nodeId,
        description: d.description.slice(0, 1000),
        resourceTitles: d.resources?.map((r) => r.title).join(" | ") ?? "",
        resourceUrls: d.resources?.map((r) => r.url).join(" | ") ?? "",
      },
    }));

    await index.upsert(vectors);
    processed += batch.length;
    console.log(`  ✓ Embedded ${processed}/${docs.length}`);
  }

  console.log("\n========================================");
  console.log("  Embedding Summary");
  console.log("========================================");
  console.log(`  Total documents:  ${docs.length}`);
  console.log(`  Pinecone index:   ${indexName}`);
  console.log(`  Embedding model:  text-embedding-3-small`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("\n✖ Fatal error:", err);
  process.exit(1);
});
