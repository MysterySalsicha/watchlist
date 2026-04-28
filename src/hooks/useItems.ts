
import { useState, useEffect, useCallback } from 'react';
import { openDB } from 'idb';

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
}) : Promise.resolve(null);

export const useItems = () => {
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = useCallback(async () => {
    const db: any = await dbPromise;
    if (!db) return;
    const allItems = await db.getAll('items');
    const activeItems = allItems.filter((i: any) => !i._rm);
    setItems(activeItems);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const updateItem = useCallback(async (item: any) => {
    const db: any = await dbPromise;
    if (!db) return;
    await db.put('items', item);
    await fetchItems();
  }, [fetchItems]);

  const softDeleteItem = useCallback(async (id: any) => {
    const db: any = await dbPromise;
    if (!db) return;
    const item = await db.get('items', id);
    if (!item) return;
    await db.put('items', { ...item, _rm: true, updatedAt: Date.now() });
    await fetchItems();
  }, [fetchItems]);

  const resetAll = useCallback(async () => {
    const db: any = await dbPromise;
    if (!db) return;
    await db.clear('items');
    await db.clear('config');
    await fetchItems();
  }, [fetchItems]);

  const exportItems = useCallback(async () => {
    const db: any = await dbPromise;
    if (!db) return [];
    return await db.getAll('items');
  }, []);

  const importItems = useCallback(async (newItems: any[]) => {
    const db: any = await dbPromise;
    if (!db) return;
    const tx = db.transaction('items', 'readwrite');
    for (const item of newItems) {
      await tx.store.put(item);
    }
    await tx.done;
    await fetchItems();
  }, [fetchItems]);

  return { items, updateItem, softDeleteItem, resetAll, exportItems, importItems };
};
