"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { RoadmapTabId } from "./RoadmapTabs";

const TABS: { key: RoadmapTabId; icon: string }[] = [
  { key: "frontend", icon: "◈" },
  { key: "backend",  icon: "◉" },
  { key: "devops",   icon: "◎" },
  { key: "mobile",   icon: "◆" },
];

export default function Navbar() {
  const t = useTranslations("tabs");
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();

  const activeTab: RoadmapTabId =
    TABS.find(({ key }) => pathname === `/roadmap/${key}`)?.key ?? "frontend";

  function switchLocale() {
    const next = locale === "mn" ? "en" : "mn";
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
      router.refresh();
    });
  }

  return (
    <>
      <nav style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 52,
        background: "rgba(15,15,15,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8,
          textDecoration: "none", flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>📖</span>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontWeight: 600, fontSize: 13,
            color: "#f4f4f5", letterSpacing: "0.05em",
          }}>devdreams</span>
        </Link>

        {/* Desktop tabs — hidden on mobile */}
        <div style={{
          display: "flex", gap: 4,
          position: "absolute", left: "50%",
          transform: "translateX(-50%)",
        }} className="hidden sm:flex">
          {TABS.map(({ key, icon }) => {
            const active = activeTab === key;
            return (
              <Link key={key} href={`/roadmap/${key}`} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "5px 12px", borderRadius: 9999,
                fontSize: 12, fontWeight: active ? 700 : 500,
                fontFamily: "'Inter', sans-serif",
                background: active ? "#FFD000" : "transparent",
                color: active ? "#0f0f0f" : "#71717a",
                border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
                textDecoration: "none", transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: 10 }}>{icon}</span>
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side — lang + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {/* Lang switch — always visible */}
          <button
            type="button"
            onClick={switchLocale}
            disabled={isPending}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "4px 10px", borderRadius: 9999,
              fontSize: 11, fontFamily: "'Geist Mono', monospace",
              fontWeight: 600, background: "transparent",
              color: "#71717a", border: "1px solid rgba(255,255,255,0.08)",
              cursor: "pointer", letterSpacing: "0.05em",
            }}
          >
            <span>{locale === "mn" ? "🇲🇳" : "🇬🇧"}</span>
            <span className="hidden xs:inline">{locale === "mn" ? "EN" : "МН"}</span>
          </button>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden"
            style={{
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "center",
              gap: 4, width: 32, height: 32,
              background: "transparent", border: "none",
              cursor: "pointer", padding: 4,
            }}
          >
            <span style={{
              display: "block", width: 18, height: 1.5,
              background: menuOpen ? "#FFD000" : "#71717a",
              transition: "all 0.2s",
              transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }} />
            <span style={{
              display: "block", width: 18, height: 1.5,
              background: menuOpen ? "#FFD000" : "#71717a",
              transition: "all 0.2s",
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: "block", width: 18, height: 1.5,
              background: menuOpen ? "#FFD000" : "#71717a",
              transition: "all 0.2s",
              transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div
          className="sm:hidden"
          style={{
            position: "fixed",
            top: 52, left: 0, right: 0,
            background: "rgba(15,15,15,0.98)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            zIndex: 99,
            padding: "12px 16px 16px",
          }}
        >
          {TABS.map(({ key, icon }) => {
            const active = activeTab === key;
            return (
              <Link
                key={key}
                href={`/roadmap/${key}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderRadius: 10,
                  marginBottom: 6,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  background: active ? "rgba(255,208,0,0.1)" : "transparent",
                  color: active ? "#FFD000" : "#71717a",
                  border: active ? "1px solid rgba(255,208,0,0.2)" : "1px solid transparent",
                  textDecoration: "none", transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span>{t(key)}</span>
                {active && (
                  <span style={{
                    marginLeft: "auto", fontSize: 10,
                    color: "#FFD000", fontFamily: "'Geist Mono', monospace",
                  }}>● active</span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
