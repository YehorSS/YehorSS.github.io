export async function copyText(text: string, fallbackEl: HTMLElement): Promise<'copied' | 'selected'> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return 'copied';
    }
  } catch { /* refused: fall through to selection */ }
  const range = document.createRange();
  range.selectNodeContents(fallbackEl);
  const sel = getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  return 'selected';
}
