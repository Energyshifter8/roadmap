import { Node, Edge } from '@xyflow/react';

export const frontendNodes: Node[] = [
  { id: 'root', position: { x: 450, y: 0 }, data: { label: 'Frontend Development', level: 'root' }, type: 'roadmapNode' },
  { id: 'internet', position: { x: 450, y: 120 }, data: { label: 'Internet', level: 'section' }, type: 'roadmapNode' },
  { id: 'how-internet', position: { x: 150, y: 120 }, data: { label: 'How does the Internet work?', level: 'topic' }, type: 'roadmapNode' },
  { id: 'http', position: { x: 150, y: 190 }, data: { label: 'HTTP/HTTPS', level: 'topic' }, type: 'roadmapNode' },
  { id: 'browsers', position: { x: 750, y: 120 }, data: { label: 'How Browsers work', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dns', position: { x: 750, y: 190 }, data: { label: 'DNS & Domain Names', level: 'topic' }, type: 'roadmapNode' },

  { id: 'html', position: { x: 450, y: 300 }, data: { label: 'HTML', level: 'section' }, type: 'roadmapNode' },
  { id: 'html-basics', position: { x: 150, y: 300 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'semantic-html', position: { x: 150, y: 380 }, data: { label: 'Semantic HTML', level: 'topic' }, type: 'roadmapNode' },
  { id: 'forms', position: { x: 750, y: 300 }, data: { label: 'Forms & Validations', level: 'topic' }, type: 'roadmapNode' },
  { id: 'accessibility', position: { x: 750, y: 380 }, data: { label: 'Accessibility', level: 'topic' }, type: 'roadmapNode' },
  { id: 'seo-basics', position: { x: 750, y: 460 }, data: { label: 'SEO Basics', level: 'topic' }, type: 'roadmapNode' },

  { id: 'css', position: { x: 450, y: 600 }, data: { label: 'CSS', level: 'section' }, type: 'roadmapNode' },
  { id: 'css-basics', position: { x: 150, y: 600 }, data: { label: 'Learn the Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'layouts', position: { x: 150, y: 680 }, data: { label: 'Layouts (Flex/Grid)', level: 'topic' }, type: 'roadmapNode' },
  { id: 'responsive', position: { x: 750, y: 600 }, data: { label: 'Responsive Design', level: 'topic' }, type: 'roadmapNode' },
  { id: 'css-frameworks', position: { x: 750, y: 680 }, data: { label: 'CSS Frameworks', level: 'topic' }, type: 'roadmapNode' },

  { id: 'js', position: { x: 450, y: 840 }, data: { label: 'JavaScript', level: 'section' }, type: 'roadmapNode' },
  { id: 'js-basics', position: { x: 150, y: 840 }, data: { label: 'JS Basics', level: 'topic' }, type: 'roadmapNode' },
  { id: 'dom', position: { x: 150, y: 920 }, data: { label: 'DOM Manipulation', level: 'topic' }, type: 'roadmapNode' },
  { id: 'fetch-api', position: { x: 750, y: 840 }, data: { label: 'Fetch API / Ajax', level: 'topic' }, type: 'roadmapNode' },
  { id: 'es6', position: { x: 750, y: 920 }, data: { label: 'ES6+ / TypeScript', level: 'topic' }, type: 'roadmapNode' },

  { id: 'vcs', position: { x: 450, y: 1060 }, data: { label: 'Version Control (Git)', level: 'section' }, type: 'roadmapNode' },
  { id: 'git', position: { x: 150, y: 1060 }, data: { label: 'Git', level: 'topic' }, type: 'roadmapNode' },
  { id: 'github', position: { x: 150, y: 1140 }, data: { label: 'GitHub / GitLab', level: 'topic' }, type: 'roadmapNode' },

  { id: 'pkg', position: { x: 450, y: 1250 }, data: { label: 'Package Managers', level: 'section' }, type: 'roadmapNode' },
  { id: 'npm', position: { x: 750, y: 1250 }, data: { label: 'npm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'pnpm-node', position: { x: 750, y: 1330 }, data: { label: 'pnpm', level: 'topic' }, type: 'roadmapNode' },
  { id: 'yarn', position: { x: 750, y: 1410 }, data: { label: 'yarn', level: 'topic' }, type: 'roadmapNode' },

  { id: 'frameworks', position: { x: 450, y: 1450 }, data: { label: 'Pick a Framework', level: 'section' }, type: 'roadmapNode' },
  { id: 'react', position: { x: 150, y: 1450 }, data: { label: 'React', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'vue', position: { x: 150, y: 1530 }, data: { label: 'Vue.js', level: 'topic' }, type: 'roadmapNode' },
  { id: 'angular', position: { x: 150, y: 1610 }, data: { label: 'Angular', level: 'topic' }, type: 'roadmapNode' },

  { id: 'build', position: { x: 450, y: 1780 }, data: { label: 'Build Tools', level: 'section' }, type: 'roadmapNode' },
  { id: 'vite', position: { x: 150, y: 1780 }, data: { label: 'Vite', level: 'recommended' }, type: 'roadmapNode' },
  { id: 'webpack', position: { x: 150, y: 1860 }, data: { label: 'Webpack', level: 'topic' }, type: 'roadmapNode' },
  { id: 'eslint', position: { x: 750, y: 1780 }, data: { label: 'ESLint / Prettier', level: 'topic' }, type: 'roadmapNode' },

  { id: 'testing', position: { x: 450, y: 1980 }, data: { label: 'Testing', level: 'section' }, type: 'roadmapNode' },
  { id: 'jest', position: { x: 150, y: 1980 }, data: { label: 'Jest', level: 'topic' }, type: 'roadmapNode' },
  { id: 'vitest', position: { x: 750, y: 1980 }, data: { label: 'Vitest', level: 'topic' }, type: 'roadmapNode' },
  { id: 'playwright', position: { x: 750, y: 2060 }, data: { label: 'Playwright', level: 'topic' }, type: 'roadmapNode' },

  { id: 'advanced', position: { x: 450, y: 2180 }, data: { label: 'Advanced Topics', level: 'section' }, type: 'roadmapNode' },
  { id: 'ssr', position: { x: 150, y: 2180 }, data: { label: 'SSR / SSG (Next.js)', level: 'topic' }, type: 'roadmapNode' },
  { id: 'performance', position: { x: 750, y: 2180 }, data: { label: 'Performance', level: 'topic' }, type: 'roadmapNode' },
  { id: 'security', position: { x: 750, y: 2260 }, data: { label: 'Web Security', level: 'topic' }, type: 'roadmapNode' },
];

export const frontendEdges: Edge[] = [
  { id: 'e-root-internet', source: 'root', target: 'internet', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-internet-html', source: 'internet', target: 'html', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-html-css', source: 'html', target: 'css', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-css-js', source: 'css', target: 'js', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-js-vcs', source: 'js', target: 'vcs', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-vcs-pkg', source: 'vcs', target: 'pkg', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-pkg-frameworks', source: 'pkg', target: 'frameworks', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-frameworks-build', source: 'frameworks', target: 'build', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-build-testing', source: 'build', target: 'testing', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },
  { id: 'e-testing-advanced', source: 'testing', target: 'advanced', type: 'smoothstep', sourceHandle: 'bottom', targetHandle: 'top' },

  { id: 'e-internet-how', source: 'internet', target: 'how-internet', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-internet-http', source: 'internet', target: 'http', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-internet-browsers', source: 'internet', target: 'browsers', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-internet-dns', source: 'internet', target: 'dns', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-html-basics', source: 'html', target: 'html-basics', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-html-semantic', source: 'html', target: 'semantic-html', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-html-forms', source: 'html', target: 'forms', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-html-accessibility', source: 'html', target: 'accessibility', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-html-seo', source: 'html', target: 'seo-basics', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-css-basics', source: 'css', target: 'css-basics', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-css-layouts', source: 'css', target: 'layouts', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-css-responsive', source: 'css', target: 'responsive', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-css-frameworks', source: 'css', target: 'css-frameworks', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-js-basics', source: 'js', target: 'js-basics', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-js-dom', source: 'js', target: 'dom', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-js-fetch', source: 'js', target: 'fetch-api', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-js-es6', source: 'js', target: 'es6', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-vcs-git', source: 'vcs', target: 'git', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-vcs-github', source: 'vcs', target: 'github', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },

  { id: 'e-pkg-npm', source: 'pkg', target: 'npm', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-pkg-pnpm', source: 'pkg', target: 'pnpm-node', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-pkg-yarn', source: 'pkg', target: 'yarn', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-fw-react', source: 'frameworks', target: 'react', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-fw-vue', source: 'frameworks', target: 'vue', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-fw-angular', source: 'frameworks', target: 'angular', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },

  { id: 'e-build-vite', source: 'build', target: 'vite', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-build-webpack', source: 'build', target: 'webpack', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-build-eslint', source: 'build', target: 'eslint', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-test-jest', source: 'testing', target: 'jest', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-test-vitest', source: 'testing', target: 'vitest', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-test-playwright', source: 'testing', target: 'playwright', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },

  { id: 'e-adv-ssr', source: 'advanced', target: 'ssr', type: 'smoothstep', sourceHandle: 'left', targetHandle: 'left-target' },
  { id: 'e-adv-perf', source: 'advanced', target: 'performance', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
  { id: 'e-adv-sec', source: 'advanced', target: 'security', type: 'smoothstep', sourceHandle: 'right', targetHandle: 'right-target' },
];
