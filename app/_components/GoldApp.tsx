"use client"
import { useState } from "react";
import * as XLSX from "xlsx";

// ─── TYPES ─────────────────────────────────────────────────────
type Role = "operator" | "engineer";
type OperatorStep = "dept" | "form" | "confirm" | "done";
type FieldType = "select" | "number" | "text" | "textarea";

interface Department {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  color: string;
}

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  unit?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface BatchRecord {
  id: number;           // заавал
  deptId: string;       // заавал
  deptName: string;     // заавал
  operator: string;     // заавал
  shift: string;        // заавал
  submitted_at: string; // заавал
  notes?: string;       // optional (? тэмдэгтэй)
  [key: string]: string | number | undefined;   // бусад dynamic талбарууд
}
interface OperatorSectionProps {
  onBack: () => void;
  onSubmit: (record: Omit<BatchRecord, "id">) => void;
}

interface EngineerSectionProps {
  onBack: () => void;
  records: BatchRecord[];
}

interface LandingProps {
  onSelect: (role: Role) => void;
  records: BatchRecord[];
}

// ─── SHARED DATA ───────────────────────────────────────────────
const departments: Department[] = [
  { id: "1001", name: "Бутлуур",       nameEn: "Crushing",        icon: "⚙️", color: "#C9A84C" },
  { id: "1002", name: "Уусгалт",       nameEn: "Leaching",        icon: "🧪", color: "#7EB8A4" },
  { id: "1006", name: "Цэвэршүүлэлт", nameEn: "Purification",    icon: "✨", color: "#C97B4C" },
  { id: "1008", name: "Хайлуулалт",   nameEn: "Smelting",        icon: "🔥", color: "#E8A87C" },
  { id: "1012", name: "Хяналт",        nameEn: "Quality Control", icon: "🔬", color: "#8B7EC8" },
];

