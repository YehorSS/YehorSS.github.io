import { beforeEach, describe, expect, it } from 'vitest';
import { RECORDS } from '../src/content';
import { renderArchive, renderBridge } from '../src/render';

let el: HTMLElement;
beforeEach(() => { el = document.createElement('section'); });

describe('archive', () => {
  beforeEach(() => renderArchive(el));

  it('renders six records', () => expect(el.querySelectorAll('article.rec')).toHaveLength(6));

  it('damages records by status', () => {
    const recs = [...el.querySelectorAll('article.rec')];
    expect(recs.filter(r => !r.matches('.damaged, .corrupted'))).toHaveLength(3);
    expect(recs.filter(r => r.matches('.damaged'))).toHaveLength(2);
    expect(recs.filter(r => r.matches('.corrupted'))).toHaveLength(1);
  });

  it('links each record to its repository in a new tab', () => {
    el.querySelectorAll('article.rec').forEach((rec, i) => {
      const links = rec.querySelectorAll('a[href^="http"]');
      expect(links).toHaveLength(1);
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
    expect(el.querySelector('h1 [data-i18n="bridge.first"]')).not.toBeNull();
    expect(el.querySelector('a[href="#deck-archive"]')).not.toBeNull();
  });
});
