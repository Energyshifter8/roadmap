import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import RoadmapDiagram from "@/components/RoadmapDiagram";
import TabSwitcher from "@/components/TabSwitcher";
import LangToggle from "@/components/LangToggle";
import frontend from "@/data/frontend.json";
import backend from "@/data/backend.json";
import devops from "@/data/devops.json";
import mobile from "@/data/mobile.json";

const roadmaps = { frontend, backend, devops, mobile } as const;

type Props = {
  params: Promise<{ type: string; locale: string }>;
};

export default async function RoadmapPage({ params }: Props) {
  const { type, locale } = await params;
  const t = await getTranslations({ locale, namespace: "Roadmap" });

  if (!(type in roadmaps)) notFound();

  const data = roadmaps[type as keyof typeof roadmaps];
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t("title", { type: title })}
        </h1>
        <div className="flex items-center gap-4">
          <TabSwitcher />
          <LangToggle />
        </div>
      </header>

      <main className="flex-1">
        <RoadmapDiagram nodes={data.nodes} edges={data.edges} />
      </main>
    </div>
  );
}
