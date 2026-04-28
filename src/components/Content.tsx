
import React from 'react';
import CardGrid from './CardGrid';
import Dashboard from './Dashboard';
import { filterByTab } from '../utils/filters';

const PANELS = ['all', 'meio', 'nova-tp', 'nc', 'ficar', 'term', 'dub', 'prio', 'prox', 'alfa'];

interface ContentProps {
  activeTab: string;
  items: any[];
  query: string;
  onOpenEdit: (item: any) => void;
  onOpenDetail: (item: any) => void;
  onUpdateItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
}

const Content = ({ activeTab, items, query, onOpenEdit, onOpenDetail, onUpdateItem, onDeleteItem }: ContentProps) => {
  let filteredItems = filterByTab(items, activeTab);

  if (query) {
    const q = query.toLowerCase();
    filteredItems = filteredItems.filter(i =>
      i.title.toLowerCase().includes(q) ||
      (i.titleJP && i.titleJP.toLowerCase().includes(q))
    );
  }

  return (
    <main className="content">
      {PANELS.map(panelKey => (
        <div
          key={panelKey}
          id={`panel-${panelKey}`}
          className="panel"
          role="tabpanel"
          hidden={activeTab !== panelKey}
        >
          {activeTab === 'all' && panelKey === 'all' && !query && (
            <Dashboard items={items} onOpenDetail={onOpenDetail} />
          )}
          {activeTab === panelKey && (
            <CardGrid
              items={filteredItems}
              onOpenEdit={onOpenEdit}
              onOpenDetail={onOpenDetail}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
            />
          )}
        </div>
      ))}
    </main>
  );
};

export default Content;
