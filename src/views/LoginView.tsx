import {
  AlertTriangle,
  Cpu,
  Eye,
  EyeOff,
  KeyRound,
  LogIn,
  Mail,
  MailCheck,
  Send,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "../components/ui/Button";

interface LoginViewProps {
  /* keepSignedIn: 자동 로그인 체크 여부 — 브라우저를 닫아도 로그인 유지 */
  onLogin: (keepSignedIn: boolean) => void;
}

/* 데모용 관리자 계정 — 실서비스 전환 시 인증 서버 연동으로 교체 */
const ADMIN_ID = "hr-erp";
const ADMIN_PW = "0123";

const SAVED_ID_KEY = "nx-hr-saved-id";

type RecoveryMode = "id" | "pw";

function maskId(value: string): string {
  if (value.length <= 3) return value[0] + "*".repeat(value.length - 1);
  return value.slice(0, 3) + "*".repeat(value.length - 3);
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [id, setId] = useState(() => localStorage.getItem(SAVED_ID_KEY) ?? "");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [saveId, setSaveId] = useState(
    () => localStorage.getItem(SAVED_ID_KEY) !== null
  );
  const [autoLogin, setAutoLogin] = useState(true);
  const [capsOn, setCapsOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState<RecoveryMode | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (id.trim() === ADMIN_ID && pw === ADMIN_PW) {
      setError(null);
      if (saveId) {
        localStorage.setItem(SAVED_ID_KEY, id.trim());
      } else {
        localStorage.removeItem(SAVED_ID_KEY);
      }
      onLogin(autoLogin);
      return;
    }
    setError("아이디 또는 비밀번호가 올바르지 않습니다.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-6 py-12">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-field bg-ink text-white">
            <Cpu size={22} strokeWidth={1.75} />
          </span>
          <div>
            <h1 className="type-display text-[28px] text-ink">
              NexChip <span className="font-light">HR Enterprise</span>
            </h1>
            <p className="mt-1.5 text-sm text-ink-400">
              넥스칩 세미콘 · People &amp; Rewards 관리자 콘솔
            </p>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-showcase border border-hairline-soft bg-surface p-8 shadow-cube"
        >
          <div className="type-label mb-6">관리자 로그인</div>

          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink-500">
              아이디
            </span>
            <div className="flex h-11 items-center gap-2.5 rounded-field border border-hairline bg-canvas px-4 transition-colors focus-within:border-cobalt focus-within:bg-surface">
              <UserRound size={16} className="flex-none text-ink-400" />
              <input
                value={id}
                onChange={(event) => setId(event.target.value)}
                placeholder="아이디를 입력하세요"
                autoComplete="username"
                autoFocus
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-300"
              />
            </div>
          </label>

          <label className="mt-4 block">
            <span className="mb-1.5 block text-[13px] font-medium text-ink-500">
              비밀번호
            </span>
            <div className="flex h-11 items-center gap-2.5 rounded-field border border-hairline bg-canvas px-4 transition-colors focus-within:border-cobalt focus-within:bg-surface">
              <KeyRound size={16} className="flex-none text-ink-400" />
              <input
                type={showPw ? "text" : "password"}
                value={pw}
                onChange={(event) => setPw(event.target.value)}
                onKeyUp={(event) =>
                  setCapsOn(event.getModifierState("CapsLock"))
                }
                onBlur={() => setCapsOn(false)}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-300"
              />
              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 표시"}
                className="flex-none text-ink-400 transition-colors hover:text-ink"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {capsOn && (
              <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-alert-deep">
                <AlertTriangle size={12} />
                Caps Lock이 켜져 있어요
              </p>
            )}
          </label>

          <div className="mt-4 flex items-center justify-between">
            <label className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-ink-500">
              <input
                type="checkbox"
                checked={saveId}
                onChange={(event) => setSaveId(event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-ink"
              />
              아이디 저장
            </label>
            <label
              className="flex cursor-pointer select-none items-center gap-2 text-[13px] text-ink-500"
              title="브라우저를 닫아도 로그인이 유지됩니다"
            >
              <input
                type="checkbox"
                checked={autoLogin}
                onChange={(event) => setAutoLogin(event.target.checked)}
                className="h-4 w-4 cursor-pointer rounded accent-ink"
              />
              자동 로그인
            </label>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-cell bg-alert-wash px-4 py-2.5 text-[13px] font-medium text-alert-deep"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            icon={<LogIn size={16} />}
            className="mt-6 w-full"
          >
            로그인
          </Button>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs text-ink-400">
            <button
              type="button"
              onClick={() => setRecovery("id")}
              className="transition-colors hover:text-ink hover:underline"
            >
              아이디 찾기
            </button>
            <span className="h-3 w-px bg-hairline" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setRecovery("pw")}
              className="transition-colors hover:text-ink hover:underline"
            >
              비밀번호 재설정
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-ink-300">
          본 시스템은 인가된 관리자만 접근할 수 있습니다.
        </p>
      </div>

      {recovery && (
        <RecoveryDialog mode={recovery} onClose={() => setRecovery(null)} />
      )}
    </div>
  );
}

/* 아이디 찾기 / 비밀번호 재설정 — 이메일 입력 후 안내 (데모 흐름) */
function RecoveryDialog({
  mode,
  onClose,
}: {
  mode: RecoveryMode;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const isId = mode === "id";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-ink/25"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isId ? "아이디 찾기" : "비밀번호 재설정"}
        className="relative w-full max-w-sm animate-fade-in rounded-showcase border border-hairline-soft bg-surface p-7 shadow-cube"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-semibold tracking-snug">
            {isId ? "아이디 찾기" : "비밀번호 재설정"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-canvas hover:text-ink"
          >
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="mt-5">
            <div className="flex items-start gap-2.5 rounded-field bg-mint-wash p-4 text-[13px] leading-relaxed text-mint-deep">
              <MailCheck size={15} className="mt-0.5 flex-none" />
              {isId ? (
                <span>
                  등록된 관리자 아이디는 <strong>{maskId(ADMIN_ID)}</strong>{" "}
                  입니다. 전체 아이디를 <strong>{email}</strong>(으)로
                  발송했어요.
                </span>
              ) : (
                <span>
                  <strong>{email}</strong>(으)로 비밀번호 재설정 링크를
                  발송했어요. 24시간 안에 링크를 열어 새 비밀번호를 설정해
                  주세요.
                </span>
              )}
            </div>
            <p className="mt-3 text-center text-xs text-ink-300">
              데모 환경에서는 메일이 실제 발송되지 않습니다.
            </p>
            <Button className="mt-4 w-full" onClick={onClose}>
              확인
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-2">
            <p className="text-[13px] leading-relaxed text-ink-400">
              {isId
                ? "관리자 등록 시 사용한 이메일을 입력하면 아이디를 안내해 드려요."
                : "관리자 이메일을 입력하면 비밀번호 재설정 링크를 보내 드려요."}
            </p>
            <div className="mt-4 flex h-11 items-center gap-2.5 rounded-field border border-hairline bg-canvas px-4 transition-colors focus-within:border-cobalt focus-within:bg-surface">
              <Mail size={16} className="flex-none text-ink-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="등록된 이메일 주소"
                autoFocus
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-300"
              />
            </div>
            <Button type="submit" className="mt-4 w-full" icon={<Send size={15} />}>
              {isId ? "아이디 안내 받기" : "재설정 링크 발송"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
