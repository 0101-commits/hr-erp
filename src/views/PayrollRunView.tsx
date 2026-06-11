import { Banknote, CheckCircle2, CircleDashed, Play, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import {
  fmtEok,
  fmtKorean,
  type Employee,
} from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";

interface PayrollRunViewProps {
  employees: Employee[];
  showToast: (message: string) => void;
}

/* 2026년 4대보험 근로자 부담 요율 (시뮬레이션 기준) */
const INSURANCE_RATES = [
  { name: "국민연금", rate: 4.5, note: "기준소득월액 상한 적용" },
  { name: "건강보험", rate: 3.545, note: "보수월액 기준" },
  { name: "장기요양보험", rate: 0.4591, note: "건강보험료의 12.95%" },
  { name: "고용보험", rate: 0.9, note: "실업급여 요율" },
];

const RUN_STEPS = [
  "근태 마감 데이터 수집",
  "변동 수당 · 시간외 수당 산정",
  "4대보험 · 소득세 공제 계산",
  "이상치 자동 검증",
  "급여 이체 파일 생성",
];

export function PayrollRunView({ employees, showToast }: PayrollRunViewProps) {
  const [completedSteps, setCompletedSteps] = useState(3);

  const { monthlyBase, overtime, deptRows } = useMemo(() => {
    const base = employees.reduce((sum, e) => sum + e.salary / 12, 0);
    /* 시간외 수당 — 주 40시간 초과분 × 통상시급 150% 근사 */
    const ot = employees.reduce((sum, e) => {
      const extra = Math.max(0, e.weekHours - 40);
      return sum + extra * 4.345 * (e.salary / 12 / 209) * 1.5;
    }, 0);

    const byDept = new Map<string, { headcount: number; amount: number }>();
    for (const e of employees) {
      const stat = byDept.get(e.dept) ?? { headcount: 0, amount: 0 };
      stat.headcount += 1;
      stat.amount += e.salary / 12;
      byDept.set(e.dept, stat);
    }
    const rows = Array.from(byDept.entries())
      .map(([dept, stat]) => ({ dept, ...stat }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);

    return { monthlyBase: base, overtime: ot, deptRows: rows };
  }, [employees]);

  const insuranceTotal = INSURANCE_RATES.reduce(
    (sum, item) => sum + monthlyBase * (item.rate / 100),
    0
  );
  const grossTotal = monthlyBase + overtime;

  const runNext = () => {
    if (completedSteps >= RUN_STEPS.length) {
      showToast("6월 급여 정산이 이미 완료됐어요 — 이체 파일이 생성됐습니다");
      return;
    }
    const next = completedSteps + 1;
    setCompletedSteps(next);
    showToast(
      next === RUN_STEPS.length
        ? "6월 급여 정산 완료 — 급여 이체 파일이 생성됐어요"
        : `단계 완료 — ${RUN_STEPS[next - 1]}`
    );
  };

  return (
    <div>
      <PageHeader
        breadcrumb={["급여 & 보상 정산", "급여 운영", "월간 급여 정산"]}
        title="월간 급여 정산"
        subtitle="고정급 · 변동 수당 · 시간외 수당을 자동 산정하고 4대보험 요율을 실시간 연동합니다 — 2026년 6월 귀속분 정산."
        actions={
          <Button variant="cobalt" icon={<Play size={15} />} onClick={runNext}>
            {completedSteps >= RUN_STEPS.length ? "정산 완료됨" : "다음 단계 실행"}
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          label="총 지급 예정액"
          value={`${fmtEok(grossTotal)} 원`}
          detail={`${employees.length.toLocaleString("ko-KR")}명 · 6월 귀속`}
          accent="mint"
        />
        <StatCard
          label="고정급 합계"
          value={`${fmtEok(monthlyBase)} 원`}
          detail="기본 연봉 ÷ 12 기준"
        />
        <StatCard
          label="시간외 수당"
          value={`${fmtEok(overtime)} 원`}
          detail="주 40시간 초과분 × 150%"
        />
        <StatCard
          label="4대보험 공제 (근로자분)"
          value={`${fmtEok(insuranceTotal)} 원`}
          detail="요율 실시간 연동"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <div className="flex flex-col gap-6">
          <Card
            title="정산 사이클 진행 상태"
            subtitle={`${RUN_STEPS.length}단계 중 ${completedSteps}단계 완료`}
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <Banknote size={16} strokeWidth={1.75} />
              </span>
            }
          >
            <ol className="flex flex-col gap-1">
              {RUN_STEPS.map((step, index) => {
                const done = index < completedSteps;
                const isNext = index === completedSteps;
                return (
                  <li
                    key={step}
                    className={`flex items-center gap-3 rounded-field px-3.5 py-3 text-sm ${
                      isNext ? "bg-canvas font-semibold" : ""
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 size={17} className="flex-none text-mint-deep" />
                    ) : (
                      <CircleDashed
                        size={17}
                        className={`flex-none ${isNext ? "text-cobalt" : "text-ink-300"}`}
                      />
                    )}
                    <span className={done ? "text-ink-400 line-through" : ""}>
                      {step}
                    </span>
                    {isNext && <Badge tone="cobalt">진행 대기</Badge>}
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card
            title="4대보험 요율 연동"
            subtitle="2026년 근로자 부담분 — 변경 고시 시 자동 반영"
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <ShieldCheck size={16} strokeWidth={1.75} />
              </span>
            }
          >
            <ul className="flex flex-col">
              {INSURANCE_RATES.map((item) => (
                <li
                  key={item.name}
                  className="flex items-baseline gap-3 border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                >
                  <span className="w-28 flex-none text-sm font-medium">{item.name}</span>
                  <span className="text-lg font-semibold tabular-nums">
                    {item.rate}%
                  </span>
                  <span className="ml-auto text-xs text-ink-400">{item.note}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card
          title="부서별 지급 요약"
          subtitle="월 고정급 기준 상위 8개 팀"
          padding="flush"
        >
          <div className="nx-scroll overflow-x-auto px-4 pb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">팀</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">인원</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">월 지급액</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">1인 평균</th>
                </tr>
              </thead>
              <tbody>
                {deptRows.map((row) => (
                  <tr
                    key={row.dept}
                    className="border-b border-hairline-soft last:border-none hover:bg-canvas"
                  >
                    <td className="whitespace-nowrap px-3.5 py-3 font-medium">{row.dept}</td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                      {row.headcount.toLocaleString("ko-KR")}명
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                      {fmtKorean(row.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums text-ink-500">
                      {fmtKorean(row.amount / row.headcount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-hairline-soft px-7 py-4 text-xs text-ink-400">
            이상치 자동 검증 단계에서 전월 대비 ±30% 이상 변동된 지급 건은 검토
            대기함으로 분리됩니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
