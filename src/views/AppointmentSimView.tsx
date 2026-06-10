import { ArrowRight, GitBranch, Search, UserCog } from "lucide-react";
import { useMemo, useState } from "react";
import {
  fmtEok,
  fmtKorean,
  ORG_UNITS,
  type Employee,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";

interface AppointmentSimViewProps {
  employees: Employee[];
  showToast: (message: string) => void;
}

interface PendingAppointment {
  id: string;
  employee: Employee;
  toDept: string;
  effectiveDate: string;
}

const EFFECTIVE_DATES = ["2026-07-01", "2026-08-01", "2026-09-01"];

export function AppointmentSimView({
  employees,
  showToast,
}: AppointmentSimViewProps) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toDept, setToDept] = useState(ORG_UNITS[0].dept);
  const [effectiveDate, setEffectiveDate] = useState(EFFECTIVE_DATES[0]);
  const [pending, setPending] = useState<PendingAppointment[]>([]);

  const matches = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return employees
      .filter((e) => e.name.includes(q) || e.id.includes(q.toUpperCase()))
      .slice(0, 6);
  }, [employees, query]);

  const selected = selectedId
    ? employees.find((e) => e.id === selectedId) ?? null
    : null;

  /* 발령 반영 시 팀별 인원·인건비 변동 시뮬레이션 */
  const deptStats = useMemo(() => {
    const map = new Map<string, { headcount: number; payroll: number }>();
    for (const e of employees) {
      const stat = map.get(e.dept) ?? { headcount: 0, payroll: 0 };
      stat.headcount += 1;
      stat.payroll += e.salary;
      map.set(e.dept, stat);
    }
    for (const ap of pending) {
      const from = map.get(ap.employee.dept);
      const to = map.get(ap.toDept);
      if (from) {
        from.headcount -= 1;
        from.payroll -= ap.employee.salary;
      }
      if (to) {
        to.headcount += 1;
        to.payroll += ap.employee.salary;
      }
    }
    return map;
  }, [employees, pending]);

  const register = () => {
    if (!selected) return;
    if (selected.dept === toDept) {
      showToast("현재 소속과 동일한 팀으로는 발령을 등록할 수 없어요");
      return;
    }
    setPending((prev) => [
      {
        id: `apm-${Date.now()}`,
        employee: selected,
        toDept,
        effectiveDate,
      },
      ...prev,
    ]);
    showToast(
      `발령 예정 등록 — ${selected.name} · ${selected.dept} → ${toDept} (${effectiveDate})`
    );
    setSelectedId(null);
    setQuery("");
  };

  const fromStat = selected ? deptStats.get(selected.dept) : null;
  const toStat = deptStats.get(toDept);

  return (
    <div>
      <PageHeader
        breadcrumb={["조직 & 인사 관리", "마스터 인사 데이터", "인사 발령 시뮬레이터"]}
        title="인사 발령 시뮬레이터"
        subtitle="발령 예정 정보를 사전 입력하고 조직 개편에 따른 인력·인건비 변동을 발령 확정 전에 시뮬레이션합니다."
        actions={
          <Badge tone="cobalt" dot>
            발령 예정 {pending.length}건
          </Badge>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <Card
          title="발령 예정 정보 입력"
          subtitle="대상자 검색 → 전입 팀과 발령일을 지정하세요"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <UserCog size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="flex h-10 items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4">
            <Search size={15} className="flex-none text-ink-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSelectedId(null);
              }}
              placeholder="성명 또는 사번으로 대상자 검색"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
              aria-label="발령 대상자 검색"
            />
          </div>

          {!selected && matches.length > 0 && (
            <ul className="mt-2 overflow-hidden rounded-field border border-hairline-soft">
              {matches.map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.id)}
                    className="flex w-full items-center gap-2.5 border-b border-hairline-soft px-4 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-canvas"
                  >
                    <Avatar name={e.name} size={26} />
                    <span className="font-medium">{e.name}</span>
                    <span className="text-xs text-ink-400">
                      {e.id} · {e.dept} · {e.position}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selected && (
            <div className="mt-4 rounded-field bg-canvas p-5">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} size={40} />
                <div>
                  <div className="text-sm font-semibold">
                    {selected.name}
                    <span className="ml-2 text-xs font-normal text-ink-400">
                      {selected.id}
                    </span>
                  </div>
                  <div className="text-xs text-ink-400">
                    {selected.entity} · {selected.dept} · {selected.position}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <div className="type-label mb-1.5">전입 팀</div>
                  <Select
                    options={ORG_UNITS.map((unit) => ({
                      value: unit.dept,
                      label: `${unit.entity} · ${unit.dept}`,
                    }))}
                    value={toDept}
                    onChange={setToDept}
                    ariaLabel="전입 팀 선택"
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="type-label mb-1.5">발령 예정일</div>
                  <Select
                    options={EFFECTIVE_DATES.map((d) => ({ value: d, label: d }))}
                    value={effectiveDate}
                    onChange={setEffectiveDate}
                    ariaLabel="발령 예정일 선택"
                    className="w-full"
                  />
                </div>
                <Button icon={<GitBranch size={15} />} onClick={register}>
                  발령 예정 등록 및 시뮬레이션 반영
                </Button>
              </div>
            </div>
          )}

          {selected && fromStat && toStat && (
            <div className="mt-4 flex items-center gap-3 rounded-field border border-hairline-soft p-4 text-center text-sm">
              <div className="flex-1">
                <div className="type-label mb-1">{selected.dept}</div>
                <div className="font-semibold tabular-nums">
                  {fromStat.headcount}명 → {fromStat.headcount - 1}명
                </div>
                <div className="text-xs tabular-nums text-alert-deep">
                  인건비 -{fmtKorean(selected.salary)}
                </div>
              </div>
              <ArrowRight size={16} className="flex-none text-ink-300" />
              <div className="flex-1">
                <div className="type-label mb-1">{toDept}</div>
                <div className="font-semibold tabular-nums">
                  {toStat.headcount}명 → {toStat.headcount + 1}명
                </div>
                <div className="text-xs tabular-nums text-mint-deep">
                  인건비 +{fmtKorean(selected.salary)}
                </div>
              </div>
            </div>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          <Card
            title="발령 예정 큐"
            subtitle="등록된 발령 예정 정보 — 아래 조직 영향 분석에 즉시 반영됩니다"
          >
            {pending.length === 0 ? (
              <p className="rounded-field border border-dashed border-hairline p-8 text-center text-sm text-ink-400">
                등록된 발령 예정 정보가 없습니다 — 대상자를 검색해 등록해 보세요
              </p>
            ) : (
              <ul className="flex flex-col">
                {pending.map((ap) => (
                  <li
                    key={ap.id}
                    className="flex items-center gap-3 border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                  >
                    <Avatar name={ap.employee.name} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">
                        {ap.employee.name}
                        <span className="ml-2 text-xs font-normal text-ink-400">
                          {ap.employee.position}
                        </span>
                      </div>
                      <div className="text-xs text-ink-400">
                        {ap.employee.dept} → {ap.toDept}
                      </div>
                    </div>
                    <Badge tone="cobalt">{ap.effectiveDate} 발령</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="조직 영향 분석"
            subtitle="발령 예정 반영 후 팀별 인원 · 연간 인건비 변동"
            padding="flush"
          >
            <div className="nx-scroll overflow-x-auto px-4 pb-4">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-hairline">
                    <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">팀</th>
                    <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">시뮬레이션 인원</th>
                    <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">연간 인건비</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from(deptStats.entries())
                    .sort((a, b) => b[1].payroll - a[1].payroll)
                    .slice(0, 8)
                    .map(([dept, stat]) => (
                      <tr
                        key={dept}
                        className="border-b border-hairline-soft last:border-none hover:bg-canvas"
                      >
                        <td className="whitespace-nowrap px-3.5 py-3 font-medium">{dept}</td>
                        <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                          {stat.headcount.toLocaleString("ko-KR")}명
                        </td>
                        <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                          {fmtEok(stat.payroll)} 원
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
