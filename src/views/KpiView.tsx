import { Database, Gauge, RefreshCcw } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatCard } from "../components/ui/StatCard";

/* 정량 지표 중심 KPI — 데이터 소스 연동 자동 업데이트 mock */
const KPIS = [
  {
    id: "kpi-1", name: "종합 웨이퍼 수율", unit: "%", current: 88.4, target: 90,
    source: "MES", synced: "5분 전", milestone: "9월 양산 안정화 마일스톤",
  },
  {
    id: "kpi-2", name: "결함 밀도 (D0)", unit: "/cm²", current: 0.09, target: 0.08,
    source: "YMS", synced: "12분 전", milestone: "D2 라인 개선 TF", invert: true,
  },
  {
    id: "kpi-3", name: "월 웨이퍼 투입량", unit: "K장", current: 128, target: 140,
    source: "MES", synced: "5분 전", milestone: "P4 캐파 증설 2단계",
  },
  {
    id: "kpi-4", name: "고객 납기 준수율", unit: "%", current: 96.2, target: 98,
    source: "ERP", synced: "1시간 전", milestone: "북미 고객 QBR 약속 지표",
  },
  {
    id: "kpi-5", name: "인당 매출", unit: "억 원", current: 11.8, target: 12.5,
    source: "ERP", synced: "1시간 전", milestone: "2026 경영 목표",
  },
  {
    id: "kpi-6", name: "핵심 인재 유지율", unit: "%", current: 96.8, target: 97,
    source: "HRIS", synced: "방금", milestone: "리텐션 프로그램 2차",
  },
];

function attainment(kpi: (typeof KPIS)[number]): number {
  if (kpi.invert) {
    return Math.min(100, Math.round((kpi.target / kpi.current) * 100));
  }
  return Math.min(100, Math.round((kpi.current / kpi.target) * 100));
}

export function KpiView() {
  const avg = Math.round(
    KPIS.reduce((sum, kpi) => sum + attainment(kpi), 0) / KPIS.length
  );
  const achieved = KPIS.filter((kpi) => attainment(kpi) >= 100).length;
  const atRisk = KPIS.filter((kpi) => attainment(kpi) < 92).length;

  return (
    <div>
      <PageHeader
        breadcrumb={["성과 & 몰입 관리", "목표 정렬 프로세스", "KPI 실적 트래킹"]}
        title="KPI 실적 트래킹"
        subtitle="정량 지표 중심 마일스톤 관리 — MES · YMS · ERP · HRIS 데이터 소스와 연동되어 실적이 자동 업데이트됩니다."
        actions={
          <Badge tone="mint" dot>
            데이터 소스 4종 연동 중
          </Badge>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="평균 달성률" value={`${avg}%`} detail={`${KPIS.length}개 지표 기준`} accent="mint" />
        <StatCard label="목표 달성" value={`${achieved}개`} detail="달성률 100% 이상" />
        <StatCard label="리스크 지표" value={`${atRisk}개`} detail="달성률 92% 미만 — 점검 필요" accent={atRisk > 0 ? "alert" : "none"} />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {KPIS.map((kpi) => {
          const pct = attainment(kpi);
          const tone = pct >= 100 ? "mint" : pct >= 92 ? "ink" : "alert";
          return (
            <Card key={kpi.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Gauge size={15} className="text-ink-400" />
                    <h2 className="text-[15px] font-semibold tracking-snug">
                      {kpi.name}
                    </h2>
                  </div>
                  <p className="mt-1 text-xs text-ink-400">{kpi.milestone}</p>
                </div>
                <Badge tone={tone === "alert" ? "critical" : tone === "mint" ? "mint" : "neutral"}>
                  {pct}%
                </Badge>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="type-display text-[32px] tabular-nums">
                  {kpi.current.toLocaleString("ko-KR")}
                </span>
                <span className="text-sm text-ink-400">
                  / 목표 {kpi.target.toLocaleString("ko-KR")} {kpi.unit}
                </span>
              </div>

              <div className="mt-3">
                <ProgressBar value={pct} max={100} tone={tone} height={6} />
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-hairline-soft pt-3.5 text-xs text-ink-400">
                <Database size={12} />
                {kpi.source} 연동
                <span className="ml-auto flex items-center gap-1">
                  <RefreshCcw size={11} />
                  {kpi.synced} 자동 업데이트
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
