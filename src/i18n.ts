import { DICT, type Lang } from './content';

const KEY = 'gekko-lang';

export function detectLang(nav: string | undefined, stored: string | null): Lang {
  if (stored === 'en' || stored === 'uk') return stored;
  const base = (nav ?? '').toLowerCase().split('-')[0];
  return base === 'uk' || base === 'ru' ? 'uk' : 'en';
}

export function t(lang: Lang, key: string): string {
  return DICT[lang][key] ?? DICT.en[key] ?? key;
}

export function applyLang(root: ParentNode, lang: Lang): void {
  root.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => { el.textContent = t(lang, el.dataset.i18n!); });
  root.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => { el.innerHTML = t(lang, el.dataset.i18nHtml!); });
  document.documentElement.lang = lang;
  document.title = t(lang, 'meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t(lang, 'meta.desc'));
}

export function readStoredLang(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function storeLang(l: Lang): void {
  try { localStorage.setItem(KEY, l); } catch { /* storage blocked: choice lasts for this page only */ }
}
