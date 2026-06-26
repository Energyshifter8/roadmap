#  DevDreams

**DevDreams** — The beginner roadmap.

### Data Flow Pipelines
1. **Roadmap:** GitHub JSON ➔ `/api/roadmap` ➔ `transformToSections` ➔ `RoadmapCanvas`.
2. **Details:** `RoadmapCanvas` (Click) ➔ `Firestore` ➔ `vaul Drawer`.
3. **Tracking:** `localStorage` ашиглан хэрэглэгчийн явцыг хадгална.

##  Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Firebase (Firestore)
- **i18n:** next-intl (cookie-based)

##  Project Structure
```text
devdreams/
├── src/
│   ├── app/              # App Router (Pages & API)
│   ├── components/       # RoadmapCanvas, Navbar, Drawer
│   ├── lib/              # Adapters & Firebase SDK
│   ├── data/             # Static fallback data
│   └── messages/         # i18n JSON files
├── scripts/              # Firestore seeder
└── next.config.ts
# 1. Install dependencies
pnpm install

# 2. Setup .env.local and firebase-admin.json
# 3. Seed Database
pnpm db:seed

# 4. Run Development
pnpm dev
