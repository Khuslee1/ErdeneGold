// GoldApp.tsx
"use client";
import { useState } from "react";
import type { Role } from "./type/type";
import Landing from "./Landing";
import OperatorSection from "./OperatorSection";
import EngineerSection from "./EngineerSection";
import EngineerLoginModal from "./EngineerLoginModal";
import { useEngineerAuth } from "../api/hooks/useEngineerAuth";

function EngineerGate({ onBack }: { onBack: () => void }) {
  const { engineer, login, logout, error, loading } = useEngineerAuth();

  if (!engineer)
    return (
      <EngineerLoginModal
        onLogin={login}
        onBack={onBack}
        error={error}
        loading={loading}
      />
    );

  return (
    <EngineerSection
      onBack={async () => {
        await logout();
        onBack();
      }}
    />
  );
}

export default function GoldApp() {
  const [role, setRole] = useState<Role | null>(null);

  if (!role) return <Landing onSelect={setRole} />;
  if (role === "operator")
    return <OperatorSection onBack={() => setRole(null)} />;
  if (role === "engineer") return <EngineerGate onBack={() => setRole(null)} />;
  return null;
}
