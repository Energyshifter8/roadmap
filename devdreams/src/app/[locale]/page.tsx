import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("ui");
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold font-mono">{t("title")}</h1>
        <p className="text-gray-400 mt-2 font-mono">{t("subtitle")}</p>
      </div>
    </main>
  );
}
