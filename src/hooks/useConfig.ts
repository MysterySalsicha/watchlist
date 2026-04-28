
import { useState, useEffect, useCallback } from 'react';
import { openDB, IDBPDatabase } from 'idb';

const dbPromise = typeof window !== 'undefined' ? openDB('watchlist', 1, {
  upgrade(database) {
    if (!database.objectStoreNames.contains('items')) {
      const store = database.createObjectStore('items', { keyPath: 'id' });
      store.createIndex('malId', 'malId', { unique: false });
      store.createIndex('tmdbId', 'tmdbId', { unique: false });
      store.createIndex('st', 'st', { unique: false });
    }
    if (!database.objectStoreNames.contains('config')) {
      database.createObjectStore('config', { keyPath: 'key' });
    }
  },
}) : Promise.resolve(null as unknown as IDBPDatabase<any>);

export const useConfig = () => {
  const [config, setConfigState] = useState({
    tmdbKey: '',
    appPin: '',
  });

  const fetchConfig = useCallback(async () => {
    const db = await dbPromise;
    if (!db) return;
    const tmdbKeyRow = await db.get('config', 'tmdbKey');
    const appPinRow = await db.get('config', 'appPin');
    setConfigState({
      tmdbKey: tmdbKeyRow?.value || '',
      appPin: appPinRow?.value || '',
    });
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const setConfig = useCallback(async (key: string, value: string) => {
    const db = await dbPromise;
    if (!db) return;
    await db.put('config', { key, value });
    await fetchConfig();
  }, [fetchConfig]);

  return { config, setConfig };
};
