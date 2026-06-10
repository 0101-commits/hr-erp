import { Sparkles } from "lucide-react";
import {
  GRADE_META,
  GRADES,
  type Employee,
  type PerformanceGrade,
  type PotentialLevel,
} from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

interface TalentViewProps {
  employees: Employee[];
  onOpenProfile: (employeeId: string) => void;
}

/* 성과 3단계 그룹핑: 상(S·A) / 중(B) / 하(C) */
const PERF_TIERS: {
  key: string;
  label: string;
  match: (grade: PerformanceGrade) => boolean;
}[] = [
  { key: "high", label: "상 (S·A)", match: (g) => g === "S" || g === "A" },
  { key: "mid", label: "중 (B)", match: (g) => g === "B" },
  { key: "low", label: "하 (C)", match: (g) => g === "C" },
];

const CELL_NAMES: string[][] = [
  ["성과 전문가", "고성과자", "핵심 인재"],
  ["견실한 기여자", "핵심 운영 인력", "성장 잠재 인재"],
  ["집중 관리 대상", "성과 개선 필요", "잠재력 보유"],
];

const DOT_COLORS: Record<PerformanceGrade, string> = {
  S: "#000000",
  A: "#3F3F46",
  B: "#0C6B44",
  C: "#A1A1AA",
};

const POTENTIAL_LEVELS: PotentialLevel[] = [1, 2, 3];

export function TalentView({ employees, onOpenProfile }: TalentViewProps) {
  const starCount = employees.filter(
    (e) => PERF_TIERS[0].match(e.grade) && e.potential === 3
  ).length;

  return (
    <div>
      <PageHeader
        breadcrumb={["허브", "9-Box 탤런트 맵핑"]}
        title="9-Box 탤런트 맵핑"
        subtitle="성과 × 잠재력 매트릭스 — 보정 등급과 실시간 연동되며, 칩을 클릭하면 프로필 패널이 열립니다."
        actions={
          <Badge tone="mint" dot>
            핵심 인재 {starCount}명
          </Badge>
        }
      />

      <Card padding="roomy">
        <div className="flex gap-5">
          <div className="flex w-10 flex-none items-center justify-center">
            <span className="type-label -rotate-90 whitespace-nowrap">
              성과 (Performance)
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex gap-4">
              <div className="flex w-16 flex-none flex-col justify-around text-right">
                {PERF_TIERS.map((tier) => (
                  <span
                    key={tier.key}
                    className="text-[13px] font-semibold text-ink-500"
                  >
                    {tier.label}
                  </span>
                ))}
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-3 grid-rows-3 gap-px overflow-hidden rounded-field border border-hairline bg-hairline">
                {PERF_TIERS.map((tier, rowIndex) =>
                  POTENTIAL_LEVELS.map((potential) => {
                    const cellEmployees = employees.filter(
                      (e) => tier.match(e.grade) && e.potential === potential
                    );
                    const isStar = rowIndex === 0 && potential === 3;
                    return (
                      <div
                        key={`${tier.key}-${potential}`}
                        className={`flex min-h-[150px] flex-col gap-2.5 p-4 ${isStar ? "bg-mint" : "bg-surface"}`}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[13px] font-semibold">
                            {isStar && (
                              <Sparkles size={13} className="text-mint-deep" />
                            )}
                            {CELL_NAMES[rowIndex][potential - 1]}
                          </span>
                          <span className="text-xs tabular-nums text-ink-400">
                            {cellEmployees.length}명
                          </span>
                        </div>
                        <div className="flex flex-wrap content-start gap-1.5">
                          {cellEmployees.map((e) => (
                            <button
                              key={e.id}
                              type="button"
                              onClick={() => onOpenProfile(e.id)}
                              title={`${e.dept} · ${e.role} · ${e.grade}등급`}
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-hairline bg-surface px-3 py-1 text-[13px] font-medium text-ink transition-colors hover:border-ink"
                            >
                              <span
                                className="h-1.5 w-1.5 flex-none rounded-full"
                                style={{ background: DOT_COLORS[e.grade] }}
                              />
                              {e.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 pl-20">
              <span className="text-center text-[13px] font-semibold text-ink-500">
                잠재력 저
              </span>
              <span className="text-center text-[13px] font-semibold text-ink-500">
                잠재력 중
              </span>
              <span className="text-center text-[13px] font-semibold text-ink-500">
                잠재력 고
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline-soft pt-6">
          <span className="type-label mr-2">등급 표기</span>
          {GRADES.map((grade) => (
            <span
              key={grade}
              className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1 text-[13px] font-medium"
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: DOT_COLORS[grade] }}
              />
              {grade} · {GRADE_META[grade].desc}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
