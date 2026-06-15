"use client";

import { cn } from "@/lib/utils";

interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FieldRow({ label, children, className }: FieldRowProps) {
  return (
    <div className={cn("flex items-baseline gap-3", className)}>
      <span className="shrink-0 text-xs font-bold uppercase tracking-wide">{label}</span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
