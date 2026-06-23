import { Node, Edge } from '@xyflow/react';

export const frontendNodes: Node[] = [
  // ── ROOT ──────────────────────────────────────────
  { id: 'root', position: { x: 450, y: 0 }, data: { label: 'Frontend Development', level: 'root' }, type: 'roadmapNode' },

  // ── INTERNET (spine y=120) ────────────────────────
  { id: 'internet', position: { x: 450, y: 120 }, data: { label: 'Internet', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'how-internet', position: { x: 150, y: 120 }, data: { label: 'How does the Internet work?', level: 'topic' }, type: 'roadmapNode' },
  { id: 'http', position: { x: 150, y: 180 }, data: { label: 'HTTP/HTTPS', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'browsers', position: { x: 750, y: 120 }, data: { label: 'How Browsers work', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dns', position: { x: 750, y: 180 }, data: { label: 'DNS & Domain Names', level: 'topic' }, type: 'roadmapNode' },

  // ── HTML (spine y=300) ────────────────────────────
  { id: 'html', position: { x: 450, y: 300 }, data: { label: 'HTML', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'html-basics', position: { x: 150, y: 300 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'semantic-html', position: { x: 150, y: 360 }, data: { label: 'Semantic HTML', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'forms', position: { x: 750, y: 300 }, data: { label: 'Forms & Validations', level: 'topic' }, type: 'roadmapNode' },
  { id: 'accessibility', position: { x: 750, y: 360 }, data: { label: 'Accessibility', level: 'topic' }, type: 'roadmapNode' },
  { id: 'seo-basics', position: { x: 750, y: 420 }, data: { label: 'SEO Basics', level: 'topic' }, type: 'roadmapNode' },

  // ── CSS (spine y=540) ─────────────────────────────
  { id: 'css', position: { x: 450, y: 540 }, data: { label: 'CSS', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'css-basics', position: { x: 150, y: 540 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'layouts', position: { x: 150, y: 600 }, data: { label: 'Layouts (Flex/Grid)', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'responsive', position: { x: 750, y: 540 }, data: { label: 'Responsive Design', level: 'topic' }, type: 'roadmapNode' },
  { id: 'css-frameworks', position: { x: 750, y: 600 }, data: { label: 'CSS Frameworks', level: 'topic' }, type: 'roadmapNode' },

  // ── JAVASCRIPT (spine y=720) ──────────────────────
  { id: 'js', position: { x: 450, y: 720 }, data: { label: 'JavaScript', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'js-basics', position: { x: 150, y: 720 }, data: { label: 'JS Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dom', position: { x: 150, y: 780 }, data: { label: 'DOM Manipulation', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'fetch-api', position: { x: 750, y: 720 }, data: { label: 'Fetch API / Ajax', level: 'topic' }, type: 'roadmapNode' },
  { id: 'es6', position: { x: 750, y: 780 }, data: { label: 'ES6+ / TypeScript', level: 'topic' }, type: 'roadmapNode' },

  // ── VERSION CONTROL (spine y=900) ─────────────────
  { id: 'vcs', position: { x: 450, y: 900 }, data: { label: 'Version Control (Git)', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'git', position: { x: 150, y: 900 }, data: { label: 'Git', level: 'topic' }, type: 'roadmapNode' },
  { id: 'github', position: { x: 150, y: 960 }, data: { label: 'GitHub / GitLab', level: 'topic' }, type: 'roadmapNode' },

  // ── PACKAGE MANAGERS (spine y=1080) ───────────────
  { id: 'pkg', position: { x: 450, y: 1080 }, data: { label: 'Package Managers', level: 'section' }, type: 'roadmapNode' },
  // right
  { id: 'npm', position: { x: 750, y: 1080 }, data: { label: 'npm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'pnpm-node', position: { x: 750, y: 1140 }, data: { label: 'pnpm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'yarn', position: { x: 750, y: 1200 }, data: { label: 'yarn', level: 'topic' }, type: 'roadmapNode' },

  // ── FRAMEWORKS (spine y=1320) ─────────────────────
  { id: 'frameworks', position: { x: 450, y: 1320 }, data: { label: 'Pick a Framework', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'react', position: { x: 150, y: 1320 }, data: { label: 'React', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'vue', position: { x: 150, y: 1380 }, data: { label: 'Vue.js', level: 'topic' }, type: 'roadmapNode' },
  { id: 'angular', position: { x: 150, y: 1440 }, data: { label: 'Angular', level: 'topic' }, type: 'roadmapNode' },

  // ── BUILD TOOLS (spine y=1560) ────────────────────
  { id: 'build', position: { x: 450, y: 1560 }, data: { label: 'Build Tools', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'vite', position: { x: 150, y: 1560 }, data: { label: 'Vite', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'webpack', position: { x: 150, y: 1620 }, data: { label: 'Webpack', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'eslint', position: { x: 750, y: 1560 }, data: { label: 'ESLint / Prettier', level: 'topic' }, type: 'roadmapNode' },

  // ── TESTING (spine y=1740) ────────────────────────
  { id: 'testing', position: { x: 450, y: 1740 }, data: { label: 'Testing', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'jest', position: { x: 150, y: 1740 }, data: { label: 'Jest', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'vitest', position: { x: 750, y: 1740 }, data: { label: 'Vitest', level: 'topic' }, type: 'roadmapNode' },
  { id: 'playwright', position: { x: 750, y: 1800 }, data: { label: 'Playwright', level: 'topic' }, type: 'roadmapNode' },

  // ── ADVANCED (spine y=1920) ───────────────────────
  { id: 'advanced', position: { x: 450, y: 1920 }, data: { label: 'Advanced Topics', level: 'section' }, type: 'roadmapNode' },
  // left
  { id: 'ssr', position: { x: 150, y: 1920 }, data: { label: 'SSR / SSG (Next.js)', level: 'topic' }, type: 'roadmapNode' },
  // right
  { id: 'performance', position: { x: 750, y: 1920 }, data: { label: 'Performance', level: 'topic' }, type: 'roadmapNode' },
  { id: 'security', position: { x: 750, y: 1980 }, data: { label: 'Web Security', level: 'topic' }, type: 'roadmapNode' },
];

export const frontendEdges: Edge[] = [
  // root → internet
  { id: 'e-root-internet', source: 'root', target: 'internet', type: 'smoothstep' },

  // internet → topics
  { id: 'e-internet-how', source: 'internet', target: 'how-internet', type: 'smoothstep' },
  { id: 'e-internet-http', source: 'internet', target: 'http', type: 'smoothstep' },
  { id: 'e-internet-browsers', source: 'internet', target: 'browsers', type: 'smoothstep' },
  { id: 'e-internet-dns', source: 'internet', target: 'dns', type: 'smoothstep' },
  // internet → html
  { id: 'e-internet-html', source: 'internet', target: 'html', type: 'smoothstep' },

  // html → topics
  { id: 'e-html-basics', source: 'html', target: 'html-basics', type: 'smoothstep' },
  { id: 'e-html-semantic', source: 'html', target: 'semantic-html', type: 'smoothstep' },
  { id: 'e-html-forms', source: 'html', target: 'forms', type: 'smoothstep' },
  { id: 'e-html-a11y', source: 'html', target: 'accessibility', type: 'smoothstep' },
  { id: 'e-html-seo', source: 'html', target: 'seo-basics', type: 'smoothstep' },
  // html → css
  { id: 'e-html-css', source: 'html', target: 'css', type: 'smoothstep' },

  // css → topics
  { id: 'e-css-basics', source: 'css', target: 'css-basics', type: 'smoothstep' },
  { id: 'e-css-layouts', source: 'css', target: 'layouts', type: 'smoothstep' },
  { id: 'e-css-responsive', source: 'css', target: 'responsive', type: 'smoothstep' },
  { id: 'e-css-frameworks', source: 'css', target: 'css-frameworks', type: 'smoothstep' },
  // css → js
  { id: 'e-css-js', source: 'css', target: 'js', type: 'smoothstep' },

  // js → topics
  { id: 'e-js-basics', source: 'js', target: 'js-basics', type: 'smoothstep' },
  { id: 'e-js-dom', source: 'js', target: 'dom', type: 'smoothstep' },
  { id: 'e-js-fetch', source: 'js', target: 'fetch-api', type: 'smoothstep' },
  { id: 'e-js-es6', source: 'js', target: 'es6', type: 'smoothstep' },
  // js → vcs
  { id: 'e-js-vcs', source: 'js', target: 'vcs', type: 'smoothstep' },

  // vcs → topics
  { id: 'e-vcs-git', source: 'vcs', target: 'git', type: 'smoothstep' },
  { id: 'e-vcs-github', source: 'vcs', target: 'github', type: 'smoothstep' },
  // vcs → pkg
  { id: 'e-vcs-pkg', source: 'vcs', target: 'pkg', type: 'smoothstep' },

  // pkg → topics
  { id: 'e-pkg-npm', source: 'pkg', target: 'npm', type: 'smoothstep' },
  { id: 'e-pkg-pnpm', source: 'pkg', target: 'pnpm-node', type: 'smoothstep' },
  { id: 'e-pkg-yarn', source: 'pkg', target: 'yarn', type: 'smoothstep' },
  // pkg → frameworks
  { id: 'e-pkg-fw', source: 'pkg', target: 'frameworks', type: 'smoothstep' },

  // frameworks → topics
  { id: 'e-fw-react', source: 'frameworks', target: 'react', type: 'smoothstep' },
  { id: 'e-fw-vue', source: 'frameworks', target: 'vue', type: 'smoothstep' },
  { id: 'e-fw-angular', source: 'frameworks', target: 'angular', type: 'smoothstep' },
  // frameworks → build
  { id: 'e-fw-build', source: 'frameworks', target: 'build', type: 'smoothstep' },

  // build → topics
  { id: 'e-build-vite', source: 'build', target: 'vite', type: 'smoothstep' },
  { id: 'e-build-webpack', source: 'build', target: 'webpack', type: 'smoothstep' },
  { id: 'e-build-eslint', source: 'build', target: 'eslint', type: 'smoothstep' },
  // build → testing
  { id: 'e-build-testing', source: 'build', target: 'testing', type: 'smoothstep' },

  // testing → topics
  { id: 'e-test-jest', source: 'testing', target: 'jest', type: 'smoothstep' },
  { id: 'e-test-vitest', source: 'testing', target: 'vitest', type: 'smoothstep' },
  { id: 'e-test-playwright', source: 'testing', target: 'playwright', type: 'smoothstep' },
  // testing → advanced
  { id: 'e-test-advanced', source: 'testing', target: 'advanced', type: 'smoothstep' },

  // advanced → topics
  { id: 'e-adv-ssr', source: 'advanced', target: 'ssr', type: 'smoothstep' },
  { id: 'e-adv-perf', source: 'advanced', target: 'performance', type: 'smoothstep' },
  { id: 'e-adv-sec', source: 'advanced', target: 'security', type: 'smoothstep' },
];
