import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from '../src/copy';

const target = () => { const el = document.createElement('code'); el.textContent = '@kujira88'; document.body.append(el); return el; };

afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ''; getSelection()?.removeAllRanges(); });

describe('copyText', () => {
  it('reports copied when the clipboard accepts', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    expect(await copyText('@kujira88', target())).toBe('copied');
    expect(writeText).toHaveBeenCalledWith('@kujira88');
  });

  it('selects the text when the clipboard refuses', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    expect(await copyText('@kujira88', target())).toBe('selected');
    expect(getSelection()!.toString()).toBe('@kujira88');
  });

  it('selects the text when there is no clipboard', async () => {
    vi.stubGlobal('navigator', {});
    expect(await copyText('@kujira88', target())).toBe('selected');
    expect(getSelection()!.toString()).toBe('@kujira88');
  });
});
