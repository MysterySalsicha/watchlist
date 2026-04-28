
import { useState, useCallback } from 'react';
import { INJECT_LIST, INJECT_BY_NAME, JIKAN } from '../utils/constants';
import { fetchWithRetry, delay, uid, translateGenre } from '../utils/helpers';

export const useInject = (onUpdateItem: (item: any) => Promise<void>) => {
  const [status, setStatus] = useState<any>({
    running: false,
    done: 0,
    total: INJECT_LIST.length + INJECT_BY_NAME.length,
    currentName: '',
    log: [],
  });

  const runInject = useCallback(async () => {
    if (status.running) return;
    
    setStatus((s: any) => ({ ...s, running: true, done: 0, log: ['Iniciando importação...'] }));

    let doneCount = 0;

    for (const data of INJECT_LIST) {
      const [malId, ep, s, dub, statusStr, lists, note, badge, bl] = data;
      try {
        setStatus((s: any) => ({ ...s, currentName: `MAL ID: ${malId}`, done: doneCount }));
        
        const res = await fetchWithRetry(`${JIKAN}/anime/${malId}`);
        const d = res.data;
        const title = d.title_english || d.title || d.title_japanese || '?';
        
        const newItem = {
          id: uid(),
          malId,
          title,
          titleAlt: (d.title_japanese && title !== d.title_japanese) ? d.title_japanese : (d.title !== title ? d.title : null),
          img: d.images?.webp?.large_image_url || d.images?.jpg?.large_image_url || '',
          genres: (d.genres || []).map((g: any) => translateGenre(g.name)),
          synopsis: d.synopsis || '',
          type: 'anime',
          dub,
          s,
          ep,
          _ep: ep,
          tot: d.episodes || 0,
          st: statusStr,
          lists,
          note: note || '',
          badge: badge || null,
          bl: bl || null,
          addedAt: Date.now(),
          updatedAt: Date.now(),
        };

        await onUpdateItem(newItem);
        doneCount++;
        setStatus((s: any) => ({ 
          ...s, 
          done: doneCount, 
          log: [...s.log, `✓ Adicionado: ${title.slice(0, 20)}...`] 
        }));
        
        await delay(400); // Rate limit Jikan
      } catch (err) {
        console.error(err);
        setStatus((s: any) => ({ ...s, log: [...s.log, `✗ Erro ID ${malId}`] }));
      }
    }

    for (const data of INJECT_BY_NAME) {
        try {
            setStatus((s: any) => ({ ...s, currentName: `Buscando: ${data.q}`, done: doneCount }));
            const res = await fetchWithRetry(`${JIKAN}/anime?q=${encodeURIComponent(data.q)}&limit=1`);
            const d = res.data[0];
            if (d) {
                const title = data.title || d.title_english || d.title;
                const newItem = {
                    id: uid(),
                    malId: d.mal_id,
                    title,
                    img: d.images?.webp?.large_image_url || d.images?.jpg?.large_image_url || '',
                    genres: (d.genres || []).map((g: any) => translateGenre(g.name)),
                    synopsis: d.synopsis || '',
                    type: 'anime',
                    dub: data.dub,
                    s: data.s,
                    ep: data.ep,
                    _ep: data.ep,
                    tot: d.episodes || 0,
                    st: data.st,
                    lists: data.lists,
                    addedAt: Date.now(),
                    updatedAt: Date.now(),
                };
                await onUpdateItem(newItem);
                doneCount++;
                setStatus((s: any) => ({ ...s, done: doneCount, log: [...s.log, `✓ Adicionado: ${title.slice(0, 20)}...`] }));
            }
            await delay(400);
        } catch (err) {
            setStatus((s: any) => ({ ...s, log: [...s.log, `✗ Erro: ${data.q}`] }));
        }
    }

    setStatus((s: any) => ({ ...s, running: false, currentName: 'Concluído!' }));
  }, [onUpdateItem, status.running]);

  return { runInject, status };
};
