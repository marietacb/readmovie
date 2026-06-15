"use client";

import { AuthProvider } from "@/context/AuthContext";
import { AuthGate } from "@/components/auth/AuthGate";
import { MediaTrackerProvider } from "@/context/MediaTrackerContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>
        <MediaTrackerProvider>{children}</MediaTrackerProvider>
      </AuthGate>
    </AuthProvider>
  );
}
