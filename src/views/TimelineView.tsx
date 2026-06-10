import { Bell, Megaphone, Pin, Shuffle } from "lucide-react";
import {
  NOTICES,
  ORG_CHANGES,
  PEER_FEEDBACK,
  type ApprovalItem,
  type OrgChangeItem,
} from "../data/mockData";
import { Avatar } from "../components/ui/Avatar";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";

interface TimelineViewProps {
  approvals: ApprovalItem[];
}

const CHANGE_TONES: Record<OrgChangeItem["kind"], "mint" | "cobalt" | "neutral" | "warning"> = {
  발령: "cobalt",
  입사: "mint",
  퇴사: "warning",
  조직개편: "neutral",
};

export function TimelineView({ approvals }: TimelineViewProps) {
  const pinned = NOTICES.filter((n) => n.pinned);
  const others = NOTICES.filter((n) => !n.pinned);

  return (
    <div>
      <PageHeader
        breadcrumb={["홈 & 워크스페이스", "개인화 포털", "알림 및 타임라인"]}
        title="알림 및 타임라인"
        subtitle="상시 피드백 알림, 전사 공지 배너, 조직 변동 사항을 하나의 스트림 피드로 — 놓치면 안 되는 변화를 시간순으로 따라가세요."
        actions={
          <Badge tone="mint" dot>
            새 알림 {approvals.length + PEER_FEEDBACK.length}건
          </Badge>
        }
      />

      {/* 전사 공지 배너 */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {pinned.map((notice) => (
          <div
            key={notice.id}
            className="flex items-start gap-4 rounded-showcase bg-ink p-7 text-white"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white/10 text-mint">
              <Megaphone size={18} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Pin size={12} className="text-mint" />
                <span className="text-[11px] font-semibold uppercase tracking-label text-white/60">
                  {notice.tag} · {notice.date}
                </span>
              </div>
              <h2 className="mt-1.5 text-[17px] font-semibold tracking-snug">
                {notice.title}
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/70">
                {notice.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <Card
          title="상시 피드백 알림"
          subtitle="동료들이 보낸 수시 감사 메시지가 실시간으로 도착합니다"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Bell size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <ul className="flex flex-col gap-4">
            {PEER_FEEDBACK.map((item) => (
              <li key={item.id} className="flex gap-3">
                <Avatar name={item.from} size={32} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-1.5 text-[13px]">
                    <span className="font-semibold">{item.from}</span>
                    <span className="text-ink-400">→</span>
                    <span className="font-semibold">@{item.to}</span>
                    <span className="text-xs text-ink-300">{item.time}</span>
                  </div>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-500">
                    {item.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title="조직 변동 스트림"
          subtitle="발령 · 입퇴사 · 조직 개편이 시간순으로 흐릅니다"
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <Shuffle size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <ul className="relative ml-1.5 border-l border-hairline pl-6">
            {ORG_CHANGES.map((change) => (
              <li key={change.id} className="relative pb-5 last:pb-0">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-surface" />
                <div className="flex items-center gap-2">
                  <Badge tone={CHANGE_TONES[change.kind]}>{change.kind}</Badge>
                  <span className="text-xs text-ink-300">{change.time}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-500">
                  {change.message}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card
            title="결재 알림"
            subtitle={`내가 처리해야 할 결재 ${approvals.length}건`}
          >
            {approvals.length === 0 ? (
              <p className="rounded-field border border-dashed border-hairline p-8 text-center text-sm text-ink-400">
                대기 중인 결재 알림이 없습니다
              </p>
            ) : (
              <ul className="flex flex-col">
                {approvals.slice(0, 5).map((item) => (
                  <li
                    key={item.id}
                    className="border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                  >
                    <div className="flex items-center gap-2">
                      <Badge tone={item.urgent ? "critical" : "neutral"}>
                        {item.kind}
                      </Badge>
                      <span className="text-[11px] text-ink-400">{item.due}</span>
                    </div>
                    <p className="mt-1 truncate text-[13px] font-medium">
                      {item.title}
                    </p>
                    <p className="text-xs text-ink-400">
                      {item.requester} · {item.dept}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="일반 공지" subtitle="고정 공지 외 최근 소식">
            <ul className="flex flex-col">
              {others.map((notice) => (
                <li
                  key={notice.id}
                  className="border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                >
                  <div className="flex items-center gap-2 text-[11px] text-ink-400">
                    <Badge tone="outline">{notice.tag}</Badge>
                    {notice.date}
                  </div>
                  <p className="mt-1 text-[13px] font-medium">{notice.title}</p>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
