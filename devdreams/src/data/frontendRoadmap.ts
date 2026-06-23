export type NodeLevel = 'root' | 'section' | 'topic' | 'recommended' | 'optional' | 'note';

export interface RoadmapNode {
  id: string;
  label: string;
  level: NodeLevel;
  description?: string;
  parentId: string;
  side?: 'left' | 'right';
}

export type RoadmapSection = {
  node: RoadmapNode;
  left: RoadmapNode[];
  right: RoadmapNode[];
};

const rd = (
  id: string,
  label: string,
  level: NodeLevel,
  parentId: string,
  description?: string,
  side?: 'left' | 'right',
): RoadmapNode => ({ id, label, level, parentId, description, side });

export const frontendSections: RoadmapSection[] = [
  {
    node: rd('internet', 'Internet', 'section', 'root'),
    left: [],
    right: [
      rd('how-internet', 'How does the internet work?', 'topic', 'internet',
        'Understand packets, routers, protocols and how data travels between computers.', 'right'),
      rd('what-http', 'What is HTTP?', 'topic', 'internet',
        'HTTP is the protocol for data communication on the web. Learn requests, responses, and status codes.', 'right'),
      rd('what-domain', 'What is Domain Name?', 'topic', 'internet',
        'A domain name is a human-readable address for a website.', 'right'),
      rd('what-hosting', 'What is hosting?', 'topic', 'internet',
        'Web hosting makes your website accessible on the internet.', 'right'),
      rd('dns', 'DNS and how it works', 'topic', 'internet',
        'DNS translates domain names into IP addresses.', 'right'),
      rd('browsers', 'Browsers and how they work?', 'topic', 'internet',
        'Learn about parsing HTML/CSS, the DOM, render tree, layout and painting.', 'right'),
    ],
  },
  {
    node: rd('html', 'HTML', 'section', 'internet'),
    left: [],
    right: [],
  },
  {
    node: rd('css', 'CSS', 'section', 'html'),
    left: [],
    right: [],
  },
  {
    node: rd('js', 'JavaScript', 'section', 'css'),
    left: [],
    right: [],
  },
  {
    node: rd('vcs', 'Version Control', 'section', 'js'),
    left: [
      rd('git', 'Git', 'recommended', 'vcs',
        'Git is the industry-standard version control system.', 'left'),
    ],
    right: [],
  },
  {
    node: rd('vcs-hosting', 'VCS Hosting', 'section', 'vcs'),
    left: [
      rd('gitlab', 'GitLab', 'topic', 'vcs-hosting',
        'GitLab is a DevOps platform with Git repository hosting and CI/CD.', 'left'),
      rd('github', 'GitHub', 'recommended', 'vcs-hosting',
        'GitHub is the most popular platform for hosting Git repositories.', 'left'),
    ],
    right: [],
  },
  {
    node: rd('intermediate', 'Intermediate Project Ideas', 'note', 'vcs-hosting'),
    left: [],
    right: [],
  },
  {
    node: rd('pkg', 'Package Managers', 'section', 'vcs-hosting'),
    left: [],
    right: [
      rd('npm', 'npm', 'topic', 'pkg',
        'Default package manager for Node.js.', 'right'),
      rd('yarn', 'yarn', 'topic', 'pkg',
        'Fast, reliable package manager with workspaces support.', 'right'),
      rd('pnpm', 'pnpm', 'recommended', 'pkg',
        'Fast, disk-efficient package manager using hard links.', 'right'),
      rd('bun', 'Bun', 'topic', 'pkg',
        'All-in-one JavaScript runtime and package manager.', 'right'),
    ],
  },
  {
    node: rd('css-fw', 'CSS Frameworks', 'section', 'pkg'),
    left: [],
    right: [
      rd('tailwind', 'Tailwind', 'recommended', 'css-fw',
        'Utility-first CSS framework for rapid UI development.', 'right'),
    ],
  },
  {
    node: rd('framework', 'Learn a Framework', 'section', 'css-fw'),
    left: [
      rd('react', 'React', 'recommended', 'framework',
        'Most popular UI library. Learn components, hooks, and state management.', 'left'),
      rd('vue', 'Vue.js', 'topic', 'framework',
        'Progressive framework for building UIs with gentle learning curve.', 'left'),
      rd('angular', 'Angular', 'topic', 'framework',
        'Full-featured TypeScript framework by Google.', 'left'),
      rd('svelte', 'Svelte', 'topic', 'framework',
        'Compiler-based framework with no virtual DOM.', 'left'),
      rd('solidjs', 'Solid JS', 'optional', 'framework',
        'Reactive UI library with fine-grained reactivity.', 'left'),
    ],
    right: [
      rd('ai-dev', 'AI in Development', 'note', 'framework', undefined, 'right'),
    ],
  },
  {
    node: rd('ai-coding', 'AI Assisted Coding', 'section', 'framework'),
    left: [
      rd('claude-code', 'Claude Code', 'recommended', 'ai-coding',
        "Anthropic's AI coding assistant that works in your terminal.", 'left'),
      rd('cursor', 'Cursor', 'topic', 'ai-coding',
        'AI-powered code editor built on VS Code.', 'left'),
      rd('github-copilot', 'GitHub Copilot', 'topic', 'ai-coding',
        'AI pair programmer by GitHub and OpenAI.', 'left'),
    ],
    right: [
      rd('ai-basics', 'Learn the Basics', 'topic', 'ai-coding',
        'Understand prompt engineering and how to effectively use AI coding tools.', 'right'),
    ],
  },
  {
    node: rd('writing-css', 'Writing CSS', 'section', 'ai-coding'),
    left: [],
    right: [
      rd('tailwind2', 'Tailwind', 'recommended', 'writing-css',
        'Utility-first CSS framework.', 'right'),
      rd('css-modules', 'CSS Modules', 'topic', 'writing-css',
        'Locally scoped CSS classes to avoid naming conflicts.', 'right'),
      rd('styled-components', 'Styled Components', 'topic', 'writing-css',
        'CSS-in-JS library for React components.', 'right'),
    ],
  },
  {
    node: rd('build', 'Build Tools', 'section', 'writing-css'),
    left: [],
    right: [
      rd('vite', 'Vite', 'recommended', 'build',
        'Next-generation build tool using native ES modules.', 'right'),
      rd('webpack', 'Webpack', 'topic', 'build',
        'Most widely used module bundler.', 'right'),
      rd('esbuild', 'esbuild', 'topic', 'build',
        'Extremely fast JavaScript bundler.', 'right'),
    ],
  },
  {
    node: rd('testing', 'Testing your Apps', 'section', 'build'),
    left: [],
    right: [
      rd('vitest', 'Vitest', 'recommended', 'testing',
        'Vite-native unit test framework.', 'right'),
      rd('playwright', 'Playwright', 'topic', 'testing',
        'End-to-end testing across all browsers.', 'right'),
      rd('cypress', 'Cypress', 'topic', 'testing',
        'Browser-based end-to-end testing tool.', 'right'),
    ],
  },
  {
    node: rd('auth', 'Authentication Strategies', 'section', 'testing'),
    left: [
      rd('jwt', 'JWT', 'topic', 'auth',
        'JSON Web Tokens for stateless authentication.', 'left'),
      rd('oauth', 'OAuth', 'topic', 'auth',
        'Open standard for access delegation.', 'left'),
      rd('session', 'Session Auth', 'topic', 'auth',
        'Server-side session management.', 'left'),
    ],
    right: [],
  },
  {
    node: rd('security', 'Web Security Basics', 'section', 'auth'),
    left: [],
    right: [
      rd('https', 'HTTPS', 'topic', 'security',
        'Encrypts data in transit using TLS/SSL.', 'right'),
      rd('cors', 'CORS', 'topic', 'security',
        'Controls cross-origin resource sharing.', 'right'),
      rd('owasp', 'OWASP Risks', 'topic', 'security',
        'Learn the top 10 web security vulnerabilities.', 'right'),
    ],
  },
  {
    node: rd('ssr', 'SSR / SSG', 'section', 'security'),
    left: [
      rd('nextjs', 'Next.js', 'recommended', 'ssr',
        'React framework with SSR, SSG, ISR and App Router.', 'left'),
      rd('astro', 'Astro', 'topic', 'ssr',
        'Content-focused framework with Islands architecture.', 'left'),
      rd('nuxt', 'Nuxt.js', 'topic', 'ssr',
        'SSR/SSG framework for Vue.', 'left'),
    ],
    right: [],
  },
  {
    node: rd('perf', 'Web Performance', 'section', 'ssr'),
    left: [],
    right: [
      rd('vitals', 'Core Web Vitals', 'topic', 'perf',
        'LCP, FID, CLS — Googles key performance metrics.', 'right'),
      rd('lighthouse', 'Lighthouse', 'topic', 'perf',
        'Audit performance, accessibility, and SEO.', 'right'),
      rd('lazy', 'Lazy Loading', 'topic', 'perf',
        'Defer loading non-critical resources.', 'right'),
    ],
  },
];
