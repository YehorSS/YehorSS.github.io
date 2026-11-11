// Screenshots the built site at desktop and phone widths in both languages,
// fails on horizontal overflow, and renders public/og.png from the bridge.
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const PORT = 4318;
const URL = `http://localhost:${PORT}/`;
const server = spawn(`npx vite preview --port ${PORT} --strictPort`, { shell: true, stdio: 'ignore' });

async function waitForServer() {
  for (let i = 0; i < 50; i++) {
    try { if ((await fetch(URL)).ok) return; } catch { /* not up yet */ }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('preview server did not start');
}

const problems = [];
mkdirSync('shots', { recursive: true });
let browser;
try {
  await waitForServer();
  browser = await chromium.launch();
  for (const [w, h] of [[1440, 900], [1280, 800], [390, 844]])
    for (const lang of ['en', 'uk']) {
      const page = await browser.newPage({ viewport: { width: w, height: h } });
      await page.addInitScript(l => { localStorage.setItem('gekko-lang', l); sessionStorage.setItem('gekko-booted', '1'); }, lang);
      await page.goto(URL);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `shots/${w}-${lang}.png`, fullPage: true });
      const bad = await page.evaluate(() => {
        const out = [];
        if (document.documentElement.scrollWidth > innerWidth) out.push(`page ${document.documentElement.scrollWidth}px wide`);
        document.querySelectorAll('.rec h2, .rec p, h1, .sys h3, .handle').forEach(el => {
          if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}" overflows`);
        });
        const g = document.querySelector('.gauge');
        if (g && getComputedStyle(g).display !== 'none') {
          const gl = g.getBoundingClientRect().left;
          document.querySelectorAll('main .coord, main .spec, main .rec').forEach(el => {
            if (el.getBoundingClientRect().right > gl) out.push(`${el.className} runs under the gauge`);
          });
        }
        return out;
      });
      bad.forEach(b => problems.push(`${w} ${lang}: ${b}`));
      await page.close();
    }

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
  await og.addInitScript(() => { localStorage.setItem('gekko-lang', 'en'); sessionStorage.setItem('gekko-booted', '1'); });
  await og.goto(URL);
  await og.evaluate(() => document.fonts.ready);
  await og.screenshot({ path: 'public/og.png' });
} finally {
  await browser?.close();
  server.kill();
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
console.log('shots ok: 6 layouts, og.png written');
process.exit(0);
