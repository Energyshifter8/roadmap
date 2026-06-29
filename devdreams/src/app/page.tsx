"use client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

const CARDS = [
  {
    href: "/roadmap/frontend",
    icon: "⬡",
    key: "frontend" as const,
    topics: "45 topics",
    time: "4 mo",
  },
  {
    href: "/roadmap/backend",
    icon: "⬡",
    key: "backend" as const,
    topics: "52 topics",
    time: "5 mo",
  },
  {
    href: "/roadmap/devops",
    icon: "⬡",
    key: "devops" as const,
    topics: "38 topics",
    time: "3 mo",
  },
  {
    href: "/roadmap/mobile",
    icon: "⬡",
    key: "mobile" as const,
    topics: "29 topics",
    time: "3 mo",
  },
];

function RoadmapCard({
  card,
  label,
}: {
  card: (typeof CARDS)[0];
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    setPos({ x, y });
  }

  return (
    <a
      href={card.href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPos({ x: 0, y: 0 });
      }}
      onMouseMove={handleMouseMove}
      style={{
        textDecoration: "none",
        background: hovered ? "#1c1c1c" : "#161616",
        border: hovered
          ? "1px solid rgba(255,208,0,0.2)"
          : "1px solid rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "28px 24px 24px",
        cursor: "pointer",
        transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,208,0,0.1)"
          : "0 4px 24px rgba(0,0,0,0.3)",
        transform: hovered
          ? `perspective(600px) rotateX(${pos.y}deg) rotateY(${pos.x}deg) scale(1.03)`
          : "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shine overlay */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 20,
            background: `radial-gradient(circle at ${50 + pos.x * 3}% ${50 - pos.y * 3}%, rgba(255,208,0,0.06) 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Icon */}
      <div
        style={{
          fontSize: 22,
          color: hovered ? "#FFD000" : "#3f3f46",
          marginBottom: 32,
          transition: "color 0.2s",
          lineHeight: 1,
        }}
      >
        {card.icon}
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#f4f4f5",
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>

      {/* Meta */}
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 11,
          color: "#52525b",
          marginBottom: 28,
          letterSpacing: "0.02em",
        }}
      >
        {card.topics} · {card.time}
      </div>

      {/* CTA */}
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          color: hovered ? "#FFD000" : "#52525b",
          display: "flex",
          alignItems: "center",
          gap: 4,
          transition: "color 0.2s",
          marginTop: "auto",
        }}
      >
        Start path
        <span
          style={{
            transition: "transform 0.2s",
            transform: hovered ? "translateX(3px)" : "translateX(0)",
            display: "inline-block",
          }}
        >
          ›
        </span>
      </div>
    </a>
  );
}

export default function Home() {
  const t = useTranslations("landing");
  const tTabs = useTranslations("tabs");
  const router = useRouter();
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        paddingTop: 52,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial background glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          background:
            "radial-gradient(ellipse at center, rgba(20,40,80,0.5) 0%, rgba(10,10,10,0) 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Bottom glow behind CTA */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 400,
          height: 200,
          background:
            "radial-gradient(ellipse at center, rgba(255,208,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero */}
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "72px 24px 64px",
            textAlign: "center",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 16px",
              borderRadius: 9999,
              marginBottom: 48,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'Geist Mono', monospace",
              fontSize: 12,
              color: "#71717a",
              letterSpacing: "0.02em",
            }}
          >
            <span style={{ color: "#FFD000", fontSize: 14 }}>✦</span>
            <span>v2.0 · updated Jun 2026</span>
          </div>

          {/* Hero title */}
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(52px, 9vw, 96px)",
              fontWeight: 900,
              lineHeight: 1.0,
              color: "#ffffff",
              marginBottom: 28,
              letterSpacing: "-0.03em",
            }}
          >
            {t("heroLine1")}{" "}
            <em
              style={{
                color: "#FFD000",
                fontStyle: "italic",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {t("heroLine2")}.
            </em>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "#71717a",
              lineHeight: 1.65,
              marginBottom: 52,
              maxWidth: 500,
              margin: "0 auto 52px",
            }}
          >
            {t("subtitle")}
          </p>

          {/* CTA */}
          <button
            type="button"
            onClick={() => router.push("/roadmap/frontend")}
            onMouseEnter={() => setCtaHovered(true)}
            onMouseLeave={() => setCtaHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 36px",
              borderRadius: 9999,
              background: "#FFD000",
              color: "#0a0a0a",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              border: "none",
              cursor: "pointer",
              boxShadow: ctaHovered
                ? "0 0 60px rgba(255,208,0,0.5), 0 8px 32px rgba(255,208,0,0.3)"
                : "0 0 40px rgba(255,208,0,0.25), 0 4px 16px rgba(255,208,0,0.15)",
              transform: ctaHovered ? "scale(1.04)" : "scale(1)",
              transition: "all 0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            {t("cta")}
            <span
              style={{
                transform: ctaHovered ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.2s",
                display: "inline-block",
                fontSize: 18,
              }}
            >
              →
            </span>
          </button>
        </div>

        {/* Cards section */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px 100px",
          }}
        >
          {/* Section label */}
          <p
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#3f3f46",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 28,
            }}
          >
            Choose a track
          </p>

          {/* Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {CARDS.map((card) => (
              <RoadmapCard key={card.key} card={card} label={tTabs(card.key)} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            paddingBottom: 40,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11,
            color: "#27272a",
            letterSpacing: "0.05em",
          }}
        >
          open source · community driven · always free
        </div>
      </div>
    </div>
  );
}
