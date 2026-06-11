import { Cpu, Eye, EyeOff, KeyRound, LogIn, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "../components/ui/Button";

interface LoginViewProps {
  onLogin: () => void;
}

/* 데모용 관리자 계정 — 실서비스 전환 시 인증 서버 연동으로 교체 */
const ADMIN_ID = "hr-erp";
const ADMIN_PW = "0123";

export function LoginView({ onLogin }: LoginViewProps) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (id.trim() === ADMIN_ID && pw === ADMIN_PW) {
      setError(null);
      onLogin();
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
          </label>

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
        </form>

        <p className="mt-6 text-center text-xs text-ink-300">
          본 시스템은 인가된 관리자만 접근할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
