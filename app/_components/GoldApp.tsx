// your GoldApp.tsx code here
"use client";
import { useState } from "react";
import type { Role, BatchRecord } from "./type/type";
import { initialRecords } from "./data/data";

import Landing from "./Landing";
import OperatorSection from "./OperatorSection";
import EngineerSection from "./EngineerSection";
import EngineerLoginModal from "./EngineerLoginModal";
import { useEngineerAuth } from "../api/hooks/useEngineerAuth";

// ── Separate component so hooks are always called unconditionally ──
function EngineerGate({ onBack, records }: { onBack: () => void; records: BatchRecord[] }) {
  const { engineer, login, logout, error, loading } = useEngineerAuth();

  const handleBack = async () => {
    await logout();
    onBack();
  };

  if (!engineer) return (
    <EngineerLoginModal
      onLogin={login}
      onBack={onBack}
      error={error}
      loading={loading}
    />
  );

  return <EngineerSection onBack={handleBack} records={records} />;
}

// ── Root app — no auth hooks here ──
export default function GoldApp() {
  const [role, setRole] = useState<Role | null>(null);
  const [records, setRecords] = useState<BatchRecord[]>(initialRecords);
  const nextIdRef = { current: records.length + 1 };

  const handleOperatorSubmit = (record: Omit<BatchRecord, "id">): void => {
    const newRecord: BatchRecord = { ...record, id: nextIdRef.current++ };
    setRecords((prev) => [newRecord, ...prev]);
  };

  if (!role) return <Landing onSelect={setRole} records={records} />;
  if (role === "operator") return <OperatorSection onBack={() => setRole(null)} onSubmit={handleOperatorSubmit} />;
  if (role === "engineer") return <EngineerGate onBack={() => setRole(null)} records={records} />;
  return null;
}