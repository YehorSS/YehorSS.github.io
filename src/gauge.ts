const TOP = 98, BOTTOM = 34;

export function integrity(progress: number): number {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  return Math.round(TOP - p * (TOP - BOTTOM));
}

export function gaugeColor(v: number): 'acid' | 'breach' {
  return v < 50 ? 'breach' : 'acid';
}

/** Pointer position on the bar as scroll progress 0..1 (top = start of the page). */
export function progressAt(clientY: number, rect: { top: number; height: number }): number {
  if (rect.height <= 0) return 0;
  return Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
}

/** Lets the gauge work as the page scrollbar: click or drag along it. */
export function mountGaugeDrag(bar: HTMLElement): void {
  const go = (e: PointerEvent) => {
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollTo({ top: progressAt(e.clientY, bar.getBoundingClientRect()) * max, behavior: 'instant' as ScrollBehavior });
  };
  bar.addEventListener('pointerdown', e => { bar.setPointerCapture(e.pointerId); go(e); });
  bar.addEventListener('pointermove', e => { if (bar.hasPointerCapture(e.pointerId)) go(e); });
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
