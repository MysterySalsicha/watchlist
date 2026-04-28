
import React from 'react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

const Header = ({ onOpenSettings, onOpenSearch }: HeaderProps) => {
  return (
    <header className="hdr glass">
      <a className="hdr-logo" href="#" aria-label="Watchlist">
        <span className="w">Watch</span><span className="g">list</span>
      </a>
      <div className="hdr-actions">
        <button className="btn-settings" id="btn-settings" aria-label="Configurações" onClick={onOpenSettings}>
          <i className="ri-settings-3-line" style={{fontSize:"18px"}}></i>
        </button>
        <button className="btn-add" id="btn-add" aria-label="Adicionar mídia" onClick={onOpenSearch}>
          <i className="ri-add-line" style={{fontSize:"16px"}}></i>
          Adicionar
        </button>
      </div>
    </header>
  );
};

export default Header;
