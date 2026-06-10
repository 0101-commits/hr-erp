import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Factory,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fmtCompa,
  fmtKorean,
  fmtWon,
  GRADE_META,
  POTENTIAL_META,
  SHIFT_META,
  type Employee,
} from "../../data/mockData";
import { Avatar } from "../ui/Avatar";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { ProgressBar } from "../ui/ProgressBar";

export type PanelMode = "profile" | "leave";

interface DetailPanelProps {
  mode: PanelMode;
  employee: Employee;
  isCurrentUser: boolean;
  onClose: () => void;
  onStartLeave: (employeeId: string) => void;
  onSubmitLeave: (employeeId: string, date: string) => void;
}

/* 시뮬레이션 기준일: 2026-06-10 (수) — 라인 캘린더 혼잡도 mock */
const LEAVE_DATE_OPTIONS = [
  { date: "2026-06-11", label: "6/11 (목)", conflicts: 1 },
  { date: "2026-06-12", label: "6/12 (금)", conflicts: 2 },
  { date: "2026-06-15", label: "6/15 (월)", conflicts: 0 },
  { date: "2026-06-16", label: "6/16 (화)", conflicts: 0 },
];

function gradeBadgeTone(grade: Employee["grade"]) {
  if (grade === "S") return "ink" as const;
  if (grade === "A") return "mint" as const;
  if (grade === "B") return "neutral" as const;
  return "warning" as const;
}

