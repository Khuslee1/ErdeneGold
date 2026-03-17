export type Role = "operator" | "engineer";
export type OperatorStep = "dept" | "form" | "confirm" | "done" | "password";
export type FieldType = "select" | "number" | "text" | "textarea";

export interface Department {
  id: string;
  name: string;
  color: string;
  password: string,
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  unit?: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export interface BatchRecord {
  id: number;
  deptId: string;
  deptName: string;
  operator: string;
  shift: string;
  submitted_at: string;
  notes?: string;
  [key: string]: string | number | undefined;
}

export interface OperatorSectionProps {
  onBack: () => void;
  onSubmit: (record: Omit<BatchRecord, "id">) => void;
}

export interface EngineerSectionProps {
  onBack: () => void;
  records: BatchRecord[];
}

export interface LandingProps {
  onSelect: (role: Role) => void;
  records: BatchRecord[];
}