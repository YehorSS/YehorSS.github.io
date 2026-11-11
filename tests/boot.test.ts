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

import { runBoot } from '../src/boot';

describe('runBoot', () => {
  it('makes the page behind the boot screen inert until it ends', async () => {
    document.body.innerHTML = '<div id="boot" hidden></div><header></header><aside class="gauge"></aside><main></main>';
    vi.useFakeTimers();
    const done = runBoot(document.getElementById('boot')!, 'en');
    for (const sel of ['header', 'main', '.gauge']) expect(document.querySelector(sel)!.hasAttribute('inert'), sel).toBe(true);
    document.getElementById('boot')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await vi.advanceTimersByTimeAsync(500);
    await done;
    vi.useRealTimers();
    for (const sel of ['header', 'main', '.gauge']) expect(document.querySelector(sel)!.hasAttribute('inert'), sel).toBe(false);
  });
});
