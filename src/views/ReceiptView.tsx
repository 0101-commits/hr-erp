import { FileCheck2, ScanLine, Sparkles, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { fmtWon } from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { StatCard } from "../components/ui/StatCard";

interface ReceiptViewProps {
  showToast: (message: string) => void;
}

interface ParsedReceipt {
  id: string;
  vendor: string;
  date: string;
  amount: number;
  category: string;
  confidence: number;
  status: "전표 생성 완료" | "검토 필요";
}

const INITIAL_RECEIPTS: ParsedReceipt[] = [
  { id: "rc-1", vendor: "판교 비스트로 본점", date: "2026-06-09", amount: 84000, category: "팀 회식비", confidence: 99, status: "전표 생성 완료" },
  { id: "rc-2", vendor: "코레일 (서울→평택)", date: "2026-06-08", amount: 16400, category: "국내 출장 교통비", confidence: 98, status: "전표 생성 완료" },
  { id: "rc-3", vendor: "오피스디포 이천점", date: "2026-06-05", amount: 132000, category: "사무용품비", confidence: 95, status: "전표 생성 완료" },
  { id: "rc-4", vendor: "그랜드호텔 평택", date: "2026-06-04", amount: 187000, category: "국내 출장 숙박비", confidence: 76, status: "검토 필요" },
];

/* 업로드 데모용 OCR 추출 결과 풀 — 순서대로 큐에 추가 */
const DEMO_POOL: Omit<ParsedReceipt, "id">[] = [
  { vendor: "스타벅스 판교캠퍼스점", date: "2026-06-10", amount: 28500, category: "회의비", confidence: 97, status: "전표 생성 완료" },
  { vendor: "대한항공 (ICN→SFO)", date: "2026-06-10", amount: 2140000, category: "해외 출장 항공료", confidence: 92, status: "전표 생성 완료" },
  { vendor: "교보문고 판교점", date: "2026-06-10", amount: 54000, category: "도서·자기계발비", confidence: 88, status: "검토 필요" },
];

export function ReceiptView({ showToast }: ReceiptViewProps) {
  const [receipts, setReceipts] = useState(INITIAL_RECEIPTS);
  const [scanning, setScanning] = useState(false);
  const demoIndex = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const upload = () => {
    if (scanning) return;
    setScanning(true);
    timerRef.current = window.setTimeout(() => {
      const demo = DEMO_POOL[demoIndex.current % DEMO_POOL.length];
      demoIndex.current += 1;
      setReceipts((prev) => [
        { ...demo, id: `rc-up-${Date.now()}` },
        ...prev,
      ]);
      setScanning(false);
      showToast(
        `OCR 인식 완료 — ${demo.vendor} · ${fmtWon(demo.amount)} (${demo.category})`
      );
    }, 1400);
  };

  const completed = receipts.filter((r) => r.status === "전표 생성 완료");
  const review = receipts.filter((r) => r.status === "검토 필요");
  const monthTotal = receipts.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <PageHeader
        breadcrumb={["복리후생 & 지원", "비용 영수증 청구", "AI 영수증 자동 인식"]}
        title="AI 영수증 자동 인식"
        help="OCR(광학 문자 인식)은 사진·스캔 이미지 속 글자를 컴퓨터가 읽을 수 있는 텍스트로 변환하는 기술입니다. 영수증의 상호·일자·금액을 자동으로 읽어 전표를 만들어 줍니다."
        subtitle="모바일/웹으로 올린 영수증의 문자를 추출(OCR)하고 비용 전표를 자동 생성합니다 — 신뢰도가 낮은 건은 검토 대기함으로 분리됩니다."
        actions={
          <Button
            variant="cobalt"
            icon={<FileCheck2 size={15} />}
            onClick={() =>
              showToast(`전표 ${completed.length}건을 ERP로 일괄 전송했어요`)
            }
          >
            전표 일괄 생성
          </Button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="이번 달 청구 합계" value={fmtWon(monthTotal)} detail={`${receipts.length}건 등록`} accent="mint" />
        <StatCard label="전표 자동 생성" value={`${completed.length}건`} detail="OCR 신뢰도 80% 이상" />
        <StatCard label="검토 필요" value={`${review.length}건`} detail="신뢰도 미달 — 수기 확인" accent={review.length > 0 ? "alert" : "none"} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[5fr_7fr]">
        <Card
          title="영수증 업로드"
          subtitle="모바일 촬영본 · 스캔 이미지 · PDF 지원"
        >
          <button
            type="button"
            onClick={upload}
            disabled={scanning}
            className={`flex w-full flex-col items-center gap-3 rounded-field border-2 border-dashed p-10 text-center transition-colors ${
              scanning
                ? "border-cobalt bg-[#E5F0FE]"
                : "border-hairline hover:border-ink hover:bg-canvas"
            }`}
          >
            {scanning ? (
              <>
                <ScanLine size={28} className="animate-pulse text-cobalt" />
                <span className="text-sm font-semibold text-cobalt">
                  OCR 문자 추출 중…
                </span>
                <span className="text-xs text-ink-400">
                  상호 · 일자 · 금액 · 비용 항목을 자동 분류하고 있어요
                </span>
              </>
            ) : (
              <>
                <UploadCloud size={28} className="text-ink-400" />
                <span className="text-sm font-semibold">
                  클릭하여 영수증 업로드 (데모)
                </span>
                <span className="text-xs text-ink-400">
                  업로드 즉시 AI가 문자를 추출해 전표 초안을 생성합니다
                </span>
              </>
            )}
          </button>

          <div className="mt-5 flex items-start gap-2.5 rounded-field bg-canvas p-4 text-xs leading-relaxed text-ink-400">
            <Sparkles size={14} className="mt-0.5 flex-none text-cobalt" />
            법인카드 매입 데이터와 자동 대사하여 중복 청구를 차단하고, 비용 규정
            한도(회의비 1인 3만 원 등)를 초과한 건은 결재 시 자동 표기됩니다.
          </div>
        </Card>

        <Card
          title="자동 생성 전표 대기함"
          subtitle="OCR 추출 결과 — 신뢰도 80% 미만은 검토 필요로 분류"
          padding="flush"
        >
          <div className="nx-scroll overflow-x-auto px-4 pb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">상호</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">사용일</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">금액</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">비용 항목</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-right">신뢰도</th>
                  <th className="type-label whitespace-nowrap px-3.5 py-3 text-left">상태</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr
                    key={receipt.id}
                    className="border-b border-hairline-soft last:border-none hover:bg-canvas"
                  >
                    <td className="whitespace-nowrap px-3.5 py-3 font-medium">
                      {receipt.vendor}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 tabular-nums text-ink-500">
                      {receipt.date}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-right font-medium tabular-nums">
                      {fmtWon(receipt.amount)}
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3 text-ink-500">
                      {receipt.category}
                    </td>
                    <td
                      className={`whitespace-nowrap px-3.5 py-3 text-right tabular-nums ${
                        receipt.confidence < 80 ? "font-semibold text-alert-deep" : ""
                      }`}
                    >
                      {receipt.confidence}%
                    </td>
                    <td className="whitespace-nowrap px-3.5 py-3">
                      <Badge tone={receipt.status === "전표 생성 완료" ? "mint" : "warning"}>
                        {receipt.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
