import { describe, expect, it } from 'vitest';
import { gaugeColor, integrity } from '../src/gauge';

describe('integrity', () => {
  it('starts at 98 at the top', () => expect(integrity(0)).toBe(98));
  it('ends at 34 at the bottom', () => expect(integrity(1)).toBe(34));
  it('clamps above the top', () => expect(integrity(-1)).toBe(98));
  it('clamps below the bottom', () => expect(integrity(2)).toBe(34));
  it('treats NaN as the top', () => expect(integrity(NaN)).toBe(98));
});

describe('gaugeColor', () => {
  it('stays acid at 50', () => expect(gaugeColor(50)).toBe('acid'));
  it('turns breach below 50', () => expect(gaugeColor(49)).toBe('breach'));
});
