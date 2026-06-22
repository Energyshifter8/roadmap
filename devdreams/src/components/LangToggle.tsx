"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const locales = ["mn", "en"] as const;

export default function LangToggle() {
  const t = useTranslations("LangToggle");
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const other = locale === "mn" ? "en" : "mn";
  const nextPath = pathname.replace(`/${locale}`, `/${other}`);

  return (
    <Link
      href={nextPath}
      className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
    >
      {t("label")}
    </Link>
  );
}
