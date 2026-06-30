"use client";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { nodeId: string; score: number }[];
}

export default function ChatWidget() {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function sendMessage() {
    const query = input.trim();
    if (!query || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: query },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, locale }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer ?? "Error",
          sources: data.sources,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: locale === "mn" ? "Алдаа гарлаа" : "Something went wrong",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: open ? "#1c1c1c" : "#FFD000",
          border: open ? "1px solid rgba(255,208,0,0.3)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: open
            ? "0 8px 32px rgba(0,0,0,0.4)"
            : "0 0 30px rgba(255,208,0,0.4), 0 4px 16px rgba(0,0,0,0.3)",
          zIndex: 200,
          transition: "all 0.2s",
          fontSize: 22,
        }}
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 92,
            right: 24,
            width: "min(360px, calc(100vw - 32px))",
            height: "min(520px, calc(100vh - 140px))",
            background: "#141414",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            zIndex: 199,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 16 }}>✦</span>
            <div>
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#f4f4f5",
                }}
              >
                {locale === "mn" ? "Roadmap AI туслах" : "Roadmap AI Assistant"}
              </div>
              <div
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  color: "#52525b",
                }}
              >
                477 topics indexed
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#52525b",
                  textAlign: "center",
                  marginTop: 40,
                }}
              >
                {locale === "mn"
                  ? "React, JWT, Git, эсвэл бусад сэдвээс асуу..."
                  : "Ask about React, JWT, Git, or any topic..."}
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: m.role === "user" ? "#FFD000" : "#1c1c1c",
                  color: m.role === "user" ? "#0a0a0a" : "#e4e4e7",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.content}
                {m.sources && m.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingTop: 8,
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                    }}
                  >
                    {m.sources.map((s) => (
                      <span
                        key={s.nodeId}
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(255,208,0,0.1)",
                          color: "#FFD000",
                        }}
                      >
                        {s.nodeId}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 12,
                  color: "#52525b",
                }}
              >
                {locale === "mn" ? "бичиж байна..." : "thinking..."}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: 12,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                locale === "mn" ? "Асуулт бичих..." : "Type a question..."
              }
              style={{
                flex: 1,
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 9999,
                padding: "10px 16px",
                color: "#f4f4f5",
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#FFD000",
                border: "none",
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                opacity: loading || !input.trim() ? 0.4 : 1,
                fontSize: 14,
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
