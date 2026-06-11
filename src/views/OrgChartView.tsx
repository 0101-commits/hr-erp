import { Building2, ChevronDown, ChevronRight, Network } from "lucide-react";
import { useMemo, useState } from "react";
import {
  ENTITY_NAMES,
  type Employee,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { StatCard } from "../components/ui/StatCard";

interface OrgChartViewProps {
  employees: Employee[];
  onOpenProfile: (employeeId: string) => void;
}

interface TeamNode {
  dept: string;
  members: Employee[];
  lead: Employee | null;
}

interface DivisionNode {
  division: string;
  headcount: number;
  teams: TeamNode[];
}

export function OrgChartView({ employees, onOpenProfile }: OrgChartViewProps) {
  const [entity, setEntity] = useState(ENTITY_NAMES[0]);
  const [openDept, setOpenDept] = useState<string | null>(null);

  /* 법인 → 부문 → 팀 노드 트리 구성 */
  const tree = useMemo<DivisionNode[]>(() => {
    const inEntity = employees.filter((e) => e.entity === entity);
    const byDivision = new Map<string, Map<string, Employee[]>>();
    for (const e of inEntity) {
      if (!byDivision.has(e.division)) byDivision.set(e.division, new Map());
      const teams = byDivision.get(e.division)!;
      if (!teams.has(e.dept)) teams.set(e.dept, []);
      teams.get(e.dept)!.push(e);
    }
    return Array.from(byDivision.entries()).map(([division, teams]) => {
      const teamNodes: TeamNode[] = Array.from(teams.entries()).map(
        ([dept, members]) => ({
          dept,
          members,
          lead:
            members.find((m) => m.position === "팀장" || m.position === "디렉터") ??
            null,
        })
      );
      return {
        division,
        headcount: teamNodes.reduce((sum, t) => sum + t.members.length, 0),
        teams: teamNodes,
      };
    });
  }, [employees, entity]);

  const entityHeadcount = tree.reduce((sum, d) => sum + d.headcount, 0);
  const teamCount = tree.reduce((sum, d) => sum + d.teams.length, 0);

  return (
    <div>
      <PageHeader
        breadcrumb={["조직 & 인사 관리", "인사 기준 정보", "전사 조직도 관리"]}
        title="전사 조직도 관리"
        subtitle="계열사/법인별 다중 조직도를 직관적인 계층 구조로 — 팀을 펼치면 구성원과 조직장 정보가 표시됩니다."
        actions={
          <Select
            options={ENTITY_NAMES.map((name) => ({ value: name, label: name }))}
            value={entity}
            onChange={(value) => {
              setEntity(value);
              setOpenDept(null);
            }}
            ariaLabel="법인 선택"
            className="w-56"
          />
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="법인" value={String(ENTITY_NAMES.length)} detail="그룹 전체 법인 수" />
        <StatCard label="선택 법인 인원" value={`${entityHeadcount.toLocaleString("ko-KR")}명`} detail={entity} accent="mint" />
        <StatCard label="부문" value={`${tree.length}개`} detail="선택 법인 기준" />
        <StatCard label="팀" value={`${teamCount}개`} detail="선택 법인 기준" />
      </div>

      <Card
        title="조직 계층 보기"
        subtitle="법인 → 부문 → 팀 계층 구조 · 팀을 클릭하면 구성원 목록이 펼쳐집니다"
        action={
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
            <Network size={16} strokeWidth={1.75} />
          </span>
        }
      >
        {/* 루트(법인) 노드 */}
        <div className="flex items-center gap-3 rounded-field bg-ink px-5 py-4 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-mint">
            <Building2 size={16} strokeWidth={1.75} />
          </span>
          <div>
            <div className="text-[15px] font-semibold tracking-snug">{entity}</div>
            <div className="text-xs text-white/60">
              임직원 {entityHeadcount.toLocaleString("ko-KR")}명 · {tree.length}개 부문
            </div>
          </div>
        </div>

        <div className="ml-5 border-l border-hairline pl-6 pt-4">
          {tree.map((divisionNode) => (
            <div key={divisionNode.division} className="relative pb-5 last:pb-0">
              <span className="absolute -left-6 top-4 h-px w-5 bg-hairline" />
              <div className="flex items-center gap-2.5 rounded-field border border-hairline-soft bg-canvas px-4 py-2.5">
                <span className="text-sm font-semibold">{divisionNode.division}</span>
                <Badge tone="neutral">{divisionNode.headcount.toLocaleString("ko-KR")}명</Badge>
                <span className="text-xs text-ink-400">{divisionNode.teams.length}개 팀</span>
              </div>

              <div className="ml-4 border-l border-hairline-soft pl-5 pt-2.5">
                {divisionNode.teams.map((team) => {
                  const isOpen = openDept === team.dept;
                  return (
                    <div key={team.dept} className="relative pb-2.5 last:pb-0">
                      <span className="absolute -left-5 top-4 h-px w-4 bg-hairline-soft" />
                      <button
                        type="button"
                        onClick={() => setOpenDept(isOpen ? null : team.dept)}
                        aria-expanded={isOpen}
                        className={`flex w-full items-center gap-2.5 rounded-field border px-4 py-2.5 text-left transition-colors ${
                          isOpen
                            ? "border-ink bg-surface"
                            : "border-hairline-soft bg-surface hover:border-ink"
                        }`}
                      >
                        {isOpen ? (
                          <ChevronDown size={14} className="flex-none text-ink-400" />
                        ) : (
                          <ChevronRight size={14} className="flex-none text-ink-400" />
                        )}
                        <span className="text-sm font-medium">{team.dept}</span>
                        <span className="text-xs tabular-nums text-ink-400">
                          {team.members.length}명
                        </span>
                        {team.lead && (
                          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-400">
                            <Avatar name={team.lead.name} size={20} />
                            {team.lead.position} {team.lead.name}
                          </span>
                        )}
                      </button>

                      {isOpen && (
                        <div className="ml-7 mt-2 rounded-field border border-hairline-soft bg-canvas p-4">
                          <div className="flex flex-wrap gap-1.5">
                            {team.members.slice(0, 24).map((member) => (
                              <button
                                key={member.id}
                                type="button"
                                onClick={() => onOpenProfile(member.id)}
                                title={`${member.position} · ${member.role}`}
                                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1 text-[13px] font-medium transition-colors hover:border-ink"
                              >
                                <Avatar name={member.name} size={18} />
                                {member.name}
                              </button>
                            ))}
                            {team.members.length > 24 && (
                              <span className="inline-flex items-center rounded-full bg-hairline-soft px-3 py-1 text-[13px] font-medium text-ink-400">
                                +{(team.members.length - 24).toLocaleString("ko-KR")}명
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
