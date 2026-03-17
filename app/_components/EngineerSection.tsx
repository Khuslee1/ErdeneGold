"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import type { BatchRecord, EngineerSectionProps } from "./type/type";
import { departments, formFields, initialRecords, getNow } from "./data/data";

// ─── STYLES ────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: "100dvh",
    background: "#0a0a0a",
    fontFamily: "'Georgia', serif",
  } as React.CSSProperties,

  // Detail view
  detail: {
    page: {
      minHeight: "100dvh",
      background: "#0a0a0a",
      fontFamily: "'Georgia', serif",
      display: "flex",
      flexDirection: "column" as const,
    },
    header: {
      background: "#0d0b07",
      borderBottom: "1px solid #1a1810",
      padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 12,
      position: "sticky" as const, top: 0, zIndex: 10,
    },
    backBtn: {
      background: "#1a1408", border: "1px solid #2a2416", color: "#7EB8A4",
      width: 40, height: 40, borderRadius: 8, fontSize: 18,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    },
    headerLabel: { fontSize: 10, color: "#5a4a30", letterSpacing: 2, textTransform: "uppercase" as const },
    headerTitle: (color = "#C9A84C") => ({ fontSize: 15, color } as React.CSSProperties),
    body:        { padding: "20px", overflowY: "auto" as const },
    metaCard:    (color = "#C9A84C") => ({ background: "#111009", border: `1px solid ${color}33`, borderRadius: 10, padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 8 } as React.CSSProperties),
    metaLabel:   { fontSize: 10, color: "#5a4a30", letterSpacing: 1 },
    metaOperator:{ fontSize: 14, color: "#e8dfc0" },
    metaShift:   { fontSize: 14, color: "#7EB8A4" },
    metaDate:    { fontSize: 13, color: "#7a6a45", fontFamily: "monospace" },
    fieldList:   { display: "flex", flexDirection: "column" as const, gap: 2 },
    fieldRow:    (even: boolean, first: boolean, last: boolean) => ({ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: even ? "#0d0b07" : "#111009", borderRadius: first ? "8px 8px 0 0" : last ? "0 0 8px 8px" : 0 } as React.CSSProperties),
    fieldLabel:  { fontSize: 13, color: "#7a6a45" },
    fieldValue:  { fontSize: 14, color: "#e8dfc0", fontWeight: 600 as const },
    notesBox:    { background: "#111009", border: "1px solid #2a2416", borderRadius: 8, padding: "12px 16px", marginTop: 12 },
    notesLabel:  { fontSize: 10, color: "#5a4a30", letterSpacing: 2, marginBottom: 6 },
    notesText:   { fontSize: 13, color: "#a09070" },
  },

  // List view
  list: {
    header: {
      background: "linear-gradient(180deg,#081410 0%,#0a0a0a 100%)",
      borderBottom: "1px solid #1a2a20",
      padding: "20px 20px 16px",
    },
    headerRow:   { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
    backBtn: {
      background: "#0a1a10", border: "1px solid #1a3a20", color: "#5a8a6a",
      width: 36, height: 36, borderRadius: 8, fontSize: 16,
      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    },
    title:       { fontSize: 16, color: "#e8dfc0", fontWeight: 600 },
    meta:        { fontSize: 11, color: "#3a6a4a" },
    exportBtn:   (exporting: boolean, exported: boolean) => ({
      background: exported ? "#0a2a10" : exporting ? "#0a1a10" : "linear-gradient(135deg,#7EB8A4,#4a8a75)",
      border: exported ? "1px solid #7EB8A4" : "none",
      color: exported ? "#7EB8A4" : "#0a0a0a",
      padding: "10px 16px", borderRadius: 10,
      fontSize: 13, fontWeight: 700,
      cursor: exporting ? "not-allowed" : "pointer",
      whiteSpace: "nowrap" as const,
    } as React.CSSProperties),
    statsRow:    { display: "flex", gap: 8, marginBottom: 14 },
    statCard:    (color: string) => ({ flex: 1, background: "#0d1a10", border: `1px solid ${color}22`, borderRadius: 8, padding: "8px 10px", textAlign: "center" as const } as React.CSSProperties),
    statValue:   (color: string) => ({ fontSize: 20, color, fontWeight: 700 } as React.CSSProperties),
    statLabel:   { fontSize: 10, color: "#3a5a3a" },
    filterRow:   { display: "flex", gap: 8, overflowX: "auto" as const, paddingBottom: 4 },
    filterBtn:   (active: boolean) => ({
      background: active ? "#0a2a18" : "none",
      border: `1px solid ${active ? "#7EB8A4" : "#1a2a20"}`,
      color: active ? "#7EB8A4" : "#3a5a3a",
      padding: "6px 12px", borderRadius: 20,
      fontSize: 12, cursor: "pointer",
      whiteSpace: "nowrap" as const, flexShrink: 0,
    } as React.CSSProperties),
    body:        { padding: "16px 16px 32px", display: "flex", flexDirection: "column" as const, gap: 10 },
    empty:       { textAlign: "center" as const, padding: "60px 20px", color: "#2a2416", fontStyle: "italic" as const },
    recordCard:  (isNew: boolean, color = "#C9A84C") => ({
      background: "#111009",
      border: `1px solid ${isNew ? "#7EB8A4" : color + "22"}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 10, padding: "14px 16px",
      cursor: "pointer", textAlign: "left" as const,
      WebkitTapHighlightColor: "transparent",
      position: "relative" as const,
    } as React.CSSProperties),
    newBadge:    { position: "absolute" as const, top: 10, right: 12, fontSize: 9, background: "#0a2a18", color: "#7EB8A4", padding: "2px 7px", borderRadius: 10, letterSpacing: 1 },
    recordTop:   { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
    recordDeptId:(color = "#C9A84C") => ({ fontSize: 15, color, fontWeight: 600 } as React.CSSProperties),
    recordDeptNm:{ fontSize: 14, color: "#a09070" },
    recordBottom:{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" },
    recordOp:    { fontSize: 12, color: "#7a6a45" },
    recordShift: { fontSize: 11, color: "#4a7a5a", marginTop: 2 },
    recordDate:  { fontSize: 11, color: "#3a3020", fontFamily: "monospace" },
    recordLink:  { fontSize: 11, color: "#3a5a3a", marginTop: 2 },
  },
};

// ─── COMPONENT ─────────────────────────────────────────────────
export default function EngineerSection({ onBack, records }: EngineerSectionProps) {
  const [filterDept, setFilterDept] = useState<string>("all");
  const [detail, setDetail]         = useState<BatchRecord | null>(null);
  const [exporting, setExporting]   = useState<boolean>(false);
  const [exported, setExported]     = useState<boolean>(false);
  const { date, time } = getNow();

  const filtered: BatchRecord[] = records.filter((r) => filterDept === "all" || r.deptId === filterDept);

  const handleExport = (): void => {
    const rows = filtered.map((record) => {
      const dept   = departments.find((d) => d.id === record.deptId);
      const fields = formFields[record.deptId] ?? [];

      const dynamicFields: Record<string, string> = {};
      fields.forEach((field) => {
        if (record[field.id] !== undefined) {
          const label = field.unit ? `${field.label} (${field.unit})` : field.label;
          dynamicFields[label] = String(record[field.id] ?? "");
        }
      });

      return {
        "Дугаар":    record.id,
        "Хэлтэс":   `${record.deptId} - ${dept?.name}`,
        "Оператор":  record.operator,
        "Ээлж":      record.shift,
        "Огноо":     record.submitted_at,
        ...dynamicFields,
        "Тэмдэглэл": record.notes ?? "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 8 }, { wch: 20 }, { wch: 18 }, { wch: 22 }, { wch: 20 },
      ...Array(20).fill({ wch: 18 }),
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Боловсруулалт");

    const today    = new Date().toLocaleDateString("mn-MN").replace(/\./g, "-");
    const deptName = filterDept === "all"
      ? "Бүх хэлтэс"
      : departments.find((d) => d.id === filterDept)?.name ?? filterDept;

    XLSX.writeFile(workbook, `Алт_боловсруулалт_${deptName}_${today}.xlsx`);
  };

  // ── DETAIL VIEW ───────────────────────────────────────────────
  if (detail) {
    const dept   = departments.find((d) => d.id === detail.deptId);
    const fields = formFields[detail.deptId] ?? [];

    return (
      <div style={S.detail.page}>
        <div style={S.detail.header}>
          <button onClick={() => setDetail(null)} style={S.detail.backBtn}>←</button>
          <div>
            <div style={S.detail.headerLabel}>Дэлгэрэнгүй</div>
            {/* <div style={S.detail.headerTitle(dept?.color)}>{dept?.icon} {dept?.name}</div> */}
          </div>
        </div>

        <div style={S.detail.body}>
          <div style={S.detail.metaCard(dept?.color)}>
            <div>
              <div style={S.detail.metaLabel}>ОПЕРАТОР</div>
              <div style={S.detail.metaOperator}>{detail.operator}</div>
            </div>
            <div>
              <div style={S.detail.metaLabel}>ЭЭЛЖ</div>
              <div style={S.detail.metaShift}>{detail.shift}</div>
            </div>
            <div>
              <div style={S.detail.metaLabel}>ОГНОО</div>
              <div style={S.detail.metaDate}>{detail.submitted_at}</div>
            </div>
          </div>

          <div style={S.detail.fieldList}>
            {fields.filter((f) => f.id !== "notes" && detail[f.id]).map((field, i, arr) => (
              <div key={field.id} style={S.detail.fieldRow(i % 2 === 0, i === 0, i === arr.length - 1)}>
                <span style={S.detail.fieldLabel}>{field.label}</span>
                <span style={S.detail.fieldValue}>{String(detail[field.id])}{field.unit ? " " + field.unit : ""}</span>
              </div>
            ))}
          </div>

          {detail.notes && (
            <div style={S.detail.notesBox}>
              <div style={S.detail.notesLabel}>ТЭМДЭГЛЭЛ</div>
              <div style={S.detail.notesText}>{detail.notes}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── LIST VIEW ─────────────────────────────────────────────────
  const stats = [
    { label: "Нийт",     value: filtered.length,                                      color: "#C9A84C" },
    { label: "Хэлтэс",   value: [...new Set(filtered.map((r) => r.deptId))].length,   color: "#7EB8A4" },
    { label: "Оператор", value: [...new Set(filtered.map((r) => r.operator))].length, color: "#C97B4C" },
  ];

  return (
    <div style={S.page}>
      <div style={S.list.header}>
        <div style={S.list.headerRow}>
          <button onClick={onBack} style={S.list.backBtn}>←</button>
          <div style={{ flex: 1 }}>
            <div style={S.list.title}>Инженерийн хэсэг</div>
            <div style={S.list.meta}>Нийт {records.length} бичлэг · {date} {time}</div>
          </div>
          <button onClick={handleExport} disabled={exporting} style={S.list.exportBtn(exporting, exported)}>
            {exported ? "✓ Татагдлаа!" : exporting ? "..." : "⬇ Excel"}
          </button>
        </div>

        <div style={S.list.statsRow}>
          {stats.map((s, i) => (
            <div key={i} style={S.list.statCard(s.color)}>
              <div style={S.list.statValue(s.color)}>{s.value}</div>
              <div style={S.list.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={S.list.filterRow}>
          {[{ id: "all", name: "Бүгд", color: "#7EB8A4" }, ...departments].map((d) => (
            <button key={d.id} onClick={() => setFilterDept(d.id)} style={S.list.filterBtn(filterDept === d.id)}>
              {d.id === "all" ? "Бүгд" : d.id}
            </button>
          ))}
        </div>
      </div>

      <div style={S.list.body}>
        {filtered.length === 0 && <div style={S.list.empty}>Мэдээлэл олдсонгүй</div>}

        {filtered.map((record, i) => {
          const dept  = departments.find((d) => d.id === record.deptId);
          const isNew = i === 0 && records.length > initialRecords.length;
          return (
            <button key={record.id} onClick={() => setDetail(record)} style={S.list.recordCard(isNew, dept?.color)}>
              {isNew && <div style={S.list.newBadge}>ШИНЭ</div>}
              <div style={S.list.recordTop}>
                {/* <span style={{ fontSize: 20 }}>{dept?.icon}</span> */}
                <span style={S.list.recordDeptId(dept?.color)}>{dept?.id}</span>
                <span style={S.list.recordDeptNm}>{dept?.name}</span>
              </div>
              <div style={S.list.recordBottom}>
                <div>
                  <div style={S.list.recordOp}>{record.operator}</div>
                  <div style={S.list.recordShift}>{record.shift}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={S.list.recordDate}>{record.submitted_at}</div>
                  <div style={S.list.recordLink}>Харах →</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}