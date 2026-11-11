export interface Bar { x: number; w: number }

const WIDTH = 200;
const GAP_FROM = 92, GAP_TO = 128;

export function barcodeRects(seed: string, broken: boolean): Bar[] {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => (h = (h * 1664525 + 1013904223) >>> 0) / 4294967296;
  const out: Bar[] = [];
  let x = 0;
  for (;;) {
    const w = 1 + Math.floor(rnd() * 3.2);
    const gap = 1 + Math.floor(rnd() * 2.4);
    if (x + w > WIDTH) break;
    if (!(broken && x > GAP_FROM && x < GAP_TO)) out.push({ x, w });
    x += w + gap;
  }
  return out;
}

export function barcodeSvg(seed: string, broken: boolean): string {
  const bars = barcodeRects(seed, broken).map(b => `<rect x="${b.x}" y="0" width="${b.w}" height="46"/>`).join('');
  const plate = broken ? '<rect class="plate" x="100" y="16" width="22" height="14"/>' : '';
  return `<svg class="barcode" viewBox="0 0 200 46" preserveAspectRatio="none" aria-hidden="true">${bars}${plate}</svg>`;
}
