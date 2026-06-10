import type { ReactNode } from "react";
import type { RouteId } from "../../data/mockData";

export interface SideNavItem {
  id: RouteId;
  label: string;
  icon: ReactNode;
}

export interface SideNavGroup {
  label: string;
  items: SideNavItem[];
}

interface SideNavProps {
  groups: SideNavGroup[];
  active: RouteId;
  onChange: (id: RouteId) => void;
}

export function SideNav({ groups, active, onChange }: SideNavProps) {
  return (
    <nav className="flex flex-col gap-6" aria-label="주요 메뉴">
      {groups.map((group) => (
        <div key={group.label}>
          <div className="type-label mb-2 px-4">{group.label}</div>
          <ul className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = item.id === active;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onChange(item.id)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                      isActive
                        ? "bg-ink font-semibold text-white"
                        : "font-medium text-ink-500 hover:bg-ink/5 hover:text-ink"
                    }`}
                  >
                    <span
                      className={isActive ? "text-mint" : "text-ink-400"}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
