"use client";

import { cn } from "@/lib/utils";

interface LinedInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function LinedInput({
  value,
  onChange,
  placeholder,
  className,
}: LinedInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full border-0 border-b border-[#c5baaf] bg-transparent px-0 py-1",
        "text-sm outline-none placeholder:text-[#c5baaf]/60 focus:border-[#4a3f35]",
        className
      )}
    />
  );
}

interface LinedTextareaProps {
  value: string;
  onChange: (value: string) => void;
  lines?: number;
  placeholder?: string;
  className?: string;
}

export function LinedTextarea({
  value,
  onChange,
  lines = 6,
  placeholder,
  className,
}: LinedTextareaProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="border-b border-[#c5baaf]/50" style={{ height: `${100 / lines}%` }} />
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={lines}
        className="relative w-full resize-none border-0 bg-transparent px-0 py-1 text-sm leading-8 outline-none placeholder:text-[#c5baaf]/60"
        style={{ lineHeight: "2rem" }}
      />
    </div>
  );
}

interface BulletListInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  count?: number;
  bulletColor?: string;
}

export function BulletListInput({
  items,
  onChange,
  count = 3,
  bulletColor = "#c5baaf",
}: BulletListInputProps) {
  const padded = [...items];
  while (padded.length < count) padded.push("");

  const handleChange = (index: number, value: string) => {
    const updated = [...padded];
    updated[index] = value;
    onChange(updated.filter((_, i) => i < count));
  };

  return (
    <div className="flex flex-col gap-3">
      {padded.slice(0, count).map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: bulletColor }}
          />
          <LinedInput value={item} onChange={(v) => handleChange(i, v)} />
        </div>
      ))}
    </div>
  );
}
