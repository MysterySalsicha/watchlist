
import React from 'react';

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'meio', label: 'Em andamento' },
  { key: 'nova-tp', label: 'Nova temporada' },
  { key: 'nc', label: 'Não comecei' },
  { key: 'ficar', label: 'Ficar de olho' },
  { key: 'term', label: 'Terminados' },
  { key: 'dub', label: 'Só dublados' },
  { key: 'prio', label: 'Prioridades' },
  { key: 'prox', label: 'Próx. de acabar' },
  { key: 'alfa', label: 'Alfabética' },
];

interface TabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  counts?: Record<string, number>;
}

const Tabs = ({ activeTab, setActiveTab, counts = {} }: TabsProps) => {
  return (
    <nav className="tabs-wrap glass" aria-label="Filtros da watchlist">
      <div className="tabs" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTab === tab.key}
            data-tab={tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            <span className="tab-badge" id={`badge-${tab.key}`}>{counts[tab.key] || 0}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Tabs;