export function DetailPanel({
  mode,
  employee,
  isCurrentUser,
  onClose,
  onStartLeave,
  onSubmitLeave,
}: DetailPanelProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="패널 닫기"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-ink/25"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={mode === "leave" ? "AI 연차 신청 안내" : "임직원 프로필"}
        className="nx-scroll absolute right-0 top-0 flex h-full w-[42vw] min-w-[480px] animate-slide-in-right flex-col overflow-y-auto bg-surface shadow-cube"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline-soft bg-surface px-8 py-5">
          <div className="flex items-center gap-2.5">
            {mode === "leave" ? (
              <>
                <Sparkles size={18} className="text-cobalt" />
                <h2 className="text-[17px] font-semibold tracking-snug">
                  AI Leave Application
                </h2>
                <Badge tone="cobalt">대화형 어드바이저</Badge>
              </>
            ) : (
              <>
                <h2 className="text-[17px] font-semibold tracking-snug">
                  임직원 프로필
                </h2>
                <Badge tone="outline">{employee.id}</Badge>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-canvas hover:text-ink"
          >
            <X size={18} />
          </button>
        </header>

        {mode === "profile" ? (
          <ProfileBody
            employee={employee}
            isCurrentUser={isCurrentUser}
            onStartLeave={onStartLeave}
          />
        ) : (
          <LeaveBody employee={employee} onSubmitLeave={onSubmitLeave} />
        )}
      </aside>
    </div>
  );
}

function ProfileBody({
  employee,
  isCurrentUser,
  onStartLeave,
}: {
  employee: Employee;
  isCurrentUser: boolean;
  onStartLeave: (employeeId: string) => void;
}) {
  const totalComp = employee.salary + employee.bonus + employee.welfare;
  const shift = SHIFT_META[employee.shift];

  return (
    <div className="flex flex-1 flex-col gap-7 px-8 py-7">
      <div className="flex items-center gap-4">
        <Avatar name={employee.name} size={64} />
        <div>
          <div className="flex items-center gap-2.5">
            <span className="type-display text-[26px]">{employee.name}</span>
            {isCurrentUser && <Badge tone="pistachio">나</Badge>}
          </div>
          <p className="mt-1 text-sm text-ink-400">
            {employee.dept} · {employee.position} · {employee.role}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <Badge tone={gradeBadgeTone(employee.grade)} dot>
              {employee.grade} · {GRADE_META[employee.grade].desc}
            </Badge>
            <Badge tone="outline">{POTENTIAL_META[employee.potential].label}</Badge>
          </div>
        </div>
      </div>

      <section className="rounded-field border border-hairline-soft bg-canvas p-6">
        <div className="type-label mb-1">연간 총보상 (현금성)</div>
        <div className="type-display text-[34px] tabular-nums">
          {fmtWon(totalComp)}
        </div>
        <dl className="mt-4 grid grid-cols-3 gap-3 border-t border-hairline-soft pt-4">
          <div>
            <dt className="text-xs text-ink-400">기본 연봉</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums">
              {fmtKorean(employee.salary)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">성과급</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums">
              {fmtKorean(employee.bonus)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-ink-400">복리후생 포인트</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums">
              {fmtKorean(employee.welfare)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-field border border-hairline-soft p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="type-label">컴파라티오</span>
            <span className="text-lg font-semibold tabular-nums">
              {fmtCompa(employee.compaRatio)}
            </span>
          </div>
          <ProgressBar
            value={employee.compaRatio - 0.7}
            max={0.6}
            tone={employee.compaRatio >= 1 ? "mint" : "ink"}
            height={6}
          />
          <p className="mt-2 text-xs text-ink-400">
            시장 미드포인트 대비 {employee.compaRatio >= 1 ? "상회" : "하회"} ·
            밴드 0.70 – 1.30
          </p>
        </div>
        <div className="rounded-field border border-hairline-soft p-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="type-label">직전 OKR 달성률</span>
            <span className="text-lg font-semibold tabular-nums">
              {employee.okrRate}%
            </span>
          </div>
          <ProgressBar
            value={Math.min(employee.okrRate, 120)}
            max={120}
            tone={employee.okrRate >= 100 ? "mint" : "ink"}
            height={6}
          />
          <p className="mt-2 text-xs text-ink-400">
            2025 하반기 사이클 · 목표 100% 기준
          </p>
        </div>
      </section>

      <section className="flex items-center justify-between rounded-field border border-hairline-soft p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-ink-500">
            <Factory size={18} strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-sm font-semibold">{shift.label}</div>
            <div className="text-xs text-ink-400">
              {shift.line} · {shift.window}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="type-label">잔여 연차</div>
          <div className="text-lg font-semibold tabular-nums">
            {employee.leaveRemaining}일
          </div>
        </div>
      </section>

      <section>
        <h3 className="type-label mb-3">RSU 부여 · 귀속 일정</h3>
        {employee.rsu.length === 0 ? (
          <div className="rounded-field border border-dashed border-hairline p-6 text-center text-sm text-ink-400">
            부여된 RSU가 없습니다. 차기 핵심인재 리뷰에서 부여 대상 여부를
            검토할 수 있어요.
          </div>
        ) : (
          <ul className="relative ml-2 border-l border-hairline pl-6">
            {employee.rsu.map((grant) => (
              <li key={grant.date + grant.note} className="relative pb-5 last:pb-0">
                <span
                  className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full border-2 ${
                    grant.vested
                      ? "border-ink bg-ink"
                      : "border-hairline bg-surface"
                  }`}
                />
                <div className="text-xs tabular-nums text-ink-400">
                  {grant.date}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm font-medium">
                  {grant.note}
                  <Badge tone={grant.vested ? "mint" : "neutral"}>
                    {grant.vested ? "귀속 완료" : "귀속 예정"}
                  </Badge>
                </div>
                <div className="mt-0.5 text-xs tabular-nums text-ink-400">
                  {grant.units.toLocaleString("ko-KR")}주
                  {grant.vested && grant.value > 0
                    ? ` · 평가액 ${fmtKorean(grant.value)}`
                    : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mt-auto border-t border-hairline-soft pt-6">
        <Button
          size="lg"
          className="w-full"
          icon={<Sparkles size={16} />}
          onClick={() => onStartLeave(employee.id)}
        >
          AI 연차 신청 어드바이저 실행
        </Button>
        <p className="mt-2.5 text-center text-xs text-ink-400">
          결재 라인과 라인 가동 현황을 AI가 자율 평가한 뒤 신청을 안내합니다
        </p>
      </footer>
    </div>
  );
}

function LeaveBody({
  employee,
  onSubmitLeave,
}: {
  employee: Employee;
  onSubmitLeave: (employeeId: string, date: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(LEAVE_DATE_OPTIONS[1].date);

  useEffect(() => {
    setStep(0);
    const timers = [
      setTimeout(() => setStep(1), 250),
      setTimeout(() => setStep(2), 950),
      setTimeout(() => setStep(3), 1750),
      setTimeout(() => setStep(4), 2500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [employee.id]);

  const selected =
    LEAVE_DATE_OPTIONS.find((opt) => opt.date === selectedDate) ??
    LEAVE_DATE_OPTIONS[1];
  const hasConflict = selected.conflicts > 0;

  return (
    <div className="flex flex-1 flex-col gap-5 px-8 py-7">
      {step >= 1 && (
        <div className="flex animate-bubble-in gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink text-mint">
            <Sparkles size={15} />
          </span>
          <div className="rounded-field rounded-tl-cell border border-hairline-soft bg-canvas px-5 py-4 text-sm leading-relaxed">
            안녕하세요, <strong>{employee.name}</strong>님. AI 리브
            어드바이저입니다. 결재 라인과 반도체 라인 가동 현황을 자율
            평가했어요. 신청 전 아래 분석을 확인해 주세요.
          </div>
        </div>
      )}

      {step >= 2 && (
        <div className="flex animate-bubble-in gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink text-mint">
            <Sparkles size={15} />
          </span>
          <div className="flex-1 rounded-field rounded-tl-cell border border-hairline-soft bg-canvas px-5 py-4">
            <p className="text-sm leading-relaxed">
              현재 잔여 연차가{" "}
              <strong>{employee.leaveRemaining}일</strong> 남아있으나,{" "}
              <strong>{selected.label}</strong>{" "}
              {hasConflict ? (
                <>
                  당일 동일 {employee.dept} 레벨3 팀원 중{" "}
                  <strong className="text-alert-deep">
                    {selected.conflicts}명이 이미 휴가 예정
                  </strong>
                  입니다. 라인 커버리지 검토를 권장합니다.
                </>
              ) : (
                <>
                  당일 동일 {employee.dept} 팀원의 휴가 일정이 없어{" "}
                  <strong className="text-mint-deep">
                    커버리지가 안정적
                  </strong>
                  입니다.
                </>
              )}
            </p>
            <div className="mt-3.5 flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  hasConflict
                    ? "bg-[#FDF3DC] text-[#8A5B00]"
                    : "bg-mint text-mint-deep"
                }`}
              >
                {hasConflict ? (
                  <AlertTriangle size={13} />
                ) : (
                  <CheckCircle2 size={13} />
                )}
                팀 커버리지 {hasConflict ? `주의 · 중복 ${selected.conflicts}명` : "안정"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3 py-1.5 text-xs font-semibold text-mint-deep">
                <Factory size={13} />
                {SHIFT_META[employee.shift].line} 가동률 96.2%
              </span>
            </div>
          </div>
        </div>
      )}

      {step >= 3 && (
        <div className="flex animate-bubble-in gap-3">
          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-ink text-mint">
            <Sparkles size={15} />
          </span>
          <div className="flex-1 rounded-field rounded-tl-cell border border-hairline-soft bg-canvas px-5 py-4">
            <p className="text-sm leading-relaxed">
              결재 라인을 자동으로 구성했어요. 평균 승인 소요는{" "}
              <strong>4시간 이내</strong>로 예상됩니다.
            </p>
            <ol className="mt-3 flex items-center gap-2 text-xs font-medium text-ink-500">
              <li className="rounded-full border border-hairline bg-surface px-3 py-1.5">
                1 · {employee.dept} 리더
              </li>
              <span className="text-ink-300">→</span>
              <li className="rounded-full border border-hairline bg-surface px-3 py-1.5">
                2 · HRBP 한지원
              </li>
              <span className="text-ink-300">→</span>
              <li className="rounded-full bg-mint px-3 py-1.5 text-mint-deep">
                자동 전결
              </li>
            </ol>
          </div>
        </div>
      )}

      {step >= 4 && (
        <div className="animate-bubble-in rounded-field border border-hairline bg-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={16} className="text-ink-500" />
            <h3 className="text-sm font-semibold">희망일 선택</h3>
            <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-400">
              <Clock3 size={13} />
              종일 연차 · 1일 차감
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {LEAVE_DATE_OPTIONS.map((option) => {
              const isSelected = option.date === selectedDate;
              return (
                <button
                  key={option.date}
                  type="button"
                  onClick={() => setSelectedDate(option.date)}
                  className={`flex items-center justify-between rounded-field border px-4 py-3 text-sm transition-colors ${
                    isSelected
                      ? "border-ink bg-ink text-white"
                      : "border-hairline bg-surface text-ink hover:bg-canvas"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                      option.conflicts > 0
                        ? isSelected
                          ? "bg-white/15 text-[#FFD79A]"
                          : "bg-[#FDF3DC] text-[#8A5B00]"
                        : isSelected
                          ? "bg-mint text-ink"
                          : "bg-mint text-mint-deep"
                    }`}
                  >
                    {option.conflicts > 0
                      ? `중복 ${option.conflicts}명`
                      : "추천"}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-hairline-soft pt-5">
            <Button
              variant="cobalt"
              size="lg"
              className="w-full"
              icon={<CheckCircle2 size={17} />}
              onClick={() => onSubmitLeave(employee.id, selected.label)}
            >
              {selected.label} 연차 신청 확정 및 결재 상신
            </Button>
            <p className="mt-2.5 text-center text-xs text-ink-400">
              상신 즉시 결재 대기 큐에 등록되고 잔여 연차가 1일 차감됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
