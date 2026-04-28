
import { useState, useCallback } from 'react';
import { JIKAN, TMDB } from '../utils/constants';
import { fetchWithRetry } from '../utils/helpers';

export const useSearch = (tmdbKey: string) => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchJikan = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithRetry(`${JIKAN}/anime?q=${encodeURIComponent(query)}&limit=15&sfw=true`);
      setResults(data.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const searchTmdb = useCallback(async (query: string) => {
    const key = tmdbKey || process.env.NEXT_PUBLIC_TMDB_KEY;
    if (!key) {
      setError('TMDB Key not configured');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWithRetry(
        `${TMDB}/search/multi?query=${encodeURIComponent(query)}&language=pt-BR&include_adult=false`,
        { headers: { Authorization: `Bearer ${key}` } }
      );
      setResults((data.results || []).filter((r: any) => r.media_type !== 'person'));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tmdbKey]);

  return { results, loading, error, searchJikan, searchTmdb, setResults };
};
