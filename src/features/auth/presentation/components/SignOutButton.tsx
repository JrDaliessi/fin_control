"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import { FeedbackMessage } from "@/shared/components/ui/FeedbackMessage";

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
        <FeedbackMessage variant="error">
          Não foi possível encerrar a sessão. Tente novamente.
        </FeedbackMessage>
      ) : null}
      {status === "success" ? (
        <FeedbackMessage variant="status">
          Sessão encerrada.
        </FeedbackMessage>
      ) : null}
      {isLoading ? (
        <p className="sr-only" role="status">
          Saindo...
        </p>
      ) : null}
      <Button
        aria-busy={isLoading}
        className="font-medium"
        disabled={isLoading}
        onClick={handleSignOut}
        variant="secondary"
      >
        <LogOut aria-hidden="true" size={18} />
        {isLoading ? "Saindo..." : "Sair"}
      </Button>
    </div>
  );
}
