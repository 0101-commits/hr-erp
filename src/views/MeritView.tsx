import { AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import {
  BUDGET_POOL,
  fmtCompa,
  fmtEok,
  fmtKorean,
  fmtWon,
  GRADE_META,
  GRADES,
  gradeHeadcount,
  simTotal,
  tierAvgSalary,
  WORKFORCE_SIZE,
  type Employee,
  type PerformanceGrade,
} from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Slider } from "../components/ui/Slider";
import { StatCard } from "../components/ui/StatCard";

interface MeritViewProps {
  employees: Employee[];
  raisePct: Record<PerformanceGrade, number>;
  onChangeRaise: (grade: PerformanceGrade, value: number) => void;
  onReset: () => void;
}

const GRADE_BADGE_TONES: Record<PerformanceGrade, "ink" | "mint" | "neutral" | "warning"> = {
  S: "ink",
  A: "mint",
  B: "neutral",
  C: "warning",
};

export function MeritView({
  employees,
  raisePct,
  onChangeRaise,
  onReset,
}: MeritViewProps) {
  const total = simTotal(employees, raisePct);
  const remaining = BUDGET_POOL - total;
  const over = remaining < 0;
  const usagePct = Math.round((total / BUDGET_POOL) * 100);

  /* 개인별 미리보기 — 연봉 상위 20명 */
  const previewRows = useMemo(
    () => [...employees].sort((a, b) => b.salary - a.salary).slice(0, 20),
    [employees]
  );

  return (
    <div>
      <PageHeader
        breadcrumb={["허브", "메리트 매트릭스 시뮬레이터"]}
        title="메리트 매트릭스 시뮬레이터"
        subtitle={`전사 ${WORKFORCE_SIZE.toLocaleString("ko-KR")}명 전수 시뮬레이션 · 총 예산 ${fmtEok(BUDGET_POOL)} 원 — 등급별 인원과 평균 연봉은 보정 결과와 실시간 연동됩니다.`}
        actions={
          <Button variant="secondary" icon={<RotateCcw size={15} />} onClick={onReset}>
            기본값으로 되돌리기
          </Button>
        }
      />

      {over ? (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-field bg-alert-wash px-6 py-4 text-sm font-semibold text-alert-deep"
        >
          <AlertTriangle size={18} />
          <span>시뮬레이션 예산 초과 — 인상률을 조정해 주세요</span>
          <span className="ml-auto font-medium tabular-nums opacity-90">
            {fmtKorean(-remaining)} 초과
          </span>
        </div>
      ) : (
        <div className="mb-6 flex items-center gap-3 rounded-field bg-mint px-6 py-4 text-sm font-semibold text-ink">
          <CheckCircle2 size={18} className="text-mint-deep" />
          <span>
            Stable — 안정적인 재정 호라이즌, 예산 풀 내에서 운용 중입니다
          </span>
          <span className="ml-auto font-medium tabular-nums text-mint-deep">
            잔여 {fmtKorean(remaining)}
          </span>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="총 예산 풀"
          value={`${fmtEok(BUDGET_POOL)} 원`}
          detail={`2026 메리트 사이클 · ${WORKFORCE_SIZE.toLocaleString("ko-KR")}명 규모 기준`}
        />
        <StatCard
          label="인상 소요 합계"
          value={`${fmtEok(total)} 원`}
          detail={`예산의 ${usagePct}% 소진`}
          accent={over ? "alert" : "mint"}
        />
        <StatCard
          label="잔여 예산"
          value={`${over ? "-" : ""}${fmtEok(Math.abs(remaining))} 원`}
          detail={over ? "한도 초과 — 조정 필요" : "운용 가능"}
          accent={over ? "alert" : "none"}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[7fr_5fr]">
        <Card
          title="등급별 인상률"
          subtitle="슬라이더를 움직이면 인상 소요액이 즉시 재계산됩니다 (0 – 20%)"
        >
          <div className="flex flex-col">
            {GRADES.map((grade) => {
              const headcount = gradeHeadcount(employees, grade);
              const avg = tierAvgSalary(employees, grade);
              const cost = headcount * avg * (raisePct[grade] / 100);
              return (
                <div
                  key={grade}
                  className="border-b border-hairline-soft py-5 first:pt-1 last:border-none last:pb-1"
                >
                  <div className="mb-3 flex items-baseline gap-3">
                    <Badge tone={GRADE_BADGE_TONES[grade]}>
                      {grade} · {GRADE_META[grade].desc}
                    </Badge>
                    <span className="text-[13px] text-ink-400">
                      {headcount.toLocaleString("ko-KR")}명 · 평균 연봉 {fmtKorean(avg)}
                    </span>
                    <span className="ml-auto text-xl font-semibold tabular-nums">
                      {raisePct[grade].toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <Slider
                      min={0}
                      max={20}
                      step={0.5}
                      value={raisePct[grade]}
                      onChange={(value) => onChangeRaise(grade, value)}
                      ariaLabel={`${grade}등급 인상률`}
                    />
                    <span className="w-32 flex-none text-right text-[13px] font-medium tabular-nums text-ink-500">
                      {fmtKorean(cost)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-field bg-canvas p-5">
            <ProgressBar
              label="예산 소진율"
              value={Math.min(total, BUDGET_POOL)}
              max={BUDGET_POOL}
              display={`${usagePct}%`}
              tone={over ? "alert" : usagePct > 85 ? "ink" : "mint"}
            />
          </div>
        </Card>

        <Card
          title="개인별 인상 미리보기"
          subtitle="연봉 상위 20명 표시 · 보정 등급과 인상률 실시간 반영"
          padding="flush"
        >
          <div className="nx-scroll overflow-x-auto px-4 pb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-label px-3.5 py-3 text-left">성명</th>
                  <th className="type-label px-3.5 py-3 text-left">등급</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">인상액</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">시뮬레이션 연봉</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">신규 컴파라티오</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.map((employee) => {
                  const raise = employee.salary * (raisePct[employee.grade] / 100);
                  const newCompa =
                    employee.compaRatio * (1 + raisePct[employee.grade] / 100);
                  return (
                    <tr
                      key={employee.id}
                      className="border-b border-hairline-soft transition-colors last:border-none hover:bg-canvas"
                    >
                      <td className="whitespace-nowrap px-3.5 py-3 font-semibold">
                        {employee.name}
                      </td>
                      <td className="px-3.5 py-3">
                        <Badge tone={GRADE_BADGE_TONES[employee.grade]}>
                          {employee.grade}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums text-mint-deep">
                        +{fmtKorean(raise)}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-right font-medium tabular-nums">
                        {fmtWon(employee.salary + raise)}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums text-ink-500">
                        {fmtCompa(newCompa)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
