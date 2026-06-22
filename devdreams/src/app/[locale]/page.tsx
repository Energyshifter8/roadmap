"use client";

import { useTranslations } from "next-intl";
import TabSwitcher from "@/components/TabSwitcher";
import LangToggle from "@/components/LangToggle";

export default function HomePage() {
  const t = useTranslations("Home");

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="absolute right-4 top-4">
        <LangToggle />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {t("title")}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          {t("subtitle")}
        </p>
      </div>

      <TabSwitcher />
    </div>
  );
}
