/** Avatar de iniciales (2 letras) con tinte. Port del Avatar del prototipo. */
const TONES = {
  violet: { bg: "var(--aw-violet-light)", fg: "var(--aw-violet)" },
  teal: { bg: "#D5F0EC", fg: "#0F7C6C" },
  warm: { bg: "#FFF1D6", fg: "#84541A" },
} as const;

export function AvatarInitials({
  name,
  size = 30,
  tone = "violet",
}: {
  name: string;
  size?: number;
  tone?: keyof typeof TONES;
}) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  const t = TONES[tone];
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-bold"
      style={{ width: size, height: size, fontSize: size * 0.37, background: t.bg, color: t.fg }}
    >
      {initials}
    </span>
  );
}
