import type { Node, Edge } from '@xyflow/react';

export const frontendNodes: Node[] = [
  // ── ROOT ──────────────────────────────────────────────
  { id: 'root', type: 'roadmapNode', position: { x: 360, y: 0 },
    data: { label: 'Frontend Development', level: 'root' } },

  // ── INTERNET ──────────────────────────────────────────
  { id: 'internet', type: 'roadmapNode', position: { x: 360, y: 90 },
    data: { label: 'Internet', level: 'section' } },
  { id: 'internet-works', type: 'roadmapNode', position: { x: 0, y: 190 },
    data: { label: 'How does the internet work?', level: 'topic', description: 'Understand the basic infrastructure of the internet: packets, routers, protocols, and how data travels between computers.' } },
  { id: 'http', type: 'roadmapNode', position: { x: 200, y: 190 },
    data: { label: 'What is HTTP?', level: 'topic', description: 'HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. Learn about requests, responses, status codes, and headers.' } },
  { id: 'browsers', type: 'roadmapNode', position: { x: 400, y: 190 },
    data: { label: 'How do browsers work?', level: 'topic', description: 'Learn about parsing HTML/CSS, the DOM, render tree, layout, painting, and JavaScript execution in the browser.' } },
  { id: 'dns', type: 'roadmapNode', position: { x: 600, y: 190 },
    data: { label: 'DNS and how it works', level: 'topic', description: 'Domain Name System translates human-readable domain names into IP addresses. Learn about DNS records, resolvers, and caching.' } },
  { id: 'domain', type: 'roadmapNode', position: { x: 800, y: 190 },
    data: { label: 'What is a Domain Name?', level: 'topic', description: 'A domain name is a human-readable address of a website. Learn about TLDs, registrars, and how domains map to IP addresses.' } },
  { id: 'hosting', type: 'roadmapNode', position: { x: 1000, y: 190 },
    data: { label: 'What is Hosting?', level: 'topic', description: 'Web hosting is a service that allows your website to be accessible on the internet. Learn about shared, VPS, dedicated, and cloud hosting.' } },

  // ── HTML ──────────────────────────────────────────────
  { id: 'html', type: 'roadmapNode', position: { x: 360, y: 320 },
    data: { label: 'HTML', level: 'section' } },
  { id: 'html-basics', type: 'roadmapNode', position: { x: 60, y: 420 },
    data: { label: 'Learn the basics', level: 'topic', description: 'HTML is the backbone of the web. Learn about elements, attributes, semantic tags, and document structure.' } },
  { id: 'semantic-html', type: 'roadmapNode', position: { x: 260, y: 420 },
    data: { label: 'Semantic HTML', level: 'topic', description: 'Semantic HTML uses meaningful tags like <article>, <section>, <nav>, <header> to improve accessibility and SEO.' } },
  { id: 'forms', type: 'roadmapNode', position: { x: 460, y: 420 },
    data: { label: 'Forms and Validations', level: 'topic', description: 'Learn how to build HTML forms with input types, validation attributes, and how to handle form submissions.' } },
  { id: 'accessibility', type: 'roadmapNode', position: { x: 660, y: 420 },
    data: { label: 'Accessibility', level: 'topic', description: 'Web accessibility ensures your site is usable by everyone. Learn about ARIA roles, keyboard navigation, and screen readers.' } },
  { id: 'seo-basics', type: 'roadmapNode', position: { x: 860, y: 420 },
    data: { label: 'SEO Basics', level: 'topic', description: 'Learn how search engines index pages, and how to use meta tags, structured data, and semantic HTML to improve rankings.' } },

  // ── CSS ───────────────────────────────────────────────
  { id: 'css', type: 'roadmapNode', position: { x: 360, y: 550 },
    data: { label: 'CSS', level: 'section' } },
  { id: 'css-basics', type: 'roadmapNode', position: { x: 0, y: 650 },
    data: { label: 'Learn the basics', level: 'topic', description: 'CSS styles HTML elements. Learn selectors, box model, specificity, cascade, and basic layout techniques.' } },
  { id: 'css-layouts', type: 'roadmapNode', position: { x: 180, y: 650 },
    data: { label: 'Making Layouts', level: 'topic', description: 'Learn Flexbox and CSS Grid, the modern layout systems that replaced floats and positioning hacks.' } },
  { id: 'responsive', type: 'roadmapNode', position: { x: 360, y: 650 },
    data: { label: 'Responsive Design', level: 'topic', description: 'Responsive design makes websites look good on all screen sizes using media queries, fluid grids, and flexible images.' } },

  // ── JAVASCRIPT ────────────────────────────────────────
  { id: 'js', type: 'roadmapNode', position: { x: 360, y: 780 },
    data: { label: 'JavaScript', level: 'section' } },
  { id: 'js-basics', type: 'roadmapNode', position: { x: 0, y: 880 },
    data: { label: 'Learn the basics', level: 'topic', description: 'JavaScript is the programming language of the web. Learn variables, data types, functions, loops, and control flow.' } },
  { id: 'dom', type: 'roadmapNode', position: { x: 180, y: 880 },
    data: { label: 'DOM Manipulation', level: 'topic', description: 'The DOM is an API for HTML documents. Learn to select, create, modify, and delete elements dynamically.' } },
  { id: 'fetch', type: 'roadmapNode', position: { x: 360, y: 880 },
    data: { label: 'Fetch API / Ajax', level: 'topic', description: 'Learn how to make HTTP requests from the browser using Fetch API and handle asynchronous operations with Promises and async/await.' } },
  { id: 'es6', type: 'roadmapNode', position: { x: 540, y: 880 },
    data: { label: 'ES6+ / TypeScript', level: 'recommended', description: 'Modern JavaScript features: arrow functions, destructuring, modules, spread/rest, optional chaining. TypeScript adds static types.' } },
  { id: 'js-concepts', type: 'roadmapNode', position: { x: 720, y: 880 },
    data: { label: 'Hoisting, Event Bubbling, Scope', level: 'topic', description: 'Deep dive into how JavaScript works: variable hoisting, closures, prototype chain, event bubbling and capturing.' } },

  // ── VERSION CONTROL ───────────────────────────────────
  { id: 'vcs', type: 'roadmapNode', position: { x: 360, y: 1010 },
    data: { label: 'Version Control Systems', level: 'section' } },
  { id: 'git', type: 'roadmapNode', position: { x: 180, y: 1110 },
    data: { label: 'Git', level: 'recommended', description: 'Git is the industry-standard version control system. Learn commits, branches, merges, rebases, and collaborative workflows.' } },
  { id: 'github', type: 'roadmapNode', position: { x: 480, y: 1110 },
    data: { label: 'GitHub / GitLab', level: 'topic', description: 'Platforms for hosting Git repositories. Learn pull requests, code reviews, issues, and CI/CD integration.' } },

  // ── PACKAGE MANAGERS ──────────────────────────────────
  { id: 'pkg', type: 'roadmapNode', position: { x: 360, y: 1240 },
    data: { label: 'Package Managers', level: 'section' } },
  { id: 'npm', type: 'roadmapNode', position: { x: 120, y: 1340 },
    data: { label: 'npm', level: 'topic', description: 'npm is the default package manager for Node.js. Learn to install, update, and manage dependencies and scripts.' } },
  { id: 'pnpm', type: 'roadmapNode', position: { x: 360, y: 1340 },
    data: { label: 'pnpm', level: 'recommended', description: 'pnpm is a fast, disk-efficient package manager that uses hard links and symlinks to save disk space.' } },
  { id: 'yarn', type: 'roadmapNode', position: { x: 600, y: 1340 },
    data: { label: 'yarn', level: 'topic', description: 'Yarn is an alternative package manager that offers deterministic installs and workspaces support.' } },

  // ── PICK A FRAMEWORK ──────────────────────────────────
  { id: 'frameworks', type: 'roadmapNode', position: { x: 360, y: 1470 },
    data: { label: 'Pick a Framework', level: 'section' } },
  { id: 'react', type: 'roadmapNode', position: { x: 60, y: 1570 },
    data: { label: 'React', level: 'recommended', description: 'React is the most popular UI library. Learn components, hooks, state management, and the React ecosystem.' } },
  { id: 'vue', type: 'roadmapNode', position: { x: 300, y: 1570 },
    data: { label: 'Vue.js', level: 'topic', description: 'Vue is a progressive framework for building UIs. Known for its gentle learning curve and excellent documentation.' } },
  { id: 'angular', type: 'roadmapNode', position: { x: 540, y: 1570 },
    data: { label: 'Angular', level: 'topic', description: 'Angular is a full-featured framework by Google. Uses TypeScript by default and follows an opinionated structure.' } },
  { id: 'svelte', type: 'roadmapNode', position: { x: 780, y: 1570 },
    data: { label: 'Svelte', level: 'optional', description: 'Svelte is a compiler-based framework that shifts work to build time, resulting in highly optimized vanilla JS.' } },

  // ── BUILD TOOLS ───────────────────────────────────────
  { id: 'build', type: 'roadmapNode', position: { x: 360, y: 1700 },
    data: { label: 'Build Tools', level: 'section' } },
  { id: 'vite', type: 'roadmapNode', position: { x: 60, y: 1800 },
    data: { label: 'Vite', level: 'recommended', description: 'Vite is a next-generation build tool that uses native ES modules for blazing fast dev server startup.' } },
  { id: 'webpack', type: 'roadmapNode', position: { x: 280, y: 1800 },
    data: { label: 'Webpack', level: 'topic', description: 'Webpack is the most widely used module bundler. Learn loaders, plugins, code splitting, and optimization.' } },
  { id: 'eslint', type: 'roadmapNode', position: { x: 500, y: 1800 },
    data: { label: 'ESLint / Prettier', level: 'topic', description: 'ESLint catches code errors and enforces style rules. Prettier formats your code automatically.' } },
  { id: 'npm-scripts', type: 'roadmapNode', position: { x: 720, y: 1800 },
    data: { label: 'npm scripts', level: 'topic', description: 'npm scripts let you automate tasks like build, test, and lint directly in package.json.' } },

  // ── TESTING ───────────────────────────────────────────
  { id: 'testing', type: 'roadmapNode', position: { x: 360, y: 1930 },
    data: { label: 'Testing your Apps', level: 'section' } },
  { id: 'jest', type: 'roadmapNode', position: { x: 60, y: 2030 },
    data: { label: 'Jest', level: 'topic', description: 'Jest is the most popular JavaScript testing framework. Learn unit tests, mocks, spies, and code coverage.' } },
  { id: 'vitest', type: 'roadmapNode', position: { x: 280, y: 2030 },
    data: { label: 'Vitest', level: 'recommended', description: 'Vitest is a Vite-native test runner that is fast and compatible with Jest APIs.' } },
  { id: 'playwright', type: 'roadmapNode', position: { x: 500, y: 2030 },
    data: { label: 'Playwright', level: 'topic', description: 'Playwright is an end-to-end testing framework that can test across Chromium, Firefox, and WebKit.' } },
  { id: 'cypress', type: 'roadmapNode', position: { x: 720, y: 2030 },
    data: { label: 'Cypress', level: 'topic', description: 'Cypress is an e2e testing tool that runs directly in the browser with time travel debugging.' } },

  // ── ADVANCED TOPICS ───────────────────────────────────
  { id: 'advanced', type: 'roadmapNode', position: { x: 360, y: 2160 },
    data: { label: 'Web Security Basics', level: 'section' } },
  { id: 'https', type: 'roadmapNode', position: { x: 0, y: 2260 },
    data: { label: 'HTTPS', level: 'topic', description: 'HTTPS encrypts data in transit using TLS/SSL. Learn about certificates, handshakes, and mixed content.' } },
  { id: 'cors', type: 'roadmapNode', position: { x: 180, y: 2260 },
    data: { label: 'CORS', level: 'topic', description: 'Cross-Origin Resource Sharing controls which origins can access your API. Learn preflight requests and headers.' } },
  { id: 'csp', type: 'roadmapNode', position: { x: 360, y: 2260 },
    data: { label: 'Content Security Policy', level: 'topic', description: 'CSP prevents XSS attacks by whitelisting content sources. Learn to configure CSP headers.' } },
  { id: 'owasp', type: 'roadmapNode', position: { x: 560, y: 2260 },
    data: { label: 'OWASP Security Risks', level: 'topic', description: 'Learn the OWASP Top 10 web security risks: XSS, CSRF, SQL injection, and how to prevent them.' } },

  // ── SSR / SSG ─────────────────────────────────────────
  { id: 'ssr', type: 'roadmapNode', position: { x: 360, y: 2390 },
    data: { label: 'SSR / SSG', level: 'section' } },
  { id: 'nextjs', type: 'roadmapNode', position: { x: 120, y: 2490 },
    data: { label: 'Next.js', level: 'recommended', description: 'Next.js is the leading React framework with SSR, SSG, ISR, App Router, and edge rendering support.' } },
  { id: 'astro', type: 'roadmapNode', position: { x: 380, y: 2490 },
    data: { label: 'Astro', level: 'topic', description: 'Astro is a content-focused framework that ships zero JavaScript by default using its Islands architecture.' } },
  { id: 'nuxt', type: 'roadmapNode', position: { x: 640, y: 2490 },
    data: { label: 'Nuxt.js', level: 'topic', description: 'Nuxt is the SSR/SSG framework for Vue, similar to Next.js but for the Vue ecosystem.' } },

  // ── PERFORMANCE ───────────────────────────────────────
  { id: 'perf', type: 'roadmapNode', position: { x: 360, y: 2620 },
    data: { label: 'Web Performance', level: 'section' } },
  { id: 'core-vitals', type: 'roadmapNode', position: { x: 60, y: 2720 },
    data: { label: 'Core Web Vitals', level: 'topic', description: 'LCP, FID, and CLS are Googles core metrics for user experience. Learn to measure and optimize them.' } },
  { id: 'lazy-loading', type: 'roadmapNode', position: { x: 300, y: 2720 },
    data: { label: 'Lazy Loading', level: 'topic', description: 'Lazy loading defers loading of non-critical resources. Learn code splitting, dynamic imports, and image lazy loading.' } },
  { id: 'perf-tools', type: 'roadmapNode', position: { x: 540, y: 2720 },
    data: { label: 'Lighthouse / DevTools', level: 'topic', description: 'Use Chrome Lighthouse and DevTools to audit and profile your web app performance.' } },
];

