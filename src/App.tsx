import {
  Clock3,
  HandHeart,
  LayoutDashboard,
  Network,
  Target,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DetailPanel, type PanelMode } from "./components/panel/DetailPanel";
import { TopBar } from "./components/layout/TopBar";
import { Avatar } from "./components/ui/Avatar";
import { SideNav, type SideNavSection } from "./components/ui/SideNav";
import { Toast } from "./components/ui/Toast";
import {
  calcBonus,
  CURRENT_USER_ID,
  DEFAULT_RAISE,
  INITIAL_APPROVALS,
  INITIAL_EMPLOYEES,
  type ApprovalItem,
  type Employee,
  type PerformanceGrade,
  type RouteId,
} from "./data/mockData";
import { AppointmentSimView } from "./views/AppointmentSimView";
import { LoginView } from "./views/LoginView";
import { AssistantView } from "./views/AssistantView";
import { CalibrationView } from "./views/CalibrationView";
import { DashboardHub } from "./views/DashboardHub";
import { FeedbackView } from "./views/FeedbackView";
import { KpiView } from "./views/KpiView";
import { LaborCostView } from "./views/LaborCostView";
import { LeaveApplyView } from "./views/LeaveApplyView";
import { LeaveVerifyView } from "./views/LeaveVerifyView";
import { LifecycleView } from "./views/LifecycleView";
import { MeritView } from "./views/MeritView";
import { OkrView } from "./views/OkrView";
import { OrgChartView } from "./views/OrgChartView";
import { PayrollRunView } from "./views/PayrollRunView";
import { ProfilesView } from "./views/ProfilesView";
import { ReceiptView } from "./views/ReceiptView";
import { RewardsView } from "./views/RewardsView";
import { SchedulingView } from "./views/SchedulingView";
import { TalentView } from "./views/TalentView";
import { TimelineView } from "./views/TimelineView";
import { WelfarePointsView } from "./views/WelfarePointsView";
import { WorkRiskView } from "./views/WorkRiskView";
import { YearEndTaxView } from "./views/YearEndTaxView";

interface PanelState {
  mode: PanelMode;
  employeeId: string;
}

/* AI 옴니바 자연어 → 라우트 매핑 사전 */
const ROUTE_KEYWORDS: { route: RouteId; words: string[] }[] = [
  { route: "org-chart", words: ["조직도", "org chart"] },
  { route: "appointment", words: ["발령"] },
  { route: "lifecycle", words: ["온보딩", "오프보딩"] },
  { route: "profiles", words: ["프로필 마스터", "사원 검색", "인사기록"] },
  { route: "scheduling", words: ["스케줄", "근무제", "교대"] },
  { route: "work-risk", words: ["52시간", "근로 리스크"] },
  { route: "leave-verify", words: ["휴가 검증", "육아기", "모성보호"] },
  { route: "payroll", words: ["급여 정산", "급여"] },
  { route: "year-end", words: ["연말정산", "환급"] },
  { route: "labor-cost", words: ["인건비", "운영비"] },
  { route: "merit", words: ["메리트", "시뮬레이터", "인상", "merit"] },
  { route: "calibration", words: ["보정", "평가 매트릭스", "등급", "calibration"] },
  { route: "rewards", words: ["리워드", "보상", "rsu", "reward"] },
  { route: "talent", words: ["탤런트", "9box", "9-box", "나인박스", "talent"] },
  { route: "okr", words: ["okr", "목표"] },
  { route: "kpi", words: ["kpi", "지표"] },
  { route: "feedback", words: ["피드백", "감사 메시지"] },
  { route: "welfare-points", words: ["복지", "포인트"] },
  { route: "receipt", words: ["영수증", "ocr", "경비"] },
  { route: "timeline", words: ["알림", "타임라인", "공지"] },
  { route: "assistant", words: ["어시스턴트", "assistant"] },
  { route: "hub", words: ["허브", "대시보드", "홈", "스냅샷", "dashboard"] },
];

