/* ============================================================
   NexChip HR Enterprise — 전역 Mock 데이터 & 도메인 헬퍼
   넥스칩 세미콘 (반도체 제조·설계 · 임직원 3,000명)
   핵심 인재풀 스냅샷 15명 + 보상 시뮬레이션 모델
   ============================================================ */

export type PerformanceGrade = "S" | "A" | "B" | "C";
export type PotentialLevel = 1 | 2 | 3;
export type ShiftCode = "DAY" | "SWING" | "NIGHT" | "OFFICE";
export type RouteId = "hub" | "calibration" | "merit" | "rewards" | "talent";

export interface RsuGrant {
  date: string;
  units: number;
  value: number;
  vested: boolean;
  note: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  dept: string;
  role: string;
  salary: number;
  compaRatio: number;
  grade: PerformanceGrade;
  okrRate: number;
  potential: PotentialLevel;
  bonus: number;
  welfare: number;
  leaveRemaining: number;
  shift: ShiftCode;
  rsu: RsuGrant[];
}

export interface ApprovalItem {
  id: string;
  kind: "연차" | "초과근무" | "채용 품의" | "경조 지원" | "해외 출장";
  title: string;
  requester: string;
  dept: string;
  due: string;
  urgent: boolean;
}

export interface PeerFeedbackItem {
  id: string;
  from: string;
  fromDept: string;
  to: string;
  message: string;
  tags: string[];
  time: string;
}

export interface OkrKeyResult {
  id: string;
  title: string;
  progress: number;
  owner: string;
}

export interface AttendanceDay {
  day: string;
  hours: number;
  isToday: boolean;
}

/* ------------------------------------------------------------
   성과 등급 · 잠재력 메타
   ------------------------------------------------------------ */

export const GRADES: PerformanceGrade[] = ["S", "A", "B", "C"];

export const GRADE_META: Record<
  PerformanceGrade,
  { label: string; desc: string; target: number; bonusRatio: number }
> = {
  S: { label: "S", desc: "탁월", target: 0.1, bonusRatio: 0.35 },
  A: { label: "A", desc: "우수", target: 0.25, bonusRatio: 0.2 },
  B: { label: "B", desc: "충족", target: 0.5, bonusRatio: 0.11 },
  C: { label: "C", desc: "보완", target: 0.15, bonusRatio: 0.05 },
};

export const POTENTIAL_META: Record<PotentialLevel, { label: string }> = {
  3: { label: "잠재력 고" },
  2: { label: "잠재력 중" },
  1: { label: "잠재력 저" },
};

export const SHIFT_META: Record<
  ShiftCode,
  { label: string; line: string; window: string }
> = {
  DAY: { label: "주간 교대", line: "이천 P3 라인", window: "06:00 – 14:00" },
  SWING: { label: "오후 교대", line: "이천 P3 라인", window: "14:00 – 22:00" },
  NIGHT: { label: "야간 교대", line: "평택 P4 라인", window: "22:00 – 06:00" },
  OFFICE: { label: "상주 근무", line: "판교 R&D 캠퍼스", window: "09:00 – 18:00" },
};

/* 등급 변경 시 성과급 재산정 (S 35% / A 20% / B 11% / C 5%) */
export function calcBonus(salary: number, grade: PerformanceGrade): number {
  return Math.round((salary * GRADE_META[grade].bonusRatio) / 100000) * 100000;
}

function welfareFor(salary: number): number {
  return Math.round((salary * 0.048) / 100000) * 100000;
}

/* ------------------------------------------------------------
   임직원 15명 고해상도 스냅샷
   (메모리 소자설계 · 공정개발 · 수율개선 · HRBP · 글로벌 마케팅)
   ------------------------------------------------------------ */

interface EmployeeSeed extends Omit<Employee, "bonus" | "welfare"> {}

