import { ChevronDown } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { RouteId } from "../../data/mockData";

export interface SideNavLeaf {
  id: RouteId;
  label: string;
}

export interface SideNavSub {
  label: string;
  items: SideNavLeaf[];
}

export interface SideNavSection {
  key: string;
  no: string;
  label: string;
  icon: ReactNode;
  subs: SideNavSub[];
}

interface SideNavProps {
  sections: SideNavSection[];
  active: RouteId;
  onChange: (id: RouteId) => void;
}

function sectionOf(sections: SideNavSection[], route: RouteId): string | null {
  for (const section of sections) {
    for (const sub of section.subs) {
      if (sub.items.some((item) => item.id === route)) return section.key;
    }
  }
  return null;
}

export function SideNav({ sections, active, onChange }: SideNavProps) {
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const key = sectionOf(sections, active);
    return key ? [key] : [];
  });

  /* 옴니바 등 외부 내비게이션 시 활성 라우트가 속한 대메뉴 자동 펼침 */
  useEffect(() => {
    const key = sectionOf(sections, active);
    if (key) {
      setOpenKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
    }
  }, [sections, active]);

  const toggle = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <nav className="flex flex-col gap-1.5" aria-label="주요 메뉴">
      {sections.map((section) => {
        const isOpen = openKeys.includes(section.key);
        const hasActive = sectionOf([section], active) === section.key;
        return (
          <div key={section.key}>
            <button
              type="button"
              onClick={() => toggle(section.key)}
              aria-expanded={isOpen}
              className={`flex w-full items-center gap-2.5 rounded-field px-3 py-2.5 text-left text-sm transition-colors duration-150 ${
                hasActive && !isOpen
                  ? "bg-ink/5 font-semibold text-ink"
                  : "font-medium text-ink-500 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              <span
                className={hasActive ? "text-mint-deep" : "text-ink-400"}
                aria-hidden="true"
              >
                {section.icon}
              </span>
              <span className="min-w-0 flex-1 truncate">
                <span className="mr-1.5 text-[11px] font-semibold tabular-nums text-ink-300">
                  {section.no}
                </span>
                {section.label}
              </span>
              <ChevronDown
                size={14}
                className={`flex-none text-ink-300 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="mb-2 mt-1 flex flex-col gap-3 pb-1 pl-3">
                {section.subs.map((sub) => (
                  <div key={sub.label}>
                    <div className="type-label mb-1 px-3">{sub.label}</div>
                    <ul className="flex flex-col gap-0.5">
                      {sub.items.map((item) => {
                        const isActive = item.id === active;
                        return (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => onChange(item.id)}
                              aria-current={isActive ? "page" : undefined}
                              className={`flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-[13px] transition-colors duration-150 ${
                                isActive
                                  ? "bg-ink font-semibold text-white"
                                  : "font-medium text-ink-500 hover:bg-ink/5 hover:text-ink"
                              }`}
                            >
                              <span
                                className={`h-1 w-1 flex-none rounded-full ${isActive ? "bg-mint" : "bg-ink-300"}`}
                                aria-hidden="true"
                              />
                              <span className="min-w-0 truncate">{item.label}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
