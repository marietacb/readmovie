"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";

export function LandingHeader() {
  return (
    <header className="border-b border-bj-border/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-bj-navy to-bj-navy/80">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-serif text-lg font-bold text-bj-navy">
            Diario<span className="font-normal text-bj-muted">.com</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <AuthButton />
          <Link href="/books" className="bj-btn-primary hidden sm:inline-flex">
            Acceder
          </Link>
        </div>
      </div>
    </header>
  );
}
