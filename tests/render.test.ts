import { beforeEach, describe, expect, it } from 'vitest';
import { RECORDS } from '../src/content';
import { renderBridge, renderRecords, renderWeb } from '../src/render';

let el: HTMLElement;
beforeEach(() => { el = document.createElement('section'); });

const web = RECORDS.filter(r => r.deck === 'web');
const code = RECORDS.filter(r => r.deck !== 'web');

describe('web deck', () => {
  beforeEach(() => renderWeb(el));

  it('shows every site as a compact card and nothing else', () => {
    expect(el.querySelectorAll('article.site')).toHaveLength(web.length);
    expect(el.querySelectorAll('article.rec')).toHaveLength(0);
    expect(web.every(r => r.site)).toBe(true);
  });

  it('opens the live site and the code in a new tab, with a picture of the site', () => {
    el.querySelectorAll('article.site').forEach((card, i) => {
      const hrefs = [...card.querySelectorAll('a[href^="http"]')].map(a => a.getAttribute('href'));
      expect(hrefs).toContain(web[i].site);
      expect(hrefs).toContain(web[i].repo);
      card.querySelectorAll('a[href^="http"]').forEach(a => expect(a.getAttribute('rel')).toContain('noopener'));
      expect(card.querySelector('img')!.getAttribute('src')).toBe(`sites/${web[i].key}.webp`);
      expect(card.querySelector('h2')!.textContent).toBe(web[i].title);
    });
  });
});

describe('soft and mods decks', () => {
  it('splits the code records by deck, keeping their damage', () => {
    renderRecords(el, '03', 'soft');
    const soft = [...el.querySelectorAll('article.rec')];
    expect(soft).toHaveLength(code.filter(r => r.deck === 'soft').length);
    expect(soft.every(r => !r.matches('.damaged, .corrupted'))).toBe(true);
    renderRecords(el, '04', 'mods');
    const mods = [...el.querySelectorAll('article.rec')];
    expect(mods).toHaveLength(code.filter(r => r.deck === 'mods').length);
    expect(mods.filter(r => r.matches('.damaged'))).toHaveLength(2);
    expect(mods.filter(r => r.matches('.corrupted'))).toHaveLength(1);
  });

  it('links each record to its repository in a new tab and draws a barcode', () => {
    renderRecords(el, '03', 'soft');
    const soft = code.filter(r => r.deck === 'soft');
    el.querySelectorAll('article.rec').forEach((rec, i) => {
      const a = rec.querySelector('a[href^="http"]')!;
      expect(a.getAttribute('href')).toBe(soft[i].repo);
      expect(a.getAttribute('target')).toBe('_blank');
      expect(rec.querySelector('h2')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(soft[i].title);
      expect(rec.querySelector('svg.barcode')).not.toBeNull();
    });
    expect(el.querySelector('[data-i18n="rec.vasyan.desc"]')).not.toBeNull();
  });
});

describe('bridge', () => {
  it('has the name and links to the sites and the programs', () => {
    renderBridge(el);
    expect(el.querySelector('h1 [data-i18n="bridge.l1"]')).not.toBeNull();
    expect(el.querySelector('a[href="#deck-web"]')).not.toBeNull();
    expect(el.querySelector('a[href="#deck-soft"]')).not.toBeNull();
  });
});

import { renderComms, renderEngineering } from '../src/render';
import { FREELANCEHUNT_URL } from '../src/content';

describe('engineering', () => {
  it('shows five systems and no percentages', () => {
    renderEngineering(el);
    expect(el.querySelectorAll('.sys')).toHaveLength(5);
    expect(el.innerHTML).not.toContain('%');
  });
});

describe('comms', () => {
  it('opens exactly the three live channels and no mail', () => {
    renderComms(el);
    const hrefs = [...el.querySelectorAll('.channel.live a')].map(a => a.getAttribute('href'));
    expect(hrefs).toEqual([FREELANCEHUNT_URL, 'https://t.me/kujira88', 'https://github.com/YehorSS']);
    expect(el.innerHTML).not.toContain('mailto:');
    expect(el.querySelectorAll('.channel.live button.copy')).toHaveLength(3);
  });
});

import { applyLang } from '../src/i18n';

describe('bridge headline', () => {
  it('leads with development and keeps the name in the crew tag', () => {
    renderBridge(el);
    applyLang(el, 'en');
    expect(el.querySelector('h1')!.textContent).toBe('Software/Web development');
    expect(el.querySelector('.ship')!.textContent).toContain('Yehor Kudinchykov');
    expect(el.querySelector('.role')!.textContent).toMatch(/desktop apps.*websites.*game tools.*mods/i);
  });

  it('reads the same way in Ukrainian', () => {
    renderBridge(el);
    applyLang(el, 'uk');
    expect(el.querySelector('h1')!.textContent).toBe('Розробка програм/сайтів');
    expect(el.querySelector('.ship')!.textContent).toContain('Єгор Кудінчиков');
  });
});

import { fitHeadline } from '../src/render';

describe('fitHeadline', () => {
  it('sizes the headline by its longest line', () => {
    renderBridge(el);
    applyLang(el, 'uk');
    fitHeadline(el.querySelector('h1')!);
    expect(el.querySelector<HTMLElement>('h1')!.style.getPropertyValue('--len')).toBe('14');
  });
});
