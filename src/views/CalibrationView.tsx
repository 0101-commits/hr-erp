import { ChevronLeft, ChevronRight, Search, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  fmtCompa,
  fmtWon,
  GRADE_META,
  GRADES,
  ORG_UNITS,
  POTENTIAL_META,
  type Employee,
  type PerformanceGrade,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";

interface CalibrationViewProps {
  employees: Employee[];
  onChangeGrade: (employeeId: string, grade: PerformanceGrade) => void;
  onFinalize: () => void;
  onOpenProfile: (employeeId: string) => void;
}

const GRADE_SEGMENT_COLORS: Record<PerformanceGrade, string> = {
  S: "#000000",
  A: "#3F3F46",
  B: "#C1FBD4",
  C: "#E4E4E7",
};

const PAGE_SIZE = 20;
const ALL = "__all__";

export function CalibrationView({
  employees,
  onChangeGrade,
  onFinalize,
  onOpenProfile,
}: CalibrationViewProps) {
  const [query, setQuery] = useState("");
  const [dept, setDept] = useState(ALL);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim();
    return employees.filter((e) => {
      if (dept !== ALL && e.dept !== dept) return false;
      if (q && !e.name.includes(q) && !e.id.includes(q.toUpperCase())) return false;
      return true;
    });
  }, [employees, query, dept]);

  const total = filtered.length;
  const counts = useMemo(
    () =>
      GRADES.reduce<Record<PerformanceGrade, number>>(
        (acc, grade) => {
          acc[grade] = filtered.filter((e) => e.grade === grade).length;
          return acc;
        },
        { S: 0, A: 0, B: 0, C: 0 }
      ),
    [filtered]
  );

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  const gradeOptions = GRADES.map((g) => ({
    value: g,
    label: `${g} · ${GRADE_META[g].desc}`,
  }));

  return (
    <div>
      <PageHeader
        breadcrumb={["성과 & 몰입 관리", "상시 다면 평가", "종합 인사 평가 매트릭스"]}
        title="종합 인사 평가 매트릭스"
        subtitle={`2026 상반기 평가 등급 보정(Calibration) 세션 · 전사 ${employees.length.toLocaleString("ko-KR")}명 — 다면 피드백 결과를 바탕으로 등급을 보정하면 성과급과 시뮬레이터, 탤런트 보드에 즉시 반영됩니다.`}
        actions={
          <Button variant="cobalt" icon={<ShieldCheck size={16} />} onClick={onFinalize}>
            보정 결과 확정
          </Button>
        }
      />

      <Card
        title="성과 분포"
        subtitle={`권장 분포 곡선 (S 10% · A 25% · B 50% · C 15%) 대비 현재 보정 상태 — 필터 적용 ${total.toLocaleString("ko-KR")}명 기준`}
        className="mb-6"
      >
        <div className="flex h-3.5 overflow-hidden rounded-full bg-hairline-soft">
          {GRADES.map((grade) => (
            <div
              key={grade}
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: total > 0 ? `${(counts[grade] / total) * 100}%` : "0%",
                background: GRADE_SEGMENT_COLORS[grade],
              }}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {GRADES.map((grade) => {
            const pct = total > 0 ? Math.round((counts[grade] / total) * 100) : 0;
            const target = Math.round(GRADE_META[grade].target * 100);
            return (
              <div key={grade} className="flex items-baseline gap-2.5 text-sm">
                <span
                  className="h-2.5 w-2.5 flex-none self-center rounded-full border border-hairline-soft"
                  style={{ background: GRADE_SEGMENT_COLORS[grade] }}
                />
                <span className="text-base font-semibold tabular-nums">
                  {counts[grade].toLocaleString("ko-KR")}명
                </span>
                <span className="text-ink-400">
                  {grade}등급 · {pct}%
                </span>
                <span
                  className={`text-xs tabular-nums ${Math.abs(pct - target) > 10 ? "font-semibold text-alert-deep" : "text-ink-300"}`}
                >
                  권장 {target}%
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card
        title="등급 조정"
        subtitle="성과급은 등급 연동으로 자동 재산정됩니다 (S 35% · A 20% · B 11% · C 5%)"
        padding="flush"
      >
        <div className="flex flex-wrap items-center gap-3 px-7 pb-2 pt-2">
          <div className="flex h-10 min-w-64 flex-1 items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4">
            <Search size={15} className="flex-none text-ink-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="성명 또는 사번 검색"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
              aria-label="보정 대상 검색"
            />
          </div>
          <Select
            options={[
              { value: ALL, label: "전체 팀" },
              ...ORG_UNITS.map((u) => ({ value: u.dept, label: u.dept })),
            ]}
            value={dept}
            onChange={(value) => {
              setDept(value);
              setPage(0);
            }}
            ariaLabel="팀 필터"
            className="w-52"
          />
        </div>

        <div className="nx-scroll overflow-x-auto px-4 pb-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">사번</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">성명</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">소속 부서</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">현재 연봉</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">컴파라티오</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">OKR 달성률</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">잠재력</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">성과 등급</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">성과급</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-hairline-soft transition-colors last:border-none hover:bg-canvas"
                >
                  <td className="whitespace-nowrap px-3.5 py-3 text-xs tabular-nums text-ink-400">
                    {employee.id}
                  </td>
                  <td className="px-3.5 py-3">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(employee.id)}
                      className="flex items-center gap-2.5 text-left"
                    >
                      <Avatar name={employee.name} size={32} />
                      <span>
                        <span className="block font-semibold text-ink hover:text-cobalt">
                          {employee.name}
                        </span>
                        <span className="block text-xs text-ink-400">
                          {employee.position} · {employee.role}
                        </span>
                      </span>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-ink-500">
                    {employee.dept}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                    {fmtWon(employee.salary)}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                    {fmtCompa(employee.compaRatio)}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                    {employee.okrRate}%
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <Badge tone={employee.potential === 3 ? "mint" : employee.potential === 2 ? "neutral" : "warning"}>
                      {POTENTIAL_META[employee.potential].label}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <Select
                      size="sm"
                      options={gradeOptions}
                      value={employee.grade}
                      onChange={(value) =>
                        onChangeGrade(employee.id, value as PerformanceGrade)
                      }
                      ariaLabel={`${employee.name} 성과 등급`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right font-medium tabular-nums">
                    {fmtWon(employee.bonus)}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3.5 py-12 text-center text-sm text-ink-400">
                    조건에 맞는 임직원이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-hairline-soft px-7 py-4">
          <span className="text-[13px] tabular-nums text-ink-400">
            {total === 0
              ? "0명"
              : `${(safePage * PAGE_SIZE + 1).toLocaleString("ko-KR")} – ${Math.min(
                  (safePage + 1) * PAGE_SIZE,
                  total
                ).toLocaleString("ko-KR")} / ${total.toLocaleString("ko-KR")}명`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={14} />}
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              이전
            </Button>
            <span className="px-2 text-[13px] tabular-nums text-ink-500">
              {safePage + 1} / {pageCount.toLocaleString("ko-KR")}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight size={14} />}
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
