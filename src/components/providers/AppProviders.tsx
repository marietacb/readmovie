"use client";

import { AuthProvider } from "@/context/AuthContext";
import { MediaTrackerProvider } from "@/context/MediaTrackerContext";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MediaTrackerProvider>{children}</MediaTrackerProvider>
    </AuthProvider>
  );
}
