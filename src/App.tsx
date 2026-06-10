import {
  Gauge,
  Grid3X3,
  LayoutDashboard,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DetailPanel, type PanelMode } from "./components/panel/DetailPanel";
import { TopBar } from "./components/layout/TopBar";
import { Avatar } from "./components/ui/Avatar";
import { SideNav, type SideNavGroup } from "./components/ui/SideNav";
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
import { CalibrationView } from "./views/CalibrationView";
import { DashboardHub } from "./views/DashboardHub";
import { MeritView } from "./views/MeritView";
import { RewardsView } from "./views/RewardsView";
import { TalentView } from "./views/TalentView";

interface PanelState {
  mode: PanelMode;
  employeeId: string;
}

const ROUTE_KEYWORDS: { route: RouteId; words: string[] }[] = [
  { route: "merit", words: ["메리트", "시뮬레이터", "인상", "merit"] },
  { route: "calibration", words: ["보정", "등급", "calibration"] },
  { route: "rewards", words: ["리워드", "보상", "rsu", "reward"] },
  { route: "talent", words: ["탤런트", "9box", "9-box", "나인박스", "talent"] },
  { route: "hub", words: ["허브", "대시보드", "홈", "dashboard"] },
];

export default function App() {
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

      if (q.includes("연차") || q.includes("휴가") || q.includes("leave")) {
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

      showToast(`“${query}” 명령을 이해하지 못했어요 — 추천 명령을 활용해 보세요`);
    },
    [currentUser.id, employees, showToast]
  );

  const navGroups: SideNavGroup[] = [
    {
      label: "워크스페이스",
      items: [
        { id: "hub", label: "대시보드 허브", icon: <LayoutDashboard size={17} strokeWidth={1.75} /> },
      ],
    },
    {
      label: "성과 · 보상",
      items: [
        { id: "calibration", label: "성과 등급 보정", icon: <Gauge size={17} strokeWidth={1.75} /> },
        { id: "merit", label: "메리트 매트릭스", icon: <SlidersHorizontal size={17} strokeWidth={1.75} /> },
        { id: "rewards", label: "토탈 리워드", icon: <Wallet size={17} strokeWidth={1.75} /> },
        { id: "talent", label: "9-Box 탤런트 맵", icon: <Grid3X3 size={17} strokeWidth={1.75} /> },
      ],
    },
  ];

  const panelEmployee = panel
    ? employees.find((e) => e.id === panel.employeeId) ?? null
    : null;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <TopBar
        userName={currentUser.name}
        userRole={`${currentUser.dept} · ${currentUser.role}`}
        notificationCount={approvals.length}
        onCommand={handleCommand}
        onOpenProfile={() => openProfile(currentUser.id)}
      />

      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-64 flex-none flex-col border-r border-hairline-soft px-4 py-7 lg:flex">
          <SideNav groups={navGroups} active={route} onChange={setRoute} />
          <button
            type="button"
            onClick={() => openProfile(currentUser.id)}
            className="mt-auto flex items-center gap-3 rounded-field p-3 text-left transition-colors hover:bg-ink/5"
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
          <div className="mx-auto max-w-[1240px]">
            {route === "hub" && (
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
            )}
            {route === "calibration" && (
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
            )}
            {route === "merit" && (
              <MeritView
                employees={employees}
                raisePct={raisePct}
                onChangeRaise={changeRaise}
                onReset={() => {
                  setRaisePct(DEFAULT_RAISE);
                  showToast("인상률이 기본값으로 복원됐어요");
                }}
              />
            )}
            {route === "rewards" && (
              <RewardsView
                employees={employees}
                raisePct={raisePct}
                selectedId={rewardsSelectedId}
                onSelect={setRewardsSelectedId}
              />
            )}
            {route === "talent" && (
              <TalentView employees={employees} onOpenProfile={openProfile} />
            )}
          </div>
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
