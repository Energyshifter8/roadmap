export type NodeLevel =
  | "root"
  | "section"
  | "topic"
  | "recommended"
  | "optional"
  | "note";

export interface RoadmapNode {
  id: string;
  titleKey: string;
  level: NodeLevel;
  description?: string;
  parentId: string;
  side?: "left" | "right";
  links?: Array<{ title: string; url: string }>;
}

export type RoadmapSection = {
  node: RoadmapNode;
  left: RoadmapNode[];
  right: RoadmapNode[];
};

const rd = (
  id: string,
  titleKey: string,
  level: NodeLevel,
  parentId: string,
  description?: string,
  side?: "left" | "right",
): RoadmapNode => ({ id, titleKey, level, parentId, description, side });

export const frontendSections: RoadmapSection[] = [
  {
    node: rd("internet", "internet", "section", "root"),
    left: [],
    right: [
      rd(
        "how-internet",
        "how-internet",
        "topic",
        "internet",
        "Understand packets, routers, protocols and how data travels between computers.",
        "right",
      ),
      rd(
        "what-http",
        "what-http",
        "topic",
        "internet",
        "HTTP is the protocol for data communication on the web. Learn requests, responses, and status codes.",
        "right",
      ),
      rd(
        "what-domain",
        "what-domain",
        "topic",
        "internet",
        "A domain name is a human-readable address for a website.",
        "right",
      ),
      rd(
        "what-hosting",
        "what-hosting",
        "topic",
        "internet",
        "Web hosting makes your website accessible on the internet.",
        "right",
      ),
      rd(
        "dns",
        "dns",
        "topic",
        "internet",
        "DNS translates domain names into IP addresses.",
        "right",
      ),
      rd(
        "browsers",
        "browsers",
        "topic",
        "internet",
        "Learn about parsing HTML/CSS, the DOM, render tree, layout and painting.",
        "right",
      ),
    ],
  },
  {
    node: rd("html", "html", "section", "internet"),
    left: [],
    right: [],
  },
  {
    node: rd("css", "css", "section", "html"),
    left: [],
    right: [],
  },
  {
    node: rd("js", "js", "section", "css"),
    left: [],
    right: [],
  },
  {
    node: rd("vcs", "vcs", "section", "js"),
    left: [
      rd(
        "git",
        "git",
        "recommended",
        "vcs",
        "Git is the industry-standard version control system.",
        "left",
      ),
    ],
    right: [],
  },
  {
    node: rd("vcs-hosting", "vcs-hosting", "section", "vcs"),
    left: [
      rd(
        "gitlab",
        "gitlab",
        "topic",
        "vcs-hosting",
        "GitLab is a DevOps platform with Git repository hosting and CI/CD.",
        "left",
      ),
      rd(
        "github",
        "github",
        "recommended",
        "vcs-hosting",
        "GitHub is the most popular platform for hosting Git repositories.",
        "left",
      ),
    ],
    right: [],
  },
  {
    node: rd("intermediate", "intermediate", "note", "vcs-hosting"),
    left: [],
    right: [],
  },
  {
    node: rd("pkg", "pkg", "section", "vcs-hosting"),
    left: [],
    right: [
      rd(
        "npm",
        "npm",
        "topic",
        "pkg",
        "Default package manager for Node.js.",
        "right",
      ),
      rd(
        "yarn",
        "yarn",
        "topic",
        "pkg",
        "Fast, reliable package manager with workspaces support.",
        "right",
      ),
      rd(
        "pnpm",
        "pnpm",
        "recommended",
        "pkg",
        "Fast, disk-efficient package manager using hard links.",
        "right",
      ),
      rd(
        "bun",
        "bun",
        "topic",
        "pkg",
        "All-in-one JavaScript runtime and package manager.",
        "right",
      ),
    ],
  },
  {
    node: rd("css-fw", "css-fw", "section", "pkg"),
    left: [],
    right: [
      rd(
        "tailwind",
        "tailwind",
        "recommended",
        "css-fw",
        "Utility-first CSS framework for rapid UI development.",
        "right",
      ),
    ],
  },
  {
    node: rd("framework", "framework", "section", "css-fw"),
    left: [
      rd(
        "react",
        "react",
        "recommended",
        "framework",
        "Most popular UI library. Learn components, hooks, and state management.",
        "left",
      ),
      rd(
        "vue",
        "vue",
        "topic",
        "framework",
        "Progressive framework for building UIs with gentle learning curve.",
        "left",
      ),
      rd(
        "angular",
        "angular",
        "topic",
        "framework",
        "Full-featured TypeScript framework by Google.",
        "left",
      ),
      rd(
        "svelte",
        "svelte",
        "topic",
        "framework",
        "Compiler-based framework with no virtual DOM.",
        "left",
      ),
      rd(
        "solidjs",
        "solidjs",
        "optional",
        "framework",
        "Reactive UI library with fine-grained reactivity.",
        "left",
      ),
    ],
    right: [rd("ai-dev", "ai-dev", "note", "framework", undefined, "right")],
  },
  {
    node: rd("ai-coding", "ai-coding", "section", "framework"),
    left: [
      rd(
        "claude-code",
        "claude-code",
        "recommended",
        "ai-coding",
        "Anthropic's AI coding assistant that works in your terminal.",
        "left",
      ),
      rd(
        "cursor",
        "cursor",
        "topic",
        "ai-coding",
        "AI-powered code editor built on VS Code.",
        "left",
      ),
      rd(
        "github-copilot",
        "github-copilot",
        "topic",
        "ai-coding",
        "AI pair programmer by GitHub and OpenAI.",
        "left",
      ),
    ],
    right: [
      rd(
        "ai-basics",
        "ai-basics",
        "topic",
        "ai-coding",
        "Understand prompt engineering and how to effectively use AI coding tools.",
        "right",
      ),
    ],
  },
  {
    node: rd("writing-css", "writing-css", "section", "ai-coding"),
    left: [],
    right: [
      rd(
        "tailwind2",
        "tailwind2",
        "recommended",
        "writing-css",
        "Utility-first CSS framework.",
        "right",
      ),
      rd(
        "css-modules",
        "css-modules",
        "topic",
        "writing-css",
        "Locally scoped CSS classes to avoid naming conflicts.",
        "right",
      ),
      rd(
        "styled-components",
        "styled-components",
        "topic",
        "writing-css",
        "CSS-in-JS library for React components.",
        "right",
      ),
    ],
  },
  {
    node: rd("build", "build", "section", "writing-css"),
    left: [],
    right: [
      rd(
        "vite",
        "vite",
        "recommended",
        "build",
        "Next-generation build tool using native ES modules.",
        "right",
      ),
      rd(
        "webpack",
        "webpack",
        "topic",
        "build",
        "Most widely used module bundler.",
        "right",
      ),
      rd(
        "esbuild",
        "esbuild",
        "topic",
        "build",
        "Extremely fast JavaScript bundler.",
        "right",
      ),
    ],
  },
  {
    node: rd("testing", "testing", "section", "build"),
    left: [],
    right: [
      rd(
        "vitest",
        "vitest",
        "recommended",
        "testing",
        "Vite-native unit test framework.",
        "right",
      ),
      rd(
        "playwright",
        "playwright",
        "topic",
        "testing",
        "End-to-end testing across all browsers.",
        "right",
      ),
      rd(
        "cypress",
        "cypress",
        "topic",
        "testing",
        "Browser-based end-to-end testing tool.",
        "right",
      ),
    ],
  },
  {
    node: rd("auth", "auth", "section", "testing"),
    left: [
      rd(
        "jwt",
        "jwt",
        "topic",
        "auth",
        "JSON Web Tokens for stateless authentication.",
        "left",
      ),
      rd(
        "oauth",
        "oauth",
        "topic",
        "auth",
        "Open standard for access delegation.",
        "left",
      ),
      rd(
        "session",
        "session",
        "topic",
        "auth",
        "Server-side session management.",
        "left",
      ),
    ],
    right: [],
  },
  {
    node: rd("security", "security", "section", "auth"),
    left: [],
    right: [
      rd(
        "https",
        "https",
        "topic",
        "security",
        "Encrypts data in transit using TLS/SSL.",
        "right",
      ),
      rd(
        "cors",
        "cors",
        "topic",
        "security",
        "Controls cross-origin resource sharing.",
        "right",
      ),
      rd(
        "owasp",
        "owasp",
        "topic",
        "security",
        "Learn the top 10 web security vulnerabilities.",
        "right",
      ),
    ],
  },
  {
    node: rd("ssr", "ssr", "section", "security"),
    left: [
      rd(
        "nextjs",
        "nextjs",
        "recommended",
        "ssr",
        "React framework with SSR, SSG, ISR and App Router.",
        "left",
      ),
      rd(
        "astro",
        "astro",
        "topic",
        "ssr",
        "Content-focused framework with Islands architecture.",
        "left",
      ),
      rd("nuxt", "nuxt", "topic", "ssr", "SSR/SSG framework for Vue.", "left"),
    ],
    right: [],
  },
  {
    node: rd("perf", "perf", "section", "ssr"),
    left: [],
    right: [
      rd(
        "vitals",
        "vitals",
        "topic",
        "perf",
        "LCP, FID, CLS — Googles key performance metrics.",
        "right",
      ),
      rd(
        "lighthouse",
        "lighthouse",
        "topic",
        "perf",
        "Audit performance, accessibility, and SEO.",
        "right",
      ),
      rd(
        "lazy",
        "lazy",
        "topic",
        "perf",
        "Defer loading non-critical resources.",
        "right",
      ),
    ],
  },
];
