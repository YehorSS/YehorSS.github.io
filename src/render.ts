import { CONTACTS, RECORDS, SKILLS, type ArchiveRecord } from './content';
import { barcodeSvg } from './barcode';

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const tr = (key: string, tag = 'span', cls = '') => `<${tag}${cls ? ` class="${cls}"` : ''} data-i18n="${key}"></${tag}>`;

function deckHead(no: string, key: string, right: string): string {
  return `<div class="deck mono"><span class="no">DECK ${no}</span>${tr(key, 'span', 'name')}<span class="coord">${right}</span></div>`;
}

export function renderBridge(el: HTMLElement): void {
  el.innerHTML = `${deckHead('01', 'deck.bridge', 'TAU-FIELD 14.07 / −3.91')}
  <div class="bridge">
    <div class="ship mono">${tr('bridge.crew', 'span', 'tag')}<span>ID 0047-YK</span></div>
    <h1 class="jolt">${tr('bridge.first')}<span class="l2" data-i18n="bridge.last"></span></h1>
    <p class="role" data-i18n-html="bridge.role"></p>
    <dl class="spec mono">
      ${tr('spec.core', 'dt')}<dd>Java · C++ · TypeScript</dd>
      ${tr('spec.systems', 'dt')}<dd>JVM bytecode · memory · VMs</dd>
      ${tr('spec.interface', 'dt')}<dd>Tauri · React · ImGui · GLSL</dd>
      ${tr('spec.comms', 'dt')}<dd>UA · RU · EN · IT</dd>
    </dl>
    <div class="cta">
      <a class="btn solid" href="#deck-archive" data-i18n="bridge.open"></a>
      <a class="btn" href="https://github.com/YehorSS" target="_blank" rel="noopener">GitHub ↗</a>
    </div>
  </div>`;
}

// Hides characters visually (ink on ink) while keeping them in the text for screen readers and copy.
const redact = (s: string, from: number, to = s.length) => `${esc(s.slice(0, from))}<span class="redact">${esc(s.slice(from, to))}</span>${esc(s.slice(to))}`;

const BREACH: Record<string, [string, number]> = { hoi4: ['2-C', 31], crit: ['3-A', 47], damage: ['4-F', 66] };

function title(r: ArchiveRecord): string {
  if (r.status === 'INTACT') return esc(r.title);
  const i = r.title.lastIndexOf(' ');
  return i < 0 ? `<span class="shift">${esc(r.title)}</span>` : `${esc(r.title.slice(0, i))} <span class="shift">${esc(r.title.slice(i + 1))}</span>`;
}

function record(r: ArchiveRecord): string {
  const cls = r.status === 'PARTIAL' ? ' damaged' : r.status === 'CORRUPTED' ? ' corrupted' : '';
  const stat = r.status === 'INTACT' ? 'ok' : r.status === 'PARTIAL' ? 'part' : 'bad';
  const date = r.status === 'INTACT' ? esc(r.recovered) : r.status === 'PARTIAL' ? redact(r.recovered, 2, 4) : redact(r.recovered, 0);
  const serial = r.status === 'INTACT' ? esc(r.serial) : r.status === 'PARTIAL' ? redact(r.serial, 10, 11) : redact(r.serial, 5, 11);
  const [sector, lost] = BREACH[r.key] ?? ['', 0];
  const note = r.status === 'PARTIAL'
    ? `<div class="breach-note mono">${tr('rec.breach')} · ${tr('rec.sector')} ${sector} · ${tr('rec.lost')} ${lost}%</div>`
    : r.status === 'CORRUPTED' ? `<div class="breach-note mono">${tr('rec.corrupt')}</div>` : '';
  return `<article class="rec${cls}">
    <i class="reg a" aria-hidden="true"></i><i class="reg b" aria-hidden="true"></i>
    <div class="side mono">
      <div><div class="k" data-i18n="rec.record"></div><div class="val">${r.id}</div></div>
      <div><div class="k" data-i18n="rec.status"></div><span class="status ${stat}">${r.status}</span></div>
      <div><div class="k" data-i18n="rec.recovered"></div><div class="val">${date}</div></div>
      <div class="bc">${barcodeSvg(r.seed, r.status !== 'INTACT')}<div class="k">${serial}</div></div>
    </div>
    <div class="body">
      <div class="top mono">${tr(`rec.${r.key}.cat`)}<span>${esc(r.stack)}</span></div>
      <h2 class="jolt">${title(r)}</h2>
      <p data-i18n="rec.${r.key}.desc"></p>
      <div class="chips mono">${r.chips.map(c => `<span>${esc(c)}</span>`).join('')}</div>
      <div class="foot mono"><span>${r.status === 'INTACT' ? esc(r.serial) : tr('rec.damaged')}</span><a href="${esc(r.repo)}" target="_blank" rel="noopener" data-i18n="rec.open"></a></div>
    </div>
    ${note}
  </article>`;
}

export function renderArchive(el: HTMLElement): void {
  el.innerHTML = `${deckHead('02', 'deck.archive', `${RECORDS.length} / ${RECORDS.length}`)}
  <div class="records">${RECORDS.map(record).join('')}</div>`;
}

export { CONTACTS, SKILLS };
