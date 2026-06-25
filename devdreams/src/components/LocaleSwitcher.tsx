"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentLocale = useLocale();

  function switchLocale(locale: string) {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1 bg-white border-2 border-zinc-900 rounded-lg p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      <button
        onClick={() => switchLocale("en")}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
          currentLocale === "en"
            ? "bg-zinc-900 text-white"
            : "bg-transparent text-zinc-600 hover:bg-zinc-100"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("mn")}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
          currentLocale === "mn"
            ? "bg-zinc-900 text-white"
            : "bg-transparent text-zinc-600 hover:bg-zinc-100"
        }`}
      >
        MN
      </button>
    </div>
  );
}
