type ProgressTone = "ink" | "mint" | "cobalt" | "alert";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  display?: string;
  tone?: ProgressTone;
  height?: number;
}

const TONE_CLASSES: Record<ProgressTone, string> = {
  ink: "bg-ink",
  mint: "bg-mint",
  cobalt: "bg-cobalt",
  alert: "bg-alert-deep",
};

export function ProgressBar({
  value,
  max,
  label,
  display,
  tone = "ink",
  height = 8,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0;

  return (
    <div>
      {(label || display) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && <span className="type-label">{label}</span>}
          {display && (
            <span className="text-[13px] font-semibold tabular-nums text-ink">
              {display}
            </span>
          )}
        </div>
      )}
      <div
        className="w-full overflow-hidden rounded-full bg-hairline-soft"
        style={{ height }}
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={Math.round(max)}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${TONE_CLASSES[tone]}`}
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}