/* 하이브리드 융합형 IA — 대메뉴 6 · 중메뉴 · 소메뉴 */
const NAV_SECTIONS: SideNavSection[] = [
  {
    key: "home",
    no: "01",
    label: "홈 & 워크스페이스",
    icon: <LayoutDashboard size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "개인화 포털",
        items: [
          { id: "hub", label: "오늘의 업무 스냅샷" },
          { id: "timeline", label: "알림 및 타임라인" },
        ],
      },
      {
        label: "지능형 통합 바",
        items: [{ id: "assistant", label: "AI 옴니 어시스턴트" }],
      },
    ],
  },
  {
    key: "org",
    no: "02",
    label: "조직 & 인사 관리",
    icon: <Network size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "마스터 인사 데이터",
        items: [
          { id: "org-chart", label: "전사 조직도 관리" },
          { id: "appointment", label: "인사 발령 시뮬레이터" },
        ],
      },
      {
        label: "임직원 생애주기",
        items: [
          { id: "lifecycle", label: "온보딩/오프보딩 가이드" },
          { id: "profiles", label: "사원 프로필 마스터" },
        ],
      },
    ],
  },
  {
    key: "time",
    no: "03",
    label: "근태 & 시간 관리",
    icon: <Clock3 size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "근로 시간 제어",
        items: [
          { id: "scheduling", label: "근무 스케줄링 엔진" },
          { id: "work-risk", label: "근로 제한 리스크 알림" },
        ],
      },
      {
        label: "휴가 & 휴직 관리",
        items: [
          { id: "leave-verify", label: "법정 휴가 자동 검증 시스템" },
          { id: "leave-apply", label: "상시 휴가 신청 프로세스" },
        ],
      },
    ],
  },
  {
    key: "pay",
    no: "04",
    label: "급여 & 보상 정산",
    icon: <Wallet size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "급여 운영 엔진",
        items: [
          { id: "payroll", label: "월간 급여 정산 프로세스" },
          { id: "year-end", label: "연말정산 시뮬레이터" },
        ],
      },
      {
        label: "경영 비용 분석",
        items: [
          { id: "labor-cost", label: "인력 운영비 다각도 리포트" },
          { id: "merit", label: "메리트 매트릭스 시뮬레이터" },
        ],
      },
      {
        label: "보상 포트폴리오",
        items: [{ id: "rewards", label: "토탈 리워드 포탈" }],
      },
    ],
  },
  {
    key: "perf",
    no: "05",
    label: "성과 & 몰입 관리",
    icon: <Target size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "목표 정렬 프로세스",
        items: [
          { id: "okr", label: "전사/조직/개인 OKR" },
          { id: "kpi", label: "KPI 실적 트래킹" },
        ],
      },
      {
        label: "상시 다면 평가",
        items: [
          { id: "feedback", label: "지속적 360도 피드백" },
          { id: "calibration", label: "종합 인사 평가 매트릭스" },
          { id: "talent", label: "9-Box 탤런트 맵" },
        ],
      },
    ],
  },
  {
    key: "welfare",
    no: "06",
    label: "복리후생 & 지원",
    icon: <HandHeart size={17} strokeWidth={1.75} />,
    subs: [
      {
        label: "맞춤형 복지 선택",
        items: [{ id: "welfare-points", label: "사내 복지 포인트 관리" }],
      },
      {
        label: "비용 영수증 청구",
        items: [{ id: "receipt", label: "AI 영수증 자동 인식" }],
      },
    ],
  },
];

const AUTH_STORAGE_KEY = "nx-hr-authed";

