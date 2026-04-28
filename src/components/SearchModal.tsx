
'use client';

import React, { useState } from 'react';
import { useSearch } from '@/hooks/useSearch';
import { TMDB_IMG } from '@/utils/constants';
import { translateGenre } from '@/utils/helpers';

interface SearchModalProps {
  onClose: () => void;
  onOpenManual: () => void;
  onSelectItem: (id: any, type: string) => void;
  tmdbKey: string;
}

const SearchModal = ({ onClose, onOpenManual, onSelectItem, tmdbKey }: SearchModalProps) => {
  const [source, setSource] = useState('jikan');
  const [query, setQuery] = useState('');
  const { results, loading, error, searchJikan, searchTmdb, setResults } = useSearch(tmdbKey);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (source === 'jikan') {
      searchJikan(query);
    } else {
      searchTmdb(query);
    }
  };

  const renderJikanResult = (item: any) => {
    const poster = item.images?.jpg?.image_url || '';
    const year = item.aired?.prop?.from?.year || '';
    const eps = item.episodes ? `${item.episodes} eps` : '';
    const score = item.score ? `⭐${item.score}` : '';
    const meta = [item.type, year, eps, score].filter(Boolean).join(' · ');
    const titleEN = item.title_english || item.title;
    const titleAlt = (item.title !== titleEN) ? item.title : '';

    return (
      <div key={item.mal_id} className="result-item" onClick={() => onSelectItem(item.mal_id, 'jikan')}>
        {poster ? (
          <img className="result-poster" src={poster} alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLElement).outerHTML='<div class=result-poster-fallback><i class=ri-sword-line style=font-size:18px;opacity:.4></i></div>' }} />
        ) : (
          <div className="result-poster-fallback"><i className="ri-sword-line" style={{fontSize:"18px", opacity:".4"}}></i></div>
        )}
        <div className="result-info">
          <div className="result-title">{titleEN}</div>
          {titleAlt && <div className="result-meta" style={{fontSize:"10px", color:"var(--t3)"}}>{titleAlt}</div>}
          <div className="result-meta">{meta}</div>
          <div className="result-genres">
            {(item.genres || []).slice(0, 3).map((g: any) => (
              <span key={g.name} className="result-genre">{translateGenre(g.name)}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderTmdbResult = (item: any) => {
    const poster = item.poster_path ? `${TMDB_IMG}/w92${item.poster_path}` : '';
    const title = item.title || item.name;
    const year = (item.release_date || item.first_air_date || '').slice(0, 4);
    const type = item.media_type === 'movie' ? 'Filme' : 'Série';
    const score = item.vote_average ? `⭐${item.vote_average.toFixed(1)}` : '';
    const meta = [type, year, score].filter(Boolean).join(' · ');

    return (
      <div key={item.id} className="result-item" onClick={() => onSelectItem(item.id, item.media_type)}>
        {poster ? (
          <img className="result-poster" src={poster} alt="" referrerPolicy="no-referrer" onError={(e) => { (e.currentTarget as HTMLElement).outerHTML='<div class=result-poster-fallback>🎬</div>' }} />
        ) : (
          <div className="result-poster-fallback">🎬</div>
        )}
        <div className="result-info">
          <div className="result-title">{title}</div>
          <div className="result-meta">{meta}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="ovl open" id="ovl-search" role="dialog" aria-modal="true" aria-label="Buscar mídia">
      <div className="sheet">
        <span className="drag-handle"></span>
        <div className="sheet-hdr">
          <span className="sheet-title">Adicionar mídia</span>
          <button className="sheet-close" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        
        <div className="src-grid">
          <button className={`src-btn ${source === 'jikan' ? 'active' : ''}`} onClick={() => { setSource('jikan'); setResults([]); }}>
            <span className="src-btn-icon">🎌</span>
            <span className="src-btn-name">MyAnimeList</span>
            <span className="src-btn-sub">Anime · Manga · OVA</span>
          </button>
          <button className={`src-btn ${source === 'tmdb' ? 'active' : ''}`} onClick={() => { setSource('tmdb'); setResults([]); }}>
            <span className="src-btn-icon">🎬</span>
            <span className="src-btn-name">TMDB</span>
            <span className="src-btn-sub">Filmes · Séries</span>
          </button>
        </div>

        {source === 'tmdb' && !tmdbKey && (
          <div className="src-warn visible">
            ⚠ Configure o token do TMDB em ⚙ Configurações para usar esta aba
          </div>
        )}

        <form className="search-row" onSubmit={handleSearch}>
          <input 
            className="search-input" 
            type="search" 
            placeholder="Nome em pt, en, jp..." 
            autoComplete="off" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-btn" type="submit" disabled={loading}>
            {loading ? '...' : 'Buscar'}
          </button>
        </form>

        <div className="search-results" id="search-results">
          {error && <div style={{padding:"20px", textAlign:"center", color:"var(--red)"}}>{error}</div>}
          {results.map(item => source === 'jikan' ? renderJikanResult(item) : renderTmdbResult(item))}
          {!loading && results.length === 0 && query && (
            <div style={{padding:"20px", textAlign:"center", color:"var(--t3)"}}>Nenhum resultado encontrado.</div>
          )}
        </div>

        <button className="search-manual-btn" onClick={onOpenManual}>
          + Adicionar manualmente (sem API)
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
