"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const types = ["frontend", "backend", "devops", "mobile"] as const;

export default function TabSwitcher() {
  const t = useTranslations("Tabs");
  const { locale } = useParams<{ locale: string }>();

  return (
    <nav className="flex gap-2">
      {types.map((type) => (
        <Link
          key={type}
          href={`/${locale}/roadmap/${type}`}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          {t(type)}
        </Link>
      ))}
    </nav>
  );
}
