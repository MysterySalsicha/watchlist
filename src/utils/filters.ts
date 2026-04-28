
export const rem = (item: any) => Math.max(0, item.tot - (item._ep ?? item.ep));

export const sortByOrder = (items: any[]) => {
  return [...items].sort((a, b) => (a.sortOrder ?? a.addedAt) - (b.sortOrder ?? b.addedAt));
};

export const prioLevel = (i: any) => {
  if (rem(i) <= 3 && (i._ep ?? i.ep) > 0) return 1;
  if (i.dub === 1 && ['continuar', 'seguir'].includes(i.st)) return 2;
  if (i.dub === 1 && (i.lists?.includes('nc') || i.lists?.includes('nova-tp'))) return 3;
  return 4;
};

export const sortPrio = (items: any[]) => {
  return [...items].sort((a, b) => prioLevel(a) - prioLevel(b));
};

export const filterByTab = (items: any[], tab: string) => {
  switch (tab) {
    case 'all':
      return sortByOrder(items);
    case 'meio':
      return sortByOrder(items.filter(i => i.lists?.includes('meio')));
    case 'nova-tp':
      return sortByOrder(items.filter(i => i.lists?.includes('nova-tp')));
    case 'nc':
      return sortByOrder(items.filter(i => i.lists?.includes('nc')));
    case 'ficar':
      return sortByOrder(items.filter(i => i.lists?.includes('ficar')));
    case 'term':
      return sortByOrder(items.filter(i => i.lists?.includes('term')));
    case 'dub':
      return sortByOrder(items.filter(i => i.dub === 1));
    case 'alfa':
      return [...items].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    case 'prio':
      return sortPrio(items.filter(i =>
        !i._done &&
        i.st !== 'terminado' &&
        !i.lists?.includes('term') &&
        !(i.tot > 0 && rem(i) === 0)
      ));
    case 'prox': {
      const w = items.filter(i => (i._ep ?? i.ep) > 0 && i.tot > 0 && rem(i) > 0);
      return w.sort((a, b) => rem(a) - rem(b)).slice(0, 20);
    }
    default:
      return items;
  }
};
