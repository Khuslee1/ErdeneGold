// hooks/useSubmissions.ts
import { useEffect, useState } from "react";
import type { Submission } from "../../_components/type/type";

export function useSubmissions(
  deptId?: string,
  dateFrom?: string,
  dateTo?: string,
) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (deptId) params.set("deptId", deptId);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    fetch(`/api/submissions?${params}`)
      .then((r) => r.json())
      .then(setSubmissions)
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubmissions();
  }, [deptId, dateFrom, dateTo]);

  return { submissions, loading, refetch: fetchSubmissions };
}
