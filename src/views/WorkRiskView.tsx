import { AlertTriangle, BellRing, ShieldAlert } from "lucide-react";
import { useMemo } from "react";
import {
  fmtHours,
  RISK_DANGER_HOURS,
  RISK_WARN_HOURS,
  WEEKLY_CAP_HOURS,
  type Employee,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatCard } from "../components/ui/StatCard";

interface WorkRiskViewProps {
  employees: Employee[];
  showToast: (message: string) => void;
  onOpenProfile: (employeeId: string) => void;
}

export function WorkRiskView({
  employees,
  showToast,
  onOpenProfile,
}: WorkRiskViewProps) {
  const { danger, warn, deptRank } = useMemo(() => {
    const dangerList = employees
      .filter((e) => e.weekHours >= RISK_DANGER_HOURS)
      .sort((a, b) => b.weekHours - a.weekHours);
    const warnList = employees
      .filter(
        (e) => e.weekHours >= RISK_WARN_HOURS && e.weekHours < RISK_DANGER_HOURS
      )
      .sort((a, b) => b.weekHours - a.weekHours);

    const byDept = new Map<string, { sum: number; count: number; risky: number }>();
    for (const e of employees) {
      const stat = byDept.get(e.dept) ?? { sum: 0, count: 0, risky: 0 };
      stat.sum += e.weekHours;
      stat.count += 1;
      if (e.weekHours >= RISK_WARN_HOURS) stat.risky += 1;
      byDept.set(e.dept, stat);
    }
    const rank = Array.from(byDept.entries())
      .map(([dept, stat]) => ({
        dept,
        avg: stat.sum / stat.count,
        risky: stat.risky,
        count: stat.count,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 6);

    return { danger: dangerList, warn: warnList, deptRank: rank };
  }, [employees]);

  const riskTotal = danger.length + warn.length;

  return (
    <div>
      <PageHeader
        breadcrumb={["근태 & 시간 관리", "근로 시간 제어", "근로 제한 위험 알림"]}
        title="근로 제한 위험 알림"
        subtitle={`주 ${WEEKLY_CAP_HOURS}시간 한도 근접 대상자를 자동 추출하고 조직장에게 사전 경고를 발송합니다 — 이번 주 예상 근로시간 기준.`}
        actions={
          <Button
            variant="cobalt"
            icon={<BellRing size={15} />}
            onClick={() =>
              showToast(
                `조직장 ${deptRank.length}명에게 사전 경고 알림을 발송했어요`
              )
            }
          >
            조직장 사전 경고 발송
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="초과 임박 (50시간 이상)"
          value={`${danger.length}명`}
          detail="즉시 근무 조정 필요"
          accent="alert"
        />
        <StatCard
          label="주의 (48–50시간)"
          help="HRBP(HR Business Partner)는 특정 사업부를 전담하며 현장 가까이에서 인사 업무를 지원하는 인사 담당자입니다."
          value={`${warn.length}명`}
          detail="HRBP 집중 관찰 대상"
        />
        <StatCard
          label="정상 범위"
          value={`${(employees.length - riskTotal).toLocaleString("ko-KR")}명`}
          detail={`전체의 ${Math.round(((employees.length - riskTotal) / employees.length) * 100)}%`}
          accent="mint"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[7fr_5fr]">
        <Card
          title="한도 근접 대상자 자동 추출"
          subtitle={`주 ${RISK_WARN_HOURS}시간 이상 ${riskTotal.toLocaleString("ko-KR")}명 중 상위 인원 — 이름을 클릭하면 프로필이 열립니다`}
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <ShieldAlert size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <ul className="flex flex-col">
            {[...danger, ...warn].slice(0, 14).map((e) => {
              const isDanger = e.weekHours >= RISK_DANGER_HOURS;
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-3.5 border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                >
                  <button
                    type="button"
                    onClick={() => onOpenProfile(e.id)}
                    className="flex min-w-0 w-52 flex-none items-center gap-2.5 text-left"
                  >
                    <Avatar name={e.name} size={32} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold hover:text-cobalt">
                        {e.name}
                      </span>
                      <span className="block truncate text-xs text-ink-400">
                        {e.dept} · {e.position}
                      </span>
                    </span>
                  </button>
                  <div className="min-w-0 flex-1">
                    <ProgressBar
                      value={e.weekHours}
                      max={WEEKLY_CAP_HOURS}
                      tone={isDanger ? "alert" : "ink"}
                      height={6}
                    />
                  </div>
                  <span className="w-24 flex-none text-right text-[13px] font-semibold tabular-nums">
                    {fmtHours(e.weekHours)}
                  </span>
                  <Badge tone={isDanger ? "critical" : "warning"}>
                    {isDanger ? "초과 임박" : "주의"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card
          title="부서별 평균 근로시간"
          subtitle="평균이 높은 순 — 한도 근접 인원이 많은 조직부터 개입하세요"
        >
          <ul className="flex flex-col gap-4">
            {deptRank.map((row) => (
              <li key={row.dept}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-medium">{row.dept}</span>
                  <span className="text-[13px] font-semibold tabular-nums">
                    평균 {row.avg.toFixed(1)}시간
                  </span>
                </div>
                <ProgressBar
                  value={row.avg}
                  max={WEEKLY_CAP_HOURS}
                  tone={row.avg >= RISK_WARN_HOURS ? "alert" : "mint"}
                  height={6}
                />
                <p className="mt-1 text-xs text-ink-400">
                  재적 {row.count.toLocaleString("ko-KR")}명 · 한도 근접{" "}
                  <strong className={row.risky > 0 ? "text-alert-deep" : ""}>
                    {row.risky}명
                  </strong>
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-start gap-2.5 rounded-field bg-canvas p-4 text-xs leading-relaxed text-ink-400">
            <AlertTriangle size={14} className="mt-0.5 flex-none text-alert-deep" />
            주 50시간 도달 시 해당 임직원과 조직장에게 자동 알림이 발송되며, 52시간
            도달 시 시스템이 추가 근무 입력을 차단합니다.
          </div>
        </Card>
      </div>
    </div>
  );
}
