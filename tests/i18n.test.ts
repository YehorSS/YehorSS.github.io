import { afterEach, describe, expect, it, vi } from 'vitest';
import { DICT, RECORDS } from '../src/content';
import { detectLang, readStoredLang, storeLang } from '../src/i18n';

describe('dictionary', () => {
  it('has the same keys in both languages', () => {
    expect(Object.keys(DICT.en).sort()).toEqual(Object.keys(DICT.uk).sort());
  });

  it('has no empty values', () => {
    for (const lang of ['en', 'uk'] as const)
      for (const [k, v] of Object.entries(DICT[lang])) expect(v.trim(), `${lang}.${k}`).not.toBe('');
  });

  it('has a category and description for every record', () => {
    for (const r of RECORDS)
      for (const lang of ['en', 'uk'] as const) {
        expect(DICT[lang][`rec.${r.key}.cat`], `${lang} ${r.key} cat`).toBeTruthy();
        expect(DICT[lang][`rec.${r.key}.desc`], `${lang} ${r.key} desc`).toBeTruthy();
      }
  });
});

describe('detectLang', () => {
  it('defaults to English', () => expect(detectLang(undefined, null)).toBe('en'));
  it('picks Ukrainian for uk', () => expect(detectLang('uk-UA', null)).toBe('uk'));
  it('picks Ukrainian for ru', () => expect(detectLang('ru-RU', null)).toBe('uk'));
  it('picks English for other languages', () => expect(detectLang('pl', null)).toBe('en'));
  it('lets the stored choice win', () => expect(detectLang('uk', 'en')).toBe('en'));
  it('ignores a garbage stored value', () => expect(detectLang('en', 'garbage')).toBe('en'));
});

describe('stored language', () => {
  afterEach(() => vi.restoreAllMocks());

  it('survives storage that throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(readStoredLang()).toBeNull();
    expect(() => storeLang('uk')).not.toThrow();
  });

  it('round-trips a stored value', () => {
    storeLang('uk');
    expect(readStoredLang()).toBe('uk');
  });
});
