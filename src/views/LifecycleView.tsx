import { CheckCircle2, Circle, LogIn, LogOut, Map } from "lucide-react";
import { useState } from "react";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { ProgressBar } from "../components/ui/ProgressBar";

interface LifecycleViewProps {
  showToast: (message: string) => void;
}

interface ChecklistPerson {
  id: string;
  name: string;
  dept: string;
  date: string;
  steps: { label: string; done: boolean }[];
}

/* 입사자 서류 자동 수집 워크플로우 mock */
const INITIAL_ONBOARDING: ChecklistPerson[] = [
  {
    id: "ob-1", name: "서지우", dept: "공정개발그룹", date: "6/8 입사",
    steps: [
      { label: "근로계약서 전자서명", done: true },
      { label: "개인정보 수집·이용 동의", done: true },
      { label: "4대보험 취득 신고", done: true },
      { label: "보안 서약서 제출", done: false },
      { label: "장비·계정 신청", done: false },
    ],
  },
  {
    id: "ob-2", name: "민하린", dept: "SoC설계팀", date: "6/8 입사",
    steps: [
      { label: "근로계약서 전자서명", done: true },
      { label: "개인정보 수집·이용 동의", done: true },
      { label: "4대보험 취득 신고", done: false },
      { label: "보안 서약서 제출", done: false },
      { label: "장비·계정 신청", done: false },
    ],
  },
  {
    id: "ob-3", name: "곽태웅", dept: "이천 P3 제조팀", date: "6/15 입사 예정",
    steps: [
      { label: "근로계약서 전자서명", done: true },
      { label: "개인정보 수집·이용 동의", done: false },
      { label: "4대보험 취득 신고", done: false },
      { label: "보안 서약서 제출", done: false },
      { label: "장비·계정 신청", done: false },
    ],
  },
];

const INITIAL_OFFBOARDING: ChecklistPerson[] = [
  {
    id: "fb-1", name: "차은결", dept: "재무회계팀", date: "6/30 퇴사 예정",
    steps: [
      { label: "인수인계서 작성", done: true },
      { label: "자산(노트북·출입증) 반납", done: true },
      { label: "계정 권한 회수", done: false },
      { label: "퇴직 정산 (연차·퇴직금)", done: false },
    ],
  },
  {
    id: "fb-2", name: "남도윤", dept: "평택 P4 제조팀", date: "6/19 퇴사 예정",
    steps: [
      { label: "인수인계서 작성", done: true },
      { label: "자산(노트북·출입증) 반납", done: false },
      { label: "계정 권한 회수", done: false },
      { label: "퇴직 정산 (연차·퇴직금)", done: false },
    ],
  },
];

/* 부서 유형별 맞춤 체크리스트 매핑 */
const DEPT_CHECKLIST_MAP = [
  { dept: "제조부문 (라인 근무)", extras: ["클린룸 안전 교육", "방진복 사이즈 등록", "교대조 배정 면담"] },
  { dept: "R&D부문", extras: ["연구보안 서약", "특허 직무발명 동의", "설계 툴 라이선스 발급"] },
  { dept: "경영지원·영업부문", extras: ["법인카드 발급 신청", "ERP 권한 신청", "고객정보 취급 교육"] },
];

function progressOf(person: ChecklistPerson): number {
  const done = person.steps.filter((s) => s.done).length;
  return Math.round((done / person.steps.length) * 100);
}

