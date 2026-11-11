const TOP = 98, BOTTOM = 34;

export function integrity(progress: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(TOP - p * (TOP - BOTTOM));
}

export function gaugeColor(v: number): 'acid' | 'breach' {
  return v < 50 ? 'breach' : 'acid';
}

export function mountGauge(fill: HTMLElement, label: HTMLElement): () => void {
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const v = integrity(max > 0 ? scrollY / max : 0);
    fill.style.height = `${v}%`;
    fill.dataset.state = gaugeColor(v);
    label.textContent = `${v}%`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  return () => { removeEventListener('scroll', update); removeEventListener('resize', update); };
}
