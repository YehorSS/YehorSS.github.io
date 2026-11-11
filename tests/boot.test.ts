import { afterEach, describe, expect, it, vi } from 'vitest';
import { markBooted, shouldBoot } from '../src/boot';

afterEach(() => { vi.restoreAllMocks(); sessionStorage.clear(); });

describe('shouldBoot', () => {
  it('never boots with reduced motion', () => expect(shouldBoot(true)).toBe(false));
  it('boots on the first visit', () => expect(shouldBoot(false)).toBe(true));

  it('does not boot again in the same session', () => {
    markBooted();
    expect(shouldBoot(false)).toBe(false);
  });

  it('boots when session storage is blocked, and marking does not throw', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(shouldBoot(false)).toBe(true);
    expect(() => markBooted()).not.toThrow();
  });
});
