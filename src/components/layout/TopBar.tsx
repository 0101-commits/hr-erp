import { Bell, Cpu, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OMNIBAR_SUGGESTIONS } from "../../data/mockData";
import { Avatar } from "../ui/Avatar";

interface TopBarProps {
  userName: string;
  userRole: string;
  notificationCount: number;
  onCommand: (query: string) => void;
  onOpenProfile: () => void;
}

export function TopBar({
  userName,
  userRole,
  notificationCount,
  onCommand,
  onOpenProfile,
}: TopBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onCommand(trimmed);
    setQuery("");
    setFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 flex-none items-center gap-6 border-b border-hairline-soft bg-surface px-8">
      <div className="flex w-60 flex-none items-center gap-3">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-cell bg-ink text-white">
          <Cpu size={16} strokeWidth={1.75} />
        </span>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-snug text-ink">
            NexChip <span className="font-light">HR Enterprise</span>
          </div>
          <div className="text-[11px] text-ink-400">
            넥스칩 세미콘 · People &amp; Rewards
          </div>
        </div>
      </div>

      <div ref={wrapRef} className="relative mx-auto w-full max-w-xl">
        <div
          className={`flex h-10 items-center gap-2.5 rounded-full bg-canvas px-4 transition-all duration-150 ${
            focused
              ? "border-2 border-cobalt bg-surface"
              : "border border-hairline"
          }`}
        >
          <Sparkles
            size={16}
            className={focused ? "text-cobalt" : "text-ink-400"}
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submit(query);
              if (event.key === "Escape") setFocused(false);
            }}
            placeholder="AI에게 무엇이든 요청하세요 — “연차 신청”, “김도현 프로필”, “메리트 시뮬레이터”"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-300"
            aria-label="AI 옴니바"
          />
          <kbd className="hidden flex-none rounded-cell border border-hairline bg-surface px-1.5 py-0.5 text-[10px] font-medium text-ink-400 md:block">
            ⏎
          </kbd>
        </div>

        {focused && (
          <div className="absolute left-0 right-0 top-12 animate-fade-in rounded-field border border-hairline-soft bg-surface p-2 shadow-cube">
            <div className="type-label px-3 pb-1.5 pt-2">AI 추천 명령</div>
            <ul>
              {OMNIBAR_SUGGESTIONS.map((suggestion) => (
                <li key={suggestion.id}>
                  <button
                    type="button"
                    onClick={() => submit(suggestion.query)}
                    className="flex w-full items-center justify-between gap-3 rounded-cell px-3 py-2.5 text-left text-sm text-ink transition-colors hover:bg-canvas"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles size={14} className="text-cobalt" />
                      {suggestion.label}
                    </span>
                    <span className="text-[11px] text-ink-300">
                      {suggestion.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex w-60 flex-none items-center justify-end gap-3">
        <button
          type="button"
          aria-label={`알림 ${notificationCount}건`}
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink-500 transition-colors hover:bg-canvas"
        >
          <Bell size={17} strokeWidth={1.75} />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-bold text-mint">
              {notificationCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label={`${userName} 프로필 열기`}
          title={`${userName} · ${userRole}`}
          className="h-10 w-10 rounded-full transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt"
        >
          <Avatar name={userName} size={40} />
        </button>
      </div>
    </header>
  );
}
