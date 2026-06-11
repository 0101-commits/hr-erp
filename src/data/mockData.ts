/* ============================================================
   NexChip HR Enterprise — 전역 Mock 데이터 & 도메인 헬퍼
   넥스칩 세미콘 그룹 (반도체 제조·설계 · 3개 법인 · 임직원 3,000여 명)
   시드 고정 결정적 더미 데이터 생성기 + 보상 시뮬레이션 모델
   ============================================================ */

export type PerformanceGrade = "S" | "A" | "B" | "C";
export type PotentialLevel = 1 | 2 | 3;
export type ShiftCode = "DAY" | "SWING" | "NIGHT" | "OFFICE";

/* 하이브리드 융합형 IA — 대메뉴 6개 산하 소메뉴 라우트 */
export type RouteId =
  /* 01. 홈 & 업무 공간 */
  | "hub"
  | "timeline"
  | "assistant"
  /* 02. 조직 & 인사 관리 */
  | "org-chart"
  | "appointment"
  | "lifecycle"
  | "profiles"
  /* 03. 근태 & 시간 관리 */
  | "scheduling"
  | "work-risk"
  | "leave-verify"
  | "leave-apply"
  /* 04. 급여 & 보상 정산 */
  | "payroll"
  | "year-end"
  | "labor-cost"
  | "merit"
  | "rewards"
  /* 05. 성과 & 몰입 관리 */
  | "okr"
  | "kpi"
  | "feedback"
  | "calibration"
  | "talent"
  /* 06. 복리후생 & 지원 */
  | "welfare-points"
  | "receipt";

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
  entity: string;
  division: string;
  dept: string;
  role: string;
  salary: number;
  compaRatio: number;
  grade: PerformanceGrade;
  okrRate: number;
  potential: PotentialLevel;
  bonus: number;
  welfare: number;
  welfareUsed: number;
  leaveRemaining: number;
  shift: ShiftCode;
  weekHours: number; // 이번 주 예상 누적 근로시간 (주 52시간 리스크 모니터링)
  tenureYears: number;
  childAge: number | null; // 막내 자녀 만 나이 (법정 휴가 적격 검증용)
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

export interface NoticeItem {
  id: string;
  tag: string;
  title: string;
  body: string;
  date: string;
  pinned: boolean;
}

export interface OrgChangeItem {
  id: string;
  kind: "발령" | "입사" | "퇴사" | "조직개편";
  message: string;
  time: string;
}

/* ------------------------------------------------------------
   성과 등급 · 잠재력 · 교대 메타
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
   핵심 인재 15명 고해상도 시드 프로필
   (메모리 소자설계 · 공정개발 · 수율개선 · HRBP · 글로벌 마케팅)
   ------------------------------------------------------------ */

interface EmployeeSeed extends Omit<Employee, "bonus" | "welfare"> {}

const HQ = "넥스칩 세미콘";

