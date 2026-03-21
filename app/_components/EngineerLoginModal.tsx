"use client";
import { useState } from "react";
// import { Icons } from "../components/Icons";
import { T } from "../styles/tokens";
import {
  ChevronLeft,
  EyeClosedIcon,
  EyeIcon,
  FileWarningIcon,
  SkipBack,
  User,
} from "lucide-react";

interface EngineerLoginModalProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onBack: () => void;
  error: string;
  loading: boolean;
}

export default function EngineerLoginModal({
  onLogin,
  onBack,
  error,
  loading,
}: EngineerLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    if (!email || !password) return;
    onLogin(email, password);
  };
  const isDisabled = loading || !email || !password;

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "13px 16px",
    background: hasError ? "#FEF2F0" : T.white,
    border: `1.5px solid ${hasError ? "#E57373" : T.border}`,
    borderRadius: 10,
    fontSize: 15,
    color: T.text,
    outline: "none",
    fontFamily: T.font,
    boxSizing: "border-box",
  });

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        display: "flex",
        flexDirection: "column",
        fontFamily: T.font,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: T.shadow,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: T.offWhite,
            border: `1px solid ${T.border}`,
            color: T.textMid,
            width: 36,
            height: 36,
            borderRadius: 8,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft />
        </button>
        <div>
          <div style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>
            Инженерийн хэсэг
          </div>
          <div style={{ fontSize: 11, color: T.textLight }}>
            Нэвтрэх шаардлагатай
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: T.offWhite,
            border: `1.5px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.text,
            marginBottom: 20,
            boxShadow: T.shadow,
          }}
        >
          <User />
        </div>
        <div
          style={{
            fontSize: 20,
            color: T.text,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Инженер нэвтрэх
        </div>
        <div style={{ fontSize: 13, color: T.textLight, marginBottom: 36 }}>
          Зөвхөн эрх бүхий инженерүүд
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: 360,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div>
            <label
              style={{
                fontSize: 11,
                color: T.textMid,
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Имэйл
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="engineer@mine.mn"
              autoComplete="email"
              style={inputStyle(!!error)}
            />
          </div>

          <div>
            <label
              style={{
                fontSize: 11,
                color: T.textMid,
                letterSpacing: 2,
                textTransform: "uppercase",
                display: "block",
                marginBottom: 8,
              }}
            >
              Нууц үг
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{ ...inputStyle(!!error), paddingRight: 48 }}
              />
              <button
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: T.textLight,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "#FEF2F0",
                border: "1px solid #FECACA",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: T.red,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FileWarningIcon /> {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              width: "100%",
              padding: "16px",
              background: isDisabled
                ? T.offWhite
                : `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
              border: "none",
              borderRadius: 12,
              color: isDisabled ? T.textLight : T.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: isDisabled ? "not-allowed" : "pointer",
              marginTop: 4,
              boxShadow: isDisabled ? "none" : T.shadowGold,
              transition: "all 0.2s",
              fontFamily: T.font,
            }}
          >
            {loading ? "Нэвтэрч байна..." : "Нэвтрэх →"}
          </button>
        </div>
      </div>
    </div>
  );
}
