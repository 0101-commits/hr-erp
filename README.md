# NexChip HR Enterprise

넥스칩 세미콘 (반도체 제조·설계 · 임직원 3,000명)을 위한 **차세대 하이브리드 인텔리전트 HR SaaS 플랫폼** 대화형 React 프로토타입.

기존 브라우저 플러그인 형태의 프로토타입을 **Vite + React + TypeScript + Tailwind CSS** 프로덕션 아키텍처로 완전히 마이그레이션·확장했습니다. 외부 UI 라이브러리 없이 Premium Cream-Mint 디자인 시스템 토큰으로 모든 컴포넌트를 독립 구현했습니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 타입 체크 + 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

## 디자인 시스템 — Premium Cream-Mint Track

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| Canvas | `#FBFBF5` | 글로벌 배경 (프리미엄 크림 화이트) |
| Surface | `#FFFFFF` | 카드·콘텐츠 표면 |
| Core Ink | `#000000` | 타이포그래피·핵심 컨트롤 |
| Aloe Mint | `#C1FBD4` | 안정 상태·핵심 인재 하이라이트 |
| Pistachio | `#D4F9E0` | 성장 액센트 |
| Hairline | `#E4E4E7` | 1px 헤어라인 보더 |
| Cobalt | `#0064E0` | 최종 승인 등 고위험 액션 전용 |

- 버튼·칩: 100% 알약 형태 (`rounded-full`)
- 쇼케이스 카드: 32px 라운딩 (`rounded-[32px]`)
- 인풋·그리드 셀: 8px / 16px 라운딩
- FLAT 원칙 — 그림자는 슬라이딩 패널·토스트에만 허용
- 디스플레이 타이포그래피: `font-weight: 330` + 스너그 트래킹

## 주요 화면

1. **대시보드 허브** — 교대조 타임 & 어텐던스(실시간 펀치 클락 · 주 52시간 프로그레스), 애자일 OKR & 피어 피드백 스트림, 엔터프라이즈 결재 대기 큐, 내러티브 HR 애널리틱스
2. **성과 등급 보정** — 권장 분포 곡선 대비 등급 밸런싱, 등급 변경 시 성과급 자동 재산정
3. **메리트 매트릭스 시뮬레이터** — 총 예산 25억 원, 초과 시 경고 배너 / 안정 시 알로에 민트 'Stable' 상태바
4. **토탈 리워드 포탈** — Recharts 기반 잉크 블랙 × 알로에 민트 모노톤 차트, RSU 베스팅 타임라인
5. **9-Box 탤런트 맵핑** — 성과 × 잠재력 매트릭스, 핵심 인재 셀 민트 하이라이트

## 핵심 인터랙션

- **AI 옴니바** — 상단 중앙 알약형 자연어 명령창. "연차 신청" → AI Leave Application 패널, 임직원 이름 → 프로필 패널, 화면 이름 → 라우팅
- **Artifacts-Style 슬라이딩 패널** — 화면 너비 42% 오버레이. 대화형 연차 어드바이저가 결재 라인·라인 가동 현황을 자율 평가 후 코발트 블루 확정 버튼으로 상신
- **전역 상태 동기화** — 보정 등급·인상률 슬라이더 변경이 대시보드 메트릭, 리워드 차트, 탤런트 보드에 즉시 반영

## 구조

```
src/
├── App.tsx                  # 중앙 집중식 전역 상태 · 라우팅 · 인터랙션 조율
├── data/mockData.ts         # 임직원 15명 스냅샷 · 시뮬레이션 모델 · ₩ 포맷터
├── components/
│   ├── ui/                  # Button · Card · Badge · Select · ProgressBar · StatCard · PageHeader · Toast · SideNav · Slider · Avatar
│   ├── layout/TopBar.tsx    # 스티키 헤더 + AI 옴니바
│   └── panel/DetailPanel.tsx# 슬라이딩 프로필 / AI 연차 신청 패널
└── views/                   # 5개 메인 워크스페이스 뷰
```
