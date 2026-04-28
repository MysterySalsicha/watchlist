
'use client';

import React from 'react';
import { rem, sortPrio } from '@/utils/filters';

interface DashboardProps {
  items: any[];
  onOpenDetail: (item: any) => void;
}

const Dashboard = ({ items, onOpenDetail }: DashboardProps) => {
  const total = items.length;
  const ongoing = items.filter(i => i.lists?.includes('meio')).length;
  const done = items.filter(i => i._done || i.st === 'terminado').length;
  const dub = items.filter(i => i.dub === 1).length;
  const dubPct = total > 0 ? Math.round((dub / total) * 100) : 0;

  const prox = items
    .filter(i => (i._ep ?? i.ep) > 0 && i.tot > 0 && rem(i) > 0 && !i._done)
    .sort((a, b) => rem(a) - rem(b))
    .slice(0, 3);

  const prio = sortPrio(
    items.filter(i => !i._done && i.st !== 'terminado' && !i.lists?.includes('term'))
  ).slice(0, 3);

  const renderHlItem = (item: any) => {
    const r = rem(item);
    const meta = (item._ep ?? item.ep) > 0 && item.tot > 0
      ? `Ep ${item._ep ?? item.ep}/${item.tot} · ${r} restante${r !== 1 ? 's' : ''}`
      : (item.st === 'comecar' ? 'Não comecei' : item.st);

    return (
      <div key={item.id} className="dash-hl-item" onClick={() => onOpenDetail(item)}>
        {item.img ? (
          <img src={item.img} alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLElement).outerHTML='<div class="dash-hl-thumb"><i class="ri-film-line"></i></div>' }} />
        ) : (
          <div className="dash-hl-thumb"><i className="ri-film-line"></i></div>
        )}
        <div>
          <div className="dash-hl-name">{item.title}</div>
          <div className="dash-hl-meta">{meta}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard">
      <div className="dash-stats">
        <div className="dash-stat">
          <div className="dash-stat-val">{total}</div>
          <div className="dash-stat-lbl">Total</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-val green">{ongoing}</div>
          <div className="dash-stat-lbl">Assistindo</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-val amber">{done}</div>
          <div className="dash-stat-lbl">Finalizados</div>
        </div>
        <div className="dash-stat">
          <div className="dash-stat-val blue">{dubPct}%</div>
          <div className="dash-stat-lbl">Dublados</div>
        </div>
      </div>

      <div className="dash-highlights">
        <div className="dash-hl-col">
          <div className="dash-hl-title">🔥 Próximos de acabar</div>
          {prox.length > 0 ? prox.map(renderHlItem) : <div className="dash-hl-empty">Continue assistindo algo!</div>}
        </div>
        <div className="dash-hl-col">
          <div className="dash-hl-title">⭐ Principais prioridades</div>
          {prio.length > 0 ? prio.map(renderHlItem) : <div className="dash-hl-empty">Defina prioridades editando itens.</div>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
