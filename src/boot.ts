import type { Lang } from './content';
import { t } from './i18n';

const FLAG = 'gekko-booted';
const LINES = 6, STEP = 340, TOTAL = 2900;

export function shouldBoot(reduced: boolean): boolean {
  if (reduced) return false;
  try { return sessionStorage.getItem(FLAG) !== '1'; } catch { return true; }
}

export function markBooted(): void {
  try { sessionStorage.setItem(FLAG, '1'); } catch { /* blocked: boot may show again next load */ }
}

export function runBoot(root: HTMLElement, lang: Lang): Promise<void> {
  return new Promise(resolve => {
    root.innerHTML = `<canvas aria-hidden="true"></canvas><div class="term mono"></div><div class="skip mono">${t(lang, 'boot.skip')}</div>`;
    root.setAttribute('role', 'button');
    root.setAttribute('tabindex', '0');
    root.setAttribute('aria-label', t(lang, 'boot.skip'));
    const behind = [...document.querySelectorAll<HTMLElement>('header, main, .gauge')];
    behind.forEach(el => el.setAttribute('inert', ''));
    root.hidden = false;
    root.focus({ preventScroll: true });
    const cv = root.querySelector('canvas')!;
    const cx = cv.getContext('2d');
    const term = root.querySelector<HTMLElement>('.term')!;
    const timers: number[] = [];
    let alive = true;

    const end = () => {
      if (!alive) return;
      alive = false;
      timers.forEach(clearTimeout);
      markBooted();
      behind.forEach(el => el.removeAttribute('inert'));
      root.classList.add('gone');
      setTimeout(() => { root.hidden = true; root.innerHTML = ''; resolve(); }, 420);
    };
    root.addEventListener('click', end);
    root.addEventListener('keydown', e => { if (['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); end(); } });

    const frame = () => {
      if (!alive || !cx) return;
      const w = (cv.width = Math.ceil(innerWidth / 3)), h = (cv.height = Math.ceil(innerHeight / 3));
      cx.fillStyle = '#0a0b09';
      cx.fillRect(0, 0, w, h);
      for (let i = 0; i < 70; i++) {
        cx.fillStyle = Math.random() < 0.08 ? 'rgba(255,46,122,.5)' : `rgba(200,255,46,${Math.random() * 0.12})`;
        cx.fillRect(Math.random() * w, Math.random() * h, Math.random() * w * 0.6, 1);
      }
      requestAnimationFrame(frame);
    };
    frame();

    for (let i = 0; i < LINES; i++)
      timers.push(window.setTimeout(() => {
        const d = document.createElement('div');
        d.className = 'line' + (i === 0 ? ' ok' : i === 4 ? ' bad' : '');
        d.textContent = t(lang, `boot.${i}`);
        term.append(d);
      }, 220 + i * STEP));
    timers.push(window.setTimeout(end, TOTAL));
  });
}
