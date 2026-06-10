import {
  ArrowRight,
  Check,
  Clock3,
  Factory,
  Heart,
  Inbox,
  Target,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  BUDGET_POOL,
  fmtCompa,
  fmtEok,
  fmtHours,
  GRADES,
  MY_KEY_RESULTS,
  ORG_HEALTH_SCORE,
  ORG_RETENTION_RATE,
  PEER_FEEDBACK,
  RND_RETENTION_DELTA,
  SHIFT_META,
  simTotal,
  TALENT_POOL_SIZE,
  WEEK_ATTENDANCE,
  WEEK_BASE_MINUTES,
  WEEKLY_CAP_HOURS,
  type ApprovalItem,
  type Employee,
  type PerformanceGrade,
  type RouteId,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ProgressBar } from "../components/ui/ProgressBar";
import { StatCard } from "../components/ui/StatCard";

interface DashboardHubProps {
  employees: Employee[];
  raisePct: Record<PerformanceGrade, number>;
  currentUser: Employee;
  approvals: ApprovalItem[];
  punchedInAt: number | null;
  todayBaseMinutes: number;
  onPunch: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onOpenProfile: (employeeId: string) => void;
  onNavigate: (route: RouteId) => void;
}

const KIND_TONES: Record<ApprovalItem["kind"], "mint" | "cobalt" | "warning" | "neutral" | "pistachio"> = {
  연차: "mint",
  초과근무: "warning",
  "채용 품의": "cobalt",
  "경조 지원": "neutral",
  "해외 출장": "pistachio",
};

