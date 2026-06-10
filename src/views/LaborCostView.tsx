import { TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fmtEok,
  fmtKorean,
  type Employee,
} from "../data/mockData";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Slider } from "../components/ui/Slider";
import { StatCard } from "../components/ui/StatCard";

interface LaborCostViewProps {
  employees: Employee[];
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E4E4E7",
  background: "#FFFFFF",
  fontSize: 13,
  boxShadow: "rgba(20, 22, 26, 0.1) 0px 4px 12px",
};

/* 월별 인건비 추이 변동 계수 (1~6월 실적 · 7~12월 계획) */
const MONTH_FACTORS = [0.97, 0.98, 1.06, 0.99, 1.0, 1.01, 1.0, 1.0, 1.08, 1.0, 1.01, 1.18];

export function LaborCostView({ employees }: LaborCostViewProps) {
  const [hireCount, setHireCount] = useState(60);
  const [hireSalary, setHireSalary] = useState(72000000);

  const { totalPayroll, divisionData, monthly } = useMemo(() => {
    const total = employees.reduce((sum, e) => sum + e.salary + e.bonus + e.welfare, 0);

    const byDivision = new Map<string, number>();
    for (const e of employees) {
      const key = `${e.division}`;
      byDivision.set(key, (byDivision.get(key) ?? 0) + e.salary + e.bonus + e.welfare);
    }
    const divisions = Array.from(byDivision.entries())
      .map(([name, cost]) => ({ name, cost: Math.round(cost) }))
      .sort((a, b) => b.cost - a.cost);

    const monthlyBase = total / 12;
    const months = MONTH_FACTORS.map((factor, index) => ({
      month: `${index + 1}월`,
      cost: Math.round(monthlyBase * factor),
      planned: index >= 6,
    }));

    return { totalPayroll: total, divisionData: divisions, monthly: months };
  }, [employees]);

  /* 채용 계획 비용 예측 — 신규 인원 × (연봉 + 성과급·복리후생 부대비용 22%) */
  const hireCost = hireCount * hireSalary * 1.22;
  const projectedTotal = totalPayroll + hireCost;

  return (
    <div>
      <PageHeader
        breadcrumb={["급여 & 보상 정산", "경영 비용 분석", "인력 운영비 다각도 리포트"]}
        title="인력 운영비 다각도 리포트"
        subtitle="부서별/직무별 인건비 추이 통계 분석과 향후 채용 계획에 따른 비용 예측 — 총보상(연봉+성과급+복리후생) 기준."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="연간 총 인력 운영비"
          value={`${fmtEok(totalPayroll)} 원`}
          detail={`${employees.length.toLocaleString("ko-KR")}명 · 총보상 기준`}
          accent="mint"
        />
        <StatCard
          label="1인당 평균 운영비"
          value={fmtKorean(totalPayroll / employees.length)}
          detail="연간 · 부대비용 제외"
        />
        <StatCard
          label="채용 반영 예상 운영비"
          value={`${fmtEok(projectedTotal)} 원`}
          detail={`신규 ${hireCount}명 채용 시 +${fmtEok(hireCost)}`}
          accent={hireCost > totalPayroll * 0.05 ? "alert" : "none"}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Card
          title="부문별 인건비 분포"
          subtitle="연간 총보상 합계 — 막대에 마우스를 올리면 금액이 표시됩니다"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={divisionData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#A1A1AA" }}
                  tickFormatter={(value) => fmtEok(Number(value))}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tickLine={false}
                  axisLine={{ stroke: "#E4E4E7" }}
                  tick={{ fontSize: 12, fill: "#3F3F46" }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                  formatter={(value) => [fmtKorean(Number(value)), "연간 인건비"]}
                  contentStyle={tooltipStyle}
                />
                <Bar dataKey="cost" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {divisionData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={index === 0 ? "#000000" : index === 1 ? "#3F3F46" : "#C1FBD4"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card
          title="월별 인건비 추이"
          subtitle="1–6월 실적 · 7–12월 계획 (성과급 지급월 반영)"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly} margin={{ top: 8, right: 12, left: 4, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: "#E4E4E7" }}
                  tick={{ fontSize: 11, fill: "#71717A" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#A1A1AA" }}
                  tickFormatter={(value) => fmtEok(Number(value))}
                  width={48}
                  domain={["dataMin - 1000000000", "dataMax + 1000000000"]}
                />
                <Tooltip
                  formatter={(value) => [fmtKorean(Number(value)), "인건비"]}
                  contentStyle={tooltipStyle}
                />
                <Line
                  type="monotone"
                  dataKey="cost"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#000000" }}
                  activeDot={{ r: 5, fill: "#C1FBD4", stroke: "#000000" }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card
        title="채용 계획 비용 예측"
        subtitle="신규 채용 인원과 평균 제시 연봉을 조정하면 연간 운영비 영향이 즉시 계산됩니다"
        className="mt-6"
        action={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
            <TrendingUp size={16} strokeWidth={1.75} />
          </span>
        }
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-[13px] font-medium">2026 하반기 신규 채용 인원</span>
              <span className="text-xl font-semibold tabular-nums">{hireCount}명</span>
            </div>
            <Slider
              min={0}
              max={300}
              step={5}
              value={hireCount}
              onChange={setHireCount}
              ariaLabel="신규 채용 인원"
            />
          </div>
          <div>
            <div className="mb-2.5 flex items-baseline justify-between">
              <span className="text-[13px] font-medium">평균 제시 연봉</span>
              <span className="text-xl font-semibold tabular-nums">
                {fmtKorean(hireSalary)}
              </span>
            </div>
            <Slider
              min={50000000}
              max={150000000}
              step={1000000}
              value={hireSalary}
              onChange={setHireSalary}
              ariaLabel="평균 제시 연봉"
            />
          </div>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            label="추가 연간 비용"
            value={`+${fmtEok(hireCost)} 원`}
            detail="부대비용 22% 포함 (4대보험·복리후생)"
          />
          <StatCard
            label="운영비 증가율"
            value={`+${((hireCost / totalPayroll) * 100).toFixed(1)}%`}
            detail="현재 총 운영비 대비"
          />
          <StatCard
            label="예상 총원"
            value={`${(employees.length + hireCount).toLocaleString("ko-KR")}명`}
            detail="채용 계획 반영 시"
            accent="mint"
          />
        </div>
      </Card>
    </div>
  );
}
