import { describe, expect, it } from 'vitest';
import { barcodeRects, barcodeSvg } from '../src/barcode';

describe('barcode', () => {
  it('is the same for the same seed', () => {
    expect(barcodeRects('vasyan', false)).toEqual(barcodeRects('vasyan', false));
  });

  it('differs between seeds', () => {
    expect(barcodeRects('vasyan', false)).not.toEqual(barcodeRects('hoi4', false));
  });

  it('loses the middle band when broken', () => {
    expect(barcodeRects('hoi4', true).some(r => r.x > 92 && r.x < 128)).toBe(false);
    expect(barcodeRects('hoi4', false).some(r => r.x > 92 && r.x < 128)).toBe(true);
  });

  it('stays inside the 200 wide box', () => {
    for (const seed of ['vasyan', 'tsm', 'damage']) for (const r of barcodeRects(seed, false)) expect(r.x + r.w).toBeLessThanOrEqual(200);
  });

  it('marks a broken code with a breach plate', () => {
    expect(barcodeSvg('hoi4', true)).toContain('x="100"');
    expect(barcodeSvg('hoi4', false)).not.toContain('class="plate"');
    expect(barcodeSvg('hoi4', false)).toContain('viewBox="0 0 200 46"');
  });
});
