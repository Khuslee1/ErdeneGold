"use client";
import { useState } from "react";

interface EngineerLoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  error: string;
  loading: boolean;
}

// ─── STYLES ────────────────────────────────────────────────────
export const S = {
  page: {
    minHeight: "100dvh",
    background: "#0a0a0a",
    display: "flex",
    flexDirection: "column" as const,
    fontFamily: "'Georgia', serif",
  },

  header: {
    wrap: {
      background: "linear-gradient(180deg,#081410 0%,#0a0a0a 100%)",
      borderBottom: "1px solid #1a2a20",
      padding: "20px 20px 16px",
      display: "flex", alignItems: "center", gap: 12,
    },
    backBtn: {
      background: "#0a1a10", border: "1px solid #1a3a20", color: "#5a8a6a",
      width: 36, height: 36, borderRadius: 8, fontSize: 16,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    },
    title:    { fontSize: 16, color: "#e8dfc0", fontWeight: 600 },
    subtitle: { fontSize: 11, color: "#3a6a4a" },
  },

  body: {
    wrap: {
      flex: 1,
      display: "flex", flexDirection: "column" as const,
      alignItems: "center", justifyContent: "center",
      padding: "32px 24px",
    },
    icon: {
      width: 72, height: 72,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#0a2a18,#081410)",
      border: "2px solid #7EB8A433",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 32, marginBottom: 20,
      boxShadow: "0 0 40px #7EB8A411",
    },
    title:    { fontSize: 20, color: "#e8dfc0", fontWeight: 600, marginBottom: 6 },
    subtitle: { fontSize: 13, color: "#3a5a4a", marginBottom: 36 },
  },

  form: {
    wrap:  { width: "100%", maxWidth: 360, display: "flex", flexDirection: "column" as const, gap: 16 },
    label: { fontSize: 11, color: "#5a8a6a", letterSpacing: 2, textTransform: "uppercase" as const, display: "block", marginBottom: 8 },
    input: (hasError: boolean) => ({
      width: "100%",
      background: hasError ? "#1a0808" : "#161410",
      border: `1.5px solid ${hasError ? "#C97B4C" : "#2a2416"}`,
      borderRadius: 8, padding: "14px 16px",
      color: "#e8dfc0", fontSize: 16, outline: "none",
      boxSizing: "border-box" as const,
      WebkitAppearance: "none" as const,
      appearance: "none" as const,
    } as React.CSSProperties),
    passwordWrap:   { position: "relative" as const },
    toggleBtn: {
      position: "absolute" as const,
      right: 14, top: "50%", transform: "translateY(-50%)",
      background: "none", border: "none", color: "#5a4a30",
      cursor: "pointer", fontSize: 16, padding: 0,
      display: "flex", alignItems: "center",
    },
    error: {
      background: "#1a0808",
      border: "1px solid #C97B4C44",
      borderRadius: 8, padding: "10px 14px",
      fontSize: 13, color: "#C97B4C",
      display: "flex", alignItems: "center", gap: 8,
    },
    submitBtn: (disabled: boolean) => ({
      width: "100%", padding: "18px",
      background: disabled ? "#0a1a10" : "linear-gradient(135deg,#7EB8A4,#4a8a75)",
      border: "none", borderRadius: 12,
      color: disabled ? "#2a4a3a" : "#0a0a0a",
      fontSize: 17, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      marginTop: 4, transition: "all 0.2s",
    } as React.CSSProperties),
  },
};

// ─── COMPONENT ─────────────────────────────────────────────────
export default function EngineerLoginModal({ onLogin, onBack, error, loading }: EngineerLoginModalProps) {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) return;
    onLogin(email, password);
  };

  const isDisabled = loading || !email || !password;

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header.wrap}>
        <button onClick={onBack} style={S.header.backBtn}>←</button>
        <div>
          <div style={S.header.title}>Инженерийн хэсэг</div>
          <div style={S.header.subtitle}>Нэвтрэх шаардлагатай</div>
        </div>
      </div>

      {/* Body */}
      <div style={S.body.wrap}>
        <div style={S.body.icon}>🔬</div>
        <div style={S.body.title}>Инженер нэвтрэх</div>
        <div style={S.body.subtitle}>Зөвхөн эрх бүхий инженерүүд</div>

        <div style={S.form.wrap}>
          {/* Email */}
          <div>
            <label style={S.form.label}>Имэйл</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="engineer@mine.mn"
              autoComplete="email"
              style={S.form.input(!!error)}
            />
          </div>

          {/* Password */}
          <div>
            <label style={S.form.label}>Нууц үг</label>
            <div style={S.form.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...S.form.input(!!error), paddingRight: 48 }}
              />
              <button onClick={() => setShowPassword((p) => !p)} style={S.form.toggleBtn}>
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={S.form.error}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={handleSubmit} disabled={isDisabled} style={S.form.submitBtn(isDisabled)}>
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх →"}
          </button>
        </div>
      </div>
    </div>
  );
}