export default function App() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem(AUTH_STORAGE_KEY) === "1"
  );
  const [route, setRoute] = useState<RouteId>("hub");
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [raisePct, setRaisePct] =
    useState<Record<PerformanceGrade, number>>(DEFAULT_RAISE);
  const [approvals, setApprovals] =
    useState<ApprovalItem[]>(INITIAL_APPROVALS);
  const [rewardsSelectedId, setRewardsSelectedId] = useState(
    INITIAL_EMPLOYEES[0].id
  );
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null
  );
  const [punchedInAt, setPunchedInAt] = useState<number | null>(null);
  const [todayBaseMinutes, setTodayBaseMinutes] = useState(0);
  const approvalSeq = useRef(0);

  const currentUser = useMemo(
    () =>
      employees.find((e) => e.id === CURRENT_USER_ID) ?? employees[0],
    [employees]
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  const login = useCallback(() => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, "1");
    setAuthed(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthed(false);
    setRoute("hub");
    setPanel(null);
  }, []);

  /* 등급 변경 → 성과급 재산정 → 시뮬레이터·리워드·탤런트에 즉시 전파 */
  const changeGrade = useCallback(
    (employeeId: string, grade: PerformanceGrade) => {
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === employeeId
            ? { ...e, grade, bonus: calcBonus(e.salary, grade) }
            : e
        )
      );
    },
    []
  );

  const changeRaise = useCallback(
    (grade: PerformanceGrade, value: number) => {
      setRaisePct((prev) => ({ ...prev, [grade]: value }));
    },
    []
  );

  const openProfile = useCallback((employeeId: string) => {
    setPanel({ mode: "profile", employeeId });
  }, []);

  const startLeave = useCallback((employeeId: string) => {
    setPanel({ mode: "leave", employeeId });
  }, []);

  const submitLeave = useCallback(
    (employeeId: string, dateLabel: string) => {
      const target = employees.find((e) => e.id === employeeId);
      if (!target) return;
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === employeeId
            ? { ...e, leaveRemaining: Math.max(0, e.leaveRemaining - 1) }
            : e
        )
      );
      approvalSeq.current += 1;
      setApprovals((prev) => [
        {
          id: `ap-ai-${approvalSeq.current}`,
          kind: "연차",
          title: `연차휴가 1일 (${dateLabel}) · AI 상신`,
          requester: target.name,
          dept: target.dept,
          due: "방금 상신",
          urgent: false,
        },
        ...prev,
      ]);
      setPanel(null);
      showToast(
        `${target.name}님의 ${dateLabel} 연차가 상신됐어요 — 결재 대기 큐에 등록`
      );
    },
    [employees, showToast]
  );

  const approve = useCallback(
    (approvalId: string) => {
      const item = approvals.find((a) => a.id === approvalId);
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      if (item) showToast(`승인 완료 — ${item.kind} · ${item.requester}`);
    },
    [approvals, showToast]
  );

  const reject = useCallback(
    (approvalId: string) => {
      const item = approvals.find((a) => a.id === approvalId);
      setApprovals((prev) => prev.filter((a) => a.id !== approvalId));
      if (item) showToast(`반려 처리 — ${item.kind} · ${item.requester}`);
    },
    [approvals, showToast]
  );

  const punch = useCallback(() => {
    if (punchedInAt === null) {
      setPunchedInAt(Date.now());
      showToast("출근 펀치 완료 — 좋은 하루 되세요!");
    } else {
      const minutes = Math.max(0, (Date.now() - punchedInAt) / 60000);
      setTodayBaseMinutes((prev) => prev + minutes);
      setPunchedInAt(null);
      showToast("퇴근 펀치 완료 — 오늘 근무가 기록됐어요");
    }
  }, [punchedInAt, showToast]);

  /* AI 옴니바 자연어 명령 라우터 */
  const handleCommand = useCallback(
    (query: string) => {
      const q = query.toLowerCase();

      if (q.includes("연차") || q.includes("leave")) {
        setPanel({ mode: "leave", employeeId: currentUser.id });
        return;
      }

      const matched = employees.find((e) => q.includes(e.name));
      if (matched) {
        setPanel({ mode: "profile", employeeId: matched.id });
        return;
      }

      const routeHit = ROUTE_KEYWORDS.find((entry) =>
        entry.words.some((word) => q.includes(word))
      );
      if (routeHit) {
        setRoute(routeHit.route);
        showToast(`이동 완료 — ${query}`);
        return;
      }

      if (q.includes("휴가")) {
        setPanel({ mode: "leave", employeeId: currentUser.id });
        return;
      }

      showToast(`“${query}” 명령을 이해하지 못했어요 — 추천 명령을 활용해 보세요`);
    },
    [currentUser.id, employees, showToast]
  );

  const panelEmployee = panel
    ? employees.find((e) => e.id === panel.employeeId) ?? null
    : null;

  const renderRoute = () => {
    switch (route) {
      case "hub":
        return (
          <DashboardHub
            employees={employees}
            raisePct={raisePct}
            currentUser={currentUser}
            approvals={approvals}
            punchedInAt={punchedInAt}
            todayBaseMinutes={todayBaseMinutes}
            onPunch={punch}
            onApprove={approve}
            onReject={reject}
            onOpenProfile={openProfile}
            onNavigate={setRoute}
          />
        );
      case "timeline":
        return <TimelineView approvals={approvals} />;
      case "assistant":
        return (
          <AssistantView
            currentUser={currentUser}
            onCommand={handleCommand}
            onStartLeave={startLeave}
          />
        );
      case "org-chart":
        return <OrgChartView employees={employees} onOpenProfile={openProfile} />;
      case "appointment":
        return <AppointmentSimView employees={employees} showToast={showToast} />;
      case "lifecycle":
        return <LifecycleView showToast={showToast} />;
      case "profiles":
        return <ProfilesView employees={employees} onOpenProfile={openProfile} />;
      case "scheduling":
        return <SchedulingView employees={employees} showToast={showToast} />;
      case "work-risk":
        return (
          <WorkRiskView
            employees={employees}
            showToast={showToast}
            onOpenProfile={openProfile}
          />
        );
      case "leave-verify":
        return (
          <LeaveVerifyView
            employees={employees}
            showToast={showToast}
            onOpenProfile={openProfile}
          />
        );
      case "leave-apply":
        return (
          <LeaveApplyView
            currentUser={currentUser}
            employees={employees}
            approvals={approvals}
            onStartLeave={startLeave}
          />
        );
      case "payroll":
        return <PayrollRunView employees={employees} showToast={showToast} />;
      case "year-end":
        return <YearEndTaxView currentUser={currentUser} />;
      case "labor-cost":
        return <LaborCostView employees={employees} />;
      case "merit":
        return (
          <MeritView
            employees={employees}
            raisePct={raisePct}
            onChangeRaise={changeRaise}
            onReset={() => {
              setRaisePct(DEFAULT_RAISE);
              showToast("인상률이 기본값으로 복원됐어요");
            }}
          />
        );
      case "rewards":
        return (
          <RewardsView
            employees={employees}
            raisePct={raisePct}
            selectedId={rewardsSelectedId}
            onSelect={setRewardsSelectedId}
          />
        );
      case "okr":
        return <OkrView currentUser={currentUser} />;
      case "kpi":
        return <KpiView />;
      case "feedback":
        return (
          <FeedbackView
            currentUser={currentUser}
            employees={employees}
            showToast={showToast}
          />
        );
      case "calibration":
        return (
          <CalibrationView
            employees={employees}
            onChangeGrade={changeGrade}
            onFinalize={() =>
              showToast(
                "보정 결과가 확정됐어요 — 시뮬레이터와 탤런트 보드에 반영됩니다"
              )
            }
            onOpenProfile={openProfile}
          />
        );
      case "talent":
        return <TalentView employees={employees} onOpenProfile={openProfile} />;
      case "welfare-points":
        return (
          <WelfarePointsView currentUser={currentUser} employees={employees} />
        );
      case "receipt":
        return <ReceiptView showToast={showToast} />;
    }
  };

  if (!authed) {
    return <LoginView onLogin={login} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopBar
        userName={currentUser.name}
        userRole={`${currentUser.dept} · ${currentUser.role}`}
        notificationCount={approvals.length}
        onCommand={handleCommand}
        onOpenProfile={() => openProfile(currentUser.id)}
        onLogout={logout}
      />

      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-72 flex-none flex-col border-r border-hairline-soft px-4 py-6 lg:flex">
          <div className="nx-scroll min-h-0 flex-1 overflow-y-auto pr-1">
            <SideNav sections={NAV_SECTIONS} active={route} onChange={setRoute} />
          </div>
          <button
            type="button"
            onClick={() => openProfile(currentUser.id)}
            className="mt-4 flex flex-none items-center gap-3 rounded-field p-3 text-left transition-colors hover:bg-ink/5"
          >
            <Avatar name={currentUser.name} size={36} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {currentUser.name}
              </span>
              <span className="block truncate text-xs text-ink-400">
                {currentUser.dept} · {currentUser.role}
              </span>
            </span>
          </button>
        </aside>

        <main className="min-w-0 flex-1 px-8 py-9">
          <div className="mx-auto max-w-[1240px]">{renderRoute()}</div>
        </main>
      </div>

      {panel && panelEmployee && (
        <DetailPanel
          mode={panel.mode}
          employee={panelEmployee}
          isCurrentUser={panelEmployee.id === currentUser.id}
          onClose={() => setPanel(null)}
          onStartLeave={startLeave}
          onSubmitLeave={submitLeave}
        />
      )}

      {toast && <Toast key={toast.id} message={toast.message} />}
    </div>
  );
}
