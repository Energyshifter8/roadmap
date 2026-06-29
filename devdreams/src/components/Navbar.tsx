"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import type { RoadmapTabId } from "./RoadmapTabs";

const TABS: { key: RoadmapTabId; icon: string }[] = [
  { key: "frontend", icon: "◈" },
  { key: "backend", icon: "◉" },
  { key: "devops", icon: "◎" },
  { key: "mobile", icon: "◆" },
];

export default function Navbar() {
  const t = useTranslations("tabs");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const activeTab: RoadmapTabId =
    TABS.find(({ key }) => pathname === `/roadmap/${key}`)?.key ?? "frontend";

  function switchLocale() {
    const next = locale === "mn" ? "en" : "mn";
    startTransition(() => {
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API lacks universal browser support
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        background: "rgba(15,15,15,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <span style={{ fontSize: 16 }}>📖</span>
        <span
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 600,
            fontSize: 13,
            color: "#f4f4f5",
            letterSpacing: "0.05em",
          }}
        >
          devdreams
        </span>
      </Link>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4 }}>
        {TABS.map(({ key, icon }) => {
          const active = activeTab === key;
          return (
            <Link
              key={key}
              href={`/roadmap/${key}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 14px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                background: active ? "#FFD000" : "transparent",
                color: active ? "#0f0f0f" : "#71717a",
                border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                cursor: "pointer",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 11 }}>{icon}</span>
              <span>{t(key)}</span>
            </Link>
          );
        })}
      </div>

      {/* Lang switch */}
      <button
        type="button"
        onClick={switchLocale}
        disabled={isPending}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 12px",
          borderRadius: 9999,
          fontSize: 11,
          fontFamily: "'Geist Mono', monospace",
          fontWeight: 600,
          background: "transparent",
          color: "#71717a",
          border: "1px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          letterSpacing: "0.05em",
        }}
      >
        <span>{locale === "mn" ? "🇲🇳" : "🇬🇧"}</span>
        <span>{locale === "mn" ? "EN" : "МН"}</span>
      </button>
    </nav>
  );
}
