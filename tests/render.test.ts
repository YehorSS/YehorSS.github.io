import { beforeEach, describe, expect, it } from 'vitest';
import { RECORDS } from '../src/content';
import { renderArchive, renderBridge } from '../src/render';

let el: HTMLElement;
beforeEach(() => { el = document.createElement('section'); });

describe('archive', () => {
  beforeEach(() => renderArchive(el));

  it('renders every record', () => expect(el.querySelectorAll('article.rec')).toHaveLength(RECORDS.length));

  it('damages records by status', () => {
    const recs = [...el.querySelectorAll('article.rec')];
    expect(recs.filter(r => !r.matches('.damaged, .corrupted'))).toHaveLength(6);
    expect(recs.filter(r => r.matches('.damaged'))).toHaveLength(2);
    expect(recs.filter(r => r.matches('.corrupted'))).toHaveLength(1);
  });

  it('links each record to its repository (and live site, if any) in a new tab', () => {
    el.querySelectorAll('article.rec').forEach((rec, i) => {
      const links = rec.querySelectorAll('a[href^="http"]');
      expect(links).toHaveLength(RECORDS[i].site ? 2 : 1);
      if (RECORDS[i].site) expect(links[1].getAttribute('href')).toBe(RECORDS[i].site);
      expect(links[0].getAttribute('href')).toBe(RECORDS[i].repo);
      expect(links[0].getAttribute('target')).toBe('_blank');
      expect(links[0].getAttribute('rel')).toContain('noopener');
    });
  });

  it('keeps the full title readable and draws a barcode', () => {
    el.querySelectorAll('article.rec').forEach((rec, i) => {
      expect(rec.querySelector('h2')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(RECORDS[i].title);
      expect(rec.querySelector('svg.barcode')).not.toBeNull();
    });
  });

  it('translates through data-i18n keys', () => {
    expect(el.querySelector('[data-i18n="rec.vasyan.desc"]')).not.toBeNull();
  });
});

describe('bridge', () => {
  it('has the name and a link to the archive', () => {
    renderBridge(el);
    expect(el.querySelector('h1 [data-i18n="bridge.l1"]')).not.toBeNull();
    expect(el.querySelector('a[href="#deck-archive"]')).not.toBeNull();
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
