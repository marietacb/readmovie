import type { ReactNode } from "react";

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-bj-navy">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-bj-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
