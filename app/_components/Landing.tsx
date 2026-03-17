"use client";
import type { LandingProps } from "./type/type";
import { initialRecords, getNow } from "./data/data";

// ─── STYLES ────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100dvh",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Georgia', serif",
    padding: 24,
  },

  hero: {
    wrap:     { textAlign: "center" as const, marginBottom: 52 },
    icon: {
      width: 72, height: 72,
      background: "linear-gradient(135deg,#C9A84C,#8B6914)",
      borderRadius: "50%",
      margin: "0 auto 20px",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 32,
      boxShadow: "0 0 40px #C9A84C33",
    },
    title:    { fontSize: 24, color: "#e8dfc0", fontWeight: 400, margin: "0 0 6px", letterSpacing: 1 },
    subtitle: { fontSize: 11, color: "#3a3020", letterSpacing: 3, textTransform: "uppercase" as const, marginBottom: 8 },
    date:     { fontSize: 13, color: "#5a4a30", fontFamily: "monospace" },
  },

  prompt: { fontSize: 11, color: "#3a3020", letterSpacing: 4, textTransform: "uppercase" as const, marginBottom: 16 },

  list: { display: "flex", flexDirection: "column" as const, gap: 14, width: "100%", maxWidth: 340 },

  card: {
    operator: {
      background: "#111009",
      border: "1px solid #C9A84C33",
      borderLeft: "4px solid #C9A84C",
      borderRadius: 14,
      padding: "20px 24px",
      cursor: "pointer",
      display: "flex", alignItems: "center", gap: 16,
      textAlign: "left" as const,
      WebkitTapHighlightColor: "transparent",
    } as React.CSSProperties,
    engineer: {
      background: "#080d0b",
      border: "1px solid #7EB8A433",
      borderLeft: "4px solid #7EB8A4",
      borderRadius: 14,
      padding: "20px 24px",
      cursor: "pointer",
      display: "flex", alignItems: "center", gap: 16,
      textAlign: "left" as const,
      WebkitTapHighlightColor: "transparent",
      position: "relative" as const,
    } as React.CSSProperties,
    icon: (bg: string) => ({
      width: 52, height: 52,
      borderRadius: 12,
      background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 28, flexShrink: 0,
    } as React.CSSProperties),
    badge: {
      position: "absolute" as const,
      top: 12, right: 16,
      background: "#7EB8A4",
      color: "#0a0a0a",
      fontSize: 11, fontWeight: 700,
      padding: "2px 8px", borderRadius: 10,
    },
    title:   (color: string) => ({ fontSize: 18, color, fontWeight: 700, marginBottom: 3 } as React.CSSProperties),
    desc:    (color: string) => ({ fontSize: 12, color } as React.CSSProperties),
    meta:    (color: string) => ({ fontSize: 11, color, marginTop: 2 } as React.CSSProperties),
    arrow:   (color: string) => ({ color, fontSize: 22 } as React.CSSProperties),
  },
};

// ─── COMPONENT ─────────────────────────────────────────────────
export default function Landing({ onSelect, records }: LandingProps) {
  const { time, date } = getNow();
  const newCount: number = records.length - initialRecords.length;

  return (
    <div style={S.page}>
      <div style={S.hero.wrap}>
        <div style={S.hero.icon}>⛏️</div>
        <h1 style={S.hero.title}>Алт боловсруулах систем</h1>
        <div style={S.hero.subtitle}>Gold Processing System</div>
        <div style={S.hero.date}>{date} · {time}</div>
      </div>

      <div style={S.prompt}>Та хэн бэ?</div>

      <div style={S.list}>
        {/* Operator */}
        <button
          onClick={() => onSelect("operator")}
          style={S.card.operator}
          onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1408"; }}
          onTouchEnd={(e)   => { (e.currentTarget as HTMLButtonElement).style.background = "#111009"; }}
        >
          <div style={S.card.icon("#C9A84C18")}>👷</div>
          <div style={{ flex: 1 }}>
            <div style={S.card.title("#C9A84C")}>Оператор</div>
            <div style={S.card.desc("#5a4a30")}>Мэдээлэл оруулах · Хэлтэс сонгох</div>
          </div>
          <div style={S.card.arrow("#3a3020")}>›</div>
        </button>

        {/* Engineer */}
        <button
          onClick={() => onSelect("engineer")}
          style={S.card.engineer}
          onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0d1a14"; }}
          onTouchEnd={(e)   => { (e.currentTarget as HTMLButtonElement).style.background = "#080d0b"; }}
        >
          {newCount > 0 && <div style={S.card.badge}>+{newCount} шинэ</div>}
          <div style={S.card.icon("#7EB8A418")}>🔬</div>
          <div style={{ flex: 1 }}>
            <div style={S.card.title("#7EB8A4")}>Инженер</div>
            <div style={S.card.desc("#3a5a4a")}>Мэдээлэл харах · Excel татах</div>
            <div style={S.card.meta("#2a4a3a")}>Нийт {records.length} бичлэг</div>
          </div>
          <div style={S.card.arrow("#2a4a3a")}>›</div>
        </button>
      </div>
    </div>
  );
}