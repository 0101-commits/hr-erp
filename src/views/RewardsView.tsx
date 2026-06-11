import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import {
  fmtEok,
  fmtKorean,
  fmtWon,
  GRADE_META,
  ORG_UNITS,
  type Employee,
  type PerformanceGrade,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";

interface RewardsViewProps {
  employees: Employee[];
  raisePct: Record<PerformanceGrade, number>;
  selectedId: string;
  onSelect: (employeeId: string) => void;
}

/* 모노톤-민트 차트 팔레트: 잉크 블랙 · 알로에 민트 · 피스타치오 */
const CHART_COLORS = ["#000000", "#C1FBD4", "#D4F9E0"];

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E4E4E7",
  background: "#FFFFFF",
  fontSize: 13,
  boxShadow: "rgba(20, 22, 26, 0.1) 0px 4px 12px",
};

export function RewardsView({
  employees,
  raisePct,
  selectedId,
  onSelect,
}: RewardsViewProps) {
  const employee =
    employees.find((e) => e.id === selectedId) ?? employees[0];
  const totalComp = employee.salary + employee.bonus + employee.welfare;

  const pieData = [
    { name: "기본 연봉", value: employee.salary },
    { name: "성과급", value: employee.bonus },
    { name: "복리후생 포인트", value: employee.welfare },
  ];

  /* 같은 팀 동료만 셀렉트에 노출 — 3,000명 전체 나열 방지 */
  const deptMembers = useMemo(
    () => employees.filter((e) => e.dept === employee.dept),
    [employees, employee.dept]
  );

  /* 시뮬레이션 총보상 상위 15명 비교 차트 */
  const barData = useMemo(() => {
    return employees
      .map((e) => {
        const simSalary = e.salary * (1 + raisePct[e.grade] / 100);
        return {
          id: e.id,
          name: e.name,
          total: Math.round(simSalary + e.bonus + e.welfare),
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);
  }, [employees, raisePct]);

  return (
    <div>
      <PageHeader
        breadcrumb={["급여 & 보상 정산", "보상 구성", "통합 보상 포털"]}
        title="통합 보상 포털"
        help="통합 보상(Total Rewards)은 기본 연봉뿐 아니라 성과급·복리후생·주식 보상(RSU)까지 합쳐 개인이 받는 전체 보상을 한눈에 보는 관점입니다."
        subtitle="기본 연봉 · 성과급 · 복리후생 · RSU를 개인별 총보상 관점으로 — 보정 등급과 인상률이 차트에 실시간 반영됩니다."
        actions={
          <>
            <Select
              options={ORG_UNITS.map((unit) => ({
                value: unit.dept,
                label: unit.dept,
              }))}
              value={employee.dept}
              onChange={(dept) => {
                const first = employees.find((e) => e.dept === dept);
                if (first) onSelect(first.id);
              }}
              ariaLabel="팀 선택"
              className="w-48"
            />
            <Select
              options={deptMembers.map((e) => ({
                value: e.id,
                label: `${e.name} · ${e.position}`,
              }))}
              value={employee.id}
              onChange={onSelect}
              ariaLabel="임직원 선택"
              className="w-52"
            />
          </>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Card title="총보상 구성" subtitle="현금성 보상 기준 (RSU 제외)">
          <div className="flex items-center gap-3.5">
            <Avatar name={employee.name} size={48} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{employee.name}</span>
                <Badge
                  tone={employee.grade === "S" ? "ink" : employee.grade === "A" ? "mint" : "neutral"}
                >
                  {employee.grade} · {GRADE_META[employee.grade].desc}
                </Badge>
              </div>
              <p className="text-[13px] text-ink-400">
                {employee.dept} · {employee.position} · {employee.id}
              </p>
            </div>
          </div>

          <div className="type-label mt-6">연간 총보상</div>
          <div className="type-display mt-1 text-[36px] tabular-nums">
            {fmtWon(totalComp)}
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={64}
                  outerRadius={96}
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {pieData.map((slice, index) => (
                    <Cell key={slice.name} fill={CHART_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmtWon(Number(value))}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-col gap-2.5">
            {pieData.map((slice, index) => (
              <div
                key={slice.name}
                className="flex items-center gap-2.5 text-[13px] text-ink-500"
              >
                <span
                  className="h-2.5 w-2.5 flex-none rounded-[3px] border border-hairline-soft"
                  style={{ background: CHART_COLORS[index] }}
                />
                <span>
                  {slice.name} · {Math.round((slice.value / totalComp) * 100)}%
                </span>
                <span className="ml-auto font-medium tabular-nums text-ink">
                  {fmtWon(slice.value)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="RSU 부여 및 귀속 일정"
          help="RSU(양도제한 조건부 주식)는 일정 기간 재직 등 조건을 충족하면 본인 소유로 확정(귀속)되어 주식으로 받는 보상입니다. 귀속 전에 퇴사하면 잔여분은 소멸됩니다."
          subtitle="귀속 완료분은 부여 시점 평가액 기준"
        >
          {employee.rsu.length === 0 ? (
            <div className="rounded-field border border-dashed border-hairline p-10 text-center">
              <p className="text-sm font-medium">부여된 RSU가 없습니다</p>
              <p className="mt-1 text-[13px] text-ink-400">
                차기 핵심인재 리뷰에서 부여 대상 여부를 검토할 수 있어요.
              </p>
            </div>
          ) : (
            <ul className="relative ml-2 border-l border-hairline pl-7">
              {employee.rsu.map((grant) => (
                <li
                  key={grant.date + grant.note}
                  className="relative pb-6 last:pb-1"
                >
                  <span
                    className={`absolute -left-[35px] top-1 h-3 w-3 rounded-full border-2 ${
                      grant.vested
                        ? "border-ink bg-ink"
                        : "border-hairline bg-surface"
                    }`}
                  />
                  <div className="text-xs tabular-nums text-ink-400">
                    {grant.date}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-medium">
                    {grant.note}
                    <Badge tone={grant.vested ? "mint" : "neutral"}>
                      {grant.vested ? "귀속 완료" : "귀속 예정"}
                    </Badge>
                  </div>
                  <div className="mt-0.5 text-[13px] tabular-nums text-ink-400">
                    {grant.units.toLocaleString("ko-KR")}주
                    {grant.vested && grant.value > 0
                      ? ` · 평가액 ${fmtKorean(grant.value)}`
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card
        title="전사 총보상 상위 15명"
        subtitle="인상률 시뮬레이션 반영 연간 총보상 — 막대를 클릭하면 해당 임직원으로 전환됩니다"
        className="mt-6"
      >
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: "#E4E4E7" }}
                tick={{ fontSize: 12, fill: "#71717A" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#A1A1AA" }}
                tickFormatter={(value) => fmtEok(Number(value))}
                width={48}
              />
              <Tooltip
                cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                formatter={(value) => [fmtWon(Number(value)), "시뮬레이션 총보상"]}
                contentStyle={tooltipStyle}
              />
              <Bar
                dataKey="total"
                radius={[6, 6, 0, 0]}
                isAnimationActive={false}
                className="cursor-pointer"
                onClick={(entry) => {
                  const payload = entry as unknown as { id?: string };
                  if (payload.id) onSelect(payload.id);
                }}
              >
                {barData.map((bar) => (
                  <Cell
                    key={bar.id}
                    fill={bar.id === employee.id ? "#C1FBD4" : "#000000"}
                    stroke={bar.id === employee.id ? "#0C6B44" : "none"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