function ChecklistCard({
  person,
  onToggle,
}: {
  person: ChecklistPerson;
  onToggle: (stepLabel: string) => void;
}) {
  const pct = progressOf(person);
  return (
    <div className="rounded-field border border-hairline-soft p-5">
      <div className="flex items-center gap-3">
        <Avatar name={person.name} size={36} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{person.name}</div>
          <div className="text-xs text-ink-400">
            {person.dept} · {person.date}
          </div>
        </div>
        <Badge tone={pct === 100 ? "mint" : "neutral"}>{pct}%</Badge>
      </div>
      <div className="mt-3">
        <ProgressBar value={pct} max={100} tone={pct === 100 ? "mint" : "ink"} height={5} />
      </div>
      <ul className="mt-3.5 flex flex-col gap-1.5">
        {person.steps.map((step) => (
          <li key={step.label}>
            <button
              type="button"
              onClick={() => onToggle(step.label)}
              className="flex w-full items-center gap-2 rounded-cell px-1.5 py-1 text-left text-[13px] transition-colors hover:bg-canvas"
            >
              {step.done ? (
                <CheckCircle2 size={15} className="flex-none text-mint-deep" />
              ) : (
                <Circle size={15} className="flex-none text-ink-300" />
              )}
              <span className={step.done ? "text-ink-400 line-through" : "text-ink"}>
                {step.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function LifecycleView({ showToast }: LifecycleViewProps) {
  const [onboarding, setOnboarding] = useState(INITIAL_ONBOARDING);
  const [offboarding, setOffboarding] = useState(INITIAL_OFFBOARDING);

  const toggle = (
    list: ChecklistPerson[],
    setList: (next: ChecklistPerson[]) => void,
    personId: string,
    stepLabel: string
  ) => {
    const next = list.map((p) =>
      p.id === personId
        ? {
            ...p,
            steps: p.steps.map((s) =>
              s.label === stepLabel ? { ...s, done: !s.done } : s
            ),
          }
        : p
    );
    setList(next);
    const person = next.find((p) => p.id === personId);
    if (person && progressOf(person) === 100) {
      showToast(`${person.name}님의 체크리스트가 모두 완료됐어요`);
    }
  };

  return (
    <div>
      <PageHeader
        breadcrumb={["조직 & 인사 관리", "임직원 생애주기", "입사·퇴사 절차 안내"]}
        title="입사·퇴사 절차 안내"
        help="입사 절차(온보딩)는 신규 입사자가 조직에 적응하도록 서류·교육·장비 준비를 챙기는 과정이고, 퇴사 절차(오프보딩)는 인수인계·자산 반납·권한 회수를 빠짐없이 마무리하는 과정입니다."
        subtitle="입퇴사자 서류 자동 수집과 부서별 맞춤 체크리스트 연결 — 단계를 클릭해 완료 처리할 수 있습니다."
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
        <Card
          title="입사 절차 진행 현황"
          subtitle={`입사 예정·진행 중 ${onboarding.length}명 · 서류는 제출 즉시 자동 수집됩니다`}
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <LogIn size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="flex flex-col gap-4">
            {onboarding.map((person) => (
              <ChecklistCard
                key={person.id}
                person={person}
                onToggle={(stepLabel) =>
                  toggle(onboarding, setOnboarding, person.id, stepLabel)
                }
              />
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card
            title="퇴사 절차 진행 현황"
            subtitle={`퇴사 예정 ${offboarding.length}명 · 자산 반납과 권한 회수를 추적합니다`}
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <LogOut size={16} strokeWidth={1.75} />
              </span>
            }
          >
            <div className="flex flex-col gap-4">
              {offboarding.map((person) => (
                <ChecklistCard
                  key={person.id}
                  person={person}
                  onToggle={(stepLabel) =>
                    toggle(offboarding, setOffboarding, person.id, stepLabel)
                  }
                />
              ))}
            </div>
          </Card>

          <Card
            title="부서별 맞춤 체크리스트"
            subtitle="공통 단계 외에 부서 유형별 추가 단계가 자동으로 연결됩니다"
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <Map size={16} strokeWidth={1.75} />
              </span>
            }
          >
            <ul className="flex flex-col gap-3.5">
              {DEPT_CHECKLIST_MAP.map((mapping) => (
                <li key={mapping.dept}>
                  <div className="text-[13px] font-semibold">{mapping.dept}</div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {mapping.extras.map((extra) => (
                      <span
                        key={extra}
                        className="rounded-full bg-pistachio px-2.5 py-0.5 text-[11px] font-semibold text-mint-deep"
                      >
                        +{extra}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
