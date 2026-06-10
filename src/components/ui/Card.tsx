import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  padding?: "default" | "flush" | "roomy";
  children: ReactNode;
}

const PADDING_CLASSES: Record<NonNullable<CardProps["padding"]>, string> = {
  default: "p-7",
  flush: "p-0",
  roomy: "p-9",
};

export function Card({
  title,
  subtitle,
  action,
  padding = "default",
  children,
  className = "",
  ...rest
}: CardProps) {
  return (
    <section
      className={`rounded-showcase border border-hairline-soft bg-surface ${PADDING_CLASSES[padding]} ${className}`}
      {...rest}
    >
      {(title || action) && (
        <header
          className={`flex items-start justify-between gap-4 ${padding === "flush" ? "px-7 pt-7" : ""} mb-5`}
        >
          <div>
            {title && (
              <h2 className="text-[17px] font-semibold tracking-snug text-ink">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-none">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
