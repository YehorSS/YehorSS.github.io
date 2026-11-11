const JOLT_EVERY = 3800;

function inView(el: Element): boolean {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < innerHeight;
}

function restart(el: Element, cls: string): void {
  el.classList.remove(cls);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(cls);
}

export function mountGlitch(reduced: boolean): void {
  if (reduced) return;
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('deck-in'); io.unobserve(e.target); }
  }, { threshold: 0.6 });
  document.querySelectorAll('.deck').forEach(d => io.observe(d));

  setInterval(() => {
    const seen = [...document.querySelectorAll('.jolt')].filter(inView);
    if (seen.length) restart(seen[Math.floor(Math.random() * seen.length)], 'glitch');
  }, JOLT_EVERY);
}
