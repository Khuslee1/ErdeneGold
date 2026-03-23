"use client";
import type { LandingProps } from "./type/type";
import { getNow } from "./data/data";

import { T } from "../styles/tokens";
import { ChevronRight, Clock, Image, UserKey, UserPen } from "lucide-react";
import { url } from "inspector";

export default function Landing({ onSelect }: LandingProps) {
  const { time, date } = getNow();

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: T.font,
        padding: "24px 20px",
        backgroundImage: "url('./landing.jpg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div
          style={{
            width: 80,
            height: 80,
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
            borderRadius: 20,
            margin: "0 auto 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.white,
            boxShadow: T.shadowGold,
          }}
        >
          <img src="./logo.png" height={"26px"} width={"52px"} />
        </div>
        <h1
          style={{
            fontSize: 20,
            color: T.text,
            fontWeight: 600,
            margin: "0 0 6px",
            letterSpacing: 0.5,
          }}
        >
          Баян Хөндий хүдэр боловсруулах үйлдвэрийн цаг тутмын мэдээ
        </h1>
        {/* <div
          style={{
            fontSize: 12,
            color: T.textLight,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Gold Processing System
        </div> */}
        <div
          style={{
            fontSize: 13,
            color: T.textMid,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Clock />
          {date} · {time}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          width: "100%",
          maxWidth: 360,
        }}
      >
        {/* Operator card */}
        <button
          onClick={() => onSelect("operator")}
          style={{
            background: T.white,
            border: `1.5px solid ${T.border}`,
            borderRadius: 16,
            padding: "20px 24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 18,
            textAlign: "left",
            boxShadow: T.shadow,
            transition: "all 0.15s",
            borderLeft: `4px solid ${T.gold}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = T.shadowMd;
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = T.shadow;
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: T.goldLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.goldDark,
              flexShrink: 0,
            }}
          >
            <UserPen />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 17,
                color: T.text,
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Оператор
            </div>
            <div style={{ fontSize: 12, color: T.textLight }}>
              Мэдээлэл оруулах · Хэлтэс сонгох
            </div>
          </div>
          <div style={{ color: T.borderDark }}>
            <ChevronRight />
          </div>
        </button>

        {/* Engineer card */}
        <button
          onClick={() => onSelect("engineer")}
          style={{
            background: T.white,
            border: `1.5px solid ${T.border}`,
            borderRadius: 16,
            padding: "20px 24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 18,
            textAlign: "left",
            boxShadow: T.shadow,
            transition: "all 0.15s",
            borderLeft: `4px solid ${T.text}`,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = T.shadowMd;
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = T.shadow;
            (e.currentTarget as HTMLButtonElement).style.transform = "none";
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: T.offWhite,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: T.text,
              flexShrink: 0,
            }}
          >
            <UserKey />
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 17,
                color: T.text,
                fontWeight: 600,
                marginBottom: 3,
              }}
            >
              Инженер
            </div>
            <div style={{ fontSize: 12, color: T.textLight }}>
              Мэдээлэл харах · Excel татах
            </div>
          </div>
          <div style={{ color: T.borderDark }}>
            <ChevronRight />
          </div>
        </button>
      </div>
    </div>
  );
}