export function DashboardHub({
  employees,
  raisePct,
  currentUser,
  approvals,
  punchedInAt,
  todayBaseMinutes,
  onPunch,
  onApprove,
  onReject,
  onOpenProfile,
  onNavigate,
}: DashboardHubProps) {
  const total = simTotal(employees, raisePct);
  const usagePct = Math.round((total / BUDGET_POOL) * 100);
  const overBudget = total > BUDGET_POOL;

  const avgCompa =
    employees.reduce((sum, e) => sum + e.compaRatio, 0) / employees.length;
  const avgOkr =
    employees.reduce((sum, e) => sum + e.okrRate, 0) / employees.length;
  const starCount = employees.filter(
    (e) => (e.grade === "S" || e.grade === "A") && e.potential === 3
  ).length;
  const gradeCounts = GRADES.map(
    (g) => `${g} ${employees.filter((e) => e.grade === g).length}`
  ).join(" · ");

  const findByName = (name: string) =>
    employees.find((e) => e.name === name);

  return (
    <div>
      <header className="mb-8">
        <p className="type-label mb-2">2026년 6월 10일 수요일 · 피플 인텔리전스 브리핑</p>
        <h1 className="type-display text-[42px]">
          좋은 아침이에요, {currentUser.name} 님
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-400">
          교대 근무 현황부터 피어 피드백, 결재 대기 큐까지 — 넥스칩 세미콘
          3,000명의 오늘을 한 화면에서 시작하세요.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <TimeAttendanceCard
          currentUser={currentUser}
          punchedInAt={punchedInAt}
          todayBaseMinutes={todayBaseMinutes}
          onPunch={onPunch}
        />

        <Card
          title="애자일 OKR & 피어 피드백"
          subtitle="분기 핵심 결과와 엔지니어 협업 칭찬 스트림"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Target size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="flex flex-col gap-3.5">
            {MY_KEY_RESULTS.map((kr) => (
              <div key={kr.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-medium text-ink">
                    {kr.title}
                  </span>
                  <span className="text-[13px] font-semibold tabular-nums text-ink">
                    {kr.progress}%
                  </span>
                </div>
                <ProgressBar
                  value={kr.progress}
                  max={100}
                  tone={kr.progress >= 80 ? "mint" : "ink"}
                  height={6}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-hairline-soft pt-5">
            <div className="type-label mb-3 flex items-center gap-1.5">
              <Heart size={12} className="text-mint-deep" />
              피어 피드백 스트림
            </div>
            <ul className="nx-scroll flex max-h-[290px] flex-col gap-4 overflow-y-auto pr-1">
              {PEER_FEEDBACK.map((item) => {
                const target = findByName(item.to);
                return (
                  <li key={item.id} className="flex gap-3">
                    <Avatar name={item.from} size={32} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
                        <span className="font-semibold">{item.from}</span>
                        <span className="text-ink-400">→</span>
                        <button
                          type="button"
                          onClick={() => target && onOpenProfile(target.id)}
                          className="font-semibold text-cobalt hover:underline"
                        >
                          @{item.to}
                        </button>
                        <span className="text-xs text-ink-300">{item.time}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                        {item.message}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-pistachio px-2.5 py-0.5 text-[11px] font-semibold text-mint-deep"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Card>

        <Card
          title="엔터프라이즈 결재 대기 큐"
          subtitle={`승인 대기 ${approvals.length}건 · 긴급 ${approvals.filter((a) => a.urgent).length}건`}
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Inbox size={16} strokeWidth={1.75} />
            </span>
          }
        >
          {approvals.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-field border border-dashed border-hairline py-12 text-center">
              <Check size={22} className="text-mint-deep" />
              <p className="text-sm font-medium">모든 결재가 완료됐어요</p>
              <p className="text-xs text-ink-400">
                새 요청이 도착하면 이곳에 표시됩니다
              </p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {approvals.map((item) => {
                const requester = findByName(item.requester);
                return (
                  <li
                    key={item.id}
                    className="flex items-center gap-3 border-b border-hairline-soft py-3.5 first:pt-0 last:border-none last:pb-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge tone={KIND_TONES[item.kind]}>{item.kind}</Badge>
                        {item.urgent && (
                          <span className="text-[11px] font-bold text-alert-deep">
                            {item.due}
                          </span>
                        )}
                        {!item.urgent && (
                          <span className="text-[11px] text-ink-400">
                            {item.due}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-[13px] font-medium">
                        {item.title}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          requester && onOpenProfile(requester.id)
                        }
                        className="text-xs text-ink-400 hover:text-cobalt hover:underline"
                      >
                        {item.requester} · {item.dept}
                      </button>
                    </div>
                    <div className="flex flex-none gap-1.5">
                      <button
                        type="button"
                        onClick={() => onApprove(item.id)}
                        aria-label={`${item.title} 승인`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-mint transition-colors hover:bg-ink-700"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(item.id)}
                        aria-label={`${item.title} 반려`}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-ink-400 transition-colors hover:bg-canvas hover:text-alert-deep"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>

      {/* 에디토리얼 내러티브 분석 모듈 */}
      <Card padding="roomy" className="mt-6">
        <div className="max-w-3xl">
          <span className="type-label">Narrative HR Analytics</span>
          <h2 className="type-subhead mt-3 text-ink">
            넥스칩 세미콘의 현재 조직 건강도 점수는{" "}
            <strong className="font-semibold">
              {ORG_HEALTH_SCORE}점
            </strong>
            이며, R&amp;D 공정 엔지니어 직군의 유지율이 전월 대비{" "}
            <strong className="font-semibold">
              {RND_RETENTION_DELTA}% 상승
            </strong>
            했습니다. 핵심 인재풀의 평균 컴파라티오는{" "}
            {fmtCompa(avgCompa)}로 시장 미드포인트에 안정적으로 정렬되어
            있고, 메리트 예산은 현재 {usagePct}% 수준에서 운용 중입니다.
          </h2>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <StatCard square label="조직 건강도" value={String(ORG_HEALTH_SCORE)} detail="전사 펄스 서베이" accent="mint" />
          <StatCard square label="유지율" value={`${ORG_RETENTION_RATE}%`} detail={`전월 +${RND_RETENTION_DELTA}%p`} />
          <StatCard square label="평균 컴파라티오" value={fmtCompa(avgCompa)} detail="밴드 0.70 – 1.30" />
          <StatCard square label="OKR 평균 달성" value={`${Math.round(avgOkr)}%`} detail="직전 사이클 기준" />
          <StatCard square label="핵심 인재" value={`${starCount}명`} detail={gradeCounts} />
          <StatCard
            square
            label="예산 소진율"
            value={`${usagePct}%`}
            detail={overBudget ? "한도 초과" : `${fmtEok(BUDGET_POOL)} 풀 기준`}
            accent={overBudget ? "alert" : "none"}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline-soft pt-6">
          <p className="mr-auto text-sm text-ink-400">
            핵심 인재풀 {TALENT_POOL_SIZE}명 환산 모델 · 보정 등급과 인상률이
            모든 지표에 실시간 반영됩니다
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigate("calibration")}
          >
            등급 보정 열기
          </Button>
          <Button
            size="sm"
            icon={<ArrowRight size={14} />}
            onClick={() => onNavigate("merit")}
          >
            메리트 시뮬레이터
          </Button>
        </div>
      </Card>
    </div>
  );
}

function TimeAttendanceCard({
  currentUser,
  punchedInAt,
  todayBaseMinutes,
  onPunch,
}: {
  currentUser: Employee;
  punchedInAt: number | null;
  todayBaseMinutes: number;
  onPunch: () => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sessionMinutes = punchedInAt
    ? Math.max(0, (now - punchedInAt) / 60000)
    : 0;
  const todayMinutes = todayBaseMinutes + sessionMinutes;
  const weekMinutes = WEEK_BASE_MINUTES + todayMinutes;
  const weekHours = weekMinutes / 60;
  const shift = SHIFT_META[currentUser.shift];

  const clock = new Date(now);
  const hh = String(clock.getHours()).padStart(2, "0");
  const mm = String(clock.getMinutes()).padStart(2, "0");
  const ss = String(clock.getSeconds()).padStart(2, "0");

  const maxDayHours = 10;

  return (
    <Card
      title="타임 & 어텐던스"
      subtitle={`${shift.label} · ${shift.line} · ${shift.window}`}
      action={
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
          <Factory size={16} strokeWidth={1.75} />
        </span>
      }
    >
      <div className="rounded-field bg-canvas p-6 text-center">
        <div className="type-display text-[44px] tabular-nums tracking-snug">
          {hh}:{mm}
          <span className="text-[22px] text-ink-300">:{ss}</span>
        </div>
        <div className="mt-1 flex items-center justify-center gap-2 text-xs text-ink-400">
          <span
            className={`h-1.5 w-1.5 rounded-full ${punchedInAt ? "bg-mint-deep" : "bg-ink-300"}`}
          />
          {punchedInAt
            ? `근무 중 · 오늘 ${fmtHours(todayMinutes / 60)}`
            : "펀치 대기 · 출근 전"}
        </div>
        <Button
          variant={punchedInAt ? "secondary" : "primary"}
          size="lg"
          className="mt-5 w-full"
          icon={<Clock3 size={16} />}
          onClick={onPunch}
        >
          {punchedInAt ? "퇴근 펀치" : "출근 펀치"}
        </Button>
      </div>

      <div className="mt-6">
        <ProgressBar
          label="주간 누적 근로시간"
          value={weekHours}
          max={WEEKLY_CAP_HOURS}
          display={`${fmtHours(weekHours)} / ${WEEKLY_CAP_HOURS}시간`}
          tone={weekHours > 48 ? "alert" : "mint"}
        />
        <p className="mt-2 text-xs text-ink-400">
          주 52시간 상한 기준 · 48시간 초과 시 HRBP 알림이 발송됩니다
        </p>
      </div>

      <div className="mt-6 flex items-end justify-between gap-2.5">
        {WEEK_ATTENDANCE.map((day) => {
          const hours = day.isToday ? todayMinutes / 60 : day.hours;
          const ratio = Math.min(hours / maxDayHours, 1);
          return (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-20 w-full items-end overflow-hidden rounded-cell bg-hairline-soft">
                <div
                  className={`w-full rounded-cell transition-all duration-500 ${day.isToday ? "bg-mint" : "bg-ink"}`}
                  style={{ height: `${ratio * 100}%` }}
                />
              </div>
              <span
                className={`text-[11px] ${day.isToday ? "font-bold text-ink" : "text-ink-400"}`}
              >
                {day.day}
              </span>
              <span className="text-[10px] tabular-nums text-ink-300">
                {hours > 0 ? hours.toFixed(1) : "–"}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
