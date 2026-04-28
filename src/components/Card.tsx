
'use client';

import React from 'react';

interface CardProps {
  item: any;
  onOpenEdit: (item: any) => void;
  onOpenDetail: (item: any) => void;
  onUpdateItem: (item: any) => void;
  onDeleteItem: (item: any) => void;
  onDragStart: (id: any) => void;
  onDrop: (id: any) => void;
}

const Card = ({ item, onOpenEdit, onOpenDetail, onUpdateItem, onDeleteItem, onDragStart, onDrop }: CardProps) => {
  const [isDraggable, setIsDraggable] = React.useState(false);
  const [isDragOver, setIsDragOver] = React.useState(false);
  
  const {
    id,
    title,
    img,
    genres,
    dub,
    st,
    ep,
    tot,
    s,
    _done,
    cr,
    badge,
    bl,
  } = item;

  const isDub = dub === 1;
  const isDone = _done;
  const hasProg = ep > 0 && tot > 0;
  const pct = hasProg ? Math.min(100, Math.round((ep / tot) * 100)) : 0;
  const remaining = hasProg ? Math.max(0, tot - ep) : Math.max(0, tot - (item._ep ?? item.ep));

  const handleAdvEp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentEp = item._ep ?? item.ep;
    const updatedItem = { ...item, _ep: currentEp + 1 };
    
    if (item.tot > 0 && updatedItem._ep >= item.tot) {
      updatedItem._done = true;
      updatedItem.st = 'terminado';
      updatedItem.lists = (item.lists || []).filter((l: string) => l !== 'meio').concat('term');
    }
    onUpdateItem(updatedItem);
  };

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateItem({ ...item, _done: !item._done });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteItem(item);
  };

  const handleOpenEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenEdit(item);
  };
  
  const handleOpenDetail = () => {
    onOpenDetail(item);
  };

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(id);
    e.dataTransfer.effectAllowed = 'move';
    requestAnimationFrame(() => {
      (e.target as HTMLElement).style.opacity = '0.35';
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '';
    setIsDraggable(false);
    setIsDragOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleInternalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(id);
  };

  const handleAddTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, just open edit which has the list selection
    onOpenEdit(item);
  };

  const posterHTML = img ? (
    <>
      <img src={img} alt="" referrerPolicy="no-referrer" onError={(e) => { 
        (e.currentTarget as HTMLImageElement).style.display='none'; 
        if ((e.currentTarget as HTMLImageElement).nextElementSibling) {
            ((e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement).style.display='flex'; 
        }
      }} />
      <div className="card-poster-fallback" style={{display:'none'}}>
        <span className="fallback-icon">🎬</span>
        <span className="fallback-initials">{title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}</span>
      </div>
    </>
  ) : (
    <div className="card-poster-fallback">
      <span className="fallback-icon">🎬</span>
      <span className="fallback-initials">{title.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}</span>
    </div>
  );

  const badgeHTML = badge ? <span className={`card-badge ${badge}`}>{bl || ''}</span> : null;

  const genresText = (genres || []).slice(0, 2).join(' · ');

  const stMap: Record<string, string> = {
    continuar: '<span class="tag t-cont">Continuar</span>',
    seguir:    '<span class="tag t-seg">A seguir</span>',
    comecar:   '<span class="tag t-com">Começar</span>',
    novamente: '<span class="tag t-nov">Assistir de novo</span>',
    terminado: '<span class="tag t-done">Terminado</span>',
  };
  const statusTag = stMap[st] ? <span dangerouslySetInnerHTML={{ __html: stMap[st] }} /> : null;
  const audioTag = <span className={`tag ${isDub ? 't-dub' : 't-leg'}`}>{isDub ? 'Dub PT-BR' : 'Legendado'}</span>;

  let progressHTML = null;
  if (hasProg) {
    const fillClass = isDone ? 'done' : isDub ? 'dub' : 'leg';
    const pctClass  = isDone ? '' : isDub ? 'dub' : 'leg';
    let remText = '', remClass = '';
    if (remaining === 0) { remText = '✓ Temporada completa'; remClass = 'done'; }
    else if (remaining <= 2) { remText = `${remaining} ep${remaining > 1 ? 's' : ''} restantes`; remClass = 'urgent'; }
    else if (remaining <= 5) { remText = `${remaining} eps restantes`; remClass = 'warn'; }
    else { remText = `${remaining} eps restantes`; remClass = ''; }

    progressHTML = (
      <div className="card-progress">
        <div className="card-progress-row">
          <span>Ep {ep}/{tot}{s > 1 ? ` · T${s}` : ''}</span>
          <span className={`card-progress-pct ${pctClass}`}>{pct}%</span>
        </div>
        <div className="progress-track">
          <div className={`progress-fill ${fillClass}`} style={{width:`${pct}%`}}></div>
        </div>
        <span className={`card-remaining ${remClass}`}>{remText}</span>
      </div>
    );
  }

  return (
    <div 
      className={`card${isDub ? ' is-dub' : ' is-leg'}${isDone ? ' is-done' : ''}${isDragOver ? ' drag-over' : ''}`} 
      data-id={id} 
      draggable={isDraggable} 
      style={img ? { '--bkg': `url('${img}')` } as React.CSSProperties : {}} 
      onClick={handleOpenDetail}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleInternalDrop}
    >
      {img && <div className="card-backdrop"></div>}
      <div 
        className="card-drag" 
        title="Arrastar para reordenar"
        onMouseDown={() => setIsDraggable(true)}
        onMouseUp={() => setIsDraggable(false)}
      >
        <i className="ri-draggable" style={{fontSize:"18px"}}></i>
      </div>
      <div className="card-poster">
        {posterHTML}
        {badgeHTML}
      </div>
      <div className="card-body">
        <div className="card-title">{title}</div>
        {!tot && <div className="card-missing">⚠️ DADOS FALTANDO, FAVOR EDITAR</div>}
        {genresText && <div className="card-genres">{genresText}</div>}
        <div className="card-tags">
            {audioTag}
            {statusTag}
            <button className="tag-add-btn" onClick={handleAddTag} title="Adicionar Tag / Mover"><i className="ri-add-line"></i> Tag</button>
        </div>
        {progressHTML}
      </div>
      <div className="card-actions">
        {cr && <a className="qa-btn qa-cr" href={cr} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} aria-label="Assistir" title="Assistir"><i className="ri-play-circle-line" style={{fontSize:"14px"}}></i></a>}
        <button className="qa-btn qa-adv" onClick={handleAdvEp} aria-label="+1 ep" title="+1 ep"><i className="ri-check-line" style={{fontSize:"14px"}}></i></button>
        <button className="qa-btn qa-done" onClick={handleToggleDone} aria-label="Concluído" title="Concluído"><i className="ri-checkbox-blank-circle-line" style={{fontSize:"14px"}}></i></button>
        <button className="qa-btn qa-edit" onClick={handleOpenEdit} aria-label="Editar" title="Editar"><i className="ri-edit-2-line" style={{fontSize:"14px"}}></i></button>
        <button className="qa-btn qa-del" onClick={handleRemove} aria-label="Remover" title="Remover"><i className="ri-delete-bin-2-line" style={{fontSize:"14px"}}></i></button>
      </div>
    </div>
  );
};

export default Card;