const EMPLOYEE_SEEDS: EmployeeSeed[] = [
  {
    id: "NC-1001", name: "김도현", position: "수석연구원", entity: HQ,
    division: "R&D부문", dept: "공정개발그룹",
    role: "EUV 포토 공정 총괄", salary: 168000000, compaRatio: 1.12, grade: "S",
    okrRate: 108, potential: 3, leaveRemaining: 8, shift: "DAY",
    weekHours: 46.5, tenureYears: 11, childAge: 7, welfareUsed: 5200000,
    rsu: [
      { date: "2024-03-02", units: 1200, value: 96000000, vested: true, note: "입사 시 재직 유지 조건 부여" },
      { date: "2025-03-02", units: 600, value: 52000000, vested: true, note: "1차 귀속 (25%)" },
      { date: "2026-03-02", units: 600, value: 58000000, vested: true, note: "2차 귀속 (25%)" },
      { date: "2027-03-02", units: 1200, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1002", name: "이서연", position: "책임연구원", entity: HQ,
    division: "R&D부문", dept: "메모리 소자설계팀",
    role: "DRAM 셀 아키텍처", salary: 152000000, compaRatio: 1.08, grade: "S",
    okrRate: 104, potential: 3, leaveRemaining: 11, shift: "OFFICE",
    weekHours: 44, tenureYears: 9, childAge: null, welfareUsed: 4100000,
    rsu: [
      { date: "2024-09-01", units: 900, value: 71000000, vested: true, note: "핵심인재 특별 부여" },
      { date: "2025-09-01", units: 450, value: 38000000, vested: true, note: "1차 귀속 (25%)" },
      { date: "2026-09-01", units: 450, value: 0, vested: false, note: "2차 귀속 (25%)" },
      { date: "2027-09-01", units: 900, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1003", name: "박지훈", position: "팀장", entity: HQ,
    division: "R&D부문", dept: "수율개선팀",
    role: "수율 분석 총괄", salary: 138000000, compaRatio: 1.05, grade: "A",
    okrRate: 96, potential: 2, leaveRemaining: 5, shift: "DAY",
    weekHours: 49.5, tenureYears: 13, childAge: 10, welfareUsed: 3900000,
    rsu: [
      { date: "2025-01-02", units: 500, value: 41000000, vested: true, note: "리더십 부여" },
      { date: "2027-01-02", units: 500, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1004", name: "최유진", position: "디렉터", entity: HQ,
    division: "영업마케팅부문", dept: "글로벌 마케팅팀",
    role: "북미 파운드리 고객 총괄", salary: 142000000, compaRatio: 1.02, grade: "A",
    okrRate: 98, potential: 3, leaveRemaining: 9, shift: "OFFICE",
    weekHours: 45, tenureYears: 8, childAge: 4, welfareUsed: 4700000,
    rsu: [
      { date: "2024-06-01", units: 800, value: 62000000, vested: true, note: "입사 시 재직 유지 조건 부여" },
      { date: "2026-06-01", units: 400, value: 0, vested: false, note: "1차 귀속 (25%)" },
      { date: "2028-06-01", units: 400, value: 0, vested: false, note: "2차 귀속 (25%)" },
    ],
  },
  {
    id: "NC-1005", name: "정민재", position: "책임연구원", entity: HQ,
    division: "R&D부문", dept: "메모리 소자설계팀",
    role: "GAA 트랜지스터 설계", salary: 118000000, compaRatio: 0.98, grade: "A",
    okrRate: 92, potential: 2, leaveRemaining: 7, shift: "OFFICE",
    weekHours: 43, tenureYears: 7, childAge: 2, welfareUsed: 3100000,
    rsu: [
      { date: "2025-03-02", units: 400, value: 33000000, vested: true, note: "연구 성과 부여" },
      { date: "2027-03-02", units: 400, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1006", name: "강하은", position: "책임연구원", entity: HQ,
    division: "R&D부문", dept: "공정개발그룹",
    role: "식각(Etch) 공정 개발", salary: 121000000, compaRatio: 1.01, grade: "A",
    okrRate: 95, potential: 3, leaveRemaining: 12, shift: "SWING",
    weekHours: 47.5, tenureYears: 6, childAge: null, welfareUsed: 2600000,
    rsu: [
      { date: "2025-09-01", units: 450, value: 38000000, vested: true, note: "핵심인재 특별 부여" },
      { date: "2026-09-01", units: 225, value: 0, vested: false, note: "1차 귀속 (25%)" },
      { date: "2027-09-01", units: 675, value: 0, vested: false, note: "잔여 귀속 (75%)" },
    ],
  },
  {
    id: "NC-1007", name: "윤성호", position: "선임매니저", entity: HQ,
    division: "경영지원부문", dept: "HRBP팀",
    role: "제조부문 HRBP", salary: 96000000, compaRatio: 0.97, grade: "B",
    okrRate: 84, potential: 2, leaveRemaining: 6, shift: "OFFICE",
    weekHours: 41, tenureYears: 5, childAge: 6, welfareUsed: 2400000,
    rsu: [
      { date: "2026-01-02", units: 200, value: 0, vested: false, note: "운영 안정화 부여 예정" },
    ],
  },
  {
    id: "NC-1008", name: "한지민", position: "선임연구원", entity: HQ,
    division: "R&D부문", dept: "수율개선팀",
    role: "결함 데이터 분석", salary: 92000000, compaRatio: 0.94, grade: "B",
    okrRate: 88, potential: 3, leaveRemaining: 10, shift: "NIGHT",
    weekHours: 50.5, tenureYears: 4, childAge: null, welfareUsed: 1900000,
    rsu: [
      { date: "2025-06-01", units: 250, value: 19000000, vested: true, note: "성장 경로 부여" },
      { date: "2027-06-01", units: 250, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1009", name: "오태양", position: "매니저", entity: HQ,
    division: "영업마케팅부문", dept: "글로벌 마케팅팀",
    role: "유럽 채널 마케팅", salary: 89000000, compaRatio: 0.92, grade: "B",
    okrRate: 81, potential: 2, leaveRemaining: 4, shift: "OFFICE",
    weekHours: 42.5, tenureYears: 5, childAge: 1, welfareUsed: 3300000,
    rsu: [
      { date: "2026-06-01", units: 150, value: 0, vested: false, note: "성과 연동 부여" },
    ],
  },
  {
    id: "NC-1010", name: "한지원", position: "책임매니저", entity: HQ,
    division: "경영지원부문", dept: "HRBP팀",
    role: "R&D부문 HRBP 총괄", salary: 98000000, compaRatio: 0.99, grade: "B",
    okrRate: 90, potential: 3, leaveRemaining: 8, shift: "OFFICE",
    weekHours: 43.5, tenureYears: 6, childAge: 3, welfareUsed: 2800000,
    rsu: [
      { date: "2025-09-01", units: 180, value: 14000000, vested: true, note: "성장 경로 부여" },
      { date: "2027-09-01", units: 180, value: 0, vested: false, note: "잔여 귀속 (50%)" },
    ],
  },
  {
    id: "NC-1011", name: "임준혁", position: "선임엔지니어", entity: HQ,
    division: "R&D부문", dept: "공정개발그룹",
    role: "박막 증착(CVD) 공정", salary: 87000000, compaRatio: 0.95, grade: "B",
    okrRate: 79, potential: 1, leaveRemaining: 3, shift: "NIGHT",
    weekHours: 51.5, tenureYears: 3, childAge: null, welfareUsed: 1200000,
    rsu: [],
  },
  {
    id: "NC-1012", name: "노아라", position: "선임연구원", entity: HQ,
    division: "R&D부문", dept: "메모리 소자설계팀",
    role: "설계 검증(DV)", salary: 90000000, compaRatio: 0.96, grade: "B",
    okrRate: 86, potential: 3, leaveRemaining: 13, shift: "OFFICE",
    weekHours: 40.5, tenureYears: 4, childAge: null, welfareUsed: 2100000,
    rsu: [
      { date: "2026-03-02", units: 200, value: 0, vested: false, note: "성장 경로 부여 예정" },
    ],
  },
  {
    id: "NC-1013", name: "황민수", position: "엔지니어", entity: HQ,
    division: "R&D부문", dept: "수율개선팀",
    role: "인라인 계측 운영", salary: 78000000, compaRatio: 0.88, grade: "C",
    okrRate: 68, potential: 2, leaveRemaining: 5, shift: "SWING",
    weekHours: 44.5, tenureYears: 2, childAge: null, welfareUsed: 900000,
    rsu: [],
  },
  {
    id: "NC-1014", name: "송다은", position: "스페셜리스트", entity: HQ,
    division: "영업마케팅부문", dept: "글로벌 마케팅팀",
    role: "시장 정보 분석", salary: 72000000, compaRatio: 0.85, grade: "C",
    okrRate: 64, potential: 1, leaveRemaining: 9, shift: "OFFICE",
    weekHours: 39.5, tenureYears: 2, childAge: null, welfareUsed: 1500000,
    rsu: [],
  },
  {
    id: "NC-1015", name: "백승우", position: "매니저", entity: HQ,
    division: "경영지원부문", dept: "HRBP팀",
    role: "인사 데이터 분석", salary: 75000000, compaRatio: 0.87, grade: "C",
    okrRate: 71, potential: 1, leaveRemaining: 6, shift: "OFFICE",
    weekHours: 41.5, tenureYears: 3, childAge: 9, welfareUsed: 1800000,
    rsu: [],
  },
];

/* ------------------------------------------------------------
   조직 블루프린트 — 3개 법인 · 9개 부문 · 28개 팀 (총 3,015명)
   팀별 정원에서 시드 인원을 차감한 만큼 결정적으로 생성
   ------------------------------------------------------------ */

export interface OrgUnit {
  entity: string;
  division: string;
  dept: string;
  headcount: number;
}

type TeamKind = "mfg" | "rnd" | "office";

interface TeamBlueprint {
  dept: string;
  count: number;
  kind: TeamKind;
  shifts: ShiftCode[];
  roles: string[];
}

interface DivisionBlueprint {
  division: string;
  teams: TeamBlueprint[];
}

interface EntityBlueprint {
  entity: string;
  divisions: DivisionBlueprint[];
}

const ORG_BLUEPRINT: EntityBlueprint[] = [
  {
    entity: HQ,
    divisions: [
      {
        division: "제조부문",
        teams: [
          { dept: "이천 P3 제조팀", count: 480, kind: "mfg", shifts: ["DAY", "SWING", "NIGHT"], roles: ["포토 공정 운영", "식각 공정 운영", "확산 공정 운영", "박막 공정 운영", "인라인 계측 운영"] },
          { dept: "평택 P4 제조팀", count: 430, kind: "mfg", shifts: ["DAY", "SWING", "NIGHT"], roles: ["포토 공정 운영", "세정 공정 운영", "이온주입 공정 운영", "CMP 공정 운영", "웨이퍼 반송 운영"] },
          { dept: "설비기술팀", count: 230, kind: "mfg", shifts: ["DAY", "SWING"], roles: ["포토 설비 PM", "식각 설비 PM", "반송 자동화 엔지니어링", "유틸리티 인프라 운영"] },
          { dept: "품질보증팀", count: 130, kind: "office", shifts: ["DAY"], roles: ["인라인 QA", "고객 품질 대응", "신뢰성 평가", "품질 시스템 운영"] },
        ],
      },
      {
        division: "R&D부문",
        teams: [
          { dept: "공정개발그룹", count: 220, kind: "rnd", shifts: ["DAY", "SWING", "OFFICE"], roles: ["EUV 포토 공정 개발", "식각(Etch) 공정 개발", "박막 증착(CVD) 공정", "확산·열처리 공정 개발"] },
          { dept: "메모리 소자설계팀", count: 200, kind: "rnd", shifts: ["OFFICE"], roles: ["DRAM 셀 설계", "NAND 어레이 설계", "설계 검증(DV)", "레이아웃 엔지니어링"] },
          { dept: "수율개선팀", count: 150, kind: "rnd", shifts: ["DAY", "SWING", "NIGHT"], roles: ["수율 데이터 분석", "결함 데이터 분석", "인라인 계측 운영", "FDC 모니터링"] },
          { dept: "패키징개발팀", count: 120, kind: "rnd", shifts: ["DAY", "OFFICE"], roles: ["HBM 적층 공정 개발", "범프 공정 개발", "패키지 신뢰성 평가"] },
          { dept: "소프트웨어플랫폼팀", count: 110, kind: "rnd", shifts: ["OFFICE"], roles: ["MES 플랫폼 개발", "수율 ML 모델링", "팹 데이터 파이프라인", "사내 시스템 개발"] },
        ],
      },
      {
        division: "경영지원부문",
        teams: [
          { dept: "HRBP팀", count: 45, kind: "office", shifts: ["OFFICE"], roles: ["제조부문 HRBP", "R&D부문 HRBP", "인사 데이터 분석", "조직문화 기획"] },
          { dept: "재무회계팀", count: 50, kind: "office", shifts: ["OFFICE"], roles: ["원가 회계", "자금 운용", "세무 기획", "연결 결산"] },
          { dept: "구매조달팀", count: 55, kind: "office", shifts: ["OFFICE"], roles: ["원자재 소싱", "설비 구매", "협력사 관리"] },
          { dept: "법무컴플라이언스팀", count: 25, kind: "office", shifts: ["OFFICE"], roles: ["계약 법무", "수출 통제 컴플라이언스", "특허 분쟁 대응"] },
          { dept: "IT인프라팀", count: 65, kind: "office", shifts: ["OFFICE"], roles: ["팹 네트워크 운영", "보안 관제", "ERP 시스템 운영", "클라우드 인프라"] },
        ],
      },
      {
        division: "영업마케팅부문",
        teams: [
          { dept: "글로벌 마케팅팀", count: 60, kind: "office", shifts: ["OFFICE"], roles: ["북미 고객 마케팅", "유럽 채널 마케팅", "시장 정보 분석", "기술 마케팅"] },
          { dept: "국내영업팀", count: 50, kind: "office", shifts: ["OFFICE"], roles: ["대형 고객 영업", "유통 채널 영업", "영업 기획"] },
          { dept: "해외영업팀", count: 60, kind: "office", shifts: ["OFFICE"], roles: ["중화권 영업", "북미 영업", "일본 영업", "수주 관리"] },
        ],
      },
    ],
  },
  {
    entity: "넥스칩 시스템 LSI",
    divisions: [
      {
        division: "설계부문",
        teams: [
          { dept: "SoC설계팀", count: 140, kind: "rnd", shifts: ["OFFICE"], roles: ["AP 아키텍처 설계", "ISP IP 설계", "NPU IP 설계", "RTL 설계"] },
          { dept: "아날로그설계팀", count: 85, kind: "rnd", shifts: ["OFFICE"], roles: ["PMIC 설계", "고속 인터페이스 설계", "ADC/DAC 설계"] },
          { dept: "설계검증팀", count: 75, kind: "rnd", shifts: ["OFFICE"], roles: ["UVM 검증", "에뮬레이션 검증", "포스트실리콘 검증"] },
        ],
      },
      {
        division: "경영지원부문",
        teams: [
          { dept: "경영지원팀", count: 35, kind: "office", shifts: ["OFFICE"], roles: ["인사 총무", "재무 회계", "구매 지원"] },
        ],
      },
    ],
  },
  {
    entity: "넥스칩 파운드리 서비스",
    divisions: [
      {
        division: "고객서비스부문",
        teams: [
          { dept: "고객지원팀", count: 70, kind: "office", shifts: ["OFFICE"], roles: ["고객 기술 지원", "MPW 운영", "디자인 하우스 관리"] },
          { dept: "테스트서비스팀", count: 100, kind: "mfg", shifts: ["DAY", "SWING"], roles: ["웨이퍼 테스트 운영", "패키지 테스트 운영", "테스트 프로그램 개발"] },
        ],
      },
      {
        division: "경영지원부문",
        teams: [
          { dept: "운영지원팀", count: 30, kind: "office", shifts: ["OFFICE"], roles: ["인사 총무", "구매 지원", "시설 운영"] },
        ],
      },
    ],
  },
];

export const ORG_UNITS: OrgUnit[] = ORG_BLUEPRINT.flatMap((e) =>
  e.divisions.flatMap((d) =>
    d.teams.map((t) => ({
      entity: e.entity,
      division: d.division,
      dept: t.dept,
      headcount: t.count,
    }))
  )
);

export const ENTITY_NAMES = ORG_BLUEPRINT.map((e) => e.entity);

/* ------------------------------------------------------------
   결정적 더미 데이터 생성기 (mulberry32 · 시드 고정)
   ------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rnd = mulberry32(20260610);

function pick<T>(list: T[]): T {
  return list[Math.floor(rnd() * list.length)];
}

function pickWeighted<T>(entries: [T, number][]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = rnd() * total;
  for (const [value, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

function randInt(min: number, max: number): number {
  return min + Math.floor(rnd() * (max - min + 1));
}

const SURNAMES = ["김", "이", "박", "최", "정", "강", "조", "윤", "장", "임", "한", "오", "서", "신", "권", "황", "안", "송", "류", "홍", "전", "고", "문", "손", "양", "배", "백", "허", "유", "남", "심", "노", "하", "곽", "성", "차", "주", "우", "구", "민"];
const GIVEN_FIRST = ["도", "서", "지", "민", "하", "주", "윤", "시", "은", "예", "수", "현", "승", "정", "재", "태", "동", "성", "영", "준", "우", "진", "상", "경", "다", "소", "가", "나", "채", "아"];
const GIVEN_SECOND = ["현", "연", "훈", "진", "우", "원", "호", "민", "영", "석", "빈", "아", "은", "라", "희", "수", "인", "규", "환", "욱", "림", "비", "솔", "결", "찬"];

/* 직급 레벨: 1 주니어 ~ 4 수석, 5 팀장 */
const SALARY_BANDS: [number, number][] = [
  [0, 0],
  [50000000, 68000000],
  [66000000, 92000000],
  [88000000, 122000000],
  [115000000, 160000000],
  [128000000, 175000000],
];

const POSITION_BY_KIND: Record<TeamKind, string[]> = {
  mfg: ["", "엔지니어", "선임엔지니어", "책임엔지니어", "수석엔지니어", "팀장"],
  rnd: ["", "연구원", "선임연구원", "책임연구원", "수석연구원", "팀장"],
  office: ["", "매니저", "선임매니저", "책임매니저", "수석매니저", "팀장"],
};

const LEVEL_WEIGHTS: Record<TeamKind, [number, number][]> = {
  mfg: [[1, 0.52], [2, 0.30], [3, 0.14], [4, 0.04]],
  rnd: [[1, 0.22], [2, 0.34], [3, 0.30], [4, 0.14]],
  office: [[1, 0.30], [2, 0.36], [3, 0.26], [4, 0.08]],
};

const OKR_RANGE: Record<PerformanceGrade, [number, number]> = {
  S: [95, 116],
  A: [85, 105],
  B: [70, 95],
  C: [54, 80],
};

const POTENTIAL_BY_GRADE: Record<PerformanceGrade, [PotentialLevel, number][]> = {
  S: [[3, 0.55], [2, 0.35], [1, 0.1]],
  A: [[3, 0.35], [2, 0.5], [1, 0.15]],
  B: [[3, 0.2], [2, 0.5], [1, 0.3]],
  C: [[3, 0.1], [2, 0.35], [1, 0.55]],
};

/* 시드 프로필이 팀장·디렉터를 이미 보유한 팀은 팀장 중복 생성 제외 */
const TEAMS_WITH_SEED_LEAD = new Set(["수율개선팀", "글로벌 마케팅팀"]);

function generateEmployees(): EmployeeSeed[] {
  const generated: EmployeeSeed[] = [];
  let seq = 0;

  const seedCountByDept = EMPLOYEE_SEEDS.reduce<Record<string, number>>(
    (acc, seed) => {
      acc[seed.dept] = (acc[seed.dept] ?? 0) + 1;
      return acc;
    },
    {}
  );

  for (const entityBp of ORG_BLUEPRINT) {
    for (const divisionBp of entityBp.divisions) {
      for (const team of divisionBp.teams) {
        const toGenerate = team.count - (seedCountByDept[team.dept] ?? 0);
        for (let i = 0; i < toGenerate; i += 1) {
          seq += 1;
          const isLead = i === 0 && !TEAMS_WITH_SEED_LEAD.has(team.dept);
          const level = isLead
            ? 5
            : pickWeighted(LEVEL_WEIGHTS[team.kind]);
          const [minSal, maxSal] = SALARY_BANDS[level];
          const salary =
            Math.round((minSal + rnd() * (maxSal - minSal)) / 100000) * 100000;
          const grade = pickWeighted<PerformanceGrade>([
            ["S", 0.1],
            ["A", 0.25],
            ["B", 0.5],
            ["C", 0.15],
          ]);
          const potential = pickWeighted(POTENTIAL_BY_GRADE[grade]);
          const [okrMin, okrMax] = OKR_RANGE[grade];
          const shift = pick(team.shifts);
          const overtimeRisk = rnd();
          const weekHours =
            Math.round(
              (36 + rnd() * 12 + (overtimeRisk > 0.92 ? 2 + rnd() * 5 : 0)) * 2
            ) / 2;
          const welfare = welfareFor(salary);
          const hasChild = rnd() < 0.45;
          const name = `${pick(SURNAMES)}${pick(GIVEN_FIRST)}${pick(GIVEN_SECOND)}`;
          const rsu: RsuGrant[] =
            grade === "S" && potential === 3 && rnd() < 0.45
              ? (() => {
                  const units = 100 * randInt(1, 4);
                  return [
                    { date: "2025-03-02", units, value: units * 85000, vested: true, note: "핵심인재 유지 목적 부여" },
                    { date: "2027-03-02", units, value: 0, vested: false, note: "잔여 귀속 (50%)" },
                  ];
                })()
              : [];

          generated.push({
            id: `NC-${2000 + seq}`,
            name,
            position: isLead ? "팀장" : POSITION_BY_KIND[team.kind][level],
            entity: entityBp.entity,
            division: divisionBp.division,
            dept: team.dept,
            role: isLead ? `${team.dept} 총괄` : pick(team.roles),
            salary,
            compaRatio: Math.round((0.78 + rnd() * 0.47) * 100) / 100,
            grade,
            okrRate: randInt(okrMin, okrMax),
            potential,
            leaveRemaining: randInt(0, 15),
            shift,
            weekHours: Math.min(weekHours, 55),
            tenureYears: isLead ? randInt(8, 18) : randInt(0, 15),
            childAge: hasChild ? randInt(0, 14) : null,
            welfareUsed:
              Math.round((welfare * (0.25 + rnd() * 0.65)) / 10000) * 10000,
            rsu,
          });
        }
      }
    }
  }

  return generated;
}

export const INITIAL_EMPLOYEES: Employee[] = [
  ...EMPLOYEE_SEEDS,
  ...generateEmployees(),
].map((seed) => ({
  ...seed,
  bonus: calcBonus(seed.salary, seed.grade),
  welfare: welfareFor(seed.salary),
}));

export const WORKFORCE_SIZE = INITIAL_EMPLOYEES.length;

/* 로그인 페르소나 — R&D부문 HRBP 리드 */
export const CURRENT_USER_ID = "NC-1010";

/* ------------------------------------------------------------
   메리트 매트릭스 — 전사 3,000여 명 전수 시뮬레이션 모델
   (예산 풀 125억 원 · 등급별 인상률 실시간 반영)
   ------------------------------------------------------------ */

export const BUDGET_POOL = 12500000000;

export const DEFAULT_RAISE: Record<PerformanceGrade, number> = {
  S: 9, A: 6, B: 3.5, C: 1.5,
};

export function gradeHeadcount(
  employees: Employee[],
  grade: PerformanceGrade
): number {
  return employees.reduce((sum, e) => sum + (e.grade === grade ? 1 : 0), 0);
}

export function tierAvgSalary(
  employees: Employee[],
  grade: PerformanceGrade
): number {
  const list = employees.filter((e) => e.grade === grade);
  if (list.length === 0) return 0;
  return list.reduce((sum, e) => sum + e.salary, 0) / list.length;
}

export function simTotal(
  employees: Employee[],
  raisePct: Record<PerformanceGrade, number>
): number {
  return employees.reduce(
    (sum, e) => sum + e.salary * (raisePct[e.grade] / 100),
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
   근태 — 주 52시간 모델
   ------------------------------------------------------------ */

export const WEEKLY_CAP_HOURS = 52;
export const WEEKLY_STANDARD_HOURS = 40;
export const RISK_WARN_HOURS = 48;
export const RISK_DANGER_HOURS = 50;

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
   OKR & 동료 피드백 모음
   ------------------------------------------------------------ */

export const MY_KEY_RESULTS: OkrKeyResult[] = [
  { id: "kr-1", title: "2026 보상 사이클 적시 완결률 100%", progress: 78, owner: "한지원" },
  { id: "kr-2", title: "핵심 인재 유지율 97% 방어", progress: 92, owner: "한지원" },
  { id: "kr-3", title: "인사 데이터 분석 대시보드 v2 구축", progress: 64, owner: "한지원" },
];

export const PEER_FEEDBACK: PeerFeedbackItem[] = [
  {
    id: "pf-1", from: "박지훈", fromDept: "수율개선팀", to: "한지민",
    message: "결함 맵 군집 분석 모델 덕분에 D2 라인 수율 문제를 하루 만에 잡았습니다. 데이터 기반 협업의 정석!",
    tags: ["수율개선", "데이터협업"], time: "26분 전",
  },
  {
    id: "pf-2", from: "김도현", fromDept: "공정개발그룹", to: "강하은",
    message: "EUV–식각 경계 조건을 함께 조율해 준 덕분에 신규 레시피 검증이 2주 단축됐어요.",
    tags: ["공정협업", "기간단축"], time: "1시간 전",
  },
  {
    id: "pf-3", from: "이서연", fromDept: "메모리 소자설계팀", to: "노아라",
    message: "설계 검증 결과 보고서가 정말 깔끔했습니다. 설계 검토 속도가 확 올라갔어요.",
    tags: ["설계검증", "품질"], time: "3시간 전",
  },
  {
    id: "pf-4", from: "최유진", fromDept: "글로벌 마케팅팀", to: "송다은",
    message: "북미 고객사 시장 동향 브리핑이 수주 회의의 결정타였습니다. 감사합니다!",
    tags: ["시장정보분석", "수주기여"], time: "어제",
  },
];

export const FEEDBACK_TAGS = [
  "협업", "데이터기반", "문제해결", "리더십", "고객지향",
  "수율개선", "공정협업", "품질", "신속함", "멘토링",
];

/* ------------------------------------------------------------
   전사 결재 대기함
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
    id: "ap-4", kind: "해외 출장", title: "북미 고객사 분기 사업 점검 출장 5일",
    requester: "최유진", dept: "글로벌 마케팅팀", due: "D-5", urgent: false,
  },
  {
    id: "ap-5", kind: "경조 지원", title: "경조금 및 경조휴가 신청",
    requester: "오태양", dept: "글로벌 마케팅팀", due: "D-7", urgent: false,
  },
];

/* ------------------------------------------------------------
   전사 공지 & 조직 변동 소식 (알림 및 소식)
   ------------------------------------------------------------ */

export const NOTICES: NoticeItem[] = [
  {
    id: "nt-1", tag: "전사 공지", pinned: true, date: "2026-06-10",
    title: "2026 상반기 성과 보정 세션 일정 안내",
    body: "6월 셋째 주부터 부문별 평가 등급 보정(캘리브레이션) 세션이 진행됩니다. 조직장은 사전 등급 입력을 6/15(월)까지 완료해 주세요.",
  },
  {
    id: "nt-2", tag: "복리후생", pinned: true, date: "2026-06-08",
    title: "하반기 복지 포인트 추가 지급 안내",
    body: "7월 1일자로 전 임직원 복지 포인트 30만 점이 추가 지급됩니다. 미사용 포인트는 12월 말 소멸됩니다.",
  },
  {
    id: "nt-3", tag: "시설", pinned: false, date: "2026-06-09",
    title: "이천 P3 라인 정기 PM에 따른 셔틀 증편",
    body: "6/13(토) 정기 설비 PM 기간 동안 이천캠퍼스 셔틀이 30분 간격으로 증편 운행됩니다.",
  },
  {
    id: "nt-4", tag: "보안", pinned: false, date: "2026-06-07",
    title: "반출입 보안 정책 개정 (Rev 4.2)",
    body: "외부 저장매체 반입 절차가 사전 승인제로 변경됩니다. 6/20 이후 미승인 매체는 게이트에서 반송됩니다.",
  },
];

export const ORG_CHANGES: OrgChangeItem[] = [
  { id: "oc-1", kind: "발령", message: "박지훈 팀장 — 수율개선팀 → 평택 P4 수율TF 겸직 발령", time: "오늘 09:00" },
  { id: "oc-2", kind: "입사", message: "신규 입사자 12명 — 6/8(월) 입사 절차 진행 중 (R&D 7 · 제조 5)", time: "어제" },
  { id: "oc-3", kind: "조직개편", message: "소프트웨어플랫폼팀 산하 ‘수율 ML 파트’ 신설", time: "2일 전" },
  { id: "oc-4", kind: "퇴사", message: "6월 퇴사 예정자 4명 — 퇴사 절차 체크리스트 진행률 75%", time: "3일 전" },
  { id: "oc-5", kind: "발령", message: "넥스칩 시스템 LSI SoC설계팀 — 책임연구원 2명 전입", time: "4일 전" },
];

/* ------------------------------------------------------------
   서술형 인사 분석 지표
   ------------------------------------------------------------ */

export const ORG_HEALTH_SCORE = 94;
export const RND_RETENTION_DELTA = 2.4;
export const ORG_RETENTION_RATE = 96.8;
export const ENGAGEMENT_INDEX = 8.6;

/* ------------------------------------------------------------
   AI 통합 검색 명령 사전
   ------------------------------------------------------------ */

export interface OmnibarSuggestion {
  id: string;
  label: string;
  hint: string;
  query: string;
}

export const OMNIBAR_SUGGESTIONS: OmnibarSuggestion[] = [
  { id: "sg-1", label: "연차 신청 안내 받기", hint: "휴가 신청", query: "연차 신청" },
  { id: "sg-2", label: "전사 조직도 열기", hint: "조직 관리", query: "조직도" },
  { id: "sg-3", label: "김도현 프로필 보기", hint: "사원 프로필", query: "김도현" },
  { id: "sg-4", label: "연말정산 시뮬레이터", hint: "급여·세무", query: "연말정산" },
  { id: "sg-5", label: "주 52시간 위험 현황", hint: "근태 관리", query: "52시간" },
  { id: "sg-6", label: "메리트 시뮬레이터 열기", hint: "보상 시뮬레이션", query: "메리트 시뮬레이터" },
];
