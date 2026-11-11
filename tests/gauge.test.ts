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

import { progressAt } from '../src/gauge';

describe('progressAt', () => {
  const rect = { top: 100, height: 400 };
  it('maps the top of the bar to the start', () => expect(progressAt(100, rect)).toBe(0));
  it('maps the bottom of the bar to the end', () => expect(progressAt(500, rect)).toBe(1));
  it('maps the middle to half way', () => expect(progressAt(300, rect)).toBe(0.5));
  it('clamps outside the bar', () => { expect(progressAt(0, rect)).toBe(0); expect(progressAt(900, rect)).toBe(1); });
});