export const frontendEdges: Edge[] = [
  { id: 'e1', source: 'root', target: 'internet', type: 'smoothstep' },

  { id: 'e2', source: 'internet', target: 'internet-works', type: 'smoothstep' },
  { id: 'e3', source: 'internet', target: 'http', type: 'smoothstep' },
  { id: 'e4', source: 'internet', target: 'browsers', type: 'smoothstep' },
  { id: 'e5', source: 'internet', target: 'dns', type: 'smoothstep' },
  { id: 'e6', source: 'internet', target: 'domain', type: 'smoothstep' },
  { id: 'e7', source: 'internet', target: 'hosting', type: 'smoothstep' },
  { id: 'e8', source: 'internet', target: 'html', type: 'smoothstep' },

  { id: 'e9',  source: 'html', target: 'html-basics', type: 'smoothstep' },
  { id: 'e10', source: 'html', target: 'semantic-html', type: 'smoothstep' },
  { id: 'e11', source: 'html', target: 'forms', type: 'smoothstep' },
  { id: 'e12', source: 'html', target: 'accessibility', type: 'smoothstep' },
  { id: 'e13', source: 'html', target: 'seo-basics', type: 'smoothstep' },
  { id: 'e14', source: 'html', target: 'css', type: 'smoothstep' },

  { id: 'e15', source: 'css', target: 'css-basics', type: 'smoothstep' },
  { id: 'e16', source: 'css', target: 'css-layouts', type: 'smoothstep' },
  { id: 'e17', source: 'css', target: 'responsive', type: 'smoothstep' },
  { id: 'e18', source: 'css', target: 'js', type: 'smoothstep' },

  { id: 'e19', source: 'js', target: 'js-basics', type: 'smoothstep' },
  { id: 'e20', source: 'js', target: 'dom', type: 'smoothstep' },
  { id: 'e21', source: 'js', target: 'fetch', type: 'smoothstep' },
  { id: 'e22', source: 'js', target: 'es6', type: 'smoothstep' },
  { id: 'e23', source: 'js', target: 'js-concepts', type: 'smoothstep' },
  { id: 'e24', source: 'js', target: 'vcs', type: 'smoothstep' },

  { id: 'e25', source: 'vcs', target: 'git', type: 'smoothstep' },
  { id: 'e26', source: 'vcs', target: 'github', type: 'smoothstep' },
  { id: 'e27', source: 'vcs', target: 'pkg', type: 'smoothstep' },

  { id: 'e28', source: 'pkg', target: 'npm', type: 'smoothstep' },
  { id: 'e29', source: 'pkg', target: 'pnpm', type: 'smoothstep' },
  { id: 'e30', source: 'pkg', target: 'yarn', type: 'smoothstep' },
  { id: 'e31', source: 'pkg', target: 'frameworks', type: 'smoothstep' },

  { id: 'e32', source: 'frameworks', target: 'react', type: 'smoothstep' },
  { id: 'e33', source: 'frameworks', target: 'vue', type: 'smoothstep' },
  { id: 'e34', source: 'frameworks', target: 'angular', type: 'smoothstep' },
  { id: 'e35', source: 'frameworks', target: 'svelte', type: 'smoothstep' },
  { id: 'e36', source: 'frameworks', target: 'build', type: 'smoothstep' },

  { id: 'e37', source: 'build', target: 'vite', type: 'smoothstep' },
  { id: 'e38', source: 'build', target: 'webpack', type: 'smoothstep' },
  { id: 'e39', source: 'build', target: 'eslint', type: 'smoothstep' },
  { id: 'e40', source: 'build', target: 'npm-scripts', type: 'smoothstep' },
  { id: 'e41', source: 'build', target: 'testing', type: 'smoothstep' },

  { id: 'e42', source: 'testing', target: 'jest', type: 'smoothstep' },
  { id: 'e43', source: 'testing', target: 'vitest', type: 'smoothstep' },
  { id: 'e44', source: 'testing', target: 'playwright', type: 'smoothstep' },
  { id: 'e45', source: 'testing', target: 'cypress', type: 'smoothstep' },
  { id: 'e46', source: 'testing', target: 'advanced', type: 'smoothstep' },

  { id: 'e47', source: 'advanced', target: 'https', type: 'smoothstep' },
  { id: 'e48', source: 'advanced', target: 'cors', type: 'smoothstep' },
  { id: 'e49', source: 'advanced', target: 'csp', type: 'smoothstep' },
  { id: 'e50', source: 'advanced', target: 'owasp', type: 'smoothstep' },
  { id: 'e51', source: 'advanced', target: 'ssr', type: 'smoothstep' },

  { id: 'e52', source: 'ssr', target: 'nextjs', type: 'smoothstep' },
  { id: 'e53', source: 'ssr', target: 'astro', type: 'smoothstep' },
  { id: 'e54', source: 'ssr', target: 'nuxt', type: 'smoothstep' },
  { id: 'e55', source: 'ssr', target: 'perf', type: 'smoothstep' },

  { id: 'e56', source: 'perf', target: 'core-vitals', type: 'smoothstep' },
  { id: 'e57', source: 'perf', target: 'lazy-loading', type: 'smoothstep' },
  { id: 'e58', source: 'perf', target: 'perf-tools', type: 'smoothstep' },
];
