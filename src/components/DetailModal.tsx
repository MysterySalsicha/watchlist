
'use client';

import React, { useState } from 'react';

interface DetailModalProps {
  item: any;
  onClose: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onAdvEp: (item: any) => void;
}

const DetailModal = ({ item, onClose, onEdit, onDelete, onAdvEp }: DetailModalProps) => {
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  if (!item) return null;

  const {
    id,
    title,
    titleAlt,
    img,
    genres,
    synopsis,
    note,
    dub,
    st,
    ep,
    tot,
    s,
    _done,
    cr,
    malId,
    tmdbId,
    type
  } = item;

  const isDub = dub === 1;
  const hasProg = ep > 0 && tot > 0;
  const pct = hasProg ? Math.min(100, Math.round((ep / tot) * 100)) : 0;
  const remaining = hasProg ? Math.max(0, tot - ep) : null;

  let remText = '', remClass = '';
  if (hasProg && remaining !== null) {
    if (remaining === 0)      { remText = '✓ Temporada completa'; remClass = 'done'; }
    else if (remaining <= 2)  { remText = `${remaining} ep${remaining > 1 ? 's' : ''} restantes`; remClass = 'urgent'; }
    else if (remaining <= 5)  { remText = `${remaining} eps restantes`; remClass = 'warn'; }
    else                      { remText = `${remaining} eps restantes`; remClass = ''; }
  }

  const coverHeight = img ? '180px' : '60px';

  const stMap: Record<string, string> = {
    continuar: 'Continuar',
    seguir:    'A seguir',
    comecar:   'Começar',
    novamente: 'Assistir de novo',
    terminado: 'Terminado',
  };

  const stClassMap: Record<string, string> = {
    continuar: 't-cont',
    seguir:    't-seg',
    comecar:   't-com',
    novamente: 't-nov',
    terminado: 't-done',
  };

  const malUrl = malId ? `https://myanimelist.net/anime/${malId}` : null;
  const tmdbUrl = tmdbId ? `https://www.themoviedb.org/${type || 'movie'}/${tmdbId}` : null;

  return (
    <div className="ovl open" id="ovl-detail" role="dialog" aria-modal="true" aria-label="Detalhes da mídia">
      <div className="sheet" id="detail-sheet">
        <div className="detail-cover-wrap" style={{height:coverHeight}}>
          {img && <img src={img} alt="" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget as HTMLImageElement).style.display='none'} />}
          <div className="detail-cover-grad"></div>
          <button className="detail-close-btn" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <div className="detail-hero">
          {img
            ? <img className="detail-poster" src={img} alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLElement).outerHTML='<div class=detail-poster-fallback><i class=ri-film-line style=font-size:28px;opacity:.4></i></div>' }} />
            : <div className="detail-poster-fallback"><i className="ri-film-line" style={{fontSize:"28px", opacity:".4"}}></i></div>}
          <div className="detail-hero-info">
            <div className="detail-title">{title}</div>
            {titleAlt && <div className="detail-subtitle">{titleAlt}</div>}
            <div className="detail-badges" style={{marginTop:"8px"}}>
                <span className={`tag ${isDub ? 't-dub' : 't-leg'}`}>{isDub ? 'Dub PT-BR' : 'Legendado'}</span>
                {stMap[st] && <span className={`tag ${stClassMap[st]}`}>{stMap[st]}</span>}
            </div>
          </div>
        </div>

        {hasProg && (
          <div className="detail-section">
            <div className="detail-section-title">Progresso</div>
            <div style={{display:"flex", justifyContent:"space-between", fontSize:"13px", color:"var(--t2)", marginBottom:"6px"}}>
              <span>Ep {ep}/{tot}{s > 1 ? ` · T${s}` : ''}</span>
              <span style={{color:isDub ? 'var(--green)' : 'var(--orange)'}}>{pct}%</span>
            </div>
            <div className="progress-track">
              <div className={`progress-fill ${isDub ? 'dub' : 'leg'}`} style={{width:`${pct}%`}}></div>
            </div>
            <div style={{marginTop:"5px", fontSize:"10px"}} className={`card-remaining ${remClass}`}>{remText}</div>
          </div>
        )}

        {(genres || []).length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">Gêneros</div>
            <div className="detail-genres">{genres.map((g: string) => <span key={g} className="detail-genre">{g}</span>)}</div>
          </div>
        )}

        {synopsis && (
          <div className="detail-section">
            <div className="detail-section-title">Sinopse</div>
            <div className={`detail-synopsis ${showFullSynopsis ? 'expanded' : ''}`} id="detail-syn">
              {synopsis}
            </div>
            <button className="detail-toggle" onClick={() => setShowFullSynopsis(!showFullSynopsis)}>
              {showFullSynopsis ? 'Ver menos ▴' : 'Ver mais ▾'}
            </button>
          </div>
        )}

        {note && (
          <div className="detail-section">
            <div className="detail-section-title">Nota</div>
            <div className="detail-info-row" style={{gridTemplateColumns:"1fr", fontSize:"13px"}}>{note}</div>
          </div>
        )}

        <div className="detail-footer">
          <button className="btn-add-wl" style={{flex:"1.5", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px"}} 
            onClick={() => { onAdvEp(item); onClose(); }}>
            <i className="ri-check-line"></i> +1 ep
          </button>
          {cr && (
            <a className="btn-link" href={cr} target="_blank" rel="noopener noreferrer" style={{flex:"1", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", color:"var(--orange)", borderColor:"var(--obrd)"}}>
              <i className="ri-play-circle-line"></i> Assistir
            </a>
          )}
          {malUrl && (
            <a className="btn-link" href={malUrl} target="_blank" rel="noopener noreferrer" title="Ver no MyAnimeList" style={{padding:"0 10px"}}>
              <img src="https://cdn.myanimelist.net/images/favicon.ico" width="16" height="16" alt="MAL" />
            </a>
          )}
          {tmdbUrl && (
            <a className="btn-link" href={tmdbUrl} target="_blank" rel="noopener noreferrer" title="Ver no TMDB" style={{padding:"0 10px"}}>
              <img src="https://www.themoviedb.org/favicon.ico" width="16" height="16" alt="TMDB" />
            </a>
          )}
          <button className="btn-link" style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", color:"var(--blue)", borderColor:"rgba(90,180,255,.3)"}}
            onClick={() => { onEdit(item); onClose(); }}>
            <i className="ri-edit-2-line"></i> Editar
          </button>
          <button className="btn-link" style={{color:"var(--red)", borderColor:"rgba(255,77,77,.2)", display:"flex", alignItems:"center", justifyContent:"center", padding:"0 12px"}}
            onClick={() => { onDelete(item); onClose(); }}>
            <i className="ri-delete-bin-2-line"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;
