import { CheckCircle2 } from "lucide-react";

interface ToastProps {
  message: string;
}

export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      className="fixed bottom-8 left-1/2 z-[120] flex -translate-x-1/2 animate-toast-up items-center gap-2.5 rounded-full bg-ink py-3 pl-4 pr-6 text-sm font-medium text-white shadow-toast"
    >
      <CheckCircle2 size={18} className="text-mint" />
      {message}
    </div>
  );
}
