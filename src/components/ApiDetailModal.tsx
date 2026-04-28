
'use client';

import React from 'react';
import { useDetails } from '@/hooks/useDetails';

interface ApiDetailModalProps {
  id: any;
  type: string;
  onClose: () => void;
  onAdd: (apiData: any) => void;
  tmdbKey: string;
  items: any[];
}

const ApiDetailModal = ({ id, type, onClose, onAdd, tmdbKey, items }: ApiDetailModalProps) => {
  const { details, loading, error, getJikanDetails, getTmdbDetails } = useDetails(tmdbKey);

  React.useEffect(() => {
    if (type === 'jikan') {
      getJikanDetails(id);
    } else {
      getTmdbDetails(id, type);
    }
  }, [id, type, getJikanDetails, getTmdbDetails]);

  if (loading) {
    return (
      <div className="ovl open" id="ovl-detail">
        <div className="sheet" style={{padding:"40px", textAlign:"center"}}>
          <div className="spinner" style={{margin:"auto"}}></div>
        </div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="ovl open" id="ovl-detail">
        <div className="sheet" style={{padding:"40px", textAlign:"center", color:"var(--t3)"}}>
          {error || 'Erro ao carregar detalhes.'}
          <br />
          <button onClick={onClose} style={{color:"var(--green)", background:"none", border:"none", marginTop:"14px", fontSize:"14px"}}>Fechar</button>
        </div>
      </div>
    );
  }

  const alreadyAdded = items.some(i => (type === 'jikan' && i.malId === id) || (type !== 'jikan' && i.tmdbId === id));

  const poster = details.images?.webp?.large_image_url || details.images?.jpg?.large_image_url || '';
  const cover = details.images?.jpg?.large_image_url || '';

  return (
    <div className="ovl open" id="ovl-detail" role="dialog" aria-modal="true" aria-label="Detalhes da mídia">
      <div className="sheet" id="detail-sheet">
        <div className="detail-cover-wrap">
          {cover ? <img src={cover} alt="" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget as HTMLImageElement).style.display='none'} /> : <div className="detail-cover-fallback">🎌</div>}
          <div className="detail-cover-grad"></div>
          <button className="detail-close-btn" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <div className="detail-hero">
          {poster ? <img className="detail-poster" src={poster} alt="" referrerPolicy="no-referrer" /> : <div className="detail-poster-fallback"><i className="ri-sword-line" style={{fontSize:"28px", opacity:".4"}}></i></div>}
          <div className="detail-hero-info">
            <div className="detail-title">{details.title_english || details.title || details.name}</div>
            {details.title && details.title !== (details.title_english || details.title) && <div className="detail-subtitle">{details.title}</div>}
            {details.title_japanese && <div className="detail-subtitle" style={{fontSize:"11px", opacity:".55"}}>{details.title_japanese}</div>}
            <div className="detail-badges">
              <span className="detail-type-badge">{details.type === 'movie' ? 'Filme' : details.type === 'tv' ? 'Série' : 'Anime'}</span>
              {(details.score || details.vote_average) && <span className="detail-score">⭐ {details.score || details.vote_average.toFixed(1)}</span>}
              {details.type === 'jikan' && (
                <span className={`detail-dub-badge ${details.hasPtBrDub ? 'dub-yes' : 'dub-no'}`}>
                    {details.hasPtBrDub ? '🇧🇷 Dublado PT-BR' : 'Sem dub PT-BR'}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="detail-stats">
          <div className="detail-stat"><div className="detail-stat-val">{details.episodes || details.number_of_episodes || (details.type === 'movie' ? 1 : '?')}</div><div className="detail-stat-lbl">Eps / Itens</div></div>
          <div className="detail-stat"><div className="detail-stat-val">{details.duration || (details.runtime ? `${details.runtime}m` : '—')}</div><div className="detail-stat-lbl">Duração/ep</div></div>
          <div className="detail-stat"><div className="detail-stat-val">{details.score || (details.vote_count ? `${details.vote_count} votos` : '—')}</div><div className="detail-stat-lbl">Avaliação</div></div>
        </div>

        {details.genresPT && (
          <div className="detail-section">
            <div className="detail-section-title">Gêneros</div>
            <div className="detail-genres">{details.genresPT.map((g: string) => <span key={g} className="detail-genre">{g}</span>)}</div>
          </div>
        )}

        <div className="detail-section">
          <div className="detail-section-title">Sinopse</div>
          <div className="detail-synopsis" id="detail-syn">{details.synopsisPT || details.synopsis || details.overview}</div>
        </div>

        <div className="detail-footer">
          {details.streamLink && (
            <a className="btn-link" href={details.streamLink.url} target="_blank" rel="noopener noreferrer" style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"6px", color:"var(--orange)", borderColor:"var(--obrd)", flex:"1"}}>
              <i className="ri-play-circle-line"></i> {details.streamLink.name}
            </a>
          )}
          <button className={`btn-add-wl ${alreadyAdded ? 'already' : ''}`} style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"6px"}}
            onClick={() => !alreadyAdded && onAdd(details)}>
            {alreadyAdded ? <><i className="ri-check-line"></i> Na sua lista</> : <><i className="ri-add-line"></i> Adicionar à Watchlist</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiDetailModal;
