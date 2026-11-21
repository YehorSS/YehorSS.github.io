import { copyText } from '../src/copy';

const presets = {
  artwork: { gap: 8, parts: [
    { width: 506, name: '01-center', label: 'center' },
    { width: 100, name: '02-right', label: 'right' },
  ] },
  featured: { gap: 0, parts: [{ width: 630, name: '01-featured', label: 'featured' }] },
};

const messages = {
  center: ['Center artwork', 'Центр'],
  right: ['Right strip', 'Правая полоса'],
  featured: ['Featured artwork', 'Избранная иллюстрация'],
  example: ['Example', 'Пример'],
  artworkSlots: ['Select Artwork Showcase. Put the center image in the main slot, and the strip in the first right slot. Save your profile.', 'Выбери витрину иллюстраций. Поставь центр в основной слот, полосу — в первый правый. Сохрани профиль.'],
  featuredSlot: ['Select Featured Artwork Showcase, put the image in its single slot and save your profile.', 'Выбери витрину избранной иллюстрации, добавь файл в её слот и сохрани профиль.'],
  unsupported: ['Choose a PNG, JPG or WebP image.', 'Выбери изображение в формате PNG, JPG или WebP.'],
  decode: ['Could not open this image. Check the file and try again.', 'Не удалось открыть изображение. Проверь файл и попробуй снова.'],
  noExample: ['Choose your own image to get started.', 'Выбери своё изображение, чтобы начать.'],
  busy: ['Preparing files…', 'Готовим файлы…'],
  ready: ['Files are ready to download.', 'Файлы готовы к скачиванию.'],
  jpeg: ['Files are ready. Larger pieces were saved as JPEG.', 'Файлы готовы. Крупные части сохранены в JPEG.'],
  failed: ['Could not export within 5 MB per file. Try reducing the height.', 'Не удалось уложиться в 5 МБ на файл. Попробуй уменьшить высоту.'],
  download: ['Download', 'Скачать'],
  copied: ['Copied', 'Скопировано'],
  selected: ['Selected · press Ctrl+C', 'Выделено · нажми Ctrl+C'],
};

const byId = id => document.getElementById(id);
const source = byId('source');
const stage = byId('stage');
const pieces = byId('pieces');
const height = byId('height');
const range = byId('height-range');
const prepare = byId('export');
const downloads = byId('downloads');
const status = byId('status');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

let language = 'en';
let statusKey = '';
let sourceName;
let image;
let preset = presets.artwork;
let outputHeight = 410;
let position = { x: .5, y: .5 };
let canvases = [];
let downloadUrls = [];
let frame = 0;
let revision = 0;
let sourceRevision = 0;
let drag;

const t = key => messages[key][language === 'ru' ? 1 : 0];
const localized = [...document.querySelectorAll('[data-ru], [data-ru-aria]')].map(element => {
  const attribute = element.hasAttribute('data-ru-aria') ? 'aria-label' : null;
  return {
    element, attribute,
    ru: attribute ? element.dataset.ruAria : element.dataset.ru,
    en: attribute ? element.getAttribute(attribute) : element.textContent,
  };
});

function updateSourceLabel() {
  const label = sourceName ?? t('example');
  byId('source-info').textContent = image ? `${label} · ${image.naturalWidth} × ${image.naturalHeight}` : label;
}

function updatePresetLabels() {
  byId('slot-help').textContent = t(preset === presets.artwork ? 'artworkSlots' : 'featuredSlot');
  byId('repeat-help').hidden = preset === presets.featured;
  canvases.forEach(({ canvas, part }) => canvas.setAttribute('aria-label', t(part.label)));
}

