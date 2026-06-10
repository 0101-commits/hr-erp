import { ChevronDown } from "lucide-react";
import type { ChangeEvent } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  size?: "sm" | "md";
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  ariaLabel,
  size = "md",
  className = "",
}: SelectProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const sizeClasses =
    size === "sm"
      ? "h-8 rounded-cell pl-3 pr-8 text-[13px]"
      : "h-10 rounded-field pl-4 pr-9 text-sm";

  return (
    <span className={`relative inline-flex ${className}`}>
      <select
        value={value}
        onChange={handleChange}
        aria-label={ariaLabel}
        className={`w-full cursor-pointer appearance-none border border-hairline bg-surface font-medium text-ink transition-colors hover:bg-canvas focus:outline-none focus-visible:border-cobalt focus-visible:ring-1 focus-visible:ring-cobalt ${sizeClasses}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={size === "sm" ? 14 : 16}
        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400"
      />
    </span>
  );
}
