
'use client';

import React from 'react';
import Card from './Card';

interface CardGridProps {
  items: any[];
  onOpenEdit: (item: any) => void;
  onOpenDetail: (item: any) => void;
  onUpdateItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
}

const CardGrid = ({ items, onOpenEdit, onOpenDetail, onUpdateItem, onDeleteItem }: CardGridProps) => {
  const [draggedItemId, setDraggedItemId] = React.useState<any>(null);

  const handleDragStart = (id: any) => {
    setDraggedItemId(id);
  };

  const handleDrop = async (toId: any) => {
    if (!draggedItemId || draggedItemId === toId) return;

    const fromItem = items.find(i => i.id === draggedItemId);
    const toItem = items.find(i => i.id === toId);

    if (!fromItem || !toItem) return;

    // Trocar sortOrder
    const fromOrder = fromItem.sortOrder ?? fromItem.addedAt;
    const toOrder = toItem.sortOrder ?? toItem.addedAt;

    const updatedFrom = { ...fromItem, sortOrder: toOrder };
    const updatedTo = { ...toItem, sortOrder: fromOrder };

    await onUpdateItem(updatedFrom);
    await onUpdateItem(updatedTo);
    
    setDraggedItemId(null);
  };

  if (!items || items.length === 0) {
    return (
      <div className="empty-state">
        <svg width="56" height="56" viewBox="0 0 56" fill="none">
          <circle cx="28" cy="28" r="27" stroke="var(--b2)" strokeWidth="1.5"/>
          <text x="28" y="35" textAnchor="middle" fontSize="22">🎬</text>
        </svg>
        <p>Nada aqui ainda — use <strong>+ Adicionar!</strong></p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {items.map(item => (
        <Card
          key={item.id}
          item={item}
          onOpenEdit={onOpenEdit}
          onOpenDetail={onOpenDetail}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
};

export default CardGrid;
