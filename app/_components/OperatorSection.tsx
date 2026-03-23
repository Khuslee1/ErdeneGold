"use client";
import { useState } from "react";
import type { OperatorSectionProps } from "./type/type";
import { useDepartments } from "../api/hooks/useDepartments";
import { useQuestions } from "../api/hooks/useQuestions";
import { DAY_HOURS, NIGHT_HOURS, getShiftForHour, getNow, DEPT_NAMES } from "./data/data";
import { T } from "../styles/tokens";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  Clock,
  FileWarning,
} from "lucide-react";

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  padding: "13px 16px",
  background: hasError ? "#FEF2F0" : T.white,
  border: `1.5px solid ${hasError ? "#E57373" : T.border}`,
  borderRadius: 10,
  fontSize: 16,
  color: T.text,
  outline: "none",
  fontFamily: T.font,
  boxSizing: "border-box",
});

export default function OperatorSection({ onBack }: OperatorSectionProps) {
  const { departments } = useDepartments();
  const [step, setStep] = useState<
    "dept" | "hour" | "form" | "confirm" | "done"
  >("dept");
  const [deptId, setDeptId] = useState<string | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [operator, setOperator] = useState<string>("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { questions } = useQuestions(deptId, hour);
  const dept = departments.find((d) => d.id === deptId);
  const { time, date } = getNow();

  const updateAnswer = (qId: string, value: string) => {
    setAnswers((p) => ({ ...p, [qId]: value }));
    if (errors[qId]) setErrors((p) => ({ ...p, [qId]: false }));
  };

  const validate = () => {
    const errs: Record<string, boolean> = {};
    questions.forEach((q) => {
      if (!answers[q.id] && answers[q.id] !== "false") errs[q.id] = true;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operatorName: operator,
          shift: getShiftForHour(hour!),
          hour,
          departmentId: deptId,
          answers,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStep("done");
    } catch {
      setSubmitError("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("dept");
    setDeptId(null);
    setHour(null);
    setOperator("");
    setAnswers({});
    setErrors({});
    setSubmitError("");
  };

  const Header = ({
    title,
    subtitle,
    onBack: back,
  }: {
    title: string;
    subtitle?: string;
    onBack: () => void;
  }) => (
    <div
      style={{
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 10,
        boxShadow: T.shadow,
      }}
    >
      <button
        onClick={back}
        style={{
          background: T.offWhite,
          border: `1px solid ${T.border}`,
          color: T.textMid,
          width: 38,
          height: 38,
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ChevronLeft />
      </button>
      <div>
        <div style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11, color: T.textLight }}>{subtitle}</div>
        )}
      </div>
    </div>
  );

  // ── DONE ──────────────────────────────────────────────────────
  if (step === "done")
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
          padding: 24,
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: `linear-gradient(135deg, #2D6A4F, #1B4332)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: T.white,
            marginBottom: 24,
            boxShadow: "0 4px 20px rgba(45,106,79,0.3)",
          }}
        >
          <Check />
        </div>
        <div
          style={{
            fontSize: 22,
            color: T.text,
            fontWeight: 600,
            marginBottom: 6,
          }}
        >
          Амжилттай илгээлээ!
        </div>
        <div style={{ fontSize: 14, color: T.textMid, marginBottom: 4 }}>
          {dept?.name} · {hour}:00
        </div>
        <div
          style={{
            fontSize: 12,
            color: T.textLight,
            marginBottom: 32,
            fontFamily: "monospace",
          }}
        >
          {date} {time}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            width: "100%",
            maxWidth: 320,
          }}
        >
          <button
            onClick={handleReset}
            style={{
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
              border: "none",
              color: T.white,
              padding: 16,
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: T.shadowGold,
              fontFamily: T.font,
            }}
          >
            Дахин оруулах
          </button>
          <button
            onClick={onBack}
            style={{
              background: T.white,
              border: `1.5px solid ${T.border}`,
              color: T.textMid,
              padding: 14,
              borderRadius: 12,
              fontSize: 14,
              cursor: "pointer",
              fontFamily: T.font,
            }}
          >
            ← Нүүр хуудас
          </button>
        </div>
      </div>
    );

  // ── CONFIRM ───────────────────────────────────────────────────
  if (step === "confirm")
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
        <Header
          title="Мэдээлэл шалгах"
          subtitle="Илгээхийн өмнө шалгана уу"
          onBack={() => setStep("form")}
        />

        <div style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto" }}>
          <div
            style={{
              background: T.white,
              border: `1.5px solid ${T.border}`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 20,
              borderLeft: `4px solid ${T.gold}`,
              boxShadow: T.shadow,
            }}
          >
            <div style={{ fontSize: 16, color: T.text, fontWeight: 600 }}>
              {dept?.name}
              {dept && DEPT_NAMES[dept.name] && (
                <span style={{ fontWeight: 400, color: T.textMid, marginLeft: 8, fontSize: 13 }}>
                  {DEPT_NAMES[dept.name]}
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: T.textLight, marginTop: 2 }}>
              {operator} · {hour}:00 · {date}
            </div>
          </div>

          {Array.from(new Set(questions.map((q) => q.label))).map((label) => (
            <div key={label ?? "main"} style={{ marginBottom: 16 }}>
              {label && (
                <div
                  style={{
                    fontSize: 10,
                    color: T.gold,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 8,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              )}
              <div
                style={{
                  background: T.white,
                  borderRadius: 10,
                  border: `1px solid ${T.border}`,
                  overflow: "hidden",
                  boxShadow: T.shadow,
                }}
              >
                {questions
                  .filter((q) => q.label === label)
                  .map((q, i, arr) => (
                    <div
                      key={q.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "11px 16px",
                        background: i % 2 === 0 ? T.white : T.bg,
                        borderBottom:
                          i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: T.textMid }}>
                        {q.title}
                      </span>
                      <span
                        style={{ fontSize: 13, color: T.text, fontWeight: 600 }}
                      >
                        {q.type === "BOOLEAN"
                          ? answers[q.id] === "true"
                            ? "✓ Тийм"
                            : "✗ Үгүй"
                          : (answers[q.id] ?? "—")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {submitError && (
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
                marginBottom: 12,
              }}
            >
              <FileWarning /> {submitError}
            </div>
          )}
        </div>

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 20px",
            background: T.white,
            borderTop: `1px solid ${T.border}`,
            boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: 17,
              background: loading
                ? T.offWhite
                : `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
              border: "none",
              borderRadius: 12,
              color: loading ? T.textLight : T.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : T.shadowGold,
              fontFamily: T.font,
            }}
          >
            {loading ? "Илгээж байна..." : "✓ Илгээх"}
          </button>
        </div>
      </div>
    );

  // ── FORM ──────────────────────────────────────────────────────
  if (step === "form") {
    const filled = questions.filter(
      (q) => answers[q.id] !== undefined && answers[q.id] !== "",
    ).length;
    const progress =
      questions.length > 0 ? Math.round((filled / questions.length) * 100) : 0;

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
        <div
          style={{
            background: T.white,
            borderBottom: `1px solid ${T.border}`,
            padding: "0 20px",
            position: "sticky",
            top: 0,
            zIndex: 10,
            boxShadow: T.shadow,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 0 10px",
            }}
          >
            <button
              onClick={() => setStep("hour")}
              style={{
                background: T.offWhite,
                border: `1px solid ${T.border}`,
                color: T.textMid,
                width: 38,
                height: 38,
                borderRadius: 8,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <ChevronLeft />
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  color: T.textLight,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {dept?.name}
              </div>
              <div style={{ fontSize: 13, color: T.textMid }}>
                {operator} · {hour}:00
              </div>
            </div>
            <div style={{ flexShrink: 0, textAlign: "right" }}>
              <div style={{ fontSize: 18, color: T.gold, fontWeight: 700 }}>
                {progress}%
              </div>
              <div style={{ fontSize: 10, color: T.textLight }}>
                {filled}/{questions.length}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: 3,
              background: T.border,
              borderRadius: 2,
              marginBottom: 1,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${T.gold}, ${T.goldDark})`,
                borderRadius: 2,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        <div style={{ flex: 1, padding: "20px 20px 120px", overflowY: "auto" }}>
          {Array.from(new Set(questions.map((q) => q.label))).map((label) => (
            <div key={label ?? "main"} style={{ marginBottom: 28 }}>
              {label && (
                <div
                  style={{
                    fontSize: 11,
                    color: T.gold,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 14,
                    paddingBottom: 8,
                    borderBottom: `1.5px solid ${T.goldLight}`,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
              )}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {questions
                  .filter((q) => q.label === label)
                  .map((q) => (
                    <div key={q.id}>
                      <label
                        style={{
                          fontSize: 12,
                          color: errors[q.id] ? T.red : T.textMid,
                          letterSpacing: 0.5,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 8,
                        }}
                      >
                        {q.title}
                        {errors[q.id] && (
                          <span style={{ color: T.red, fontSize: 11 }}>
                            ← Заавал бөглөнө үү
                          </span>
                        )}
                      </label>

                      {q.type === "BOOLEAN" ? (
                        <div style={{ display: "flex", gap: 10 }}>
                          {[
                            { label: "✓ Тийм", value: "true" },
                            { label: "✗ Үгүй", value: "false" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => updateAnswer(q.id, opt.value)}
                              style={{
                                flex: 1,
                                padding: "13px",
                                borderRadius: 10,
                                border: `1.5px solid ${answers[q.id] === opt.value ? (opt.value === "true" ? T.green : T.red) : T.border}`,
                                background:
                                  answers[q.id] === opt.value
                                    ? opt.value === "true"
                                      ? "#F0FFF4"
                                      : "#FEF2F0"
                                    : T.white,
                                color:
                                  answers[q.id] === opt.value
                                    ? opt.value === "true"
                                      ? T.green
                                      : T.red
                                    : T.textLight,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: T.font,
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type={q.type === "NUMBER" ? "number" : "text"}
                          inputMode={q.type === "NUMBER" ? "decimal" : "text"}
                          value={answers[q.id] ?? ""}
                          onChange={(e) => updateAnswer(q.id, e.target.value)}
                          style={inputStyle(!!errors[q.id])}
                        />
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 20px",
            background: T.white,
            borderTop: `1px solid ${T.border}`,
            boxShadow: "0 -4px 12px rgba(0,0,0,0.06)",
          }}
        >
          <button
            onClick={() => {
              if (validate()) setStep("confirm");
            }}
            style={{
              width: "100%",
              padding: 17,
              background: `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
              border: "none",
              borderRadius: 12,
              color: T.white,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: T.shadowGold,
              fontFamily: T.font,
            }}
          >
            Шалгах →
          </button>
        </div>
      </div>
    );
  }

  // ── HOUR SELECTION ────────────────────────────────────────────
  if (step === "hour") {
    const currentHour = new Date().getHours();
    const hours = [...DAY_HOURS, ...NIGHT_HOURS];

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
        <Header
          title={dept?.name ?? ""}
          subtitle="Цаг сонгох"
          onBack={() => setStep("dept")}
        />

        <div style={{ padding: "20px 20px 32px" }}>
          {/* Operator name input */}
          <div style={{ marginBottom: 24 }}>
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
              Операторын нэр
            </label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="Нэрээ оруулна уу..."
              style={inputStyle(false)}
              autoFocus
            />
          </div>

          {/* Hour grid */}
          <div
            style={{
              fontSize: 11,
              color: T.textMid,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Цаг сонгох
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 10,
            }}
          >
            {hours.map((h) => (
              <button
                key={h}
                onClick={() => {
                  if (!operator.trim()) return;
                  setHour(h);
                  setStep("form");
                }}
                disabled={!operator.trim()}
                style={{
                  padding: "14px 0",
                  borderRadius: 10,
                  border: `1.5px solid ${h === currentHour ? T.gold : T.border}`,
                  background: h === currentHour ? T.goldLight : T.white,
                  color: !operator.trim()
                    ? T.textLight
                    : h === currentHour
                      ? T.goldDark
                      : T.textMid,
                  fontSize: 14,
                  fontWeight: h === currentHour ? 700 : 400,
                  cursor: operator.trim() ? "pointer" : "not-allowed",
                  boxShadow: h === currentHour ? T.shadowGold : T.shadow,
                  fontFamily: T.font,
                }}
              >
                {h}:00
              </button>
            ))}
          </div>
          {!operator.trim() && (
            <div
              style={{
                fontSize: 12,
                color: T.red,
                textAlign: "center",
                marginTop: 12,
              }}
            >
              Эхлээд нэрээ оруулна уу
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── DEPT SELECTION ────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: T.bg, fontFamily: T.font }}>
      <div
        style={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          padding: "16px 20px",
          boxShadow: T.shadow,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 4,
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
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, color: T.text, fontWeight: 600 }}>
              Алт боловсруулалт
            </div>
            <div style={{ fontSize: 11, color: T.textLight }}>
              Оператор · {date}
            </div>
          </div>
          <div
            style={{
              fontSize: 17,
              color: T.gold,
              fontWeight: 700,
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Clock /> {time}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 32px" }}>
        <div
          style={{
            fontSize: 12,
            color: T.textLight,
            marginBottom: 16,
            paddingLeft: 4,
          }}
        >
          Өөрийн хэлтсийг сонгоно уу:
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {departments.map((d) => (
            <button
              key={d.id}
              onClick={() => {
                setDeptId(d.id);
                setStep("hour");
              }}
              style={{
                background: T.white,
                border: `1.5px solid ${T.border}`,
                borderLeft: `4px solid ${d.color}`,
                borderRadius: 12,
                padding: "16px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 16,
                textAlign: "left",
                boxShadow: T.shadow,
                transition: "all 0.15s",
                fontFamily: T.font,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateX(2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "none";
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, color: T.text, fontWeight: 600 }}>
                  {d.name}
                </div>
                {DEPT_NAMES[d.name] && (
                  <div style={{ fontSize: 12, color: T.textMid, marginTop: 2 }}>
                    {DEPT_NAMES[d.name]}
                  </div>
                )}
              </div>
              <div style={{ color: T.borderDark }}>
                <ChevronDown />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
