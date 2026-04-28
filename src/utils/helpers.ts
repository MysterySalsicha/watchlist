
import { GENRE_PT } from './constants';

export function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }

export function translateGenre(name: string) {
  return GENRE_PT[name] || name;
}

export async function translateText(text: string, toLang = 'pt-BR') {
  if (!text || text.length < 10) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${toLang}&dt=t&q=${encodeURIComponent(text.slice(0, 4000))}`;
    const res  = await fetch(url); // Remove signal: AbortSignal.timeout(6000) if it causes issues in older Node but it should be fine in browser
    const data = await res.json();
    return data[0].map((x: any) => x[0]).filter(Boolean).join('');
  } catch {
    return text;
  }
}

export async function fetchWithRetry(url: string, opts: any = {}, retries = 2) {
  const actualRetries = typeof opts === 'number' ? opts : retries;
  const fetchOpts = typeof opts === 'object' ? opts : {};
  
  for (let i = 0; i <= actualRetries; i++) {
    try {
      const r = await fetch(url, { ...fetchOpts });
      if (r.status === 429) { await delay(2000 * (i + 1)); continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      if (i === actualRetries) throw e;
      await delay(1000 * (i + 1));
    }
  }
}

export function streamFavicon(url: string, manualLogo?: string) {
  if (manualLogo) return manualLogo;
  if (!url) return '';
  try {
    const d = new URL(url).hostname.replace('www.', '');
    return `https://www.google.com/s2/favicons?sz=64&domain=${d}`;
  } catch { return ''; }
}

export function streamName(item: any) {
  if (item.crName) return item.crName;
  if (!item.cr) return '';
  try {
    const d = new URL(item.cr).hostname.replace('www.', '').split('.')[0];
    return d.charAt(0).toUpperCase() + d.slice(1);
  } catch { return 'Assistir'; }
}

export function normalize(str: string) {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function initials(title: string) {
  return (title || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function rem(item: any) {
  return Math.max(0, item.tot - (item._ep ?? item.ep));
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
