// hooks/useQuestions.ts
import { useEffect, useState } from "react";
import type { Question } from "../../_components/type/type";

export function useQuestions(departmentId: string | null, hour: number | null) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!departmentId) return;
    setLoading(true);
    fetch(`/api/departments/${departmentId}/questions`)
      .then((r) => r.json())
      .then((data: Question[]) => {
        // Filter by allowedHours
        const filtered = data.filter(
          (q) =>
            q.allowedHours.length === 0 ||
            (hour !== null && q.allowedHours.includes(hour)),
        );
        setQuestions(filtered);
      })
      .finally(() => setLoading(false));
  }, [departmentId, hour]);

  return { questions, loading };
}