const formFields: Record<string, FormField[]> = {
  "1001": [
    { id: "shift",         label: "Ээлж",               type: "select",   options: ["Өглөө 06:00–14:00","Өдөр 14:00–22:00","Шөнө 22:00–06:00"], required: true },
    { id: "ore_weight",    label: "Хүдрийн жин",         type: "number",   unit: "тн",  placeholder: "0.00", required: true },
    { id: "crusher_speed", label: "Бутлуурын хурд",      type: "number",   unit: "rpm", placeholder: "0" },
    { id: "feed_size",     label: "Оролтын хэмжээ",      type: "number",   unit: "мм",  placeholder: "0" },
    { id: "output_size",   label: "Гаралтын хэмжээ",     type: "number",   unit: "мм",  placeholder: "0" },
    { id: "moisture",      label: "Чийглэг",              type: "number",   unit: "%",   placeholder: "0.0" },
    { id: "notes",         label: "Тэмдэглэл",           type: "textarea", placeholder: "Нэмэлт мэдээлэл..." },
  ],
  "1002": [
    { id: "shift",           label: "Ээлж",                 type: "select",   options: ["Өглөө 06:00–14:00","Өдөр 14:00–22:00","Шөнө 22:00–06:00"], required: true },
    { id: "solution_volume", label: "Уусмалын хэмжээ",      type: "number",   unit: "м³",   placeholder: "0.0", required: true },
    { id: "cyanide_conc",    label: "Цианидын концентраци", type: "number",   unit: "мг/л", placeholder: "0.0" },
    { id: "ph_level",        label: "pH түвшин",             type: "number",   unit: "pH",   placeholder: "0.0" },
    { id: "temperature",     label: "Температур",            type: "number",   unit: "°C",   placeholder: "0.0" },
    { id: "leach_time",      label: "Уусгалтын хугацаа",    type: "number",   unit: "цаг",  placeholder: "0" },
    { id: "gold_recovery",   label: "Алтны ялгарал",        type: "number",   unit: "%",    placeholder: "0.0" },
    { id: "notes",           label: "Тэмдэглэл",            type: "textarea", placeholder: "Нэмэлт мэдээлэл..." },
  ],
  "1006": [
    { id: "shift",           label: "Ээлж",                  type: "select",   options: ["Өглөө 06:00–14:00","Өдөр 14:00–22:00","Шөнө 22:00–06:00"], required: true },
    { id: "input_grade",     label: "Оролтын зэрэглэл",      type: "number",   unit: "г/т", placeholder: "0.0", required: true },
    { id: "output_grade",    label: "Гаралтын зэрэглэл",     type: "number",   unit: "г/т", placeholder: "0.0" },
    { id: "reagent_used",    label: "Ашигласан реагент",      type: "number",   unit: "кг",  placeholder: "0.0" },
    { id: "filter_pressure", label: "Шүүлтүүрийн даралт",   type: "number",   unit: "бар", placeholder: "0.0" },
    { id: "purity",          label: "Цэвэршилтийн хувь",     type: "number",   unit: "%",   placeholder: "0.0" },
    { id: "notes",           label: "Тэмдэглэл",             type: "textarea", placeholder: "Нэмэлт мэдээлэл..." },
  ],
  "1008": [
    { id: "shift",          label: "Ээлж",                  type: "select",   options: ["Өглөө 06:00–14:00","Өдөр 14:00–22:00","Шөнө 22:00–06:00"], required: true },
    { id: "furnace_temp",   label: "Зуухны температур",     type: "number",   unit: "°C",  placeholder: "0", required: true },
    { id: "gold_input",     label: "Алтны оролт",           type: "number",   unit: "г",   placeholder: "0.0" },
    { id: "gold_output",    label: "Алтны гаралт",          type: "number",   unit: "г",   placeholder: "0.0" },
    { id: "flux_amount",    label: "Флюсийн хэмжээ",        type: "number",   unit: "кг",  placeholder: "0.0" },
    { id: "smelt_duration", label: "Хайлуулалтын хугацаа", type: "number",   unit: "мин", placeholder: "0" },
    { id: "notes",          label: "Тэмдэглэл",             type: "textarea", placeholder: "Нэмэлт мэдээлэл..." },
  ],
  "1012": [
    { id: "shift",        label: "Ээлж",            type: "select",   options: ["Өглөө 06:00–14:00","Өдөр 14:00–22:00","Шөнө 22:00–06:00"], required: true },
    { id: "sample_id",    label: "Дээжийн дугаар",  type: "text",     placeholder: "SAMPLE-001", required: true },
    { id: "gold_grade",   label: "Алтны агуулга",   type: "number",   unit: "г/т",   placeholder: "0.0" },
    { id: "silver_grade", label: "Мөнгөний агуулга",type: "number",   unit: "г/т",   placeholder: "0.0" },
    { id: "density",      label: "Нягтрал",          type: "number",   unit: "г/см³", placeholder: "0.0" },
    { id: "result",       label: "Үр дүн",           type: "select",   options: ["Тэнцсэн ✓","Тэнцээгүй ✗","Давтан шалгах ↺"] },
    { id: "notes",        label: "Тэмдэглэл",        type: "textarea", placeholder: "Нэмэлт мэдээлэл..." },
  ],
};

