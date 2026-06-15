import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  accent?: string;
  trend?: string;
}

export function StatCard({ label, value, icon, accent = "bg-bj-navy", trend }: StatCardProps) {
  return (
    <div className="bj-panel group relative overflow-hidden p-5 transition-shadow hover:shadow-md">
      <div className={cn("absolute left-0 top-0 h-full w-1", accent)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-bj-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold text-bj-navy">{value}</p>
          {trend && <p className="mt-1 text-xs text-bj-sage">{trend}</p>}
        </div>
        {icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bj-surface text-bj-navy/60 transition-colors group-hover:bg-bj-navy/5 group-hover:text-bj-navy">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
