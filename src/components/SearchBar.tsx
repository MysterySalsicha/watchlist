
'use client';

import React from 'react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}

const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className="search-wrap">
      <i className="ri-search-line search-icon"></i>
      <input
        type="text"
        className="list-search"
        id="list-search"
        placeholder="Filtrar nesta lista..."
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        className={`search-clear ${query ? 'visible' : ''}`}
        id="search-clear"
        aria-label="Limpar filtro"
        onClick={handleClear}
      >
        <i className="ri-close-line" style={{fontSize:"15px"}}></i>
      </button>
    </div>
  );
};

export default SearchBar;
