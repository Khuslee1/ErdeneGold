// hooks/useEngineerAuth.ts
import { useState } from "react";

export function useEngineerAuth() {
  const [engineer, setEngineer] = useState<{ name: string } | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError("Нэвтрэх мэдээлэл буруу байна"); return; }
      const data = await res.json();
      setEngineer({ name: data.name });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setEngineer(null);
  };

  return { engineer, login, logout, error, loading };
}