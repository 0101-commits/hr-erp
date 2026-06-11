import { BadgeCheck, Baby, HeartPulse, Send, Stethoscope, Users2 } from "lucide-react";
import { useMemo } from "react";
import type { Employee } from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";

interface LeaveVerifyViewProps {
  employees: Employee[];
  showToast: (message: string) => void;
  onOpenProfile: (employeeId: string) => void;
}

export function LeaveVerifyView({
  employees,
  showToast,
  onOpenProfile,
}: LeaveVerifyViewProps) {
  /* 법정 요건 기반 적격자 자동 필터링 */
  const { childCare, familyCare, longService } = useMemo(() => {
    const childCareList = employees.filter(
      (e) => e.childAge !== null && e.childAge <= 8
    );
    const familyCareList = employees.filter((e) => e.childAge !== null);
    const longServiceList = employees.filter((e) => e.tenureYears >= 10);
    return {
      childCare: childCareList,
      familyCare: familyCareList,
      longService: longServiceList,
    };
  }, [employees]);

  const rules = [
    {
      id: "rule-1",
      icon: <Baby size={16} strokeWidth={1.75} />,
      name: "육아기 근로시간 단축",
      condition: "만 8세 이하 자녀 양육 임직원 · 자녀 1명당 최대 2년",
      eligible: childCare.length,
      tone: "mint" as const,
    },
    {
      id: "rule-2",
      icon: <HeartPulse size={16} strokeWidth={1.75} />,
      name: "모성보호 (임신기 단축근무)",
      condition: "임신 12주 이내 · 36주 이후 — 일 2시간 단축, 임금 삭감 없음",
      eligible: 14,
      tone: "cobalt" as const,
    },
    {
      id: "rule-3",
      icon: <Users2 size={16} strokeWidth={1.75} />,
      name: "가족돌봄휴가",
      condition: "부양가족(자녀 포함) 보유 임직원 · 연 최대 10일 (무급)",
      eligible: familyCare.length,
      tone: "neutral" as const,
    },
    {
      id: "rule-4",
      icon: <Stethoscope size={16} strokeWidth={1.75} />,
      name: "난임치료휴가",
      condition: "전 임직원 · 연 3일 (최초 1일 유급)",
      eligible: employees.length,
      tone: "warning" as const,
    },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb={["근태 & 시간 관리", "휴가 & 휴직 관리", "법정 휴가 자동 검증"]}
        title="법정 휴가 자동 검증"
        subtitle="모성보호 · 육아기 단축근무 등 법정 제도의 적격 여부(자녀 연령, 근속 등)를 인사 기준 정보로 자동 선별합니다."
        actions={
          <Button
            variant="cobalt"
            icon={<Send size={15} />}
            onClick={() =>
              showToast(
                `육아기 단축근무 적격자 ${childCare.length.toLocaleString("ko-KR")}명에게 적격 통지를 발송했어요`
              )
            }
          >
            적격 통지 일괄 발송
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          label="육아기 단축 적격"
          value={`${childCare.length.toLocaleString("ko-KR")}명`}
          detail="만 8세 이하 자녀 보유 — 자동 추출"
          accent="mint"
        />
        <StatCard
          label="가족돌봄휴가 대상"
          value={`${familyCare.length.toLocaleString("ko-KR")}명`}
          detail="부양 자녀 보유 임직원"
        />
        <StatCard
          label="장기근속 재충전 휴가 대상"
          value={`${longService.length.toLocaleString("ko-KR")}명`}
          detail="근속 10년 이상 · 5일 특별휴가"
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <Card
          title="법정 제도 검증 규칙"
          subtitle="제도별 적격 조건과 자동 선별 결과"
        >
          <ul className="flex flex-col gap-3.5">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="flex items-start gap-3.5 rounded-field border border-hairline-soft p-4"
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-canvas text-ink-500">
                  {rule.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{rule.name}</span>
                    <Badge tone={rule.tone}>
                      적격 {rule.eligible.toLocaleString("ko-KR")}명
                    </Badge>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-400">
                    {rule.condition}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-start gap-2.5 rounded-field bg-mint-wash p-4 text-xs leading-relaxed text-mint-deep">
            <BadgeCheck size={14} className="mt-0.5 flex-none" />
            신청 시점에 자녀 연령·근속·재직 상태를 재검증해 부적격 신청을 자동
            반려하고, 사유를 임직원에게 안내합니다.
          </div>
        </Card>

        <Card
          title="육아기 근로시간 단축 적격자"
          subtitle={`만 8세 이하 자녀 보유 ${childCare.length.toLocaleString("ko-KR")}명 중 자녀 연령 낮은 순 상위 12명`}
          padding="flush"
        >
          <div className="nx-scroll overflow-x-auto px-4 pb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">성명</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">소속</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">막내 자녀</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">사용 가능 기간</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">검증 결과</th>
                </tr>
              </thead>
              <tbody>
                {childCare
                  .slice()
                  .sort((a, b) => (a.childAge ?? 0) - (b.childAge ?? 0))
                  .slice(0, 12)
                  .map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-hairline-soft last:border-none hover:bg-canvas"
                    >
                      <td className="whitespace-nowrap px-3.5 py-3">
                        <button
                          type="button"
                          onClick={() => onOpenProfile(e.id)}
                          className="flex items-center gap-2.5 text-left"
                        >
                          <Avatar name={e.name} size={30} />
                          <span className="font-semibold hover:text-cobalt">{e.name}</span>
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-ink-500">
                        {e.dept}
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                        만 {e.childAge}세
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                        최대 {Math.min(2, 9 - (e.childAge ?? 0))}년
                      </td>
                      <td className="whitespace-nowrap px-3.5 py-3">
                        <Badge tone="mint" dot>
                          적격 · 자동 승인 가능
                        </Badge>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
