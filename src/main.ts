import './styles/tokens.css';
import './styles/layout.css';
import './styles/records.css';
import './styles/systems.css';
import './styles/effects.css';
import type { Lang } from './content';
import { applyLang, detectLang, readStoredLang, storeLang } from './i18n';
import { renderArchive, renderBridge, renderComms, renderEngineering } from './render';
import { mountGauge } from './gauge';
import { renderTemp, mountTelemetry } from './telemetry';
import { mountGlitch } from './glitch';
import { runBoot, shouldBoot } from './boot';

const $ = (id: string) => document.getElementById(id)!;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

renderBridge($('deck-bridge'));
renderArchive($('deck-archive'));
renderEngineering($('deck-engineering'));
renderComms($('deck-comms'));

function setLang(l: Lang): void {
  applyLang(document, l);
  $('lang-en').setAttribute('aria-pressed', String(l === 'en'));
  $('lang-uk').setAttribute('aria-pressed', String(l === 'uk'));
  renderTemp();
}

const lang = detectLang(navigator.language, readStoredLang());
setLang(lang);
$('lang-en').addEventListener('click', () => { setLang('en'); storeLang('en'); });
$('lang-uk').addEventListener('click', () => { setLang('uk'); storeLang('uk'); });

mountGauge($('gauge-fill'), $('gauge-value'));
mountTelemetry(reduced);
mountGlitch(reduced);
if (shouldBoot(reduced)) void runBoot($('boot'), lang);
