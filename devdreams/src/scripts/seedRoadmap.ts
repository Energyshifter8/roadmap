import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

/* Load .env.local before anything else */
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
  type?: string;
  position?: { x: number; y: number };
  data?: {
    label?: string;
    description?: string;
    links?: Array<{ title: string; url: string }>;
  };
  [key: string]: unknown;
}

interface SeedResource {
  title: string;
  url: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const ROADMAP_URLS: Record<string, string> = {
  frontend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/frontend/frontend.json",
  backend:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/backend/backend.json",
  devops:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/devops/devops.json",
  mobile:
    "https://raw.githubusercontent.com/nilbuild/developer-roadmap/master/src/data/roadmaps/android/android.json",
};

const MN_TOPICS: Record<string, string> = {
  internet:
    "Интернет хэрхэн ажилладаг талаарх үндсэн ойлголтууд: пакет, протокол, чиглүүлэлт, DNS болон хөтөч.",
  "how-internet":
    "Интернет нь дэлхий даяарх компьютеруудыг холбосон сүлжээ юм. Өгөгдөл нь пакет хэлбэрээр хуваагдаж, чиглүүлэгчээр дамжин хүрэх газартаа хүрдэг.",
  "what-http":
    "HTTP (HyperText Transfer Protocol) нь вэб харилцааны суурь протокол юм. Хүсэлт, хариу, статус кодуудын тухай суралцах нь вэб хөгжүүлэгч бүрт зайлшгүй хэрэгтэй.",
  "what-domain":
    "Домэйн нэр нь вэбсайтын хүний унших боломжтой хаяг юм. Жишээ нь: google.com. Энэ нь IP хаягийг орлож хэрэглэгддэг.",
  "what-hosting":
    "Вэб хостинг нь таны вэбсайтын файлуудыг хадгалах, интернетэд нээлттэй болгох үйлчилгээ юм.",
  dns: 'DNS (Domain Name System) нь домэйн нэрийг IP хаяг руу хөрвүүлдэг. Энэ нь интернетийн "утсан дугаарын дэвтэр" юм.',
  browsers:
    "Хөтөч нь HTML, CSS, JavaScript кодыг тайлж, хэрэглэгчид харагдах вэб хуудас болгон хувиргадаг. DOM, render tree, layout, painting зэрэг үйл явцыг ойлгох нь чухал.",
  html: "HTML (HyperText Markup Language) нь вэб хуудасны бүтцийг тодорхойлох стандарт хэл юм. Элемент, таг, атрибут зэрэг үндсийг эзэмших нь вэб хөгжүүлэлтийн эхний алхам.",
  css: "CSS (Cascading Style Sheets) нь вэб хуудсыг загварчлах, өнгө, фонт, байрлалыг тодорхойлох хэл юм. Flexbox, Grid, responsive design зэрэг чадваруудыг эзэмших хэрэгтэй.",
  js: "JavaScript нь вэб хуудсыг интерактив болгодог програмчлалын хэл юм. Хувьсагч, функц, объект, промис, async/await зэрэг үндсэн ойлголтуудыг суралцах шаардлагатай.",
  vcs: "Вершн хяналтын систем (VCS) нь кодын өөрчлөлтийг хянах, хамтран ажиллахад тусалдаг. Git нь хамгийн түгээмэл VCS бөгөөд салбарлалт, нэгтгэл, түүхийг удирдах боломжтой.",
  git: "Git нь үйлдвэрлэлийн стандарт вершн хяналтын систем юм. commit, branch, merge, rebase зэрэг үйлдлүүдийг эзэмших нь хөгжүүлэгч бүрийн үндсэн чадвар.",
  "vcs-hosting":
    "VCS хостинг платформууд нь Git репозиторийг онлайн хадгалах, хамтран ажиллах боломжийг олгодог. GitHub, GitLab, Bitbucket зэрэг платформууд багтана.",
  gitlab:
    "GitLab нь DevOps платформ бөгөөд Git репозитори хостинг, CI/CD, issue tracking зэрэг функцүүдтэй. Энэ нь нэгдсэн DevOps шийдэл юм.",
  github:
    "GitHub нь Git репозитори хостингын хамгийн алдартай платформ юм. Pull request, code review, Actions, Pages зэрэг функцүүдээр хамтран ажиллах боломжтой.",
  intermediate:
    "Дунд шатны төслүүдээр дамжуулан мэдлэгээ бэхжүүлж, бодит төслүүд дээр ажиллаж суралцана.",
  pkg: "Пакет менежер нь кодын сангуудыг суулгах, шинэчлэх, устгахад тусалдаг. npm, yarn, pnpm зэрэг нь хамгийн түгээмэл пакет менежерүүд.",
  npm: "npm нь Node.js-ийн үндсэн пакет менежер юм. package.json, node_modules, scripts зэрэг үндсэн ойлголтуудыг эзэмших хэрэгтэй.",
  yarn: "Yarn нь npm-ээс хурдан, найдвартай пакет менежер юм. Workspace, offline caching, plug-and-play зэрэг онцлогтой.",
  pnpm: "pnpm нь хурд, дискний хэмнэлтээр npm болон yarn-ээс давуу талтай пакет менежер юм. Hard link технологийг ашигладаг.",
  bun: "Bun нь JavaScript runtime болон пакет менежерийг нэгтгэсэн орчин үеийн хэрэгсэл юм. Node.js-ээс хурдан, бүх нийтийн шийдэл.",
  "css-fw":
    "CSS фреймворкууд нь вэб хуудсыг хурдан загварчлахад тусалдаг. Tailwind CSS нь utility-first арга барилаар хамгийн түгээмэл сонголт.",
  tailwind:
    "Tailwind CSS нь utility-first CSS фреймворк юм. Урьдчилан тодорхойлсон классуудыг ашиглан хурдан загварчлах боломжтой.",
  framework:
    "Вэб фреймворк суралцах нь орчин үеийн вэб хөгжүүлэлтийн чухал алхам юм. React, Vue, Angular зэрэг фреймворкууд нь хамгийн түгээмэл сонголтууд.",
  react:
    "React нь хэрэглэгчийн интерфейс бүтээх хамгийн алдартай UI библиотека юм. Компонент, hooks, state management зэрэг үндсэн ойлголтуудыг эзэмших хэрэгтэй.",
  vue: "Vue.js нь хэрэглэгчийн интерфейс бүтээх дэвшилтэт фреймворк юм. Реактив өгөгдөл, компонент систем, чиглүүлэлт зэрэг онцлогтой.",
  angular:
    "Angular бол Google-ийн бүрэн хэмжээний TypeScript фреймворк юм. Module, component, service, dependency injection зэрэг ойлголтуудыг багтаасан.",
  svelte:
    "Svelte нь компилятор дээр суурилсан фреймворк юм. Виртуал DOM ашиглахгүйгээр шууд DOM-д хөрвүүлдэг онцлогтой.",
  solidjs:
    "SolidJS нь нарийн ширхэгтэй реактив UI библиотека юм. Виртуал DOM-гүйгээр шууд DOM-д хөрвүүлж, өндөр гүйцэтгэлтэй.",
  "ai-dev":
    "Хөгжүүлэлт дэх AI хэрэгслүүд нь код бичих, шалгалт өгөх, төслийг хурдасгахад тусалдаг. Claude Code, GitHub Copilot, Cursor зэрэг хэрэгслүүд багтана.",
  "ai-coding":
    "AI тусламжтай код бичих хэрэгслүүд нь хөгжүүлэлтийг хурдасгаж, кодын чанарыг сайжруулдаг. Claude Code, GitHub Copilot, Cursor зэрэг хэрэгслүүд хамгийн түгээмэл.",
  "claude-code":
    "Claude Code нь Anthropic компанийн AI туслах бөгөөд терминал дээр шууд ажилладаг. Код бичих, тайлбарлах, рефактор хийх боломжтой.",
  cursor:
    "Cursor нь AI-ээр ажилладаг код редактор юм. VS Code дээр суурилсан бөгөөд AI тусламжтай код бичих, засварлах боломжтой.",
  "github-copilot":
    "GitHub Copilot нь GitHub болон OpenAI-ийн AI хос программист юм. Код бичих үед автомат санал, гүйцээлт өгдөг.",
  "ai-basics":
    "AI хэрэгслийг үр дүнтэй ашиглахын тулд prompt engineering үндсийг ойлгох хэрэгтэй. Тодорхой, дэлгэрэнгүй заавар өгөх нь илүү сайн үр дүн авчирдаг.",
  "writing-css":
    "CSS бичих арга барилууд: Tailwind CSS, CSS Modules, styled-components зэрэг нь орчин үеийн CSS архитектурын шийдлүүд юм.",
  tailwind2:
    "Tailwind CSS нь utility-first CSS фреймворк бөгөөд урьдчилан тодорхойлсон классуудыг ашиглан хурдан, тууштай загварчлах боломжийг олгодог.",
  "css-modules":
    "CSS Modules нь локал хүрээтэй CSS классуудыг бий болгож, нэрний зөрчлөөс сэргийлдэг. Автоматаар уникаль класс нэр үүсгэдэг.",
  "styled-components":
    "styled-components нь CSS-in-JS библиотека юм. React компонентуудад CSS кодыг шууд бичих боломжтой.",
  build:
    "Build хэрэгслүүд нь кодыг багцалж, оновчтой болгож, хөгжүүлэлтийг хурдасгадаг. Vite, Webpack, esbuild зэрэг нь хамгийн түгээмэл хэрэгслүүд.",
  vite: "Vite нь дараагийн үеийн build хэрэгсэл юм. ES модулийг ашиглан хурдан хөгжүүлэлтийн сервер, оновчтой бүтээцийг хангадаг.",
  webpack:
    "Webpack нь хамгийн өргөн хэрэглэгддэг модуль багцалагч юм. Entry, output, loader, plugin зэрэг үндсэн ойлголтуудыг эзэмших хэрэгтэй.",
  esbuild:
    "esbuild нь маш хурдан JavaScript багцалагч юм. Go хэл дээр бичигдсэн бөгөөд Webpack-ээс 10-100 дахин хурдан.",
  testing:
    "Тест бичих нь кодын чанар, найдвартай байдлыг хангахад чухал. Unit тест, интеграцийн тест, E2E тест гэсэн үндсэн төрлүүд байдаг.",
  vitest:
    "Vitest нь Vite-д зориулсан unit тест фреймворк юм. Хурдан, Jest-тэй нийцтэй, TypeScript-ийг дэмждэг.",
  playwright:
    "Playwright нь бүх хөтөч дээр E2E тест хийх боломжтой хэрэгсэл юм. Chromium, Firefox, Safari-г дэмждэг.",
  cypress:
    "Cypress нь хөтөч дээр суурилсан E2E тест хэрэгсэл юм. Бодит цаг хугацаанд тест бичих, шалгах боломжтой.",
  auth: "Баталгаажуулалт нь хэрэглэгчийн хэн болохыг тодорхойлох үйл явц юм. JWT, OAuth, Session зэрэг стратегиуд багтана.",
  jwt: "JWT (JSON Web Token) нь төлөвгүй баталгаажуулалтын токен юм. Header, payload, signature гэсэн гурван хэсгээс бүрддэг.",
  oauth:
    "OAuth нь нээлттэй стандарт протокол бөгөөд гуравдагч этгээдэд хандалтыг зөвшөөрөхөд ашиглагддаг. Google, GitHub-ээр нэвтрэх зэрэгт хэрэглэгдэнэ.",
  session:
    "Session ашиглан баталгаажуулалт нь сервер талд хэрэглэгчийн мэдээллийг хадгалдаг. Cookie-д session ID хадгалагдана.",
  security:
    "Вэб аюулгүй байдал нь вэб аппликейшныг халдлагаас хамгаалах арга хэмжээ юм. HTTPS, CORS, OWASP зэрэг ойлголтуудыг багтаана.",
  https:
    "HTTPS нь TLS/SSL ашиглан өгөгдлийг шифрлэдэг. Холбооны үед өгөгдлийн бүрэн бүтэн байдал, нууцлалыг хангадаг.",
  cors: "CORS (Cross-Origin Resource Sharing) нь өөр гарал үүслийн эх үүсвэрт хандах хандалтыг хянадаг HTTP механизм юм.",
  owasp:
    "OWASP (Open Web Application Security Project) нь вэб аюулгүй байдлын топ 10 эмзэг байдлыг тодорхойлдог. SQL injection, XSS, CSRF зэрэг халдлагууд багтана.",
  ssr: "Сервер талын рендер (SSR) нь вэб хуудсыг сервер дээр үүсгэж, клиентэд бэлэн хуудас илгээдэг. SEO, гүйцэтгэлийг сайжруулдаг.",
  nextjs:
    "Next.js нь React фреймворк бөгөөд SSR, SSG, ISR болон App Router-ийг дэмждэг. Full-stack вэб аппликейшн бүтээх хүчирхэг хэрэгсэл.",
  astro:
    "Astro нь контент төвтэй фреймворк бөгөөд Islands архитектур ашигладаг. Статик сайт, контент сайтад хамгийн тохиромжтой.",
  nuxt: "Nuxt.js нь Vue-д зориулсан SSR/SSG фреймворк юм. Автомат чиглүүлэлт, модуль систем, сервер талын рендерийг дэмждэг.",
  perf: "Вэб гүйцэтгэл нь вэбсайтын хурд, хариу үйлдлийг хэмждэг. Core Web Vitals, Lighthouse, lazy loading зэрэг ойлголтуудыг багтаана.",
  vitals:
    "Core Web Vitals нь Google-ийн гүйцэтгэлийн гол үзүүлэлтүүд: LCP (ачаалалт), FID (хариу үйлдэл), CLS (харааны тогтвортой байдал).",
  lighthouse:
    "Lighthouse нь вэб хуудасны гүйцэтгэл, хүртээмж, SEO-г шалгадаг аудит хэрэгсэл юм. Chrome DevTools-д суурилагдсан.",
  lazy: "Lazy loading нь чухал бус нөөцийг хойшлуулж ачаалах арга юм. Зураг, видео, компонентуудыг шаардлагатай үед л ачаалдаг.",
};

const MN_COLLECTIONS: Record<string, string> = {
  internet: "Интернет ба Вэб Үндэс",
  html: "HTML бүтэц, семантик таг, хүртээмж",
  css: "CSS загварчлал, Flexbox, Grid, анимац",
  js: "JavaScript суурь, ES6+, хөтөчийн API",
  git: "Git вершн хяналт, commit, branch, merge",
  react: "React компонент, hooks, төлөв удирдлага",
  nextjs: "Next.js App Router, SSR, сервер компонент",
  nodejs: "Node.js суурь, модуль, файл систем",
  database: "Өгөгдлийн сан, SQL, NoSQL, ORM",
  api: "REST API, GraphQL, эндпоинт загварчлал",
  testing: "Тест бичих, unit, интеграци, E2E",
};

const RESOURCES: Record<string, SeedResource[]> = {
  html: [
    {
      title: "MDN: HTML суурь",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics",
    },
    {
      title: "freeCodeCamp Responsive Web Design",
      url: "https://www.freecodecamp.org/learn/responsive-web-design/",
    },
    {
      title: "HTML Full Course (YouTube)",
      url: "https://www.youtube.com/watch?v=pQN-pnXPaVg",
    },
  ],
  css: [
    {
      title: "MDN: CSS суурь",
      url: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
    },
    {
      title: "freeCodeCamp CSS",
      url: "https://www.freecodecamp.org/learn/responsive-web-design/#css-flexbox",
    },
    {
      title: "CSS Grid Complete Guide",
      url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    },
  ],
  js: [
    {
      title: "MDN: JavaScript Guide",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    },
    {
      title: "freeCodeCamp JavaScript",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
    },
    { title: "JavaScript.info", url: "https://javascript.info/" },
  ],
  react: [
    { title: "React албан ёсны баримт бичиг", url: "https://react.dev/" },
    {
      title: "freeCodeCamp React",
      url: "https://www.freecodecamp.org/learn/front-end-development-libraries/#react",
    },
    {
      title: "React Tutorial (YouTube)",
      url: "https://www.youtube.com/watch?v=RGKi6LSPDLU",
    },
  ],
  nextjs: [
    {
      title: "Next.js албан ёсны баримт бичиг",
      url: "https://nextjs.org/docs",
    },
    {
      title: "Next.js App Router Tutorial",
      url: "https://www.youtube.com/watch?v=Y6KDk5iyrYE",
    },
  ],
  git: [
    { title: "Git албан ёсны баримт бичиг", url: "https://git-scm.com/doc" },
    {
      title: "freeCodeCamp Git Tutorial",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
    },
  ],
  github: [
    { title: "GitHub Docs", url: "https://docs.github.com/en" },
    { title: "GitHub Learning Lab", url: "https://lab.github.com/" },
  ],
  nodejs: [
    {
      title: "Node.js албан ёсны баримт бичиг",
      url: "https://nodejs.org/en/docs/",
    },
    {
      title: "freeCodeCamp Node.js",
      url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
    },
  ],
  npm: [
    { title: "npm баримт бичиг", url: "https://docs.npmjs.com/" },
    {
      title: "npm үндсэн ойлголтууд",
      url: "https://www.freecodecamp.org/news/what-is-npm-a-node-package-manager-tutorial/",
    },
  ],
  "rest-api": [
    { title: "REST API Tutorial", url: "https://restfulapi.net/" },
    {
      title: "freeCodeCamp REST API",
      url: "https://www.youtube.com/watch?v=lsMQRaeKNDk",
    },
  ],
  graphql: [
    {
      title: "GraphQL албан ёсны баримт бичиг",
      url: "https://graphql.org/learn/",
    },
    {
      title: "freeCodeCamp GraphQL",
      url: "https://www.youtube.com/watch?v=ZQL7tL2S0oQ",
    },
  ],
  docker: [
    { title: "Docker Docs", url: "https://docs.docker.com/" },
    {
      title: "freeCodeCamp Docker Tutorial",
      url: "https://www.youtube.com/watch?v=9zUHg7xjIqQ",
    },
  ],
  postgresql: [
    { title: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
    {
      title: "freeCodeCamp SQL/PostgreSQL",
      url: "https://www.youtube.com/watch?v=Z0No9eByBcA",
    },
  ],
  mongodb: [
    {
      title: "MongoDB албан ёсны баримт бичиг",
      url: "https://www.mongodb.com/docs/",
    },
    {
      title: "freeCodeCamp MongoDB",
      url: "https://www.youtube.com/watch?v=VELrufCX6uc",
    },
  ],
  typescript: [
    {
      title: "TypeScript албан ёсны баримт бичиг",
      url: "https://www.typescriptlang.org/docs/",
    },
    {
      title: "freeCodeCamp TypeScript",
      url: "https://www.youtube.com/watch?v=gp5H0Vw39yw",
    },
  ],
  tailwind: [
    { title: "Tailwind CSS Docs", url: "https://tailwindcss.com/docs" },
    {
      title: "Tailwind CSS Tutorial (YouTube)",
      url: "https://www.youtube.com/watch?v=ft30zcMlFf8",
    },
  ],
  kubernetes: [
    { title: "Kubernetes Docs", url: "https://kubernetes.io/docs/" },
    {
      title: "freeCodeCamp Kubernetes",
      url: "https://www.youtube.com/watch?v=d6WC5n9G_sM",
    },
  ],
  aws: [
    { title: "AWS Docs", url: "https://docs.aws.amazon.com/" },
    {
      title: "freeCodeCamp AWS",
      url: "https://www.youtube.com/watch?v=SOTamWNgDKc",
    },
  ],
  "ci-cd": [
    { title: "GitHub Actions Docs", url: "https://docs.github.com/en/actions" },
    {
      title: "CI/CD Pipeline Tutorial (YouTube)",
      url: "https://www.youtube.com/watch?v=mLAiBz1k5jc",
    },
  ],
  python: [
    {
      title: "Python албан ёсны баримт бичиг",
      url: "https://docs.python.org/3/",
    },
    {
      title: "freeCodeCamp Python",
      url: "https://www.youtube.com/watch?v=rfscVS0vtbw",
    },
  ],
  sql: [
    {
      title: "SQL Tutorial (freeCodeCamp)",
      url: "https://www.youtube.com/watch?v=HXV3zeQKqGY",
    },
    { title: "PostgreSQL Docs", url: "https://www.postgresql.org/docs/" },
  ],
  redis: [
    { title: "Redis Docs", url: "https://redis.io/docs/" },
    {
      title: "Redis Tutorial (YouTube)",
      url: "https://www.youtube.com/watch?v=Hbt56gFj998",
    },
  ],
};

const DEFAULT_RESOURCES: SeedResource[] = [
  { title: "MDN Web Docs", url: "https://developer.mozilla.org/" },
  { title: "freeCodeCamp", url: "https://www.freecodecamp.org/" },
  {
    title: "YouTube Tutorials",
    url: "https://www.youtube.com/results?search_query=web+development+tutorial",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function extractLabel(node: RawNode): string {
  return node.data?.label ?? node.id ?? "unknown";
}

function extractDescription(node: RawNode): string | undefined {
  return node.data?.description ?? undefined;
}

function generateDescription(nodeId: string, node: RawNode): string {
  const lower = nodeId.toLowerCase();

  if (MN_TOPICS[lower]) return MN_TOPICS[lower];

  const label = extractLabel(node);
  const collection = MN_COLLECTIONS[lower] ?? `${label} сэдэв`;
  const engDesc = extractDescription(node);

  if (engDesc) {
    return `${collection}. ${engDesc}`;
  }

  return `${collection} — орчин үеийн вэб хөгжүүлэлтийн чухал хэсэг. Энэ сэдвийг гүнзгий судалж, практик төслүүд дээр хэрэгжүүлээрэй.`;
}

function generateResources(nodeId: string): SeedResource[] {
  const lower = nodeId.toLowerCase();

  if (RESOURCES[lower]) return RESOURCES[lower];

  const label = extractLabel({ id: nodeId });
  return [
    {
      title: `${label} албан ёсны баримт бичиг`,
      url: `https://www.google.com/search?q=${encodeURIComponent(label)}+documentation`,
    },
    ...DEFAULT_RESOURCES,
  ];
}

/* ------------------------------------------------------------------ */
/*  Main                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("========================================");
  console.log("  DevDreams — Roadmap Details Seeder");
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

  /* ---- 2. Fetch roadmaps & collect node IDs ---- */

  const allNodeIds = new Set<string>();
  const nodeMeta = new Map<string, { type: string; label: string }>();

  for (const [type, url] of Object.entries(ROADMAP_URLS)) {
    process.stdout.write(`  Fetching ${type} roadmap... `);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) {
        console.log(`✖ HTTP ${res.status}`);
        continue;
      }
      const data: { nodes?: RawNode[] } = await res.json();
      const nodes = data.nodes ?? [];
      for (const node of nodes) {
        if (node.id) {
          allNodeIds.add(node.id);
          if (!nodeMeta.has(node.id)) {
            nodeMeta.set(node.id, {
              type: node.type ?? "topic",
              label: extractLabel(node),
            });
          }
        }
      }
      console.log(`✓ (${nodes.length} nodes)`);
    } catch (err) {
      console.log(`✖ ${err instanceof Error ? err.message : "unknown error"}`);
    }
  }

  console.log(`\n  Total unique node IDs: ${allNodeIds.size}\n`);

  if (allNodeIds.size === 0) {
    console.warn("⚠ No nodes found. Nothing to seed.");
    process.exit(0);
  }

  /* ---- 3. Generate documents & write to Firestore ---- */

  const sortedIds = [...allNodeIds].sort();
  let success = 0;
  let failed = 0;

  const batchSize = 50;
  const batches: string[][] = [];
  for (let i = 0; i < sortedIds.length; i += batchSize) {
    batches.push(sortedIds.slice(i, i + batchSize));
  }

  for (const [batchIndex, batch] of batches.entries()) {
    const batchWriter = firestore.batch();

    for (const nodeId of batch) {
      const meta = nodeMeta.get(nodeId);
      const rawNode: RawNode = {
        id: nodeId,
        type: meta?.type,
        data: { label: meta?.label },
      };

      const docData = {
        nodeId,
        description: generateDescription(nodeId, rawNode),
        resources: generateResources(nodeId),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      };

      const ref = firestore.doc(`roadmap_details/${nodeId}`);
      batchWriter.set(ref, docData, { merge: false });
    }

    try {
      await batchWriter.commit();
      success += batch.length;
      console.log(
        `  ✓ Batch ${batchIndex + 1}/${batches.length} (${batch.length} docs)`,
      );
    } catch (err) {
      failed += batch.length;
      console.error(
        `  ✖ Batch ${batchIndex + 1}/${batches.length} failed:`,
        err,
      );
    }
  }

  /* ---- 4. Summary ---- */

  console.log("\n========================================");
  console.log("  Seed Summary");
  console.log("========================================");
  console.log(`  Total nodes:    ${sortedIds.length}`);
  console.log(`  Successful:     ${success}`);
  console.log(`  Failed:         ${failed}`);
  console.log(`  Collection:     roadmap_details`);
  console.log("========================================\n");

  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("\n✖ Fatal error:", err);
  process.exit(1);
});
