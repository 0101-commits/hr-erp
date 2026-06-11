import { HelpCircle } from "lucide-react";

interface HelpTipProps {
  text: string;
  size?: number;
}

/* '?' 아이콘에 마우스를 올리면 용어 설명 말풍선이 표시되는 도움말 */
export function HelpTip({ text, size = 15 }: HelpTipProps) {
  return (
    <span className="group relative inline-flex items-center align-middle">
      <span
        tabIndex={0}
        role="img"
        aria-label={`도움말: ${text}`}
        className="flex cursor-help items-center justify-center rounded-full text-ink-300 outline-none transition-colors hover:text-ink-500 focus-visible:text-ink-500"
      >
        <HelpCircle size={size} strokeWidth={1.75} />
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-field bg-ink px-4 py-3 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-white opacity-0 shadow-toast transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}
