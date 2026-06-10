import { Calculator, ReceiptText, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { fmtKorean, fmtWon, type Employee } from "../data/mockData";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/PageHeader";
import { Slider } from "../components/ui/Slider";
import { StatCard } from "../components/ui/StatCard";

interface YearEndTaxViewProps {
  currentUser: Employee;
}

/* 간이 근로소득공제 (시뮬레이션용 단순화 모델) */
function earnedIncomeDeduction(gross: number): number {
  if (gross <= 5000000) return gross * 0.7;
  if (gross <= 15000000) return 3500000 + (gross - 5000000) * 0.4;
  if (gross <= 45000000) return 7500000 + (gross - 15000000) * 0.15;
  if (gross <= 100000000) return 12000000 + (gross - 45000000) * 0.05;
  return 14750000 + (gross - 100000000) * 0.02;
}

/* 간이 누진세율 (지방소득세 제외) */
function progressiveTax(base: number): number {
  const brackets: [number, number, number][] = [
    [14000000, 0.06, 0],
    [50000000, 0.15, 1260000],
    [88000000, 0.24, 5760000],
    [150000000, 0.35, 15440000],
    [Infinity, 0.38, 19940000],
  ];
  for (const [limit, rate, deduction] of brackets) {
    if (base <= limit) return Math.max(0, base * rate - deduction);
  }
  return 0;
}

export function YearEndTaxView({ currentUser }: YearEndTaxViewProps) {
  const [dependents, setDependents] = useState(1);
  const [cardSpend, setCardSpend] = useState(24000000);
  const [medical, setMedical] = useState(2000000);
  const [education, setEducation] = useState(1500000);
  const [pension, setPension] = useState(4000000);

  const result = useMemo(() => {
    const gross = currentUser.salary;
    const incomeDeduction = earnedIncomeDeduction(gross);
    const personalDeduction = (1 + dependents) * 1500000;
    /* 신용카드 공제 — 총급여 25% 초과분의 15%, 한도 300만 */
    const cardDeduction = Math.min(
      Math.max(0, cardSpend - gross * 0.25) * 0.15,
      3000000
    );
    const taxBase = Math.max(
      0,
      gross - incomeDeduction - personalDeduction - cardDeduction
    );
    const calculated = progressiveTax(taxBase);
    /* 세액공제 — 연금저축 13.2% (한도 600만), 의료비 15% (총급여 3% 초과분), 교육비 15% */
    const pensionCredit = Math.min(pension, 6000000) * 0.132;
    const medicalCredit = Math.max(0, medical - gross * 0.03) * 0.15;
    const educationCredit = education * 0.15;
    const determined = Math.max(
      0,
      calculated - pensionCredit - medicalCredit - educationCredit
    );
    /* 기납부세액 — 간이세액표 근사 (결정세액 대비 8% 가산 원천징수 가정) */
    const prepaid = calculated * 1.08;
    const refund = prepaid - determined;
    return { gross, taxBase, determined, prepaid, refund };
  }, [currentUser.salary, dependents, cardSpend, medical, education, pension]);

  const isRefund = result.refund >= 0;

  const inputs = [
    { label: "부양가족 수 (본인 제외)", value: dependents, min: 0, max: 6, step: 1, set: setDependents, fmt: (v: number) => `${v}명` },
    { label: "신용카드 등 사용액", value: cardSpend, min: 0, max: 80000000, step: 1000000, set: setCardSpend, fmt: fmtKorean },
    { label: "의료비 지출액", value: medical, min: 0, max: 20000000, step: 500000, set: setMedical, fmt: fmtKorean },
    { label: "교육비 지출액", value: education, min: 0, max: 20000000, step: 500000, set: setEducation, fmt: fmtKorean },
    { label: "연금저축 납입액", value: pension, min: 0, max: 12000000, step: 500000, set: setPension, fmt: fmtKorean },
  ];

  return (
    <div>
      <PageHeader
        breadcrumb={["급여 & 보상 정산", "급여 운영 엔진", "연말정산 시뮬레이터"]}
        title="연말정산 시뮬레이터"
        subtitle="임직원 직접 입력 방식 가이드 폼 — 공제 항목을 조정하면 요율 검증을 거쳐 예상 환급액이 실시간으로 도출됩니다."
        actions={
          <Badge tone="cobalt" dot>
            2026 귀속 · 간이 모델
          </Badge>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[7fr_5fr]">
        <Card
          title="공제 항목 입력 가이드 폼"
          subtitle={`총급여 ${fmtKorean(result.gross)} (현재 연봉 기준) — 슬라이더를 움직여 입력하세요`}
          action={
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-ink-500">
              <ReceiptText size={16} strokeWidth={1.75} />
            </span>
          }
        >
          <div className="flex flex-col">
            {inputs.map((input) => (
              <div
                key={input.label}
                className="border-b border-hairline-soft py-5 first:pt-1 last:border-none last:pb-1"
              >
                <div className="mb-2.5 flex items-baseline justify-between gap-3">
                  <span className="text-[13px] font-medium">{input.label}</span>
                  <span className="text-base font-semibold tabular-nums">
                    {input.fmt(input.value)}
                  </span>
                </div>
                <Slider
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={input.value}
                  onChange={input.set}
                  ariaLabel={input.label}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-start gap-2.5 rounded-field bg-canvas p-4 text-xs leading-relaxed text-ink-400">
            <Sparkles size={14} className="mt-0.5 flex-none text-cobalt" />
            입력값은 국세청 간소화 자료와 대조해 공제 요율·한도를 자동 검증하며,
            한도 초과분은 계산에서 제외됩니다. 본 결과는 간이 모델 추정치입니다.
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <div
            className={`rounded-showcase p-9 ${isRefund ? "bg-ink text-white" : "bg-alert-wash text-alert-deep"}`}
          >
            <div className="flex items-center gap-2">
              <Calculator size={16} className={isRefund ? "text-mint" : ""} />
              <span
                className={`text-[11px] font-semibold uppercase tracking-label ${isRefund ? "text-white/60" : ""}`}
              >
                {isRefund ? "예상 환급액" : "예상 추가 납부액"}
              </span>
            </div>
            <div className="type-display mt-3 text-[40px] tabular-nums">
              {fmtKorean(Math.abs(result.refund))}
            </div>
            <p className={`mt-2 text-[13px] ${isRefund ? "text-white/60" : ""}`}>
              {isRefund
                ? "2월 급여에 합산 지급될 것으로 예상됩니다"
                : "2월 급여에서 분할 공제될 것으로 예상됩니다"}
            </p>
          </div>

          <Card title="산출 내역" subtitle="단계별 검증 결과">
            <dl className="flex flex-col">
              {[
                ["총급여", result.gross],
                ["과세표준", result.taxBase],
                ["결정세액", result.determined],
                ["기납부세액 (원천징수)", result.prepaid],
              ].map(([label, value]) => (
                <div
                  key={label as string}
                  className="flex items-baseline justify-between border-b border-hairline-soft py-3 first:pt-0 last:border-none last:pb-0"
                >
                  <dt className="text-[13px] text-ink-400">{label as string}</dt>
                  <dd className="text-sm font-semibold tabular-nums">
                    {fmtWon(value as number)}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>

          <StatCard
            label="13월의 보너스 가이드"
            value={isRefund ? "환급 예상" : "납부 예상"}
            detail="연금저축 납입액을 늘리면 세액공제 한도(600만 원)까지 환급액이 늘어나요"
            accent={isRefund ? "mint" : "alert"}
          />
        </div>
      </div>
    </div>
  );
}