const initialRecords: BatchRecord[] = [
  {
    id: 1,
    deptId: "1001",
    deptName: "Бутлуур",
    operator: "Б. Батболд",
    shift: "Өглөө 06:00–14:00",
    submitted_at: "2024-03-11 08:32",
    notes: "",
    ore_weight: "245",
    crusher_speed: "1200",
    feed_size: "300",
    output_size: "25",
    moisture: "8.2",
  },
  {
    id: 2,
    deptId: "1002",
    deptName: "Уусгалт",
    operator: "Д. Мөнхбат",
    shift: "Өглөө 06:00–14:00",
    submitted_at: "2024-03-11 09:15",
    notes: "",
    solution_volume: "1200",
    cyanide_conc: "450",
    ph_level: "10.5",
    temperature: "22",
    leach_time: "24",
    gold_recovery: "94.2",
  },
  {
    id: 3,
    deptId: "1006",
    deptName: "Цэвэршүүлэлт",
    operator: "Э. Оюунбаяр",
    shift: "Өдөр 14:00–22:00",
    submitted_at: "2024-03-11 15:45",
    notes: "",
    input_grade: "45.2",
    output_grade: "48.9",
    reagent_used: "12.5",
    filter_pressure: "3.2",
    purity: "99.1",
  },
];

function getNow(): { time: string; date: string; full: string } {
  const n = new Date();
  return {
    time: n.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }),
    date: n.toLocaleDateString("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit" }),
    full: n.toLocaleString("mn-MN"),
  };
}

function getInputStyle(hasError: boolean): React.CSSProperties {
  return {
    width: "100%",
    background: hasError ? "#1a0808" : "#161410",
    border: `1.5px solid ${hasError ? "#C97B4C" : "#2a2416"}`,
    borderRadius: 8,
    padding: "14px 16px",
    color: "#e8dfc0",
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
    WebkitAppearance: "none",
    appearance: "none",
  };
}


