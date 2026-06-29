"use client";

import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("landing");
  const tTabs = useTranslations("tabs");

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", paddingTop: 52 }}>
      {/* Hero */}
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "80px 24px 48px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 9999,
            marginBottom: 32,
            background: "rgba(255,208,0,0.08)",
            border: "1px solid rgba(255,208,0,0.2)",
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11,
            color: "#FFD000",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#FFD000",
              display: "inline-block",
            }}
          />
          Монгол хөгжүүлэгчдэд зориулсан
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(40px, 8vw, 72px)",
            fontWeight: 900,
            lineHeight: 1.05,
            color: "#f4f4f5",
            marginBottom: 20,
            letterSpacing: "-0.02em",
          }}
        >
          {t("title")} <span style={{ color: "#FFD000" }}>·</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#71717a",
            lineHeight: 1.7,
            marginBottom: 40,
            maxWidth: 480,
            margin: "0 auto 40px",
          }}
        >
          {t("subtitle")}
        </p>

        {/* CTA */}
        <a
          href="/roadmap/frontend"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 9999,
            background: "#FFD000",
            color: "#0f0f0f",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            boxShadow: "0 0 40px rgba(255,208,0,0.25)",
            transition: "all 0.2s",
          }}
        >
          Get started →
        </a>
      </div>

      {/* Cards */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "#3f3f46",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          замаа сонго
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 12,
          }}
        >
          {[
            {
              href: "/roadmap/frontend",
              icon: "◈",
              label: tTabs("frontend"),
              topics: "45 сэдэв",
              time: "~4 сар",
            },
            {
              href: "/roadmap/backend",
              icon: "◉",
              label: tTabs("backend"),
              topics: "52 сэдэв",
              time: "~5 сар",
            },
            {
              href: "/roadmap/devops",
              icon: "◎",
              label: tTabs("devops"),
              topics: "38 сэдэв",
              time: "~3 сар",
            },
            {
              href: "/roadmap/mobile",
              icon: "◆",
              label: tTabs("mobile"),
              topics: "29 сэдэв",
              time: "~3 сар",
            },
          ].map((card) => (
            <a
              key={card.href}
              href={card.href}
              style={{
                display: "block",
                padding: "20px",
                borderRadius: 16,
                textDecoration: "none",
                background: "#141414",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#18181b";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,208,0,0.3)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#141414";
                (e.currentTarget as HTMLElement).style.borderColor =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  marginBottom: 14,
                  color: "#3f3f46",
                }}
              >
                {card.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#f4f4f5",
                  marginBottom: 4,
                }}
              >
                {card.label}
              </div>
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  color: "#52525b",
                  marginBottom: 10,
                }}
              >
                {card.topics}
              </div>
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  color: "#52525b",
                }}
              >
                {card.time} →
              </div>
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          textAlign: "center",
          paddingBottom: 32,
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11,
          color: "#27272a",
        }}
      >
        open source · community driven · always free
      </div>
    </div>
  );
}
