const AVATAR_TONES = [
  "bg-mint text-ink",
  "bg-pistachio text-ink",
  "bg-ink text-white",
  "bg-[#EBFDF2] text-mint-deep",
  "bg-hairline-soft text-ink-500",
];

interface AvatarProps {
  name: string;
  size?: number;
}

function toneIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  }
  return hash % AVATAR_TONES.length;
}

export function Avatar({ name, size = 36 }: AvatarProps) {
  const initial = name.trim().charAt(0);
  return (
    <span
      className={`inline-flex flex-none select-none items-center justify-center rounded-full font-semibold ${AVATAR_TONES[toneIndex(name)]}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
