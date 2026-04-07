// GoldApp.tsx
"use client";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import type { Role } from "./type/type";
import Landing from "./Landing";
import OperatorSection from "./OperatorSection";
import EngineerSection from "./EngineerSection";
import EngineerLoginModal from "./EngineerLoginModal";

function EngineerGate({ onBack }: { onBack: () => void }) {
  const { signOut } = useClerk();
  const [authed, setAuthed] = useState(false);

  if (!authed)
    return <EngineerLoginModal onBack={onBack} onSuccess={() => setAuthed(true)} />;

  return (
    <EngineerSection
      onBack={async () => {
        await signOut();
        setAuthed(false);
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
