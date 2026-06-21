"use client";

import { useAuth } from "@/context/AuthContext";
import { LandingPage } from "@/components/layout/LandingPage";
import { MainHeader } from "@/components/layout/MainHeader";
import { HomeDashboardView } from "@/components/home/HomeDashboardView";

export function HomePage() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isConfigured && isLoading) {
    return (
      <div className="bj-app-bg flex min-h-dvh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-bj-border border-t-bj-navy" />
      </div>
    );
  }

  if (isConfigured && !user) {
    return <LandingPage />;
  }

  return (
    <div className="bj-app-bg flex min-h-dvh flex-col">
      <MainHeader activeModule="home" />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6">
        <div className="rounded-2xl border border-bj-border/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm md:p-8">
          <HomeDashboardView />
        </div>
      </main>
    </div>
  );
}
