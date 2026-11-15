const COLORS = ["bg-peach", "bg-lavender", "bg-sea", "bg-gold", "bg-butter"];

export function Confetti({ count = 40 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`absolute top-0 block h-3 w-2 rounded-sm ${COLORS[i % COLORS.length]}`}
          style={{
            left: `${(i * 37) % 100}%`,
            animation: `confetti-fall ${1.8 + (i % 5) * 0.35}s ease-in ${(i % 8) * 0.12}s both`,
          }}
        />
      ))}
    </div>
  );
}
