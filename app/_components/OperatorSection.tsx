"use client";
import { useState } from "react";
import type { OperatorStep, OperatorSectionProps } from "./type/type";
import { departments, formFields, getNow, getInputStyle } from "./data/data";
// import {S} from 

// ─── STYLES ────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100dvh",
    background: "#0a0a0a",
    fontFamily: "'Georgia', serif",
  } as React.CSSProperties,

  backBtn: (color = "#5a4a30") => ({
    background: "#1a1408",
    border: "1px solid #2a2416",
    color,
    width: 36,
    height: 36,
    borderRadius: 8,
    fontSize: 16,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties),

  backBtnLg: (color = "#C9A84C") => ({
    background: "#1a1408",
    border: "1px solid #2a2416",
    color,
    width: 40,
    height: 40,
    borderRadius: 8,
    fontSize: 18,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties),

  stickyHeader: {
    background: "#0d0b07",
    borderBottom: "1px solid #1a1810",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    position: "sticky" as const,
    top: 0,
    zIndex: 10,
  },

  labelSm: {
    fontSize: 10,
    color: "#5a4a30",
    letterSpacing: 2,
    textTransform: "uppercase" as const,
  },

  fixedBottom: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: "16px 20px",
    background: "#0a0a0a",
    borderTop: "1px solid #1a1810",
  },

  done: {
    page: {
      minHeight: "100dvh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Georgia', serif",
      padding: 24,
      textAlign: "center" as const,
    },
    icon: {
      width: 80,
      height: 80,
      borderRadius: "50%",
      background: "linear-gradient(135deg,#2a5a3a,#1a3a28)",
      border: "2px solid #7EB8A4",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 36,
      marginBottom: 24,
      boxShadow: "0 0 32px #7EB8A422",
    },
    title:    { fontSize: 22, color: "#7EB8A4", marginBottom: 8, fontWeight: 600 },
    subtitle: { fontSize: 14, color: "#7a6a45", marginBottom: 4 },
    date:     { fontSize: 12, color: "#3a3020", marginBottom: 12, fontFamily: "monospace" },
    badge: {
      fontSize: 12,
      color: "#4a7a4a",
      background: "#0a1a0a",
      border: "1px solid #2a4a2a",
      padding: "8px 16px",
      borderRadius: 8,
      marginBottom: 32,
    },
    actions: {
      display: "flex",
      flexDirection: "column" as const,
      gap: 12,
      width: "100%",
      maxWidth: 320,
    },
    primaryBtn: {
      background: "linear-gradient(135deg,#C9A84C,#8B6914)",
      border: "none",
      color: "#0a0a0a",
      padding: "16px",
      borderRadius: 12,
      fontSize: 16,
      fontWeight: 700,
      cursor: "pointer",
    },
    secondaryBtn: {
      background: "none",
      border: "1px solid #2a2416",
      color: "#5a4a30",
      padding: "14px",
      borderRadius: 12,
      fontSize: 14,
      cursor: "pointer",
    },
  },

  confirm: {
    deptCard: (color = "#C9A84C") => ({
      background: "#111009",
      border: `1px solid ${color}33`,
      borderRadius: 12,
      padding: "16px",
      marginBottom: 20,
      display: "flex",
      alignItems: "center",
      gap: 12,
    } as React.CSSProperties),
    deptName:  (color = "#C9A84C") => ({ fontSize: 16, color, fontWeight: 600 } as React.CSSProperties),
    deptMeta:  { fontSize: 11, color: "#4a3a20" },
    fieldRow:  (even: boolean, first: boolean, last: boolean) => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 16px",
      background: even ? "#0d0b07" : "#111009",
      borderRadius: first ? "8px 8px 0 0" : last ? "0 0 8px 8px" : 0,
    } as React.CSSProperties),
    fieldLabel: { fontSize: 13, color: "#7a6a45" },
    fieldValue: { fontSize: 14, color: "#e8dfc0", fontWeight: 600 as const },
    notesBox:   { background: "#111009", border: "1px solid #2a2416", borderRadius: 8, padding: "12px 16px" },
    notesLabel: { fontSize: 10, color: "#5a4a30", letterSpacing: 2, marginBottom: 6 },
    notesText:  { fontSize: 13, color: "#a09070" },
    submitBtn:  (loading: boolean) => ({
      width: "100%",
      padding: "18px",
      background: loading ? "#1a2010" : "linear-gradient(135deg,#7EB8A4,#4a8a75)",
      border: "none",
      borderRadius: 12,
      color: "#0a0a0a",
      fontSize: 17,
      fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
    } as React.CSSProperties),
  },

  form: {
    header: {
      background: "#0d0b07",
      borderBottom: "1px solid #1a1810",
      padding: "0 20px",
      position: "sticky" as const,
      top: 0,
      zIndex: 10,
    },
    headerInner:   { display: "flex", alignItems: "center", gap: 12, padding: "14px 0 10px" },
    deptLabel:     { fontSize: 10, color: "#5a4a30", letterSpacing: 2, textTransform: "uppercase" as const },
    deptName:      (color = "#C9A84C") => ({ fontSize: 15, color, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const } as React.CSSProperties),
    progressPct:   { fontSize: 18, color: "#C9A84C", fontWeight: 700, textAlign: "right" as const },
    progressCount: { fontSize: 10, color: "#3a3020" },
    progressTrack: { height: 3, background: "#1a1810", borderRadius: 2 },
    progressFill:  (pct: number, color = "#C9A84C") => ({ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}aa)`, borderRadius: 2, transition: "width 0.3s" } as React.CSSProperties),
    body:          { flex: 1, padding: "20px 20px 120px", overflowY: "auto" as const },
    fieldList:     { display: "flex", flexDirection: "column" as const, gap: 16 },
    fieldLabel:    (hasError: boolean) => ({ fontSize: 12, color: hasError ? "#C97B4C" : "#7a6a45", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6, marginBottom: 8, textTransform: "uppercase" as const } as React.CSSProperties),
    required:      { color: "#C9A84C", fontSize: 14 },
    errorHint:     { color: "#C97B4C", fontSize: 11, textTransform: "none" as const },
    selectWrap:    { position: "relative" as const },
    selectArrow:   { position: "absolute" as const, right: 14, top: "50%", transform: "translateY(-50%)", color: "#5a4a30", pointerEvents: "none" as const, fontSize: 12 },
    unitWrap:      { display: "flex" },
    unit:          { background: "#1a1408", border: "1.5px solid #2a2416", borderLeft: "none", borderRadius: "0 8px 8px 0", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 13, color: "#7a6a45", whiteSpace: "nowrap" as const, flexShrink: 0 },
    nextBtn:       { width: "100%", padding: "18px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", border: "none", borderRadius: 12, color: "#0a0a0a", fontSize: 17, fontWeight: 700, cursor: "pointer" },
  },

  dept: {
    header:     { background: "linear-gradient(180deg,#1a1408 0%,#0d0b07 100%)", borderBottom: "1px solid #1a1810", padding: "20px 20px 16px" },
    headerRow:  { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
    title:      { fontSize: 16, color: "#e8dfc0", fontWeight: 600 },
    meta:       { fontSize: 11, color: "#5a4a30" },
    time:       { fontSize: 18, color: "#C9A84C", fontWeight: 700, fontFamily: "monospace" },
    hint:       { fontSize: 13, color: "#7a6a45" },
    list:       { padding: "16px 16px 32px", display: "flex", flexDirection: "column" as const, gap: 12 },
    card:       (color = "#C9A84C") => ({ background: "#111009", border: `1px solid ${color}22`, borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left" as const, WebkitTapHighlightColor: "transparent" } as React.CSSProperties),
    cardIcon:   (color = "#C9A84C") => ({ width: 52, height: 52, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 } as React.CSSProperties),
    cardId:     (color = "#C9A84C") => ({ fontSize: 20, color, fontWeight: 700, marginBottom: 2 } as React.CSSProperties),
    cardName:   { fontSize: 15, color: "#c0b090" },
    cardEn:     { fontSize: 11, color: "#4a3a20" },
    cardArrow:  { color: "#3a3020", fontSize: 22 },
  },
};

// ─── COMPONENT ─────────────────────────────────────────────────
export default function OperatorSection({ onBack, onSubmit }: OperatorSectionProps) {
  const [step, setStep]               = useState<OperatorStep>("dept");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [formData, setFormData]       = useState<Record<string, string>>({});
  const [loading, setLoading]         = useState<boolean>(false);
  const [errors, setErrors]           = useState<Record<string, boolean>>({});
  const [passwordInput, setPasswordInput] = useState<string>("");
const [passwordError, setPasswordError] = useState<string>("");
const [showPw, setShowPw] = useState<boolean>(false);

const handleDeptSelect = (deptId: string): void => {
  setSelectedDept(deptId);
  setPasswordInput("");
  setPasswordError("");
  setStep("password");
};

const handlePasswordCheck = (): void => {
  const correct = departments.find((d) => d.id === selectedDept)?.password;
  if (passwordInput === correct) {
    setPasswordError("");
    setStep("form");
  } else {
    console.log(departments)
    setPasswordError("Нууц үг буруу байна. Дахин оролдоно уу.");
  }
};
  const { time, date } = getNow();

  const dept   = departments.find((d) => d.id === selectedDept);
  const fields = selectedDept ? (formFields[selectedDept] ?? []) : [];

  const validate = (): boolean => {
    const errs: Record<string, boolean> = {};
    fields.forEach((f) => { if (f.required && !formData[f.id]) errs[f.id] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    setLoading(true);
    try {
      await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          deptId:   selectedDept ?? "",
          deptName: dept?.name ?? "",
          operator: "Оператор",
          shift:    formData["shift"] ?? "",
        }),
      });
      onSubmit({
        ...formData,
        deptId:       selectedDept ?? "",
        deptName:     dept?.name ?? "",
        operator:     "Оператор",
        submitted_at: getNow().full,
      });
      setStep("done");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (): void => {
    setStep("dept");
    setSelectedDept(null);
    setFormData({});
    setErrors({});
  };

  const updateField = (id: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
  };

  // ── DONE ──────────────────────────────────────────────────────
  if (step === "done") return (
    <div style={S.done.page}>
      <div style={S.done.icon}>✓</div>
      <div style={S.done.title}>Амжилттай илгээлээ!</div>
      <div style={S.done.subtitle}>{dept?.name} · {formData["shift"]}</div>
      <div style={S.done.date}>{date} {time}</div>
      <div style={S.done.badge}>✓ Инженерийн хэсэгт шууд харагдана</div>
      <div style={S.done.actions}>
        <button onClick={handleReset} style={S.done.primaryBtn}>Дахин оруулах</button>
        <button onClick={onBack}      style={S.done.secondaryBtn}>← Нүүр хуудас</button>
      </div>
    </div>
  );

  // ── CONFIRM ───────────────────────────────────────────────────
  if (step === "confirm") return (
    <div style={{ ...S.page, display: "flex", flexDirection: "column" }}>
      <div style={S.stickyHeader}>
        <button onClick={() => setStep("form")} style={S.backBtnLg()}>←</button>
        <div>
          <div style={S.labelSm}>Шалгах</div>
          <div style={{ fontSize: 15, color: "#e8dfc0" }}>Мэдээлэл баталгаажуулах</div>
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto" }}>
        <div style={S.confirm.deptCard(dept?.color)}>
          {/* <span style={{ fontSize: 28 }}>{dept?.icon}</span> */}
          <div>
            <div style={S.confirm.deptName(dept?.color)}>{dept?.name}</div>
            <div style={S.confirm.deptMeta}>Хэлтэс {dept?.id} · {date}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
          {fields.filter((f) => f.id !== "notes" && formData[f.id]).map((field, i, arr) => (
            <div key={field.id} style={S.confirm.fieldRow(i % 2 === 0, i === 0, i === arr.length - 1)}>
              <span style={S.confirm.fieldLabel}>{field.label}</span>
              <span style={S.confirm.fieldValue}>{formData[field.id]}{field.unit ? " " + field.unit : ""}</span>
            </div>
          ))}
        </div>

        {formData["notes"] && (
          <div style={S.confirm.notesBox}>
            <div style={S.confirm.notesLabel}>ТЭМДЭГЛЭЛ</div>
            <div style={S.confirm.notesText}>{formData["notes"]}</div>
          </div>
        )}
      </div>

      <div style={S.fixedBottom}>
        <button onClick={handleSubmit} disabled={loading} style={S.confirm.submitBtn(loading)}>
          {loading ? "Илгээж байна..." : "✓ Илгээх — Инженерт харагдана"}
        </button>
      </div>
    </div>
  );

  // ── FORM ──────────────────────────────────────────────────────
  if (step === "form") {
    const filledCount = fields.filter((f) => formData[f.id]).length;
    const progress    = Math.round((filledCount / fields.length) * 100);

    return (
      <div style={{ ...S.page, display: "flex", flexDirection: "column" }}>
        <div style={S.form.header}>
          <div style={S.form.headerInner}>
            <button onClick={() => setStep("dept")} style={{ ...S.backBtnLg(), flexShrink: 0 }}>←</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={S.form.deptLabel}>Хэлтэс {dept?.id}</div>
              {/* <div style={S.form.deptName(dept?.color)}>{dept?.icon} {dept?.name}</div> */}
            </div>
            <div style={{ flexShrink: 0 }}>
              <div style={S.form.progressPct}>{progress}%</div>
              <div style={S.form.progressCount}>{filledCount}/{fields.length}</div>
            </div>
          </div>
          <div style={S.form.progressTrack}>
            <div style={S.form.progressFill(progress, dept?.color)} />
          </div>
        </div>

        <div style={S.form.body}>
          <div style={S.form.fieldList}>
            {fields.map((field) => (
              <div key={field.id}>
                <label style={S.form.fieldLabel(!!errors[field.id])}>
                  {field.label}
                  {field.required   && <span style={S.form.required}>*</span>}
                  {errors[field.id] && <span style={S.form.errorHint}>← Заавал бөглөнө үү</span>}
                </label>

                {field.type === "select" ? (
                  <div style={S.form.selectWrap}>
                    <select
                      value={formData[field.id] ?? ""}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      style={{ ...getInputStyle(!!errors[field.id]), paddingRight: 40 }}
                    >
                      <option value="">— Сонгох —</option>
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <span style={S.form.selectArrow}>▼</span>
                  </div>

                ) : field.type === "textarea" ? (
                  <textarea
                    value={formData[field.id] ?? ""}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    rows={3}
                    placeholder={field.placeholder}
                    style={{ ...getInputStyle(false), resize: "none", lineHeight: 1.6 }}
                  />

                ) : (
                  <div style={S.form.unitWrap}>
                    <input
                      type={field.type}
                      inputMode={field.type === "number" ? "decimal" : "text"}
                      value={formData[field.id] ?? ""}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        ...getInputStyle(!!errors[field.id]),
                        borderRadius: field.unit ? "8px 0 0 8px" : 8,
                        borderRight:  field.unit ? "none" : undefined,
                      }}
                    />
                    {field.unit && <div style={S.form.unit}>{field.unit}</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={S.fixedBottom}>
          <button onClick={() => { if (validate()) setStep("confirm"); }} style={S.form.nextBtn}>
            Шалгах →
          </button>
        </div>
      </div>
    );
  }

  // ── PASSWORD ──────────────────────────────────────────────────
if (step === "password") return (
  <div style={{ minHeight: "100dvh", background: "#0a0a0a", display: "flex", flexDirection: "column", fontFamily: "'Georgia', serif" }}>
    {/* Header */}
    <div style={S.stickyHeader}>
      <button onClick={() => setStep("dept")} style={S.backBtnLg()}>←</button>
      <div>
        <div style={S.labelSm}>Нэвтрэх</div>
        <div style={{ fontSize: 15, color: dept?.color }}>
       {dept?.name}
        </div>
      </div>
    </div>

    {/* Body */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      {/* Icon */}
      {/* <div style={{ width: 72, height: 72, borderRadius: "50%", background: `${dept?.color}18`, border: `2px solid ${dept?.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 20 }}>
        {dept?.icon}
      </div> */}

      <div style={{ fontSize: 20, color: "#e8dfc0", fontWeight: 600, marginBottom: 6 }}>
        {dept?.name}
      </div>
      <div style={{ fontSize: 13, color: "#5a4a30", marginBottom: 36 }}>
        Хэлтсийн нууц үгийг оруулна уу
      </div>

      <div style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Password input */}
        <div>
          <label style={{ fontSize: 11, color: "#7a6a45", letterSpacing: 2, textTransform: "uppercase", display: "block", marginBottom: 8 }}>
            Нууц үг
          </label>
          <div style={{ position: "relative" }}>
            <input
              // type={showPw ? "text" : "password"}
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                console.log(e.target.value)
                setPasswordError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && handlePasswordCheck()}
              placeholder="••••••••"
              style={{ ...getInputStyle(!!passwordError), paddingRight: 48 }}
            />
            <button
              onClick={() => setShowPw((p) => !p)}
              style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a4a30", cursor: "pointer", fontSize: 16, padding: 0 }}
            >
              {showPw ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {/* Error */}
        {passwordError && (
          <div style={{ background: "#1a0808", border: "1px solid #C97B4C44", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#C97B4C", display: "flex", alignItems: "center", gap: 8 }}>
            <span>⚠</span> {passwordError}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handlePasswordCheck}
          // disabled={passwordInput}
          style={{ width: "100%", padding: "18px", background:  "orange" , border: "none", borderRadius: 12, color: !passwordInput ? "#3a3020" : "#0a0a0a", fontSize: 17, fontWeight: 700, cursor: !passwordInput ? "not-allowed" : "pointer", transition: "all 0.2s" }}
        >
          Нэвтрэх →
        </button>
      </div>
    </div>
  </div>
);
  // ── DEPT SELECTION ────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.dept.header}>
        <div style={S.dept.headerRow}>
          <button onClick={onBack} style={S.backBtn()}>←</button>
          <div style={{ flex: 1 }}>
            <div style={S.dept.title}>Алт боловсруулалт</div>
            <div style={S.dept.meta}>Оператор · {date}</div>
          </div>
          <div style={S.dept.time}>{time}</div>
        </div>
        <div style={S.dept.hint}>Өөрийн хэлтсийг сонгоно уу:</div>
      </div>

      <div style={S.dept.list}>
        {departments.map((d) => (
          <button
            key={d.id}
            onClick={() => { handleDeptSelect(d.id) }}
            style={S.dept.card(d.color)}
            onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1408"; }}
            onTouchEnd={(e)   => { (e.currentTarget as HTMLButtonElement).style.background = "#111009"; }}
          >
            {/* <div style={S.dept.cardIcon(d.color)}>{d.icon}</div> */}
            <div style={{ flex: 1 }}>
              <div style={S.dept.cardId(d.color)}>{d.id}</div>
              <div style={S.dept.cardName}>{d.name}</div>
              {/* <div style={S.dept.cardEn}>{d.nameEn}</div> */}
            </div>
            <div style={S.dept.cardArrow}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

