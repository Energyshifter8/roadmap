import Link from "next/link";
import { getTranslations } from "next-intl/server";

const roadmaps = [
  { id: "frontend", href: "/roadmap/frontend", bg: "bg-[#ffd000]" },
  { id: "backend", href: "/roadmap/backend", bg: "bg-[#39ff14]" },
  { id: "devops", href: "/roadmap/devops", bg: "bg-[#00e5ff]" },
  { id: "mobile", href: "/roadmap/mobile", bg: "bg-[#ff6b6b]" },
] as const;

export default async function Home() {
  const t = await getTranslations("landing");
  const tt = await getTranslations("tabs");

  return (
    <main className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full py-20">
        <h1 className="font-black text-4xl md:text-6xl uppercase border-b-4 border-black pb-4 mb-8 text-zinc-900">
          {t("title")}
        </h1>

        <p className="text-zinc-600 text-lg mb-12 max-w-2xl">{t("subtitle")}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roadmaps.map(({ id, href, bg }) => (
            <Link
              key={id}
              href={href}
              className={`${bg} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all rounded-xl px-8 py-10 text-center`}
            >
              <span className="font-black text-2xl uppercase text-zinc-900">
                {tt(id)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
