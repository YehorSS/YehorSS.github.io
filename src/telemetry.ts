const START = -41.2, STEP = 0.1, EVERY = 2600;

let temp = START;

export function renderTemp(): void {
  const el = document.getElementById('temp');
  if (!el) return;
  const s = temp.toFixed(1).replace('-', '−');
  el.textContent = document.documentElement.lang === 'uk' ? s.replace('.', ',') : s;
}

export function mountTelemetry(reduced: boolean): void {
  renderTemp();
  if (reduced) return;
  setInterval(() => { temp -= STEP; renderTemp(); }, EVERY);
}
