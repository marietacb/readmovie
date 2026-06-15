"use client";

import { useAuth } from "@/context/AuthContext";
import { AuthScreen } from "@/components/auth/AuthScreen";
import type { ReactNode } from "react";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading, isConfigured } = useAuth();

  if (!isConfigured) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="bj-app-bg flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-bj-border border-t-bj-navy" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}
