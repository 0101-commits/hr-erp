import { Heart, Search, Send, Tags } from "lucide-react";
import { useMemo, useState } from "react";
import {
  FEEDBACK_TAGS,
  PEER_FEEDBACK,
  type Employee,
  type PeerFeedbackItem,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

interface FeedbackViewProps {
  currentUser: Employee;
  employees: Employee[];
  showToast: (message: string) => void;
}

export function FeedbackView({
  currentUser,
  employees,
  showToast,
}: FeedbackViewProps) {
  const [feed, setFeed] = useState<PeerFeedbackItem[]>(PEER_FEEDBACK);
  const [query, setQuery] = useState("");
  const [targetId, setTargetId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const matches = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return employees
      .filter((e) => e.id !== currentUser.id && (e.name.includes(q) || e.id.includes(q.toUpperCase())))
      .slice(0, 5);
  }, [employees, query, currentUser.id]);

  const target = targetId ? employees.find((e) => e.id === targetId) ?? null : null;

  const tagStats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of feed) {
      for (const tag of item.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [feed]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 3
          ? [...prev, tag]
          : prev
    );
  };

  const send = () => {
    if (!target || !message.trim()) {
      showToast("받는 동료와 감사 메시지를 입력해 주세요");
      return;
    }
    setFeed((prev) => [
      {
        id: `pf-new-${Date.now()}`,
        from: currentUser.name,
        fromDept: currentUser.dept,
        to: target.name,
        message: message.trim(),
        tags: selectedTags.length > 0 ? selectedTags : ["협업"],
        time: "방금",
      },
      ...prev,
    ]);
    showToast(`${target.name}님에게 감사 메시지를 보냈어요 — 상시 피드백에 기록됩니다`);
    setQuery("");
    setTargetId(null);
    setMessage("");
    setSelectedTags([]);
  };

  return (
    <div>
      <PageHeader
        breadcrumb={["성과 & 몰입 관리", "상시 다면 평가", "지속적 360도 피드백"]}
        title="지속적 360도 피드백"
        help="360도 피드백은 상사·동료·후배 등 함께 일하는 다양한 구성원이 서로 피드백을 주고받는 다면 평가 방식입니다. 한 사람의 시각이 아닌 여러 방향(360도)에서 역량을 조명합니다."
        subtitle="동료 간 수시 감사 메시지와 협업 역량 키워드 선택 — 누적된 피드백은 종합 인사 평가 매트릭스에 연동됩니다."
        actions={
          <Badge tone="mint" dot>
            이번 분기 {feed.length}건
          </Badge>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <div className="flex flex-col gap-6">
          <Card
            title="감사 메시지 보내기"
            subtitle="동료를 검색하고 역량 키워드를 선택하세요 (최대 3개)"
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <Heart size={16} strokeWidth={1.75} />
              </span>
            }
          >
            {target ? (
              <div className="flex items-center gap-3 rounded-field bg-canvas p-4">
                <Avatar name={target.name} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{target.name}</div>
                  <div className="text-xs text-ink-400">
                    {target.dept} · {target.position}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setTargetId(null)}>
                  변경
                </Button>
              </div>
            ) : (
              <>
                <div className="flex h-10 items-center gap-2.5 rounded-full border border-hairline bg-canvas px-4">
                  <Search size={15} className="flex-none text-ink-400" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="받는 동료 검색 (성명 또는 사번)"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-300"
                    aria-label="피드백 대상 검색"
                  />
                </div>
                {matches.length > 0 && (
                  <ul className="mt-2 overflow-hidden rounded-field border border-hairline-soft">
                    {matches.map((e) => (
                      <li key={e.id}>
                        <button
                          type="button"
                          onClick={() => setTargetId(e.id)}
                          className="flex w-full items-center gap-2.5 border-b border-hairline-soft px-4 py-2.5 text-left text-sm transition-colors last:border-none hover:bg-canvas"
                        >
                          <Avatar name={e.name} size={26} />
                          <span className="font-medium">{e.name}</span>
                          <span className="text-xs text-ink-400">
                            {e.dept} · {e.position}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="구체적인 상황과 기여를 담아 감사를 전해 보세요"
              className="mt-4 w-full resize-none rounded-field border border-hairline bg-surface p-4 text-sm outline-none transition-colors placeholder:text-ink-300 focus:border-cobalt"
              aria-label="감사 메시지"
            />

            <div className="mt-3 flex flex-wrap gap-1.5">
              {FEEDBACK_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={isSelected}
                    className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                      isSelected
                        ? "bg-ink text-mint"
                        : "bg-hairline-soft text-ink-500 hover:bg-pistachio hover:text-mint-deep"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>

            <Button className="mt-5 w-full" icon={<Send size={15} />} onClick={send}>
              피드백 보내기
            </Button>
          </Card>

          <Card
            title="역량 키워드 통계"
            subtitle="이번 분기 가장 많이 선택된 협업 역량"
            action={
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
                <Tags size={16} strokeWidth={1.75} />
              </span>
            }
          >
            <div className="flex flex-wrap gap-2">
              {tagStats.map(([tag, count]) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-pistachio px-3.5 py-1.5 text-[13px] font-semibold text-mint-deep"
                >
                  #{tag}
                  <span className="tabular-nums">{count}</span>
                </span>
              ))}
            </div>
          </Card>
        </div>

        <Card
          title="상시 피드백 모아보기"
          subtitle="최근 도착한 수시 감사 메시지"
        >
          <ul className="flex flex-col gap-5">
            {feed.map((item) => (
              <li key={item.id} className="flex gap-3">
                <Avatar name={item.from} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
                    <span className="font-semibold">{item.from}</span>
                    <span className="text-xs text-ink-300">{item.fromDept}</span>
                    <span className="text-ink-400">→</span>
                    <span className="font-semibold text-cobalt">@{item.to}</span>
                    <span className="ml-auto text-xs text-ink-300">{item.time}</span>
                  </div>
                  <p className="mt-1.5 rounded-field rounded-tl-cell bg-canvas px-4 py-3 text-[13px] leading-relaxed text-ink-500">
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
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
