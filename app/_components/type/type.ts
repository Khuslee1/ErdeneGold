// type/type.ts
export type Role = "operator" | "engineer";
export type OperatorStep = "dept" | "hour" | "form" | "confirm" | "done";

export interface Department {
  id: string;
  name: string;
  color: string;
}

export interface Question {
  id: string;
  title: string;
  label: string | null;
  type: "TEXT" | "NUMBER" | "BOOLEAN";
  order: number;
  allowedHours: number[];
}

export interface Submission {
  id: string;
  operatorName: string;
  shift: "DAY" | "NIGHT";
  hour: number;
  submittedAt: string;
  answers: Record<string, string>; // { questionId: value }
  department: { id: string; name: string };
}

export interface OperatorSectionProps {
  onBack: () => void;
}

export interface EngineerSectionProps {
  onBack: () => void;
}

export interface LandingProps {
  onSelect: (role: Role) => void;
}
