import type { Department, FormField, BatchRecord } from "../type/type";

export const departments: Department[] = [
  { id: "1001", name: "Бутлуур",   color: "#C9A84C", password: "1001" },
  { id: "1002", name: "Уусгалт",   color: "#7EB8A4" , password: "1002"},
  { id: "1006", name: "Цэвэршүүлэлт",  color: "#C97B4C", password: "1006" },
  { id: "1008", name: "Хайлуулалт",   color: "#E8A87C", password: "1008"},
  { id: "1012", name: "Хяналт",      color: "#8B7EC8", password: "1012" },
];

export const formFields: Record<string, FormField[]> = {
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

export const initialRecords: BatchRecord[] = [
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

export function getNow(): { time: string; date: string; full: string } {
  const n = new Date();
  return {
    time: n.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }),
    date: n.toLocaleDateString("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit" }),
    full: n.toLocaleString("mn-MN"),
  };
}

export function getInputStyle(hasError: boolean): React.CSSProperties {
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