import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  detail?: string;
  accent?: "none" | "mint" | "alert";
  footer?: ReactNode;
  square?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  accent = "none",
  footer,
  square = false,
}: StatCardProps) {
  const surface =
    accent === "mint"
      ? "bg-mint border-mint"
      : accent === "alert"
        ? "bg-alert-wash border-alert-wash"
        : "bg-surface border-hairline-soft";

  return (
    <div
      className={`flex flex-col rounded-field border p-5 ${surface} ${square ? "aspect-square justify-between" : "gap-1.5"}`}
    >
      <span className="type-label">{label}</span>
      <div>
        <div className="type-display text-[28px] tabular-nums text-ink">
          {value}
        </div>
        {detail && (
          <p
            className={`mt-1 text-[13px] ${accent === "alert" ? "text-alert-deep" : accent === "mint" ? "text-mint-deep" : "text-ink-400"}`}
          >
            {detail}
          </p>
        )}
      </div>
      {footer}
    </div>
  );
}
