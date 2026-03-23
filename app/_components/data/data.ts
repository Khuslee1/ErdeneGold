// data/data.ts
export const DEPT_NAMES: Record<string, string> = {
  "1001": "Бутлуурын хэсэг",
  "1002": "Тээрмийн хэсэг",
  "1006 1007": "Уусгалт шингээлтийн хэсэг",
  "1008 1009": "Усгүйжүүлэх, саармагжуулах хэсэг",
  "1010": "Хаягдал шахах хэсэг",
  "1011": "Дисорбицийн хэсэг",
  "6000": "Урвалжийн хэсэг",
};

export const DEPT_COLORS: Record<string, string> = {
  "1001": "#C9A84C",
  "1002": "#7EB8A4",
  "1006 1007": "#C97B4C",
  "1008 1009": "#E8A87C",
  "1010": "#8B7EC8",
  "1011": "#7EB8C0",
};

export const DAY_HOURS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
export const NIGHT_HOURS = [17, 18, 19, 20, 21, 22, 23, 0, 1, 2, 3, 4];

export function getShiftForHour(hour: number): "DAY" | "NIGHT" {
  return DAY_HOURS.includes(hour) ? "DAY" : "NIGHT";
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function getNow() {
  const n = new Date();
  return {
    time: n.toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }),
    date: n.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
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