const EMPLOYEE_SEEDS: EmployeeSeed[] = [
  {
    id: "NC-1001", name: "김도현", position: "수석연구원", dept: "공정개발그룹",
    role: "EUV 포토 공정 리드", salary: 168000000, compaRatio: 1.12, grade: "S",
    okrRate: 108, potential: 3, leaveRemaining: 8, shift: "DAY",
    rsu: [
      { date: "2024-03-02", units: 1200, value: 96000000, vested: true, note: "입사 리텐션 부여" },
      { date: "2025-03-02", units: 600, value: 52000000, vested: true, note: "1차 귀속 (25%)" },
      { date: "2026-03-02", units: 600, value: 58000000, vested: true, note: "2차 귀속 (25%)" },
      { date: "2027-03-02", units: 1200, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1002", name: "이서연", position: "책임연구원", dept: "메모리 소자설계팀",
    role: "DRAM 셀 아키텍처", salary: 152000000, compaRatio: 1.08, grade: "S",
    okrRate: 104, potential: 3, leaveRemaining: 11, shift: "OFFICE",
    rsu: [
      { date: "2024-09-01", units: 900, value: 71000000, vested: true, note: "핵심인재 특별 부여" },
      { date: "2025-09-01", units: 450, value: 38000000, vested: true, note: "1차 귀속 (25%)" },
      { date: "2026-09-01", units: 450, value: 0, vested: false, note: "2차 귀속 (25%)" },
      { date: "2027-09-01", units: 900, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1003", name: "박지훈", position: "팀장", dept: "수율개선팀",
    role: "수율 분석 총괄", salary: 138000000, compaRatio: 1.05, grade: "A",
    okrRate: 96, potential: 2, leaveRemaining: 5, shift: "DAY",
    rsu: [
      { date: "2025-01-02", units: 500, value: 41000000, vested: true, note: "리더십 부여" },
      { date: "2027-01-02", units: 500, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1004", name: "최유진", position: "디렉터", dept: "글로벌 마케팅팀",
    role: "북미 파운드리 고객 총괄", salary: 142000000, compaRatio: 1.02, grade: "A",
    okrRate: 98, potential: 3, leaveRemaining: 9, shift: "OFFICE",
    rsu: [
      { date: "2024-06-01", units: 800, value: 62000000, vested: true, note: "입사 리텐션 부여" },
      { date: "2026-06-01", units: 400, value: 0, vested: false, note: "1차 귀속 (25%)" },
      { date: "2028-06-01", units: 400, value: 0, vested: false, note: "2차 귀속 (25%)" },
    ],
  },
  {
    id: "NC-1005", name: "정민재", position: "책임연구원", dept: "메모리 소자설계팀",
    role: "GAA 트랜지스터 설계", salary: 118000000, compaRatio: 0.98, grade: "A",
    okrRate: 92, potential: 2, leaveRemaining: 7, shift: "OFFICE",
    rsu: [
      { date: "2025-03-02", units: 400, value: 33000000, vested: true, note: "연구 성과 부여" },
      { date: "2027-03-02", units: 400, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1006", name: "강하은", position: "책임연구원", dept: "공정개발그룹",
    role: "식각(Etch) 공정 개발", salary: 121000000, compaRatio: 1.01, grade: "A",
    okrRate: 95, potential: 3, leaveRemaining: 12, shift: "SWING",
    rsu: [
      { date: "2025-09-01", units: 450, value: 38000000, vested: true, note: "핵심인재 특별 부여" },
      { date: "2026-09-01", units: 225, value: 0, vested: false, note: "1차 귀속 (25%)" },
      { date: "2027-09-01", units: 675, value: 0, vested: false, note: "잔여 귀속 (75%)" },
    ],
  },
  {
    id: "NC-1007", name: "윤성호", position: "선임매니저", dept: "HRBP팀",
    role: "제조부문 HRBP", salary: 96000000, compaRatio: 0.97, grade: "B",
    okrRate: 84, potential: 2, leaveRemaining: 6, shift: "OFFICE",
    rsu: [
      { date: "2026-01-02", units: 200, value: 0, vested: false, note: "운영 안정화 부여 예정" },
    ],
  },
  {
    id: "NC-1008", name: "한지민", position: "선임연구원", dept: "수율개선팀",
    role: "결함 데이터 분석", salary: 92000000, compaRatio: 0.94, grade: "B",
    okrRate: 88, potential: 3, leaveRemaining: 10, shift: "NIGHT",
    rsu: [
      { date: "2025-06-01", units: 250, value: 19000000, vested: true, note: "성장 트랙 부여" },
      { date: "2027-06-01", units: 250, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1009", name: "오태양", position: "매니저", dept: "글로벌 마케팅팀",
    role: "유럽 채널 마케팅", salary: 89000000, compaRatio: 0.92, grade: "B",
    okrRate: 81, potential: 2, leaveRemaining: 4, shift: "OFFICE",
    rsu: [
      { date: "2026-06-01", units: 150, value: 0, vested: false, note: "인센티브 연동 부여" },
    ],
  },
  {
    id: "NC-1010", name: "한지원", position: "책임매니저", dept: "HRBP팀",
    role: "R&D부문 HRBP 리드", salary: 98000000, compaRatio: 0.99, grade: "B",
    okrRate: 90, potential: 3, leaveRemaining: 8, shift: "OFFICE",
    rsu: [
      { date: "2025-09-01", units: 180, value: 14000000, vested: true, note: "성장 트랙 부여" },
      { date: "2027-09-01", units: 180, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1011", name: "임준혁", position: "선임엔지니어", dept: "공정개발그룹",
    role: "박막 증착(CVD) 공정", salary: 87000000, compaRatio: 0.95, grade: "B",
    okrRate: 79, potential: 1, leaveRemaining: 3, shift: "NIGHT",
    rsu: [],
  },
  {
    id: "NC-1012", name: "노아라", position: "선임연구원", dept: "메모리 소자설계팀",
    role: "설계 검증(DV)", salary: 90000000, compaRatio: 0.96, grade: "B",
    okrRate: 86, potential: 3, leaveRemaining: 13, shift: "OFFICE",
    rsu: [
      { date: "2026-03-02", units: 200, value: 0, vested: false, note: "성장 트랙 부여 예정" },
    ],
  },
  {
    id: "NC-1013", name: "황민수", position: "엔지니어", dept: "수율개선팀",
    role: "인라인 계측 운영", salary: 78000000, compaRatio: 0.88, grade: "C",
    okrRate: 68, potential: 2, leaveRemaining: 5, shift: "SWING",
    rsu: [],
  },
  {
    id: "NC-1014", name: "송다은", position: "스페셜리스트", dept: "글로벌 마케팅팀",
    role: "마켓 인텔리전스", salary: 72000000, compaRatio: 0.85, grade: "C",
    okrRate: 64, potential: 1, leaveRemaining: 9, shift: "OFFICE",
    rsu: [],
  },
  {
    id: "NC-1015", name: "백승우", position: "매니저", dept: "HRBP팀",
    role: "피플 애널리틱스", salary: 75000000, compaRatio: 0.87, grade: "C",
    okrRate: 71, potential: 1, leaveRemaining: 6, shift: "OFFICE",
    rsu: [],
  },
];

export const INITIAL_EMPLOYEES: Employee[] = EMPLOYEE_SEEDS.map((seed) => ({
  ...seed,
  bonus: calcBonus(seed.salary, seed.grade),
  welfare: welfareFor(seed.salary),
}));

/* 로그인 페르소나 — R&D부문 HRBP 리드 */
export const CURRENT_USER_ID = "NC-1010";

/* ------------------------------------------------------------
   메리트 매트릭스 — 핵심 인재풀 312명 환산 모델
   (표시되는 15명은 대표 프로필 · 예산 풀 25억 원)
   ------------------------------------------------------------ */

export const BUDGET_POOL = 2500000000;
export const TALENT_POOL_SIZE = 312;

export const TIER_HEADCOUNT: Record<PerformanceGrade, number> = {
  S: 28, A: 84, B: 142, C: 58,
};

export const TIER_FALLBACK_AVG: Record<PerformanceGrade, number> = {
  S: 155000000, A: 125000000, B: 90000000, C: 75000000,
};

export const DEFAULT_RAISE: Record<PerformanceGrade, number> = {
  S: 9, A: 6, B: 3.5, C: 1.5,
};

export function tierAvgSalary(
  employees: Employee[],
  grade: PerformanceGrade
): number {
  const list = employees.filter((e) => e.grade === grade);
  if (list.length === 0) return TIER_FALLBACK_AVG[grade];
  return list.reduce((sum, e) => sum + e.salary, 0) / list.length;
}

export function simTotal(
  employees: Employee[],
  raisePct: Record<PerformanceGrade, number>
): number {
  return GRADES.reduce(
    (sum, g) =>
      sum + TIER_HEADCOUNT[g] * tierAvgSalary(employees, g) * (raisePct[g] / 100),
    0
  );
}

/* ------------------------------------------------------------
   ₩ 포맷터
   ------------------------------------------------------------ */

export function fmtWon(n: number): string {
  return "₩" + Math.round(n).toLocaleString("ko-KR");
}

/* 1억 6,800만 원 스타일 */
export function fmtKorean(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  const eok = Math.floor(abs / 100000000);
  const man = Math.round((abs % 100000000) / 10000);
  if (eok && man)
    return `${sign}${eok.toLocaleString("ko-KR")}억 ${man.toLocaleString("ko-KR")}만 원`;
  if (eok) return `${sign}${eok.toLocaleString("ko-KR")}억 원`;
  if (man) return `${sign}${man.toLocaleString("ko-KR")}만 원`;
  return `${sign}${abs.toLocaleString("ko-KR")}원`;
}

/* 15.4억 스타일 (요약 숫자용) */
export function fmtEok(n: number): string {
  return (
    (n / 100000000).toLocaleString("ko-KR", { maximumFractionDigits: 1 }) + "억"
  );
}

export function fmtCompa(n: number): string {
  return n.toFixed(2);
}

export function fmtHours(n: number): string {
  const h = Math.floor(n);
  const m = Math.round((n - h) * 60);
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

/* ------------------------------------------------------------
   타임 & 어텐던스 — 주 52시간 모델
   ------------------------------------------------------------ */

export const WEEKLY_CAP_HOURS = 52;
export const WEEKLY_STANDARD_HOURS = 40;

/* 기준일: 2026-06-10 (수) — 월·화는 확정 기록, 수요일은 라이브 집계 */
export const WEEK_ATTENDANCE: AttendanceDay[] = [
  { day: "월", hours: 8.5, isToday: false },
  { day: "화", hours: 9.5, isToday: false },
  { day: "수", hours: 0, isToday: true },
  { day: "목", hours: 0, isToday: false },
  { day: "금", hours: 0, isToday: false },
];

export const WEEK_BASE_MINUTES = WEEK_ATTENDANCE.reduce(
  (sum, d) => sum + d.hours * 60,
  0
);

/* ------------------------------------------------------------
   애자일 OKR & 피어 피드백 스트림
   ------------------------------------------------------------ */

export const MY_KEY_RESULTS: OkrKeyResult[] = [
  { id: "kr-1", title: "2026 보상 사이클 적시 완결률 100%", progress: 78, owner: "한지원" },
  { id: "kr-2", title: "핵심 인재 유지율 97% 방어", progress: 92, owner: "한지원" },
  { id: "kr-3", title: "피플 애널리틱스 대시보드 v2 론칭", progress: 64, owner: "한지원" },
];

export const PEER_FEEDBACK: PeerFeedbackItem[] = [
  {
    id: "pf-1", from: "박지훈", fromDept: "수율개선팀", to: "한지민",
    message: "결함 맵 클러스터링 모델 덕분에 D2 라인 수율 이슈를 하루 만에 잡았습니다. 데이터 드리븐 협업의 정석!",
    tags: ["수율개선", "데이터협업"], time: "26분 전",
  },
  {
    id: "pf-2", from: "김도현", fromDept: "공정개발그룹", to: "강하은",
    message: "EUV–식각 인터페이스 조건을 함께 튜닝해 준 덕분에 신규 레시피 검증이 2주 단축됐어요.",
    tags: ["공정협업", "리드타임단축"], time: "1시간 전",
  },
  {
    id: "pf-3", from: "이서연", fromDept: "메모리 소자설계팀", to: "노아라",
    message: "DV 커버리지 리포트가 정말 깔끔했습니다. 설계 리뷰 속도가 확 올라갔어요.",
    tags: ["설계검증", "품질"], time: "3시간 전",
  },
  {
    id: "pf-4", from: "최유진", fromDept: "글로벌 마케팅팀", to: "송다은",
    message: "북미 고객사 인텔리전스 브리핑이 수주 미팅의 결정타였습니다. 감사합니다!",
    tags: ["마켓인텔리전스", "수주기여"], time: "어제",
  },
];

/* ------------------------------------------------------------
   엔터프라이즈 결재 대기 큐
   ------------------------------------------------------------ */

export const INITIAL_APPROVALS: ApprovalItem[] = [
  {
    id: "ap-1", kind: "연차", title: "연차휴가 1일 (6/12 금)",
    requester: "강하은", dept: "공정개발그룹", due: "오늘 마감", urgent: true,
  },
  {
    id: "ap-2", kind: "초과근무", title: "야간 라인 비상 대응 6시간",
    requester: "임준혁", dept: "공정개발그룹", due: "D-1", urgent: true,
  },
  {
    id: "ap-3", kind: "채용 품의", title: "수율개선팀 TO 2명 증원",
    requester: "박지훈", dept: "수율개선팀", due: "D-3", urgent: false,
  },
  {
    id: "ap-4", kind: "해외 출장", title: "북미 고객사 QBR 출장 5일",
    requester: "최유진", dept: "글로벌 마케팅팀", due: "D-5", urgent: false,
  },
  {
    id: "ap-5", kind: "경조 지원", title: "경조금 및 경조휴가 신청",
    requester: "오태양", dept: "글로벌 마케팅팀", due: "D-7", urgent: false,
  },
];

/* ------------------------------------------------------------
   내러티브 HR 애널리틱스
   ------------------------------------------------------------ */

export const ORG_HEALTH_SCORE = 94;
export const RND_RETENTION_DELTA = 2.4;
export const ORG_RETENTION_RATE = 96.8;
export const ENGAGEMENT_INDEX = 8.6;

/* ------------------------------------------------------------
   AI 옴니바 명령 사전
   ------------------------------------------------------------ */

export interface OmnibarSuggestion {
  id: string;
  label: string;
  hint: string;
  query: string;
}

export const OMNIBAR_SUGGESTIONS: OmnibarSuggestion[] = [
  { id: "sg-1", label: "연차 신청 안내 받기", hint: "AI Leave Application", query: "연차 신청" },
  { id: "sg-2", label: "메리트 시뮬레이터 열기", hint: "Merit Matrix", query: "메리트 시뮬레이터" },
  { id: "sg-3", label: "김도현 프로필 보기", hint: "Employee Profile", query: "김도현" },
  { id: "sg-4", label: "9-Box 탤런트 맵 이동", hint: "Talent Mapping", query: "탤런트 맵" },
];
