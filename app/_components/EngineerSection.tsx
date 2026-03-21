"use client";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import type { EngineerSectionProps, Submission, Question } from "./type/type";
import { useSubmissions } from "../api/hooks/useSubmissions";
import { useDepartments } from "../api/hooks/useDepartments";
import { getNow } from "./data/data";

import { T } from "../styles/tokens";
import {
  ArrowBigDown,
  Calendar,
  ChevronLeft,
  File,
  Filter,
} from "lucide-react";

export default function EngineerSection({ onBack }: EngineerSectionProps) {
  const { departments } = useDepartments();
  const [filterDept, setFilterDept] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];
  const [dateFrom, setDateFrom] = useState<string>(today);
  const [dateTo, setDateTo] = useState<string>(today);
  const [detail, setDetail] = useState<Submission | null>(null);
  const [questionMap, setQuestionMap] = useState<Record<string, string>>({});

  const { submissions, loading } = useSubmissions(
    filterDept || undefined,
    dateFrom,
    dateTo,
  );
  const { date, time } = getNow();
  const dept = detail
    ? departments.find((d) => d.id === detail.department.id)
    : null;

  useEffect(() => {
    if (!departments.length) return;
    Promise.all(
      departments.map((d) =>
        fetch(`/api/departments/${d.id}/questions`).then((r) => r.json()),
      ),
    ).then((results: Question[][]) => {
      const map: Record<string, string> = {};
      results.flat().forEach((q) => {
        map[q.id] = q.title;
      });
      setQuestionMap(map);
    });
  }, [departments]);

  const resolveAnswers = (answers: Record<string, string>) =>
    Object.entries(answers).reduce(
      (acc, [k, v]) => ({ ...acc, [questionMap[k] ?? k]: v }),
      {} as Record<string, string>,
    );

  const handleExport = () => {
    const rows = submissions.map((s) => ({
      Хэлтэс: s.department.name,
      Оператор: s.operatorName,
      Ээлж: s.shift === "DAY" ? "Өдрийн" : "Шөнийн",
      Цаг: `${s.hour}:00`,
      Огноо: new Date(s.submittedAt).toLocaleDateString("mn-MN"),
      ...resolveAnswers(s.answers),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Мэдээлэл");
    const deptName =
      filterDept === "all"
        ? "Бүх хэлтэс"
        : (departments.find((d) => d.id === filterDept)?.name ?? filterDept);
    XLSX.writeFile(wb, `Алт_${deptName}_${dateFrom}_${dateTo}.xlsx`);
  };

  const inputDateStyle: React.CSSProperties = {
    background: T.white,
    border: `1.5px solid ${T.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: T.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    fontFamily: T.font,
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: T.bg,
        fontFamily: T.font,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top navbar — desktop */}
      <div
        style={{
          background: T.white,
          borderBottom: `1px solid ${T.border}`,
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: T.shadow,
          position: "sticky",
          top: 0,
          zIndex: 20,
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
          <div style={{ fontSize: 16, color: T.text, fontWeight: 600 }}>
            Инженерийн хэсэг
          </div>
          <div style={{ fontSize: 11, color: T.textLight }}>
            {date} · {time} · Нийт {submissions.length} бичлэг
          </div>
        </div>
        <button
          onClick={handleExport}
          style={{
            background: `linear-gradient(135deg, ${T.gold}, ${T.goldDark})`,
            border: "none",
            color: T.white,
            padding: "10px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: T.shadowGold,
            fontFamily: T.font,
          }}
        >
          <File /> Excel татах
        </button>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar filters */}
        <div
          style={{
            width: 260,
            background: T.white,
            borderRight: `1px solid ${T.border}`,
            padding: "24px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            flexShrink: 0,
            overflowY: "auto",
          }}
        >
          {/* Stats */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              { label: "Нийт", value: submissions.length, color: T.gold },
              {
                label: "Хэлтэс",
                value: [...new Set(submissions.map((s) => s.department.id))]
                  .length,
                color: T.text,
              },
              {
                label: "Оператор",
                value: [...new Set(submissions.map((s) => s.operatorName))]
                  .length,
                color: T.green,
              },
              {
                label: "Цаг",
                value: [...new Set(submissions.map((s) => s.hour))].length,
                color: T.textMid,
              },
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  background: T.bg,
                  border: `1px solid ${T.border}`,
                  borderRadius: 10,
                  padding: "12px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 22, color: s.color, fontWeight: 700 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Date range */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMid,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Calendar /> Огноо
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div>
                <div
                  style={{ fontSize: 11, color: T.textLight, marginBottom: 4 }}
                >
                  Эхлэх
                </div>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  style={inputDateStyle}
                />
              </div>
              <div>
                <div
                  style={{ fontSize: 11, color: T.textLight, marginBottom: 4 }}
                >
                  Дуусах
                </div>
                <input
                  type="date"
                  value={dateTo}
                  min={dateFrom}
                  onChange={(e) => setDateTo(e.target.value)}
                  style={inputDateStyle}
                />
              </div>
            </div>
          </div>

          {/* Dept filter */}
          <div>
            <div
              style={{
                fontSize: 11,
                color: T.textMid,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Filter /> Хэлтэс
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {departments.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setFilterDept(d.id)}
                  style={{
                    background: filterDept === d.id ? T.goldLight : "none",
                    border: `1.5px solid ${filterDept === d.id ? T.gold : T.border}`,
                    color: filterDept === d.id ? T.goldDark : T.textMid,
                    padding: "9px 14px",
                    borderRadius: 8,
                    fontSize: 13,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: T.font,
                    fontWeight: filterDept === d.id ? 600 : 400,
                  }}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
          {/* Detail view */}
          {detail ? (
            <div style={{ maxWidth: 700 }}>
              <button
                onClick={() => setDetail(null)}
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  color: T.textMid,
                  padding: "8px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  marginBottom: 20,
                  fontFamily: T.font,
                }}
              >
                <ChevronLeft /> Буцах
              </button>

              <div
                style={{
                  background: T.white,
                  border: `1.5px solid ${T.border}`,
                  borderRadius: 14,
                  padding: "20px 24px",
                  marginBottom: 20,
                  borderLeft: `4px solid ${dept?.color ?? T.gold}`,
                  boxShadow: T.shadow,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    color: T.text,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {detail.department.name}
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textLight,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Оператор
                    </div>
                    <div style={{ fontSize: 14, color: T.text, marginTop: 2 }}>
                      {detail.operatorName}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textLight,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Цаг
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        color: T.gold,
                        fontWeight: 600,
                        marginTop: 2,
                      }}
                    >
                      {detail.hour}:00
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textLight,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Огноо
                    </div>
                    <div style={{ fontSize: 14, color: T.text, marginTop: 2 }}>
                      {new Date(detail.submittedAt).toLocaleDateString("mn-MN")}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.textLight,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Ээлж
                    </div>
                    <div style={{ fontSize: 14, color: T.text, marginTop: 2 }}>
                      {detail.shift === "DAY" ? "Өдрийн" : "Шөнийн"}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: T.white,
                  border: `1px solid ${T.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: T.shadow,
                }}
              >
                {Object.entries(resolveAnswers(detail.answers)).map(
                  ([key, value], i, arr) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 20px",
                        background: i % 2 === 0 ? T.white : T.bg,
                        borderBottom:
                          i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                      }}
                    >
                      <span style={{ fontSize: 13, color: T.textMid }}>
                        {key}
                      </span>
                      <span
                        style={{ fontSize: 13, color: T.text, fontWeight: 600 }}
                      >
                        {value}
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            // List view
            <>
              {loading && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: T.textLight,
                  }}
                >
                  Уншиж байна...
                </div>
              )}
              {!loading && submissions.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    color: T.textLight,
                  }}
                >
                  Мэдээлэл олдсонгүй
                </div>
              )}

              {/* Table */}
              {!loading && submissions.length > 0 && (
                <div
                  style={{
                    background: T.white,
                    border: `1px solid ${T.border}`,
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: T.shadow,
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontFamily: T.font,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: T.offWhite,
                          borderBottom: `2px solid ${T.border}`,
                        }}
                      >
                        {["Хэлтэс", "Оператор", "Цаг", "Ээлж", "Огноо", ""].map(
                          (h, i) => (
                            <th
                              key={i}
                              style={{
                                padding: "12px 16px",
                                textAlign: "left",
                                fontSize: 11,
                                color: T.textMid,
                                letterSpacing: 1,
                                textTransform: "uppercase",
                                fontWeight: 600,
                              }}
                            >
                              {h}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((s, i) => {
                        const d = departments.find(
                          (dep) => dep.id === s.department.id,
                        );
                        return (
                          <tr
                            key={s.id}
                            style={{
                              borderBottom:
                                i < submissions.length - 1
                                  ? `1px solid ${T.border}`
                                  : "none",
                              background: i % 2 === 0 ? T.white : T.bg,
                              cursor: "pointer",
                              transition: "background 0.1s",
                            }}
                            onClick={() => setDetail(s)}
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = T.goldLight;
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLTableRowElement
                              ).style.background = i % 2 === 0 ? T.white : T.bg;
                            }}
                          >
                            <td style={{ padding: "12px 16px" }}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <div
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: "50%",
                                    background: d?.color ?? T.gold,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: 13,
                                    color: T.text,
                                    fontWeight: 500,
                                  }}
                                >
                                  {s.department.name}
                                </span>
                              </div>
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 13,
                                color: T.textMid,
                              }}
                            >
                              {s.operatorName}
                            </td>
                            <td style={{ padding: "12px 16px" }}>
                              <span
                                style={{
                                  fontSize: 13,
                                  color: T.gold,
                                  fontWeight: 600,
                                }}
                              >
                                {s.hour}:00
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 12,
                                color: T.textLight,
                              }}
                            >
                              {s.shift === "DAY" ? "Өдрийн" : "Шөнийн"}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                fontSize: 12,
                                color: T.textLight,
                              }}
                            >
                              {new Date(s.submittedAt).toLocaleDateString(
                                "mn-MN",
                              )}
                            </td>
                            <td
                              style={{
                                padding: "12px 16px",
                                color: T.textLight,
                              }}
                            >
                              <ArrowBigDown />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
