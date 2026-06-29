import { type NextRequest, NextResponse } from "next/server";
import {
  transformGithubJSON,
  type MilestoneMap,
} from "@/lib/transformToSections";

const URLS: Record<string, string> = {
  frontend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/refs/heads/master/src/data/roadmaps/frontend/frontend.json",
  backend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/refs/heads/master/src/data/roadmaps/backend/backend.json",
  devops:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/refs/heads/master/src/data/roadmaps/devops/devops.json",
  mobile:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/refs/heads/master/src/data/roadmaps/android/android.json",
};

const MILESTONES_BACKEND: MilestoneMap = {
  "internet": 1,
  "pick-a-language": 3,
  "version-control-systems": 4,
  "repo-hosting-services": 4,
  "relational-databases": 5,
  "more-about-databases": 5,
  "scaling-databases": 5,
  "nosql-databases": 5,
  "learn-about-apis": 6,
  "caching": 6,
  "message-brokers": 6,
  "search-engines": 6,
  "web-servers": 6,
  "real-time-data": 6,
  "web-security": 7,
  "testing": 7,
  "containerization-vs-virtualization": 8,
  "ci-cd": 8,
};

const MILESTONE_TITLES: Record<number, string> = {
  1: "Introduction & How the Internet Works",
  3: "Pick a Language",
  4: "Version Control & Repo Hosting",
  5: "Relational & NoSQL Databases",
  6: "APIs, Caching & Real-Time Communication",
  7: "Testing & Web Security",
  8: "Containerization & CI/CD",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const url = URLS[type];
  if (!url) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const raw = await res.json();
    const milestoneMap = type === "backend" ? MILESTONES_BACKEND : undefined;
    const milestoneTitles =
      type === "backend" ? MILESTONE_TITLES : undefined;
    const { sections, labelMap } = transformGithubJSON(raw, milestoneMap);
    return NextResponse.json({ sections, labelMap, milestoneTitles });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
