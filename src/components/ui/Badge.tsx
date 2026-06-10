import type { ReactNode } from "react";

type BadgeTone =
  | "ink"
  | "mint"
  | "pistachio"
  | "neutral"
  | "outline"
  | "warning"
  | "critical"
  | "cobalt";

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  ink: "bg-ink text-white",
  mint: "bg-mint text-ink",
  pistachio: "bg-pistachio text-ink",
  neutral: "bg-hairline-soft text-ink-500",
  outline: "bg-surface text-ink-500 border border-hairline",
  warning: "bg-[#FDF3DC] text-[#8A5B00]",
  critical: "bg-alert-wash text-alert-deep",
  cobalt: "bg-[#E5F0FE] text-cobalt",
};

const DOT_CLASSES: Record<BadgeTone, string> = {
  ink: "bg-white",
  mint: "bg-mint-deep",
  pistachio: "bg-mint-deep",
  neutral: "bg-ink-400",
  outline: "bg-ink-400",
  warning: "bg-[#C98A00]",
  critical: "bg-alert-deep",
  cobalt: "bg-cobalt",
};

export function Badge({
  tone = "neutral",
  dot = false,
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${TONE_CLASSES[tone]} ${className}`}
    >
      {dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[tone]}`} />
      )}
      {children}
    </span>
  );
}
