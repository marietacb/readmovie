"use client";

import { cn } from "@/lib/utils";

interface TagCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: string;
}

export function TagCheckbox({
  label,
  checked,
  onChange,
  color = "#c5baaf",
}: TagCheckboxProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 text-left text-xs uppercase tracking-wide transition-opacity hover:opacity-70"
    >
      <span
        className={cn(
          "h-3 w-3 shrink-0 rounded-full border-2 transition-colors",
          checked ? "border-transparent" : "border-transparent bg-transparent"
        )}
        style={{ backgroundColor: checked ? color : `${color}60` }}
      />
      <span>{label}</span>
    </button>
  );
}

interface CheckboxGroupProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T[];
  onChange: (selected: T[]) => void;
  columns?: number;
}

export function CheckboxGroup<T extends string>({
  options,
  selected,
  onChange,
  columns = 2,
}: CheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {options.map((opt) => (
        <TagCheckbox
          key={opt.value}
          label={opt.label}
          checked={selected.includes(opt.value)}
          onChange={() => toggle(opt.value)}
        />
      ))}
    </div>
  );
}
