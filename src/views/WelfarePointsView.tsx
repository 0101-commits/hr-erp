import { Coins, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { fmtEok, fmtWon, type Employee } from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatCard } from "../components/ui/StatCard";

interface WelfarePointsViewProps {
  currentUser: Employee;
  employees: Employee[];
}

/* 내 포인트 사용 내역 mock — 복지몰 카테고리 기준 */
const MY_USAGE_HISTORY = [
  { id: "wp-1", date: "2026-06-02", category: "건강", item: "종합 건강검진 업그레이드", amount: 450000 },
  { id: "wp-2", date: "2026-05-21", category: "자기계발", item: "반도체 공정 전문 교육 수강권", amount: 380000 },
  { id: "wp-3", date: "2026-05-09", category: "여가", item: "리조트 숙박권 (2박)", amount: 520000 },
  { id: "wp-4", date: "2026-04-18", category: "리빙", item: "복지몰 생활가전 구매", amount: 310000 },
  { id: "wp-5", date: "2026-03-27", category: "건강", item: "피트니스 연간 이용권", amount: 600000 },
];

const CATEGORY_COLORS = ["#000000", "#3F3F46", "#C1FBD4", "#D4F9E0"];
const CATEGORY_TONES: Record<string, "ink" | "neutral" | "mint" | "pistachio"> = {
  건강: "ink",
  자기계발: "neutral",
  여가: "mint",
  리빙: "pistachio",
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #E4E4E7",
  background: "#FFFFFF",
  fontSize: 13,
  boxShadow: "rgba(20, 22, 26, 0.1) 0px 4px 12px",
};

export function WelfarePointsView({
  currentUser,
  employees,
}: WelfarePointsViewProps) {
  const myRemaining = currentUser.welfare - currentUser.welfareUsed;
  const myUsagePct = Math.round((currentUser.welfareUsed / currentUser.welfare) * 100);

  const { totalGranted, totalUsed, categoryData } = useMemo(() => {
    const granted = employees.reduce((sum, e) => sum + e.welfare, 0);
    const used = employees.reduce((sum, e) => sum + e.welfareUsed, 0);
    /* 전사 카테고리 사용 분포 — 사용 총액을 카테고리 비중으로 환산 */
    const ratios: [string, number][] = [
      ["건강", 0.38],
      ["자기계발", 0.24],
      ["여가", 0.22],
      ["리빙", 0.16],
    ];
    return {
      totalGranted: granted,
      totalUsed: used,
      categoryData: ratios.map(([name, ratio]) => ({
        name,
        value: Math.round(used * ratio),
      })),
    };
  }, [employees]);

  return (
    <div>
      <PageHeader
        breadcrumb={["복리후생 & 지원", "맞춤형 복지 선택", "사내 복지 포인트 관리"]}
        title="사내 복지 포인트 관리"
        subtitle="임직원별 포인트 부여와 사용 내역 실시간 차감 · 정산 — 미사용 포인트는 매년 12월 31일 소멸됩니다."
        actions={
          <Badge tone="mint" dot>
            전사 사용률 {Math.round((totalUsed / totalGranted) * 100)}%
          </Badge>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Card
          title="내 복지 포인트"
          subtitle={`${currentUser.name} · 2026년 부여분`}
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Coins size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="rounded-field bg-canvas p-6 text-center">
            <div className="type-label">사용 가능 잔액</div>
            <div className="type-display mt-1 text-[36px] tabular-nums">
              {fmtWon(myRemaining)}
            </div>
            <p className="mt-1 text-xs text-ink-400">
              부여 {fmtWon(currentUser.welfare)} · 사용 {fmtWon(currentUser.welfareUsed)}
            </p>
          </div>
          <div className="mt-5">
            <ProgressBar
              label="소진율"
              value={currentUser.welfareUsed}
              max={currentUser.welfare}
              display={`${myUsagePct}%`}
              tone={myUsagePct > 85 ? "alert" : "mint"}
            />
            <p className="mt-2 text-xs text-ink-400">
              잔여 포인트는 12월 31일 자정 이후 자동 소멸됩니다
            </p>
          </div>
        </Card>

        <Card
          title="내 사용 내역"
          subtitle="결제 즉시 실시간 차감 · 정산"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <ShoppingBag size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <ul className="flex flex-col">
            {MY_USAGE_HISTORY.map((usage) => (
              <li
                key={usage.id}
                className="flex items-center gap-3 border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
              >
                <Badge tone={CATEGORY_TONES[usage.category] ?? "neutral"}>
                  {usage.category}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{usage.item}</p>
                  <p className="text-xs tabular-nums text-ink-400">{usage.date}</p>
                </div>
                <span className="text-[13px] font-semibold tabular-nums">
                  -{fmtWon(usage.amount)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="전사 포인트 운영 현황" subtitle="카테고리별 사용 분포">
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={54}
                  outerRadius={82}
                  paddingAngle={2}
                  strokeWidth={0}
                  isAnimationActive={false}
                >
                  {categoryData.map((slice, index) => (
                    <Cell key={slice.name} fill={CATEGORY_COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => fmtWon(Number(value))}
                  contentStyle={tooltipStyle}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {categoryData.map((slice, index) => (
              <div
                key={slice.name}
                className="flex items-center gap-2.5 text-[13px] text-ink-500"
              >
                <span
                  className="h-2.5 w-2.5 flex-none rounded-[3px] border border-hairline-soft"
                  style={{ background: CATEGORY_COLORS[index] }}
                />
                {slice.name}
                <span className="ml-auto font-medium tabular-nums text-ink">
                  {fmtEok(slice.value)} 원
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-hairline-soft pt-5">
            <StatCard label="총 부여" value={`${fmtEok(totalGranted)} 원`} detail={`${employees.length.toLocaleString("ko-KR")}명`} />
            <StatCard label="총 사용" value={`${fmtEok(totalUsed)} 원`} detail="실시간 차감 반영" accent="mint" />
          </div>
        </Card>
      </div>
    </div>
  );
}
