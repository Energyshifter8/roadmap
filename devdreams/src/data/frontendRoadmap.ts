import { Node, Edge } from '@xyflow/react';

export const frontendNodes: Node[] = [
  // ROOT
  { id: 'root', position: { x: 400, y: 0 }, data: { label: 'Frontend Development', level: 'root' }, type: 'roadmapNode' },

  // INTERNET
  { id: 'internet', position: { x: 400, y: 100 }, data: { label: 'Internet', level: 'section' }, type: 'roadmapNode' },
  { id: 'how-internet', position: { x: 100, y: 200 }, data: { label: 'How does the Internet work?', level: 'topic' }, type: 'roadmapNode' },
  { id: 'http', position: { x: 320, y: 200 }, data: { label: 'HTTP/HTTPS', level: 'topic' }, type: 'roadmapNode' },
  { id: 'browsers', position: { x: 540, y: 200 }, data: { label: 'How Browsers work', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dns', position: { x: 760, y: 200 }, data: { label: 'DNS & Domain Names', level: 'topic' }, type: 'roadmapNode' },

  // HTML
  { id: 'html', position: { x: 400, y: 320 }, data: { label: 'HTML', level: 'section' }, type: 'roadmapNode' },
  { id: 'html-basics', position: { x: 150, y: 420 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'semantic-html', position: { x: 370, y: 420 }, data: { label: 'Semantic HTML', level: 'topic' }, type: 'roadmapNode' },
  { id: 'forms', position: { x: 590, y: 420 }, data: { label: 'Forms & Validations', level: 'topic' }, type: 'roadmapNode' },
  { id: 'accessibility', position: { x: 150, y: 500 }, data: { label: 'Accessibility', level: 'topic' }, type: 'roadmapNode' },
  { id: 'seo-basics', position: { x: 370, y: 500 }, data: { label: 'SEO Basics', level: 'topic' }, type: 'roadmapNode' },

  // CSS
  { id: 'css', position: { x: 400, y: 620 }, data: { label: 'CSS', level: 'section' }, type: 'roadmapNode' },
  { id: 'css-basics', position: { x: 100, y: 720 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'layouts', position: { x: 280, y: 720 }, data: { label: 'Layouts (Flex/Grid)', level: 'topic' }, type: 'roadmapNode' },
  { id: 'responsive', position: { x: 480, y: 720 }, data: { label: 'Responsive Design', level: 'topic' }, type: 'roadmapNode' },
  { id: 'css-frameworks', position: { x: 680, y: 720 }, data: { label: 'CSS Frameworks', level: 'topic' }, type: 'roadmapNode' },

  // JAVASCRIPT
  { id: 'js', position: { x: 400, y: 840 }, data: { label: 'JavaScript', level: 'section' }, type: 'roadmapNode' },
  { id: 'js-basics', position: { x: 100, y: 940 }, data: { label: 'JS Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dom', position: { x: 280, y: 940 }, data: { label: 'DOM Manipulation', level: 'topic' }, type: 'roadmapNode' },
  { id: 'fetch-api', position: { x: 480, y: 940 }, data: { label: 'Fetch API / Ajax', level: 'topic' }, type: 'roadmapNode' },
  { id: 'es6', position: { x: 680, y: 940 }, data: { label: 'ES6+ / TypeScript', level: 'topic' }, type: 'roadmapNode' },

  // VERSION CONTROL
  { id: 'vcs', position: { x: 400, y: 1060 }, data: { label: 'Version Control (Git)', level: 'section' }, type: 'roadmapNode' },
  { id: 'git', position: { x: 250, y: 1160 }, data: { label: 'Git', level: 'topic' }, type: 'roadmapNode' },
  { id: 'github', position: { x: 500, y: 1160 }, data: { label: 'GitHub / GitLab', level: 'topic' }, type: 'roadmapNode' },

  // PACKAGE MANAGERS
  { id: 'pkg', position: { x: 400, y: 1280 }, data: { label: 'Package Managers', level: 'section' }, type: 'roadmapNode' },
  { id: 'npm', position: { x: 200, y: 1380 }, data: { label: 'npm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'pnpm-node', position: { x: 400, y: 1380 }, data: { label: 'pnpm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'yarn', position: { x: 600, y: 1380 }, data: { label: 'yarn', level: 'topic' }, type: 'roadmapNode' },

  // FRAMEWORKS
  { id: 'frameworks', position: { x: 400, y: 1500 }, data: { label: 'Pick a Framework', level: 'section' }, type: 'roadmapNode' },
  { id: 'react', position: { x: 150, y: 1600 }, data: { label: 'React', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'vue', position: { x: 400, y: 1600 }, data: { label: 'Vue.js', level: 'topic' }, type: 'roadmapNode' },
  { id: 'angular', position: { x: 650, y: 1600 }, data: { label: 'Angular', level: 'topic' }, type: 'roadmapNode' },

  // BUILD TOOLS
  { id: 'build', position: { x: 400, y: 1720 }, data: { label: 'Build Tools', level: 'section' }, type: 'roadmapNode' },
  { id: 'vite', position: { x: 200, y: 1820 }, data: { label: 'Vite', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'webpack', position: { x: 400, y: 1820 }, data: { label: 'Webpack', level: 'topic' }, type: 'roadmapNode' },
  { id: 'eslint', position: { x: 600, y: 1820 }, data: { label: 'ESLint / Prettier', level: 'topic' }, type: 'roadmapNode' },

  // TESTING
  { id: 'testing', position: { x: 400, y: 1940 }, data: { label: 'Testing', level: 'section' }, type: 'roadmapNode' },
  { id: 'jest', position: { x: 200, y: 2040 }, data: { label: 'Jest', level: 'topic' }, type: 'roadmapNode' },
  { id: 'vitest', position: { x: 400, y: 2040 }, data: { label: 'Vitest', level: 'topic' }, type: 'roadmapNode' },
  { id: 'playwright', position: { x: 600, y: 2040 }, data: { label: 'Playwright', level: 'topic' }, type: 'roadmapNode' },

  // ADVANCED
  { id: 'advanced', position: { x: 400, y: 2160 }, data: { label: 'Advanced Topics', level: 'section' }, type: 'roadmapNode' },
  { id: 'ssr', position: { x: 150, y: 2260 }, data: { label: 'SSR / SSG (Next.js)', level: 'topic' }, type: 'roadmapNode' },
  { id: 'performance', position: { x: 400, y: 2260 }, data: { label: 'Performance', level: 'topic' }, type: 'roadmapNode' },
  { id: 'security', position: { x: 650, y: 2260 }, data: { label: 'Web Security', level: 'topic' }, type: 'roadmapNode' },
];

export const frontendEdges: Edge[] = [
  { id: 'e-root-internet', source: 'root', target: 'internet', type: 'smoothstep' },
  { id: 'e-internet-how', source: 'internet', target: 'how-internet', type: 'smoothstep' },
  { id: 'e-internet-http', source: 'internet', target: 'http', type: 'smoothstep' },
  { id: 'e-internet-browsers', source: 'internet', target: 'browsers', type: 'smoothstep' },
  { id: 'e-internet-dns', source: 'internet', target: 'dns', type: 'smoothstep' },
  { id: 'e-internet-html', source: 'internet', target: 'html', type: 'smoothstep' },
  { id: 'e-html-basics', source: 'html', target: 'html-basics', type: 'smoothstep' },
  { id: 'e-html-semantic', source: 'html', target: 'semantic-html', type: 'smoothstep' },
  { id: 'e-html-forms', source: 'html', target: 'forms', type: 'smoothstep' },
  { id: 'e-html-a11y', source: 'html', target: 'accessibility', type: 'smoothstep' },
  { id: 'e-html-seo', source: 'html', target: 'seo-basics', type: 'smoothstep' },
  { id: 'e-html-css', source: 'html', target: 'css', type: 'smoothstep' },
  { id: 'e-css-basics', source: 'css', target: 'css-basics', type: 'smoothstep' },
  { id: 'e-css-layouts', source: 'css', target: 'layouts', type: 'smoothstep' },
  { id: 'e-css-responsive', source: 'css', target: 'responsive', type: 'smoothstep' },
  { id: 'e-css-frameworks', source: 'css', target: 'css-frameworks', type: 'smoothstep' },
  { id: 'e-css-js', source: 'css', target: 'js', type: 'smoothstep' },
  { id: 'e-js-basics', source: 'js', target: 'js-basics', type: 'smoothstep' },
  { id: 'e-js-dom', source: 'js', target: 'dom', type: 'smoothstep' },
  { id: 'e-js-fetch', source: 'js', target: 'fetch-api', type: 'smoothstep' },
  { id: 'e-js-es6', source: 'js', target: 'es6', type: 'smoothstep' },
  { id: 'e-js-vcs', source: 'js', target: 'vcs', type: 'smoothstep' },
  { id: 'e-vcs-git', source: 'vcs', target: 'git', type: 'smoothstep' },
  { id: 'e-vcs-github', source: 'vcs', target: 'github', type: 'smoothstep' },
  { id: 'e-vcs-pkg', source: 'vcs', target: 'pkg', type: 'smoothstep' },
  { id: 'e-pkg-npm', source: 'pkg', target: 'npm', type: 'smoothstep' },
  { id: 'e-pkg-pnpm', source: 'pkg', target: 'pnpm-node', type: 'smoothstep' },
  { id: 'e-pkg-yarn', source: 'pkg', target: 'yarn', type: 'smoothstep' },
  { id: 'e-pkg-fw', source: 'pkg', target: 'frameworks', type: 'smoothstep' },
  { id: 'e-fw-react', source: 'frameworks', target: 'react', type: 'smoothstep' },
  { id: 'e-fw-vue', source: 'frameworks', target: 'vue', type: 'smoothstep' },
  { id: 'e-fw-angular', source: 'frameworks', target: 'angular', type: 'smoothstep' },
  { id: 'e-fw-build', source: 'frameworks', target: 'build', type: 'smoothstep' },
  { id: 'e-build-vite', source: 'build', target: 'vite', type: 'smoothstep' },
  { id: 'e-build-webpack', source: 'build', target: 'webpack', type: 'smoothstep' },
  { id: 'e-build-eslint', source: 'build', target: 'eslint', type: 'smoothstep' },
  { id: 'e-build-testing', source: 'build', target: 'testing', type: 'smoothstep' },
  { id: 'e-test-jest', source: 'testing', target: 'jest', type: 'smoothstep' },
  { id: 'e-test-vitest', source: 'testing', target: 'vitest', type: 'smoothstep' },
  { id: 'e-test-playwright', source: 'testing', target: 'playwright', type: 'smoothstep' },
  { id: 'e-test-advanced', source: 'testing', target: 'advanced', type: 'smoothstep' },
  { id: 'e-adv-ssr', source: 'advanced', target: 'ssr', type: 'smoothstep' },
  { id: 'e-adv-perf', source: 'advanced', target: 'performance', type: 'smoothstep' },
  { id: 'e-adv-sec', source: 'advanced', target: 'security', type: 'smoothstep' },
];
