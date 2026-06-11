import type { ReactNode } from "react";
import { HelpTip } from "./HelpTip";

interface PageHeaderProps {
  breadcrumb?: string[];
  title: string;
  /* 전문 용어 설명 — '?' 아이콘 호버 시 말풍선으로 표시 */
  help?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({
  breadcrumb,
  title,
  help,
  subtitle,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="mb-2 flex items-center gap-1.5 text-xs text-ink-400">
            {breadcrumb.map((crumb, index) => (
              <span key={crumb} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-hairline">/</span>}
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? "font-medium text-ink-500"
                      : ""
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="type-display flex items-center gap-2.5 text-4xl text-ink">
          {title}
          {help && <HelpTip text={help} size={18} />}
        </h1>
        {subtitle && (
          <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-400">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-none items-center gap-2.5">{actions}</div>}
    </header>
  );
}
