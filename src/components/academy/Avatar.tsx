//==============================================================================
// Academy — member avatar: uploaded photo when present, emoji otherwise.
// Photos are 256px squares from /api/academy/profile/photo, so `unoptimized`
// skips Vercel's image-optimization quota without costing anything.
//==============================================================================

import Image from "next/image";

export default function Avatar({
  emoji,
  photoUrl,
  size = 40,
  className = "",
}: {
  emoji: string;
  photoUrl?: string | null;
  size?: number;
  className?: string;
}) {
  if (photoUrl) {
    return (
      <Image
        src={photoUrl}
        alt=""
        width={size}
        height={size}
        unoptimized
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full bg-black/40 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      {emoji}
    </span>
  );
}
