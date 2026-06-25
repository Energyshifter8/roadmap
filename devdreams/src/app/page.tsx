import Link from "next/link";

const roadmaps = [
  {
    id: "frontend",
    label: "Frontend",
    href: "/roadmap/frontend",
    bg: "bg-[#ffd000]",
  },
  {
    id: "backend",
    label: "Backend",
    href: "/roadmap/backend",
    bg: "bg-[#39ff14]",
  },
  {
    id: "devops",
    label: "DevOps",
    href: "/roadmap/devops",
    bg: "bg-[#00e5ff]",
  },
  {
    id: "mobile",
    label: "Mobile",
    href: "/roadmap/mobile",
    bg: "bg-[#ff6b6b]",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full py-20">
        <h1 className="font-black text-4xl md:text-6xl uppercase border-b-4 border-black pb-4 mb-8 text-zinc-900">
          Welcome to DevDreams
        </h1>

        <p className="text-zinc-600 text-lg mb-12 max-w-2xl">
          Choose your path and start mastering the skills you need to become a
          world-class developer.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roadmaps.map(({ id, label, href, bg }) => (
            <Link
              key={id}
              href={href}
              className={`${bg} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl px-8 py-10 text-center`}
            >
              <span className="font-black text-2xl uppercase text-zinc-900">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
