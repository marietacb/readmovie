"use client";

import { Cloud, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export function AuthButton({ className }: { className?: string }) {
  const { user, isLoading, isConfigured, signOut } = useAuth();

  if (!isConfigured || isLoading || !user) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="hidden items-center gap-1.5 text-xs text-bj-muted sm:flex">
        <Cloud className="h-3.5 w-3.5 text-bj-terracotta" />
        Sincronizado
      </span>
      <button
        type="button"
        onClick={() => signOut()}
        className="flex items-center gap-1.5 rounded-xl border border-bj-border px-3 py-2 text-sm text-bj-muted transition-colors hover:bg-bj-surface hover:text-bj-navy"
        title={user.email ?? "Cerrar sesión"}
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Salir</span>
      </button>
    </div>
  );
}