// ─── OPERATOR SECTION ──────────────────────────────────────────
function OperatorSection({ onBack, onSubmit }: OperatorSectionProps) {
  const [step, setStep] = useState<OperatorStep>("dept");
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const { time, date } = getNow();

  const dept = departments.find((d) => d.id === selectedDept);
  const fields: FormField[] = selectedDept ? (formFields[selectedDept] ?? []) : [];

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
        deptId: selectedDept ?? "",
        deptName: dept?.name ?? "",
        operator: "Оператор",
        shift: formData["shift"] ?? "",
      }),
    });
    onSubmit({
      ...formData,
      deptId: selectedDept ?? "",
      deptName: dept?.name ?? "",
      operator: "Оператор",
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

  // ── DONE ──
  if (step === "done") return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 24, textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#2a5a3a,#1a3a28)", border: "2px solid #7EB8A4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 24, boxShadow: "0 0 32px #7EB8A422" }}>✓</div>
      <div style={{ fontSize: 22, color: "#7EB8A4", marginBottom: 8, fontWeight: 600 }}>Амжилттай илгээлээ!</div>
      <div style={{ fontSize: 14, color: "#7a6a45", marginBottom: 4 }}>{dept?.name} · {formData["shift"]}</div>
      <div style={{ fontSize: 12, color: "#3a3020", marginBottom: 12, fontFamily: "monospace" }}>{date} {time}</div>
      <div style={{ fontSize: 12, color: "#4a7a4a", background: "#0a1a0a", border: "1px solid #2a4a2a", padding: "8px 16px", borderRadius: 8, marginBottom: 32 }}>
        ✓ Инженерийн хэсэгт шууд харагдана
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 320 }}>
        <button onClick={handleReset} style={{ background: "linear-gradient(135deg,#C9A84C,#8B6914)", border: "none", color: "#0a0a0a", padding: "16px", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer" }}>Дахин оруулах</button>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #2a2416", color: "#5a4a30", padding: "14px", borderRadius: 12, fontSize: 14, cursor: "pointer" }}>← Нүүр хуудас</button>
      </div>
    </div>
  );

  // ── CONFIRM ──
  if (step === "confirm") return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#0d0b07", borderBottom: "1px solid #1a1810", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => setStep("form")} style={{ background: "#1a1408", border: "1px solid #2a2416", color: "#C9A84C", width: 40, height: 40, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
        <div>
          <div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 2, textTransform: "uppercase" }}>Шалгах</div>
          <div style={{ fontSize: 15, color: "#e8dfc0" }}>Мэдээлэл баталгаажуулах</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "20px 20px 100px", overflowY: "auto" }}>
        <div style={{ background: "#111009", border: `1px solid ${dept?.color}33`, borderRadius: 12, padding: "16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{dept?.icon}</span>
          <div>
            <div style={{ fontSize: 16, color: dept?.color, fontWeight: 600 }}>{dept?.name}</div>
            <div style={{ fontSize: 11, color: "#4a3a20" }}>Хэлтэс {dept?.id} · {date}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 16 }}>
          {fields.filter((f) => f.id !== "notes" && formData[f.id]).map((field, i, arr) => (
            <div key={field.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? "#0d0b07" : "#111009", borderRadius: i === 0 ? "8px 8px 0 0" : i === arr.length - 1 ? "0 0 8px 8px" : 0 }}>
              <span style={{ fontSize: 13, color: "#7a6a45" }}>{field.label}</span>
              <span style={{ fontSize: 14, color: "#e8dfc0", fontWeight: 600 }}>{formData[field.id]}{field.unit ? " " + field.unit : ""}</span>
            </div>
          ))}
        </div>
        {formData["notes"] && (
          <div style={{ background: "#111009", border: "1px solid #2a2416", borderRadius: 8, padding: "12px 16px" }}>
            <div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 2, marginBottom: 6 }}>ТЭМДЭГЛЭЛ</div>
            <div style={{ fontSize: 13, color: "#a09070" }}>{formData["notes"]}</div>
          </div>
        )}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "#0a0a0a", borderTop: "1px solid #1a1810" }}>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "18px", background: loading ? "#1a2010" : "linear-gradient(135deg,#7EB8A4,#4a8a75)", border: "none", borderRadius: 12, color: "#0a0a0a", fontSize: 17, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Илгээж байна..." : "✓ Илгээх — Инженерт харагдана"}
        </button>
      </div>
    </div>
  );

  // ── FORM ──
  if (step === "form") {
    const filledCount = fields.filter((f) => formData[f.id]).length;
    const progress = Math.round((filledCount / fields.length) * 100);
    return (
      <div style={{ minHeight: "100dvh", background: "#0a0a0a", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#0d0b07", borderBottom: "1px solid #1a1810", padding: "0 20px", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0 10px" }}>
            <button onClick={() => setStep("dept")} style={{ background: "#1a1408", border: "1px solid #2a2416", color: "#C9A84C", width: 40, height: 40, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>←</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 2, textTransform: "uppercase" }}>Хэлтэс {dept?.id}</div>
              <div style={{ fontSize: 15, color: dept?.color, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dept?.icon} {dept?.name}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 18, color: "#C9A84C", fontWeight: 700 }}>{progress}%</div>
              <div style={{ fontSize: 10, color: "#3a3020" }}>{filledCount}/{fields.length}</div>
            </div>
          </div>
          <div style={{ height: 3, background: "#1a1810", borderRadius: 2 }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${dept?.color},${dept?.color}aa)`, borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
        <div style={{ flex: 1, padding: "20px 20px 120px", overflowY: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map((field) => (
              <div key={field.id}>
                <label style={{ fontSize: 12, color: errors[field.id] ? "#C97B4C" : "#7a6a45", letterSpacing: 1, display: "flex", alignItems: "center", gap: 6, marginBottom: 8, textTransform: "uppercase" }}>
                  {field.label}
                  {field.required && <span style={{ color: "#C9A84C", fontSize: 14 }}>*</span>}
                  {errors[field.id] && <span style={{ color: "#C97B4C", fontSize: 11, textTransform: "none" }}>← Заавал бөглөнө үү</span>}
                </label>
                {field.type === "select" ? (
                  <div style={{ position: "relative" }}>
                    <select value={formData[field.id] ?? ""} onChange={(e) => updateField(field.id, e.target.value)} style={{ ...getInputStyle(!!errors[field.id]), paddingRight: 40 }}>
                      <option value="">— Сонгох —</option>
                      {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#5a4a30", pointerEvents: "none", fontSize: 12 }}>▼</span>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea value={formData[field.id] ?? ""} onChange={(e) => updateField(field.id, e.target.value)} rows={3} placeholder={field.placeholder} style={{ ...getInputStyle(false), resize: "none", lineHeight: 1.6 }} />
                ) : (
                  <div style={{ display: "flex" }}>
                    <input
                      type={field.type}
                      inputMode={field.type === "number" ? "decimal" : "text"}
                      value={formData[field.id] ?? ""}
                      onChange={(e) => updateField(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      style={{ ...getInputStyle(!!errors[field.id]), borderRadius: field.unit ? "8px 0 0 8px" : 8, borderRight: field.unit ? "none" : undefined }}
                    />
                    {field.unit && (
                      <div style={{ background: "#1a1408", border: "1.5px solid #2a2416", borderLeft: "none", borderRadius: "0 8px 8px 0", padding: "0 14px", display: "flex", alignItems: "center", fontSize: 13, color: "#7a6a45", whiteSpace: "nowrap", flexShrink: 0 }}>{field.unit}</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px", background: "#0a0a0a", borderTop: "1px solid #1a1810" }}>
          <button onClick={() => { if (validate()) setStep("confirm"); }} style={{ width: "100%", padding: "18px", background: "linear-gradient(135deg,#C9A84C,#8B6914)", border: "none", borderRadius: 12, color: "#0a0a0a", fontSize: 17, fontWeight: 700, cursor: "pointer" }}>Шалгах →</button>
        </div>
      </div>
    );
  }

  // ── DEPT SELECTION ──
  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", fontFamily: "'Georgia', serif" }}>
      <div style={{ background: "linear-gradient(180deg,#1a1408 0%,#0d0b07 100%)", borderBottom: "1px solid #1a1810", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: "#1a1408", border: "1px solid #2a2416", color: "#5a4a30", width: 36, height: 36, borderRadius: 8, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: "#e8dfc0", fontWeight: 600 }}>Алт боловсруулалт</div>
            <div style={{ fontSize: 11, color: "#5a4a30" }}>Оператор · {date}</div>
          </div>
          <div style={{ fontSize: 18, color: "#C9A84C", fontWeight: 700, fontFamily: "monospace" }}>{time}</div>
        </div>
        <div style={{ fontSize: 13, color: "#7a6a45" }}>Өөрийн хэлтсийг сонгоно уу:</div>
      </div>
      <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 12 }}>
        {departments.map((d) => (
          <button key={d.id} onClick={() => { setSelectedDept(d.id); setStep("form"); }}
            style={{ background: "#111009", border: `1px solid ${d.color}22`, borderLeft: `4px solid ${d.color}`, borderRadius: 12, padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left", WebkitTapHighlightColor: "transparent" }}
            onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1408"; }}
            onTouchEnd={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#111009"; }}>
            <div style={{ width: 52, height: 52, borderRadius: 10, background: `${d.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{d.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, color: d.color, fontWeight: 700, marginBottom: 2 }}>{d.id}</div>
              <div style={{ fontSize: 15, color: "#c0b090" }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "#4a3a20" }}>{d.nameEn}</div>
            </div>
            <div style={{ color: "#3a3020", fontSize: 22 }}>›</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ENGINEER SECTION ──────────────────────────────────────────
function EngineerSection({ onBack, records }: EngineerSectionProps) {
  const [filterDept, setFilterDept] = useState<string>("all");
  const [detail, setDetail] = useState<BatchRecord | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exported, setExported] = useState<boolean>(false);
  const { date, time } = getNow();

  const filtered: BatchRecord[] = records.filter((r) => filterDept === "all" || r.deptId === filterDept);

const handleExport = (): void => {
  // 1. Өгөгдлийг Excel-д тохирох хэлбэрт оруулах
  const rows = filtered.map((record) => {
    const dept = departments.find((d) => d.id === record.deptId);
    const fields = formFields[record.deptId] ?? [];

    // Dynamic талбаруудыг нэр: утга болгон задлах
    const dynamicFields: Record<string, string> = {};
    fields.forEach((field) => {
      if (record[field.id] !== undefined) {
        const label = field.unit
          ? `${field.label} (${field.unit})`
          : field.label;
        dynamicFields[label] = String(record[field.id] ?? "");
      }
    });

    return {
      "Дугаар": record.id,
      "Хэлтэс": `${record.deptId} - ${dept?.name}`,
      "Оператор": record.operator,
      "Ээлж": record.shift,
      "Огноо": record.submitted_at,
      ...dynamicFields,
      "Тэмдэглэл": record.notes ?? "",
    };
  });

  // 2. Worksheet үүсгэх
  const worksheet = XLSX.utils.json_to_sheet(rows);

  // 3. Багана өргөн тохируулах
  worksheet["!cols"] = [
    { wch: 8 },   // Дугаар
    { wch: 20 },  // Хэлтэс
    { wch: 18 },  // Оператор
    { wch: 22 },  // Ээлж
    { wch: 20 },  // Огноо
    ...Array(20).fill({ wch: 18 }), // Бусад багана
  ];

  // 4. Workbook үүсгэх
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Боловсруулалт");

  // 5. Файл нэр — огноо оруулах
  const today = new Date().toLocaleDateString("mn-MN").replace(/\./g, "-");
  const deptName = filterDept === "all"
    ? "Бүх хэлтэс"
    : departments.find((d) => d.id === filterDept)?.name ?? filterDept;

  const fileName = `Алт_боловсруулалт_${deptName}_${today}.xlsx`;

  // 6. Татах
  XLSX.writeFile(workbook, fileName);
};
  if (detail) {
    const dept = departments.find((d) => d.id === detail.deptId);
    const fields: FormField[] = formFields[detail.deptId] ?? [];
    return (
      <div style={{ minHeight: "100dvh", background: "#0a0a0a", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" }}>
        <div style={{ background: "#0d0b07", borderBottom: "1px solid #1a1810", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
          <button onClick={() => setDetail(null)} style={{ background: "#1a1408", border: "1px solid #2a2416", color: "#7EB8A4", width: 40, height: 40, borderRadius: 8, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div>
            <div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 2, textTransform: "uppercase" }}>Дэлгэрэнгүй</div>
            <div style={{ fontSize: 15, color: dept?.color }}>{dept?.icon} {dept?.name}</div>
          </div>
        </div>
        <div style={{ padding: "20px", overflowY: "auto" }}>
          <div style={{ background: "#111009", border: `1px solid ${dept?.color}33`, borderRadius: 10, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div><div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 1 }}>ОПЕРАТОР</div><div style={{ fontSize: 14, color: "#e8dfc0" }}>{detail.operator}</div></div>
            <div><div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 1 }}>ЭЭЛЖ</div><div style={{ fontSize: 14, color: "#7EB8A4" }}>{detail.shift}</div></div>
            <div><div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 1 }}>ОГНОО</div><div style={{ fontSize: 13, color: "#7a6a45", fontFamily: "monospace" }}>{detail.submitted_at}</div></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {fields.filter((f) => f.id !== "notes" && detail[f.id]).map((field, i, arr) => (
              <div key={field.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: i % 2 === 0 ? "#0d0b07" : "#111009", borderRadius: i === 0 ? "8px 8px 0 0" : i === arr.length - 1 ? "0 0 8px 8px" : 0 }}>
                <span style={{ fontSize: 13, color: "#7a6a45" }}>{field.label}</span>
                <span style={{ fontSize: 14, color: "#e8dfc0", fontWeight: 600 }}>{String(detail[field.id])}{field.unit ? " " + field.unit : ""}</span>
              </div>
            ))}
          </div>
          {detail.notes && (
            <div style={{ background: "#111009", border: "1px solid #2a2416", borderRadius: 8, padding: "12px 16px", marginTop: 12 }}>
              <div style={{ fontSize: 10, color: "#5a4a30", letterSpacing: 2, marginBottom: 6 }}>ТЭМДЭГЛЭЛ</div>
              <div style={{ fontSize: 13, color: "#a09070" }}>{detail.notes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", fontFamily: "'Georgia', serif" }}>
      <div style={{ background: "linear-gradient(180deg,#081410 0%,#0a0a0a 100%)", borderBottom: "1px solid #1a2a20", padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <button onClick={onBack} style={{ background: "#0a1a10", border: "1px solid #1a3a20", color: "#5a8a6a", width: 36, height: 36, borderRadius: 8, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, color: "#e8dfc0", fontWeight: 600 }}>Инженерийн хэсэг</div>
            <div style={{ fontSize: 11, color: "#3a6a4a" }}>Нийт {records.length} бичлэг · {date} {time}</div>
          </div>
          <button onClick={handleExport} disabled={exporting} style={{ background: exported ? "#0a2a10" : exporting ? "#0a1a10" : "linear-gradient(135deg,#7EB8A4,#4a8a75)", border: exported ? "1px solid #7EB8A4" : "none", color: exported ? "#7EB8A4" : "#0a0a0a", padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: exporting ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {exported ? "✓ Татагдлаа!" : exporting ? "..." : "⬇ Excel"}
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[
            { label: "Нийт", value: filtered.length, color: "#C9A84C" },
            { label: "Хэлтэс", value: [...new Set(filtered.map((r) => r.deptId))].length, color: "#7EB8A4" },
            { label: "Оператор", value: [...new Set(filtered.map((r) => r.operator))].length, color: "#C97B4C" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "#0d1a10", border: `1px solid ${s.color}22`, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, color: s.color, fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#3a5a3a" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {[{ id: "all", name: "Бүгд", color: "#7EB8A4" }, ...departments].map((d) => (
            <button key={d.id} onClick={() => setFilterDept(d.id)} style={{ background: filterDept === d.id ? "#0a2a18" : "none", border: `1px solid ${filterDept === d.id ? "#7EB8A4" : "#1a2a20"}`, color: filterDept === d.id ? "#7EB8A4" : "#3a5a3a", padding: "6px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {d.id === "all" ? "Бүгд" : d.id}
            </button>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 16px 32px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#2a2416", fontStyle: "italic" }}>Мэдээлэл олдсонгүй</div>
        )}
        {filtered.map((record, i) => {
          const dept = departments.find((d) => d.id === record.deptId);
          const isNew: boolean = i === 0 && records.length > initialRecords.length;
          return (
            <button key={record.id} onClick={() => setDetail(record)} style={{ background: "#111009", border: `1px solid ${isNew ? "#7EB8A4" : (dept?.color ?? "#C9A84C") + "22"}`, borderLeft: `4px solid ${dept?.color ?? "#C9A84C"}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", textAlign: "left", WebkitTapHighlightColor: "transparent", position: "relative" }}>
              {isNew && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 9, background: "#0a2a18", color: "#7EB8A4", padding: "2px 7px", borderRadius: 10, letterSpacing: 1 }}>ШИНЭ</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{dept?.icon}</span>
                <span style={{ fontSize: 15, color: dept?.color, fontWeight: 600 }}>{dept?.id}</span>
                <span style={{ fontSize: 14, color: "#a09070" }}>{dept?.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontSize: 12, color: "#7a6a45" }}>{record.operator}</div>
                  <div style={{ fontSize: 11, color: "#4a7a5a", marginTop: 2 }}>{record.shift}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#3a3020", fontFamily: "monospace" }}>{record.submitted_at}</div>
                  <div style={{ fontSize: 11, color: "#3a5a3a", marginTop: 2 }}>Харах →</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── LANDING ────────────────────────────────────────────────────
function Landing({ onSelect, records }: LandingProps) {
  const { time, date } = getNow();
  const newCount: number = records.length - initialRecords.length;
  return (
    <div style={{ minHeight: "100dvh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ width: 72, height: 72, background: "linear-gradient(135deg,#C9A84C,#8B6914)", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: "0 0 40px #C9A84C33" }}>⛏️</div>
        <h1 style={{ fontSize: 24, color: "#e8dfc0", fontWeight: 400, margin: "0 0 6px", letterSpacing: 1 }}>Алт боловсруулах систем</h1>
        <div style={{ fontSize: 11, color: "#3a3020", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Gold Processing System</div>
        <div style={{ fontSize: 13, color: "#5a4a30", fontFamily: "monospace" }}>{date} · {time}</div>
      </div>
      <div style={{ fontSize: 11, color: "#3a3020", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>Та хэн бэ?</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", maxWidth: 340 }}>
        <button onClick={() => onSelect("operator")}
          style={{ background: "#111009", border: "1px solid #C9A84C33", borderLeft: "4px solid #C9A84C", borderRadius: 14, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left", WebkitTapHighlightColor: "transparent" }}
          onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1a1408"; }}
          onTouchEnd={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#111009"; }}>
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "#C9A84C18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>👷</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, color: "#C9A84C", fontWeight: 700, marginBottom: 3 }}>Оператор</div>
            <div style={{ fontSize: 12, color: "#5a4a30" }}>Мэдээлэл оруулах · Хэлтэс сонгох</div>
          </div>
          <div style={{ color: "#3a3020", fontSize: 22 }}>›</div>
        </button>
        <button onClick={() => onSelect("engineer")}
          style={{ background: "#080d0b", border: "1px solid #7EB8A433", borderLeft: "4px solid #7EB8A4", borderRadius: 14, padding: "20px 24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, textAlign: "left", WebkitTapHighlightColor: "transparent", position: "relative" }}
          onTouchStart={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#0d1a14"; }}
          onTouchEnd={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#080d0b"; }}>
          {newCount > 0 && <div style={{ position: "absolute", top: 12, right: 16, background: "#7EB8A4", color: "#0a0a0a", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10 }}>+{newCount} шинэ</div>}
          <div style={{ width: 52, height: 52, borderRadius: 12, background: "#7EB8A418", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>🔬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, color: "#7EB8A4", fontWeight: 700, marginBottom: 3 }}>Инженер</div>
            <div style={{ fontSize: 12, color: "#3a5a4a" }}>Мэдээлэл харах · Excel татах</div>
            <div style={{ fontSize: 11, color: "#2a4a3a", marginTop: 2 }}>Нийт {records.length} бичлэг</div>
          </div>
          <div style={{ color: "#2a4a3a", fontSize: 22 }}>›</div>
        </button>
      </div>
    </div>
  );
}

// // ─── ROOT APP ───────────────────────────────────────────────────
export default function GoldApp() {
  const [role, setRole] = useState<Role | null>(null);
  const [records, setRecords] = useState<BatchRecord[]>(initialRecords);
  const nextIdRef = { current: records.length + 1 };

  const handleOperatorSubmit = (record: Omit<BatchRecord, "id">): void => {
    const newRecord: BatchRecord = { ...record, id: nextIdRef.current++ };
    setRecords((prev) => [newRecord, ...prev]);
  };

  if (!role) return <Landing onSelect={setRole} records={records} />;
  if (role === "operator") return <OperatorSection onBack={() => setRole(null)} onSubmit={handleOperatorSubmit} />;
  if (role === "engineer") return <EngineerSection onBack={() => setRole(null)} records={records} />;
  return null;
}

