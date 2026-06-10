import { CalendarRange, Factory, Send } from "lucide-react";
import { useMemo } from "react";
import {
  SHIFT_META,
  type Employee,
  type ShiftCode,
} from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

interface SchedulingViewProps {
  employees: Employee[];
  showToast: (message: string) => void;
}

/* 유연근무제 규칙 템플릿 — 복잡한 근무 유형을 템플릿화해 일괄 배포 */
const FLEX_TEMPLATES = [
  {
    id: "tpl-1", name: "시차출퇴근 A", rule: "출근 07:00–10:00 자율 · 일 8시간 고정",
    target: "상주(OFFICE) 근무자", tone: "mint" as const,
  },
  {
    id: "tpl-2", name: "선택근무제", rule: "월 단위 총 근로시간 자율 배분 · 코어타임 13–16시",
    target: "R&D부문 연구직", tone: "cobalt" as const,
  },
  {
    id: "tpl-3", name: "탄력근무 2주 단위", rule: "주 평균 40시간 · 특정 주 최대 48시간",
    target: "설비기술 · 수율개선", tone: "neutral" as const,
  },
  {
    id: "tpl-4", name: "4조 3교대", rule: "DAY/SWING/NIGHT 6일 주기 로테이션 · 휴게 보장",
    target: "제조 라인 전 교대조", tone: "warning" as const,
  },
];

const SHIFT_ORDER: ShiftCode[] = ["DAY", "SWING", "NIGHT", "OFFICE"];

export function SchedulingView({ employees, showToast }: SchedulingViewProps) {
  const shiftStats = useMemo(() => {
    const map = new Map<ShiftCode, number>();
    for (const e of employees) {
      map.set(e.shift, (map.get(e.shift) ?? 0) + 1);
    }
    return map;
  }, [employees]);

  /* 라인별 교대조 로스터 — 제조·연구 라인 부서 집계 */
  const roster = useMemo(() => {
    const lineDepts = [
      "이천 P3 제조팀",
      "평택 P4 제조팀",
      "설비기술팀",
      "수율개선팀",
      "테스트서비스팀",
    ];
    return lineDepts.map((dept) => {
      const members = employees.filter((e) => e.dept === dept);
      const byShift = SHIFT_ORDER.map(
        (shift) => members.filter((e) => e.shift === shift).length
      );
      return { dept, total: members.length, byShift };
    });
  }, [employees]);

  const total = employees.length;

  return (
    <div>
      <PageHeader
        breadcrumb={["근태 & 시간 관리", "근로 시간 제어", "근무 스케줄링 엔진"]}
        title="근무 스케줄링 엔진"
        subtitle="시차출퇴근 · 선택근무 · 탄력근무 등 복잡한 유연근무제 규칙을 템플릿화하고, 라인별 교대조 로스터를 한 화면에서 운용합니다."
      />

      {/* 교대 유형 분포 */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {SHIFT_ORDER.map((shift) => {
          const count = shiftStats.get(shift) ?? 0;
          const meta = SHIFT_META[shift];
          return (
            <div key={shift} className="rounded-field border border-hairline-soft bg-surface p-5">
              <div className="type-label">{meta.label}</div>
              <div className="type-display mt-1 text-[28px] tabular-nums">
                {count.toLocaleString("ko-KR")}명
              </div>
              <p className="mt-1 text-[13px] text-ink-400">
                {meta.window} · 전체의 {Math.round((count / total) * 100)}%
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[6fr_6fr]">
        <Card
          title="유연근무제 규칙 템플릿"
          subtitle="템플릿을 배포하면 대상 조직의 스케줄 규칙이 일괄 적용됩니다"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <CalendarRange size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="flex flex-col gap-3.5">
            {FLEX_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                className="flex items-center gap-4 rounded-field border border-hairline-soft p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{tpl.name}</span>
                    <Badge tone={tpl.tone}>{tpl.target}</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-400">{tpl.rule}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Send size={13} />}
                  onClick={() =>
                    showToast(`‘${tpl.name}’ 템플릿이 ${tpl.target} 대상으로 배포됐어요`)
                  }
                >
                  배포
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="라인별 교대조 로스터"
          subtitle="이번 주 기준 교대 유형별 배치 인원"
          padding="flush"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Factory size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="nx-scroll overflow-x-auto px-4 pb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">팀</th>
                  {SHIFT_ORDER.map((shift) => (
                    <th
                      key={shift}
                      className="type-label whitespace-nowrap px-3.5 py-3 text-right"
                    >
                      {SHIFT_META[shift].label}
                    </th>
                  ))}
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">합계</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((row) => (
                  <tr
                    key={row.dept}
                    className="border-b border-hairline-soft last:border-none hover:bg-canvas"
                  >
                    <td className="whitespace-nowrap px-3.5 py-3 font-medium">{row.dept}</td>
                    {row.byShift.map((count, index) => (
                      <td
                        key={SHIFT_ORDER[index]}
                        className={`whitespace-nowrap px-3.5 py-3 text-right tabular-nums ${count === 0 ? "text-ink-300" : ""}`}
                      >
                        {count === 0 ? "–" : `${count}명`}
                      </td>
                    ))}
                    <td className="whitespace-nowrap px-3.5 py-3 text-right font-semibold tabular-nums">
                      {row.total}명
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-hairline-soft px-7 py-4 text-xs text-ink-400">
            로스터는 발령·온보딩 데이터와 실시간 연동되며, 주 52시간 한도를 초과하는
            배치는 스케줄링 엔진이 자동 차단합니다.
          </p>
        </Card>
      </div>
    </div>
  );
}
