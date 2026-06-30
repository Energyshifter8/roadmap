import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Pinecone } from "@pinecone-database/pinecone";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) process.env[key] = value;
  }
}

async function main() {
  console.log("========================================");
  console.log("  DevDreams — Roadmap Embedder (Pinecone-native)");
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

  const pineconeApiKey = process.env.PINECONE_API_KEY;
  if (!pineconeApiKey) {
    console.error("✖ Missing PINECONE_API_KEY");
    process.exit(1);
  }
  const pc = new Pinecone({ apiKey: pineconeApiKey });
  const indexName =
    process.env.PINECONE_INDEX_NAME ?? "llama-text-embed-v2-index";

  console.log(`  Using Pinecone index: ${indexName}\n`);

  const indexDescription = await pc.describeIndex(indexName);
  const fieldMap = indexDescription.embed?.fieldMap as
    | Record<string, string>
    | undefined;
  const textField = fieldMap ? Object.values(fieldMap)[0] : "text";
  console.log(
    `  Index model:       ${JSON.stringify(indexDescription.embed?.model ?? "unknown")}`,
  );
  console.log(`  Index dimension:   ${indexDescription.dimension}`);
  console.log(`  Embed fieldMap:    ${JSON.stringify(fieldMap)}`);
  console.log(`  Using text field:  "${textField}"\n`);

  const index = pc.index(indexName);

  console.log("  Fetching all roadmap_details from Firestore...");
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

  console.log(
    `  Upserting records with Pinecone-native embedding (batches of 50, field="${textField}")...`,
  );
  const batchSize = 50;
  let processed = 0;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize);

    const records = batch.map((d) => ({
      id: d.id,
      [textField]: `${d.nodeId}: ${d.description}`,
      nodeId: d.nodeId,
      description: d.description.slice(0, 1000),
      resourceTitles: d.resources?.map((r) => r.title).join(" | ") ?? "",
      resourceUrls: d.resources?.map((r) => r.url).join(" | ") ?? "",
    }));

    await index.upsertRecords({ records });

    processed += batch.length;
    console.log(`  ✓ Upserted ${processed}/${docs.length}`);
  }

  console.log("\n========================================");
  console.log("  Embedding Summary");
  console.log("========================================");
  console.log(`  Total documents:  ${docs.length}`);
  console.log(`  Pinecone index:   ${indexName}`);
  console.log(`  Text field:       "${textField}"`);
  console.log(`  Embedding model:  Pinecone-native (no OpenAI needed)`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("\n✖ Fatal error:", err);
  process.exit(1);
});
