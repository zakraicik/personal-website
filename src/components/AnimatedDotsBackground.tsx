// A deterministic CSS texture keeps the background quiet and avoids runtime animation work.
export function AnimatedDotsBackground() {
  return <div className="ambient-background" aria-hidden="true" />;
}
