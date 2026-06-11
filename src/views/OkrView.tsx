import { Crosshair, GitMerge, Target } from "lucide-react";
import {
  MY_KEY_RESULTS,
  type Employee,
} from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatCard } from "../components/ui/StatCard";

interface OkrViewProps {
  currentUser: Employee;
}

/* 전사 → 조직 → 개인 목표 계층 정렬 mock */
const COMPANY_OBJECTIVE = {
  title: "2026년 HBM4 양산 진입과 수율 90% 달성으로 메모리 시장 점유율 확대",
  progress: 71,
};

const ORG_OBJECTIVES = [
  {
    id: "org-1",
    owner: "R&D부문",
    title: "HBM4 적층 공정 개발 완료 및 신뢰성 인증 통과",
    progress: 78,
    krs: [
      { title: "16단 적층 본딩 수율 92% 달성", progress: 84 },
      { title: "신뢰성 인증 3종 통과 (JEDEC)", progress: 67 },
    ],
  },
  {
    id: "org-2",
    owner: "제조부문",
    title: "이천 P3 · 평택 P4 종합 수율 90% 안정화",
    progress: 69,
    krs: [
      { title: "D2 라인 결함 밀도 0.08/cm² 이하", progress: 73 },
      { title: "설비 비가동 시간 월 4% 이하 유지", progress: 65 },
    ],
  },
  {
    id: "org-3",
    owner: "경영지원부문",
    title: "핵심 인재 유지와 데이터 기반 인력 운영 체계 구축",
    progress: 66,
    krs: [
      { title: "핵심 인재 유지율 97% 방어", progress: 92 },
      { title: "인사 데이터 분석 대시보드 v2 구축", progress: 64 },
      { title: "2026 보상 사이클 적시 완결률 100%", progress: 78 },
    ],
  },
];

export function OkrView({ currentUser }: OkrViewProps) {
  const avgOrgProgress = Math.round(
    ORG_OBJECTIVES.reduce((sum, o) => sum + o.progress, 0) / ORG_OBJECTIVES.length
  );
  const myAvg = Math.round(
    MY_KEY_RESULTS.reduce((sum, kr) => sum + kr.progress, 0) / MY_KEY_RESULTS.length
  );

  return (
    <div>
      <PageHeader
        breadcrumb={["성과 & 몰입 관리", "목표 정렬", "전사/조직/개인 OKR"]}
        title="전사 / 조직 / 개인 OKR"
        help="OKR(Objectives & Key Results)은 도전적인 목표(Objective)와 달성도를 수치로 측정하는 핵심 결과(Key Result)로 구성된 목표 관리 기법입니다. 전사 → 조직 → 개인으로 목표를 정렬해 같은 방향을 보게 합니다."
        subtitle="상위 목표와 하위 목표 간 유기적 계층 구조 정렬 — 모든 진척도는 하위 핵심 결과에서 상위 목표로 실시간 합산됩니다."
        actions={
          <Badge tone="mint" dot>
            2026 2분기 사이클
          </Badge>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="전사 목표 진척" value={`${COMPANY_OBJECTIVE.progress}%`} detail="하위 조직 진척 자동 합산" accent="mint" />
        <StatCard label="조직 목표 평균" value={`${avgOrgProgress}%`} detail={`${ORG_OBJECTIVES.length}개 부문 목표`} />
        <StatCard label="내 KR 평균" value={`${myAvg}%`} detail={`${currentUser.name} · ${MY_KEY_RESULTS.length}개 핵심 결과`} />
      </div>

      <Card
        title="목표 정렬 트리"
        subtitle="전사 → 조직 → 개인으로 이어지는 계층 정렬 구조"
        action={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
            <GitMerge size={16} strokeWidth={1.75} />
          </span>
        }
      >
        {/* 전사 목표 */}
        <div className="rounded-field bg-ink p-6 text-white">
          <div className="flex items-center gap-2">
            <Target size={15} className="text-mint" />
            <span className="text-[11px] font-semibold tracking-label text-white/60">
              전사 목표
            </span>
            <span className="ml-auto text-xl font-semibold tabular-nums">
              {COMPANY_OBJECTIVE.progress}%
            </span>
          </div>
          <h2 className="mt-2 text-[17px] font-semibold leading-snug tracking-snug">
            {COMPANY_OBJECTIVE.title}
          </h2>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-mint transition-all duration-500"
              style={{ width: `${COMPANY_OBJECTIVE.progress}%` }}
            />
          </div>
        </div>

        {/* 조직 목표 */}
        <div className="ml-5 border-l border-hairline pl-6 pt-5">
          {ORG_OBJECTIVES.map((objective) => (
            <div key={objective.id} className="relative pb-5 last:pb-0">
              <span className="absolute -left-6 top-6 h-px w-5 bg-hairline" />
              <div className="rounded-field border border-hairline-soft p-5">
                <div className="flex items-center gap-2.5">
                  <Badge tone="cobalt">{objective.owner}</Badge>
                  <span className="text-sm font-semibold">{objective.title}</span>
                  <span className="ml-auto text-base font-semibold tabular-nums">
                    {objective.progress}%
                  </span>
                </div>
                <div className="mt-3">
                  <ProgressBar
                    value={objective.progress}
                    max={100}
                    tone={objective.progress >= 75 ? "mint" : "ink"}
                    height={6}
                  />
                </div>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {objective.krs.map((kr) => (
                    <li key={kr.title} className="flex items-center gap-3">
                      <Crosshair size={13} className="flex-none text-ink-300" />
                      <span className="min-w-0 flex-1 truncate text-[13px] text-ink-500">
                        {kr.title}
                      </span>
                      <span className="w-32 flex-none">
                        <ProgressBar value={kr.progress} max={100} tone="ink" height={4} />
                      </span>
                      <span className="w-10 flex-none text-right text-[13px] font-semibold tabular-nums">
                        {kr.progress}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 개인 KR */}
        <div className="ml-12 border-l border-hairline pl-6 pt-5">
          <div className="relative">
            <span className="absolute -left-6 top-6 h-px w-5 bg-hairline" />
            <div className="rounded-field bg-mint-wash p-5">
              <div className="flex items-center gap-2.5">
                <Badge tone="mint">내 핵심 결과</Badge>
                <span className="text-sm font-semibold">
                  {currentUser.name} · {currentUser.role}
                </span>
                <span className="ml-auto text-base font-semibold tabular-nums">
                  {myAvg}%
                </span>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {MY_KEY_RESULTS.map((kr) => (
                  <li key={kr.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <span className="text-[13px] font-medium">{kr.title}</span>
                      <span className="text-[13px] font-semibold tabular-nums">
                        {kr.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={kr.progress}
                      max={100}
                      tone={kr.progress >= 80 ? "mint" : "ink"}
                      height={5}
                    />
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-mint-deep">
                상위 목표 ‘핵심 인재 유지와 데이터 기반 인력 운영 체계 구축’에 정렬됨
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
