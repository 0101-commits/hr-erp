import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "cobalt" | "mint";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-ink text-white hover:bg-ink-700 active:bg-ink disabled:bg-ink-300",
  secondary:
    "bg-surface text-ink border border-hairline hover:bg-canvas active:bg-hairline-soft disabled:text-ink-300",
  ghost:
    "bg-transparent text-ink-500 hover:bg-ink/5 active:bg-ink/10 disabled:text-ink-300",
  cobalt:
    "bg-cobalt text-white hover:bg-cobalt-deep active:bg-cobalt disabled:bg-ink-300",
  mint:
    "bg-mint text-ink hover:bg-pistachio active:bg-mint disabled:bg-hairline-soft disabled:text-ink-300",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-[13px] gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-[15px] gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