function setLanguage(value) {
  language = value;
  document.documentElement.lang = value;
  localized.forEach(({ element, attribute, ru, en }) => {
    const text = value === 'ru' ? ru : en;
    if (attribute) element.setAttribute(attribute, text);
    else element.textContent = text;
  });
  document.querySelectorAll('[data-lang]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.lang === value)));
  downloads.querySelectorAll('[data-download-name]').forEach(label => {
    label.textContent = `${t('download')} ${label.dataset.downloadName}`;
  });
  if (statusKey) status.textContent = t(statusKey);
  updateSourceLabel();
  updatePresetLabels();
}

function showStatus(key = '', error = false) {
  statusKey = key;
  status.textContent = key ? t(key) : '';
  status.hidden = !key;
  status.toggleAttribute('data-error', error);
}

function clearExport() {
  revision++;
  downloadUrls.forEach(url => URL.revokeObjectURL(url));
  downloadUrls = [];
  downloads.replaceChildren();
  downloads.hidden = true;
  prepare.disabled = !image;
  showStatus();
}

function frameGeometry() {
  const width = preset.parts.reduce((total, part) => total + part.width, 0) + preset.gap;
  const scale = Math.max(width / image.naturalWidth, outputHeight / image.naturalHeight);
  const scaledWidth = image.naturalWidth * scale;
  const scaledHeight = image.naturalHeight * scale;
  return { width, scaledWidth, scaledHeight, freeX: scaledWidth - width, freeY: scaledHeight - outputHeight };
}

function render() {
  if (!image) return;
  const { width, scaledWidth, scaledHeight, freeX, freeY } = frameGeometry();
  let start = 0;
  canvases.forEach(({ canvas, caption, part }) => {
    if (canvas.width !== part.width) canvas.width = part.width;
    if (canvas.height !== outputHeight) canvas.height = outputHeight;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, -freeX * position.x - start, -freeY * position.y, scaledWidth, scaledHeight);
    caption.textContent = `${part.width} × ${outputHeight}`;
    start += part.width + preset.gap;
  });
  pieces.style.setProperty('--preview-width', `${Math.min(width, width * 330 / outputHeight)}px`);
  pieces.style.gridTemplateColumns = preset.parts.map(part => `${part.width}fr`).join(` ${preset.gap / width * 100}% `);
}

function scheduleRender() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(render);
}

function setHeight(value) {
  outputHeight = clamp(Math.round(value), Number(height.min), Number(height.max));
  height.value = outputHeight;
  range.value = outputHeight;
  clearExport();
  scheduleRender();
}

function setPreset(value) {
  preset = presets[value];
  canvases = preset.parts.map((part, index) => {
    const panel = document.createElement('div');
    const canvas = document.createElement('canvas');
    const caption = document.createElement('small');
    panel.className = 'piece';
    panel.style.gridColumn = index * 2 + 1;
    canvas.setAttribute('role', 'img');
    panel.append(canvas, caption);
    return { panel, canvas, caption, part };
  });
  pieces.replaceChildren(...canvases.map(entry => entry.panel));
  updatePresetLabels();
  clearExport();
  scheduleRender();
}

async function loadImage(url, name, token) {
  const next = new Image();
  next.src = url;
  await next.decode();
  if (token !== sourceRevision) return;
  image = next;
  position = { x: .5, y: .5 };
  sourceName = name;
  byId('file-name').textContent = name ?? '';
  updateSourceLabel();
  const { width } = frameGeometry();
  setHeight(width * next.naturalHeight / next.naturalWidth);
}

