import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ENTITY_NAMES,
  GRADE_META,
  ORG_UNITS,
  WORKFORCE_SIZE,
  type Employee,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";

interface ProfilesViewProps {
  employees: Employee[];
  onOpenProfile: (employeeId: string) => void;
}

const PAGE_SIZE = 15;
const ALL = "__all__";

function gradeBadgeTone(grade: Employee["grade"]) {
  if (grade === "S") return "ink" as const;
  if (grade === "A") return "mint" as const;
  if (grade === "B") return "neutral" as const;
  return "warning" as const;
}

export function ProfilesView({ employees, onOpenProfile }: ProfilesViewProps) {
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState(ALL);
  const [dept, setDept] = useState(ALL);
  const [page, setPage] = useState(0);

  const deptOptions = useMemo(() => {
    const units =
      entity === ALL ? ORG_UNITS : ORG_UNITS.filter((u) => u.entity === entity);
    return [
      { value: ALL, label: "전체 팀" },
      ...units.map((u) => ({ value: u.dept, label: u.dept })),
    ];
  }, [entity]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return employees.filter((e) => {
      if (entity !== ALL && e.entity !== entity) return false;
      if (dept !== ALL && e.dept !== dept) return false;
      if (q && !e.name.includes(q) && !e.id.includes(q.toUpperCase())) return false;
      return true;
    });
  }, [employees, query, entity, dept]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        breadcrumb={["조직 & 인사 관리", "임직원 생애주기", "사원 프로필 마스터"]}
        title="사원 프로필 마스터"
        subtitle={`전사 ${WORKFORCE_SIZE.toLocaleString("ko-KR")}명의 개인 신상 · 경력 · 역량 평가 이력을 통합 관리 — 행을 클릭하면 통합 프로필 패널이 열립니다.`}
        actions={
          <Badge tone="mint" dot>
            검색 결과 {filtered.length.toLocaleString("ko-KR")}명
          </Badge>
        }
      />

      <Card padding="flush">
        <div className="flex flex-wrap items-center gap-3 px-7 pb-2 pt-7">
          <div className="flex h-10 min-w-64 flex-1 items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4">
            <Search size={15} className="flex-none text-ink-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(0);
              }}
              placeholder="성명 또는 사번 검색 (예: 김도현, NC-1001)"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
              aria-label="임직원 검색"
            />
          </div>
          <Select
            options={[
              { value: ALL, label: "전체 법인" },
              ...ENTITY_NAMES.map((name) => ({ value: name, label: name })),
            ]}
            value={entity}
            onChange={(value) => {
              setEntity(value);
              setDept(ALL);
              setPage(0);
            }}
            ariaLabel="법인 필터"
            className="w-48"
          />
          <Select
            options={deptOptions}
            value={dept}
            onChange={(value) => {
              setDept(value);
              setPage(0);
            }}
            ariaLabel="팀 필터"
            className="w-48"
          />
        </div>

        <div className="nx-scroll overflow-x-auto px-4 pb-2">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-hairline">
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">사번</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">성명</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">법인</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">부문 · 팀</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">직급</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">근속</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">성과 등급</th>
                <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">잔여 연차</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr
                  key={e.id}
                  className="cursor-pointer border-b border-hairline-soft transition-colors last:border-none hover:bg-canvas"
                  onClick={() => onOpenProfile(e.id)}
                >
                  <td className="whitespace-nowrap px-3.5 py-3 text-xs tabular-nums text-ink-400">
                    {e.id}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <span className="flex items-center gap-2.5">
                      <Avatar name={e.name} size={30} />
                      <span>
                        <span className="block font-semibold">{e.name}</span>
                        <span className="block text-xs text-ink-400">{e.role}</span>
                      </span>
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-ink-500">{e.entity}</td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-ink-500">
                    {e.division} · {e.dept}
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">{e.position}</td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                    {e.tenureYears}년
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3">
                    <Badge tone={gradeBadgeTone(e.grade)}>
                      {e.grade} · {GRADE_META[e.grade].desc}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-3.5 py-3 text-right tabular-nums">
                    {e.leaveRemaining}일
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3.5 py-12 text-center text-sm text-ink-400">
                    <Users size={20} className="mx-auto mb-2 text-ink-300" />
                    조건에 맞는 임직원이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-hairline-soft px-7 py-4">
          <span className="text-[13px] tabular-nums text-ink-400">
            {filtered.length === 0
              ? "0명"
              : `${(safePage * PAGE_SIZE + 1).toLocaleString("ko-KR")} – ${Math.min(
                  (safePage + 1) * PAGE_SIZE,
                  filtered.length
                ).toLocaleString("ko-KR")} / ${filtered.length.toLocaleString("ko-KR")}명`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronLeft size={14} />}
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              이전
            </Button>
            <span className="px-2 text-[13px] tabular-nums text-ink-500">
              {safePage + 1} / {pageCount.toLocaleString("ko-KR")}
            </span>
            <Button
              variant="secondary"
              size="sm"
              icon={<ChevronRight size={14} />}
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage(safePage + 1)}
            >
              다음
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
