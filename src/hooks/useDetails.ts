
import { useState, useCallback } from 'react';
import { JIKAN, TMDB } from '../utils/constants';
import { fetchWithRetry, translateGenre, translateText } from '../utils/helpers';

export const useDetails = (tmdbKey: string) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getJikanDetails = useCallback(async (malId: any) => {
    setLoading(true);
    setError(null);
    try {
      const [data, streamData, charsData] = await Promise.all([
        fetchWithRetry(`${JIKAN}/anime/${malId}`),
        fetchWithRetry(`${JIKAN}/anime/${malId}/streaming`).catch(() => ({ data: [] })),
        fetchWithRetry(`${JIKAN}/anime/${malId}/characters`).catch(() => ({ data: [] })),
      ]);
      
      const d = data.data;
      const chars = charsData.data || [];
      const hasPtBrDub = chars.some((c: any) =>
        c.voice_actors?.some((va: any) => va.language === 'Portuguese (Brazilian)')
      );

      const streams = streamData.data || [];
      const crStream = streams.find((s: any) => /crunchyroll/i.test(s.name));
      const streamLink = crStream || streams[0] || null;

      const synopsisPT = await translateText(d.synopsis);

      setDetails({
        ...d,
        synopsisPT,
        hasPtBrDub,
        streamLink,
        genresPT: (d.genres || []).map((g: any) => translateGenre(g.name))
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTmdbDetails = useCallback(async (id: any, type: string) => {
    const key = tmdbKey || process.env.NEXT_PUBLIC_TMDB_KEY;
    if (!key) {
      setError('TMDB Key not configured');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithRetry(
        `${TMDB}/${type}/${id}?language=pt-BR&append_to_response=external_ids`,
        { headers: { Authorization: `Bearer ${key}` } }
      );
      
      setDetails({
        ...data,
        title: data.title || data.name,
        synopsisPT: data.overview,
        genresPT: (data.genres || []).map((g: any) => g.name),
        type: type,
        episodes: data.number_of_episodes || (type === 'movie' ? 1 : 0),
        images: {
          webp: { large_image_url: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '' },
          jpg: { large_image_url: data.backdrop_path ? `https://image.tmdb.org/t/p/w1280${data.backdrop_path}` : '' }
        }
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tmdbKey]);

  return { details, loading, error, getJikanDetails, getTmdbDetails };
};
