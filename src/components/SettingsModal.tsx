
'use client';

import React, { useState, useEffect, useRef } from 'react';

interface SettingsModalProps {
  onClose: () => void;
  config: any;
  onSaveConfig: (key: string, value: string) => void;
  onRunInject: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onCopyShareLink: () => void;
  onReset: () => void;
}

const SettingsModal = ({ onClose, config, onSaveConfig, onRunInject, onExport, onImport, onCopyShareLink, onReset }: SettingsModalProps) => {
  const [tmdbKey, setTmdbKey] = useState(config.tmdbKey || '');
  const [appPin, setAppPin] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTmdbKey(config.tmdbKey || '');
  }, [config.tmdbKey]);

  const handleSave = async () => {
    await onSaveConfig('tmdbKey', tmdbKey);
    if (appPin) {
      await onSaveConfig('appPin', appPin);
    }
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      onClose();
    }
  };

  return (
    <div className="ovl open" id="ovl-settings" role="dialog" aria-modal="true" aria-label="Configurações">
      <div className="sheet">
        <span className="drag-handle"></span>
        <div className="sheet-hdr">
          <span className="sheet-title">Configurações</span>
          <button className="sheet-close" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <div className="settings-body">
          <div className="settings-field">
            <span className="settings-label">TMDB API Read Access Token (v4)</span>
            <input 
              className="settings-input" 
              type="text" 
              placeholder="eyJhbGciOiJIUzI1NiJ9..." 
              autoComplete="off" 
              spellCheck="false" 
              value={tmdbKey}
              onChange={(e) => setTmdbKey(e.target.value)}
            />
            <span className="settings-hint">
              Acesse <a href="https://www.themoviedb.org/settings/api" target="_blank" rel="noopener noreferrer">themoviedb.org/settings/api</a>
              e copie o campo <strong style={{color:"var(--t1)"}}>"API Read Access Token (v4 auth)"</strong> — começa com "eyJ...".
            </span>
          </div>
          <div className="settings-field">
            <span className="settings-label">Jikan (MyAnimeList)</span>
            <input className="settings-input" value="api.jikan.moe/v4 — público e gratuito" disabled />
          </div>
          <button className="btn-save" onClick={handleSave}>Salvar configurações</button>

          <div style={{height:"1px", background:"var(--b1)", margin:"12px 0"}}></div>

          <div className="settings-field">
            <span className="settings-label">Senha de acesso (lock screen)</span>
            <input 
              className="settings-input" 
              type="password" 
              placeholder="Deixe em branco para desativar" 
              autoComplete="new-password" 
              value={appPin}
              onChange={(e) => setAppPin(e.target.value)}
            />
            <span className="settings-hint">Se configurada, será pedida ao abrir o app. Útil para proteger suas API keys.</span>
          </div>

          <div style={{height:"1px", background:"var(--b1)", margin:"12px 0"}}></div>

          <div className="settings-field">
            <span className="settings-label">Compartilhar / Backup</span>
            <span className="settings-hint">Exporte sua watchlist para fazer backup ou compartilhar com amigos.</span>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginTop:"8px"}}>
              <button className="btn-cancel" style={{height:"40px", fontSize:"13px", display:"flex", alignItems:"center", justifySelf:"stretch", justifyContent:"center", gap:"6px"}} onClick={onExport}><i className="ri-download-2-line"></i> Exportar JSON</button>
              <button className="btn-cancel" style={{height:"40px", fontSize:"13px", display:"flex", alignItems:"center", justifySelf:"stretch", justifyContent:"center", gap:"6px"}} onClick={() => fileInputRef.current?.click()}><i className="ri-upload-2-line"></i> Importar JSON</button>
            </div>
            <input type="file" ref={fileInputRef} accept=".json" style={{display:"none"}} onChange={handleFileChange} />
            <button className="btn-cancel" style={{height:"40px", fontSize:"13px", marginTop:"8px", width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"6px"}} onClick={onCopyShareLink}><i className="ri-links-line"></i> Copiar link compartilhável</button>
          </div>

          <div style={{height:"1px", background:"var(--b1)", margin:"12px 0"}}></div>

          <div className="settings-field">
            <span className="settings-label">Importar minha watchlist do MAL</span>
            <span className="settings-hint">Busca automaticamente os 31 animes configurados via MyAnimeList (requer internet). Itens já existentes serão ignorados.</span>
            <button className="btn-save" style={{marginTop:"8px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px"}} onClick={() => { onClose(); onRunInject(); }}>
              <i className="ri-robot-2-line"></i> Buscar watchlist do MAL (31 animes)
            </button>
          </div>

          <div style={{height:"1px", background:"var(--b1)", margin:"12px 0"}}></div>

          <div className="settings-field">
            <span className="settings-label" style={{color:"var(--red)"}}>Zona de Perigo</span>
            <button className="btn-cancel" style={{marginTop:"8px", width:"100%", color:"var(--red)", borderColor:"rgba(255,77,77,.2)"}} onClick={onReset}>
              <i className="ri-delete-bin-line"></i> Reset Total (Apagar tudo)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
