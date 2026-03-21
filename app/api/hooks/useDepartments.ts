// hooks/useDepartments.ts
import { useEffect, useState } from "react";
import type { Department } from "../../_components/type/type";
import { DEPT_COLORS } from "../../_components/data/data";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/departments")
      .then((r) => r.json())
      .then((data) => {
        setDepartments(
          data.map((d: any) => ({
            ...d,
            color: DEPT_COLORS[d.name] ?? "#C9A84C",
          })),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return { departments, loading };
}
