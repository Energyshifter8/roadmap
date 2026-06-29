import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

/* Load .env.local */
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

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RawNode {
  id: string;
  data?: { label?: string };
  [key: string]: unknown;
}

function extractLabel(node: RawNode): string {
  return node.data?.label ?? node.id ?? "unknown";
}

function toKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

const BACKEND_URL =
  "https://raw.githubusercontent.com/nilbuild/developer-roadmap/refs/heads/master/src/data/roadmaps/backend/backend.json";

async function main() {
  console.log("========================================");
  console.log("  DevDreams — Backend Roadmap Seeder");
  console.log("========================================\n");

  /* ---- 1. Initialize Firebase Admin ---- */

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.error("✖ Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local");
    process.exit(1);
  }

  try {
    if (!getApps().length) {
      const saPath = resolve(__dirname, "../../firebase-admin.json");
      if (existsSync(saPath)) {
        const sa = JSON.parse(readFileSync(saPath, "utf-8"));
        initializeApp({ credential: cert(sa), projectId });
        console.log("✓ Firebase Admin initialized (firebase-admin.json)\n");
      } else {
        initializeApp({ projectId });
        console.log("✓ Firebase Admin initialized (application default)\n");
      }
    }
  } catch (err) {
    console.error("✖ Failed to initialize Firebase Admin:", err);
    process.exit(1);
  }

  const firestore = getFirestore();

  /* ---- 2. Fetch backend roadmap JSON ---- */

  process.stdout.write("  Fetching backend roadmap... ");
  let nodes: RawNode[];
  try {
    const res = await fetch(BACKEND_URL, { signal: AbortSignal.timeout(15_000) });
    if (!res.ok) {
      console.log(`✖ HTTP ${res.status}`);
      process.exit(1);
    }
    const data: { nodes?: RawNode[] } = await res.json();
    nodes = data.nodes ?? [];
    console.log(`✓ (${nodes.length} nodes)\n`);
  } catch (err) {
    console.log(`✖ ${err instanceof Error ? err.message : "unknown error"}`);
    process.exit(1);
  }

  if (nodes.length === 0) {
    console.warn("⚠ No nodes found. Nothing to seed.");
    process.exit(0);
  }

  /* ---- 3. Build unique slugs from node labels ---- */

  const seen = new Set<string>();
  const slugs: { slug: string; label: string }[] = [];

  for (const node of nodes) {
    if (!node.id) continue;
    const label = extractLabel(node);
    const slug = toKey(label);
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    slugs.push({ slug, label });
  }

  console.log(`  Discovered ${slugs.length} unique topics\n`);

  /* ---- 4. Check Firestore & create missing docs ---- */

  const collectionRef = firestore.collection("roadmap_details");
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < slugs.length; i++) {
    const { slug, label } = slugs[i];
    const docRef = collectionRef.doc(slug);
    const snap = await docRef.get();

    if (snap.exists) {
      skipped++;
      continue;
    }

    await docRef.set({
      title: label,
      description: "",
      resources: [],
    });

    created++;
    if (created % 20 === 0 || created === 1) {
      console.log(`  ✓ Created ${created}/${slugs.length} — "${label}"`);
    }
  }

  /* ---- 5. Merge rich content for known topics ---- */

  interface RichTopic {
    title: string;
    description: string;
    resources: Array<{ id: number; title: string; url: string }>;
  }

  const richContent: Record<string, RichTopic> = {
    internet: {
      title: "How does the Internet work?",
      description:
        "Интернэт бол дэлхий даяарх сая сая компьютеруудыг холбосон аварга том сүлжээ юм. Backend хөгжүүлэгчийн хувьд DNS, IP хаягжилт, Хөтөч (Browser) болон Сервер хоорондын харилцааг заавал мэдэх шаардлагатай.",
      resources: [
        {
          id: 1,
          title: "MDN - How does the Internet work?",
          url: "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work",
        },
      ],
    },
    http: {
      title: "What is HTTP?",
      description:
        "HTTP нь вэб дээр өгөгдөл дамжуулах үндсэн протокол юм. Backend хөгжүүлэгч нь Request/Response бүтэц, HTTP аргууд (GET, POST) болон Статус кодуудыг (2xx, 4xx, 5xx) нэвт шувт мэдэх ёстой.",
      resources: [
        {
          id: 1,
          title: "HTTP Status Codes Guide",
          url: "https://httpstatuses.com/",
        },
      ],
    },
    postgresql: {
      title: "PostgreSQL",
      description:
        "PostgreSQL нь дэлхийн хамгийн дэвшилтэт, нээлттэй эх үүсвэртэй харилцаат өгөгдлийн сан (RDBMS) юм. ACID зарчмыг бүрэн хангадаг, өндөр ачаалал даах чадвартай тул backend-ийн стандарт сонголт болдог.",
      resources: [
        {
          id: 1,
          title: "PostgreSQL Official Docs",
          url: "https://www.postgresql.org/docs/",
        },
      ],
    },
    apis: {
      title: "Learn about APIs",
      description:
        "REST (Representational State Transfer) болон бусад API архитектурууд нь вэб системүүд хоорондоо HTTP протокол ашиглан өгөгдөл (JSON) солилцох үндсэн арга зам юм.",
      resources: [
        {
          id: 1,
          title: "REST API Best Practices",
          url: "https://restfulapi.net/",
        },
      ],
    },
  };

  let merged = 0;

  for (const [slug, data] of Object.entries(richContent)) {
    const docRef = collectionRef.doc(slug);
    await docRef.set(data, { merge: true });
    merged++;
    console.log(`  ✓ Merged "${data.title}"`);
  }

  /* ---- 6. Summary ---- */

  console.log("\n========================================");
  console.log("  Seed Summary");
  console.log("========================================");
  console.log(`  Total unique topics: ${slugs.length}`);
  console.log(`  Created:            ${created}`);
  console.log(`  Skipped (existed):  ${skipped}`);
  console.log(`  Merged (rich):      ${merged}`);
  console.log(`  Collection:         roadmap_details`);
  console.log("========================================\n");
}

main().catch((err) => {
  console.error("\n✖ Fatal error:", err);
  process.exit(1);
});
