import { CalendarHeart, MessageSquareText, Sparkles, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { ApprovalItem, Employee } from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";

interface LeaveApplyViewProps {
  currentUser: Employee;
  employees: Employee[];
  approvals: ApprovalItem[];
  onStartLeave: (employeeId: string) => void;
}

const LEAVE_TYPES = [
  { id: "annual", name: "연차", desc: "종일 1일 차감", deduct: "1일" },
  { id: "half-am", name: "오전 반차", desc: "09:00–13:00", deduct: "0.5일" },
  { id: "half-pm", name: "오후 반차", desc: "14:00–18:00", deduct: "0.5일" },
  { id: "family", name: "경조휴가", desc: "사유별 기준 부여", deduct: "차감 없음" },
];

export function LeaveApplyView({
  currentUser,
  employees,
  approvals,
  onStartLeave,
}: LeaveApplyViewProps) {
  const [leaveType, setLeaveType] = useState(LEAVE_TYPES[0].id);

  /* 대체근무자 후보 — 같은 팀 동료 중 잔여 연차 여유 인원 */
  const substitutes = useMemo(
    () =>
      employees
        .filter((e) => e.dept === currentUser.dept && e.id !== currentUser.id)
        .slice(0, 12),
    [employees, currentUser]
  );
  const [substituteId, setSubstituteId] = useState(
    () => substitutes[0]?.id ?? ""
  );

  const myRequests = approvals.filter((a) => a.requester === currentUser.name);
  const leaveQueue = approvals.filter((a) => a.kind === "연차");

  return (
    <div>
      <PageHeader
        breadcrumb={["근태 & 시간 관리", "휴가 & 휴직 관리", "상시 휴가 신청"]}
        title="상시 휴가 신청"
        subtitle="대화 방식으로 연차 · 반차 · 경조휴가를 신청하고 대체근무자를 지정합니다 — AI가 인력 공백과 결재 라인을 자동 구성합니다."
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Card
          title="휴가 유형 선택"
          subtitle="신청할 휴가 유형과 대체근무자를 지정하세요"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <CalendarHeart size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="rounded-field bg-canvas p-5 text-center">
            <div className="type-label">내 잔여 연차</div>
            <div className="type-display mt-1 text-[36px] tabular-nums">
              {currentUser.leaveRemaining}
              <span className="text-[18px] text-ink-400">일</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {LEAVE_TYPES.map((type) => {
              const isSelected = type.id === leaveType;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setLeaveType(type.id)}
                  className={`rounded-field border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-surface hover:bg-canvas"
                  }`}
                >
                  <div className="text-sm font-semibold">{type.name}</div>
                  <div
                    className={`mt-0.5 text-[11px] ${isSelected ? "text-white/60" : "text-ink-400"}`}
                  >
                    {type.desc} · {type.deduct}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            <div className="type-label mb-1.5 flex items-center gap-1.5">
              <UserCheck size={12} />
              대체근무자 지정
            </div>
            <Select
              options={substitutes.map((e) => ({
                value: e.id,
                label: `${e.name} · ${e.position} (잔여 ${e.leaveRemaining}일)`,
              }))}
              value={substituteId}
              onChange={setSubstituteId}
              ariaLabel="대체근무자 선택"
              className="w-full"
            />
            <p className="mt-1.5 text-xs text-ink-400">
              {currentUser.dept} 동료 중 휴가 일정이 겹치지 않는 인원이 추천됩니다
            </p>
          </div>

          <Button
            size="lg"
            className="mt-5 w-full"
            icon={<Sparkles size={16} />}
            onClick={() => onStartLeave(currentUser.id)}
          >
            대화형 AI 도우미로 신청 진행
          </Button>
        </Card>

        <Card
          title="내 신청 현황"
          subtitle="상신된 휴가 신청의 결재 진행 상태"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <MessageSquareText size={16} strokeWidth={1.75} />
            </span>
          }
        >
          {myRequests.length === 0 ? (
            <p className="rounded-field border border-dashed border-hairline p-10 text-center text-sm text-ink-400">
              진행 중인 신청이 없습니다
              <br />
              <span className="text-xs">
                AI 도우미로 신청하면 이곳에서 결재 상태를 추적할 수 있어요
              </span>
            </p>
          ) : (
            <ul className="flex flex-col">
              {myRequests.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-hairline-soft py-3.5 first:pt-0 last:border-none last:pb-0"
                >
                  <div className="flex items-center gap-2">
                    <Badge tone="mint">{item.kind}</Badge>
                    <span className="text-[11px] text-ink-400">{item.due}</span>
                  </div>
                  <p className="mt-1 text-[13px] font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-400">
                    결재 라인: 팀장 → HRBP → 자동 전결
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title="팀 휴가 일정 모아보기"
          subtitle="결재 대기 중인 전사 연차 신청 흐름"
        >
          {leaveQueue.length === 0 ? (
            <p className="rounded-field border border-dashed border-hairline p-10 text-center text-sm text-ink-400">
              대기 중인 연차 신청이 없습니다
            </p>
          ) : (
            <ul className="flex flex-col">
              {leaveQueue.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-3 border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                >
                  <Avatar name={item.requester} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{item.title}</p>
                    <p className="text-xs text-ink-400">
                      {item.requester} · {item.dept}
                    </p>
                  </div>
                  <Badge tone={item.urgent ? "critical" : "neutral"}>
                    {item.due}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
