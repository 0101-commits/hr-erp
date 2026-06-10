import { BookOpenText, CalendarCheck, ChevronDown, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  OMNIBAR_SUGGESTIONS,
  type Employee,
} from "../data/mockData";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

interface AssistantViewProps {
  currentUser: Employee;
  onCommand: (query: string) => void;
  onStartLeave: (employeeId: string) => void;
}

/* 규정 질의응답 — 자주 묻는 사규 Q&A 모음 */
const POLICY_FAQ = [
  {
    q: "연차는 언제까지 사용해야 하나요?",
    a: "회계연도 기준 12월 31일까지 사용해야 하며, 미사용 연차는 연차수당으로 정산됩니다. 단, 사용 촉진 통보를 받은 연차는 수당 정산 대상에서 제외될 수 있습니다.",
  },
  {
    q: "육아기 근로시간 단축은 누가 신청할 수 있나요?",
    a: "만 8세 이하 또는 초등학교 2학년 이하 자녀를 양육하는 임직원이 신청할 수 있습니다. 주 15~35시간 범위에서 단축 근무가 가능하며, 자녀 1명당 최대 2년까지 사용할 수 있습니다.",
  },
  {
    q: "초과근무 수당은 어떻게 계산되나요?",
    a: "통상임금의 150%가 적용되며, 야간(22시~06시) 근로는 50%가 가산됩니다. 주 52시간 한도를 초과하는 근무는 시스템에서 사전 차단됩니다.",
  },
  {
    q: "복지 포인트는 어디에 사용할 수 있나요?",
    a: "복지몰(건강·자기계발·여가·리빙 카테고리)에서 자유롭게 사용 가능합니다. 미사용 포인트는 매년 12월 31일 소멸되며, 영수증 청구 방식의 의료비 지원과 중복 사용이 가능합니다.",
  },
  {
    q: "경조휴가와 경조금 기준이 궁금해요.",
    a: "본인 결혼 5일, 배우자 출산 10일, 직계가족 조사 5일이 기본 부여됩니다. 경조금은 사유별 기준표에 따라 자동 산정되며, 결재 승인 후 익월 급여에 합산 지급됩니다.",
  },
];

export function AssistantView({
  currentUser,
  onCommand,
  onStartLeave,
}: AssistantViewProps) {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const submit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    onCommand(trimmed);
    setQuery("");
  };

  return (
    <div>
      <PageHeader
        breadcrumb={["홈 & 워크스페이스", "지능형 통합 바", "AI 옴니 어시스턴트"]}
        title="AI 옴니 어시스턴트"
        subtitle="자연어로 기능을 검색하고, 휴가를 즉시 신청하고, 사내 규정을 바로 질의응답 — 흩어진 HR 기능을 하나의 대화 창구로 모았습니다."
      />

      {/* 자연어 명령 히어로 */}
      <div className="mb-6 rounded-showcase bg-ink p-9 text-white">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-mint">
            <Sparkles size={13} />
            Natural Language HR Command
          </span>
          <h2 className="type-display mt-4 text-[32px]">
            {currentUser.name} 님, 무엇을 도와드릴까요?
          </h2>
          <div className="mt-6 flex h-14 items-center gap-3 rounded-full bg-surface px-5 text-ink">
            <Search size={18} className="flex-none text-ink-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submit();
              }}
              placeholder="예: “6월 15일 연차 신청해줘”, “조직도 보여줘”, “연말정산 시뮬레이터”"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
              aria-label="AI 어시스턴트 명령 입력"
            />
            <Button size="sm" onClick={submit}>
              실행
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {OMNIBAR_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => onCommand(suggestion.query)}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-mint hover:text-mint"
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <Card
          title="휴가 즉시 신청"
          subtitle="대화형 어드바이저가 커버리지와 결재 라인을 자율 평가합니다"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <CalendarCheck size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="rounded-field bg-canvas p-6 text-center">
            <div className="type-label">내 잔여 연차</div>
            <div className="type-display mt-1 text-[40px] tabular-nums">
              {currentUser.leaveRemaining}
              <span className="text-[20px] text-ink-400">일</span>
            </div>
            <Button
              size="lg"
              className="mt-5 w-full"
              icon={<Sparkles size={16} />}
              onClick={() => onStartLeave(currentUser.id)}
            >
              AI 연차 신청 어드바이저 실행
            </Button>
            <p className="mt-2.5 text-xs text-ink-400">
              팀 커버리지 · 라인 가동률 · 결재 라인을 AI가 자동 점검합니다
            </p>
          </div>
        </Card>

        <Card
          title="규정 질의응답"
          subtitle="취업규칙 · 복무 · 보상 규정을 AI가 요약해 답변합니다"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <BookOpenText size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <ul className="flex flex-col">
            {POLICY_FAQ.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <li
                  key={faq.q}
                  className="border-b border-hairline-soft last:border-none"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-medium hover:text-cobalt"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles size={14} className="flex-none text-cobalt" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={15}
                      className={`flex-none text-ink-300 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {isOpen && (
                    <p className="rounded-field bg-canvas px-5 py-4 text-[13px] leading-relaxed text-ink-500">
                      {faq.a}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