async function useFile(file) {
  if (!file) return;
  const token = ++sourceRevision;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
    showStatus('unsupported', true);
    return;
  }
  const url = URL.createObjectURL(file);
  try {
    await loadImage(url, file.name, token);
  } catch {
    if (token === sourceRevision) showStatus('decode', true);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function moveImage(dx, dy) {
  if (!image) return;
  const { freeX, freeY } = frameGeometry();
  if (freeX > 0.01) position.x = clamp(position.x - dx / freeX, 0, 1);
  if (freeY > 0.01) position.y = clamp(position.y - dy / freeY, 0, 1);
  clearExport();
  scheduleRender();
}

source.addEventListener('change', () => {
  void useFile(source.files[0]);
  source.value = '';
});
stage.addEventListener('dragover', event => {
  event.preventDefault();
  stage.toggleAttribute('data-drop', true);
});
stage.addEventListener('dragleave', event => {
  if (!stage.contains(event.relatedTarget)) stage.removeAttribute('data-drop');
});
stage.addEventListener('drop', event => {
  event.preventDefault();
  stage.removeAttribute('data-drop');
  void useFile(event.dataTransfer.files[0]);
});
document.querySelectorAll('[name=format]').forEach(input => input.addEventListener('change', () => setPreset(input.value)));
range.addEventListener('input', () => setHeight(range.valueAsNumber));
height.addEventListener('input', () => {
  if (height.validity.valid && Number.isFinite(height.valueAsNumber)) setHeight(height.valueAsNumber);
});
height.addEventListener('change', () => setHeight(Number.isFinite(height.valueAsNumber) ? height.valueAsNumber : outputHeight));
byId('reset').addEventListener('click', () => {
  position = { x: .5, y: .5 };
  clearExport();
  scheduleRender();
});

stage.addEventListener('pointerdown', event => {
  if (!(event.target instanceof HTMLCanvasElement) || event.button !== 0 || drag) return;
  stage.focus();
  stage.setPointerCapture(event.pointerId);
  drag = { id: event.pointerId, x: event.clientX, y: event.clientY, scale: event.target.width / event.target.clientWidth };
});
stage.addEventListener('pointermove', event => {
  if (drag?.id !== event.pointerId) return;
  moveImage((event.clientX - drag.x) * drag.scale, (event.clientY - drag.y) * drag.scale);
  drag.x = event.clientX;
  drag.y = event.clientY;
});
stage.addEventListener('lostpointercapture', event => {
  if (drag?.id === event.pointerId) drag = undefined;
});
stage.addEventListener('keydown', event => {
  const directions = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
  if (!Object.hasOwn(directions, event.key)) return;
  event.preventDefault();
  moveImage(...directions[event.key]);
});

const uploadLimit = 5_000_000;
const encode = (canvas, type, quality) => new Promise(resolve => canvas.toBlob(resolve, type, quality));

async function exportPart({ canvas, part }) {
  const png = await encode(canvas, 'image/png');
  if (png && png.size <= uploadLimit) return { blob: png, name: `${part.name}.png`, part };

  const jpeg = await encode(canvas, 'image/jpeg', .9);
  if (jpeg && jpeg.size <= uploadLimit) return { blob: jpeg, name: `${part.name}.jpg`, part };
  throw new Error('Image exceeds the export size limit');
}

prepare.addEventListener('click', async () => {
  clearExport();
  const token = revision;
  prepare.disabled = true;
  showStatus('busy');
  try {
    cancelAnimationFrame(frame);
    render();
    const results = await Promise.all(canvases.map(exportPart));
    if (token !== revision) return;
    for (const { blob, name, part } of results) {
      const link = document.createElement('a');
      const label = document.createElement('span');
      const size = document.createElement('span');
      link.className = 'download';
      link.download = name;
      link.href = URL.createObjectURL(blob);
      downloadUrls.push(link.href);
      label.dataset.downloadName = name;
      label.textContent = `${t('download')} ${name}`;
      size.textContent = `${part.width} × ${outputHeight}`;
      link.append(label, size);
      downloads.append(link);
    }
    downloads.hidden = false;
    showStatus(results.some(result => result.name.endsWith('.jpg')) ? 'jpeg' : 'ready');
  } catch {
    if (token === revision) showStatus('failed', true);
  } finally {
    if (token === revision) prepare.disabled = false;
  }
});

byId('copy').addEventListener('click', async event => {
  const button = event.currentTarget;
  const command = byId('steam-command');
  button.textContent = t(await copyText(command.textContent, command));
});

const pageScroll = byId('page-scroll');
const scrollDistance = () => document.documentElement.scrollHeight - innerHeight;
function syncPageScroll() {
  const distance = scrollDistance();
  pageScroll.hidden = distance <= 0;
  pageScroll.value = distance > 0 ? Math.round(scrollY / distance * Number(pageScroll.max)) : 0;
}
pageScroll.addEventListener('input', () => {
  scrollTo({ top: scrollDistance() * pageScroll.valueAsNumber / Number(pageScroll.max), behavior: 'instant' });
});
window.addEventListener('scroll', syncPageScroll, { passive: true });
window.addEventListener('resize', syncPageScroll);
new ResizeObserver(syncPageScroll).observe(document.body);

let preferredLanguage;
try { preferredLanguage = localStorage.getItem('steam-showcase-language'); } catch { /* storage may be blocked */ }
setLanguage(preferredLanguage === 'en' || preferredLanguage === 'ru' ? preferredLanguage
  : navigator.language.startsWith('ru') ? 'ru' : 'en');
byId('languages').addEventListener('click', event => {
  const value = event.target.dataset.lang;
  if (!value) return;
  setLanguage(value);
  try { localStorage.setItem('steam-showcase-language', value); } catch { /* keep the current choice */ }
});
setPreset(document.querySelector('[name=format]:checked').value);
loadImage(new URL('./example.jpg', import.meta.url).href, undefined, sourceRevision).catch(() => {
  if (sourceRevision === 0) showStatus('noExample', true);
});
