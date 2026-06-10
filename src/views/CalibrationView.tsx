import { ShieldCheck } from "lucide-react";
import {
  fmtCompa,
  fmtWon,
  GRADE_META,
  GRADES,
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

export function CalibrationView({
  employees,
  onChangeGrade,
  onFinalize,
  onOpenProfile,
}: CalibrationViewProps) {
  const total = employees.length;
  const counts = GRADES.reduce<Record<PerformanceGrade, number>>(
    (acc, grade) => {
      acc[grade] = employees.filter((e) => e.grade === grade).length;
      return acc;
    },
    { S: 0, A: 0, B: 0, C: 0 }
  );

  const gradeOptions = GRADES.map((g) => ({
    value: g,
    label: `${g} · ${GRADE_META[g].desc}`,
  }));

  return (
    <div>
      <PageHeader
        breadcrumb={["허브", "성과 등급 보정"]}
        title="성과 등급 보정"
        subtitle="2026 상반기 보정 세션 · 핵심 인재풀 15명 — 등급을 변경하면 성과급과 메리트 시뮬레이터, 탤런트 보드에 즉시 반영됩니다."
        actions={
          <Button variant="cobalt" icon={<ShieldCheck size={16} />} onClick={onFinalize}>
            보정 결과 확정
          </Button>
        }
      />

      <Card
        title="성과 분포"
        subtitle="권장 분포 곡선 (S 10% · A 25% · B 50% · C 15%) 대비 현재 보정 상태"
        className="mb-6"
      >
        <div className="flex h-3.5 overflow-hidden rounded-full bg-hairline-soft">
          {GRADES.map((grade) => (
            <div
              key={grade}
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${(counts[grade] / total) * 100}%`,
                background: GRADE_SEGMENT_COLORS[grade],
              }}
            />
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {GRADES.map((grade) => {
            const pct = Math.round((counts[grade] / total) * 100);
            const target = Math.round(GRADE_META[grade].target * 100);
            return (
              <div key={grade} className="flex items-baseline gap-2.5 text-sm">
                <span
                  className="h-2.5 w-2.5 flex-none self-center rounded-full border border-hairline-soft"
                  style={{ background: GRADE_SEGMENT_COLORS[grade] }}
                />
                <span className="text-base font-semibold tabular-nums">
                  {counts[grade]}명
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
        <div className="nx-scroll overflow-x-auto px-4 pb-4">
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
              {employees.map((employee) => (
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
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
