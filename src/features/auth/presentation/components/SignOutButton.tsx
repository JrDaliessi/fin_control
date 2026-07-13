"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

type SignOutButtonProps = {
  onSignOut(): Promise<void>;
};

type SignOutStatus = "idle" | "loading" | "success" | "error";

export function SignOutButton({ onSignOut }: SignOutButtonProps) {
  const [status, setStatus] = useState<SignOutStatus>("idle");
  const isLoading = status === "loading";

  async function handleSignOut() {
    if (isLoading) {
      return;
    }

    setStatus("loading");

    try {
      await onSignOut();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {status === "error" ? (
        <p className="text-sm text-danger" role="alert">
          Não foi possível encerrar a sessão. Tente novamente.
        </p>
      ) : null}
      {status === "success" ? (
        <p className="text-sm text-primary" role="status">
          Sessão encerrada.
        </p>
      ) : null}
      <button
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isLoading}
        onClick={handleSignOut}
        type="button"
      >
        <LogOut aria-hidden="true" size={18} />
        {isLoading ? "Saindo..." : "Sair"}
      </button>
    </div>
  );
}
