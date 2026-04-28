
'use client';

import React, { useState } from 'react';

interface FlowModalProps {
  apiData: any;
  onClose: () => void;
  onConfirm: (finalData: any) => void;
}

const FlowModal = ({ apiData, onClose, onConfirm }: FlowModalProps) => {
  const [isWatching, setIsWatching] = useState('nao');
  const [ep, setEp] = useState(1);
  const [season, setSeason] = useState(1);
  const [dub, setDub] = useState(apiData.hasPtBrDub ? 'dub' : 'leg');
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const handleToggleTag = (tag: string) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleConfirm = () => {
    const status = isWatching === 'sim' ? 'continuar' : 'comecar';
    const lists = isWatching === 'sim' ? ['meio'] : ['nc'];
    if (tags.includes('ficar')) lists.push('ficar');
    if (tags.includes('nova')) lists.push('nova-tp');

    onConfirm({
      ...apiData,
      st: status,
      lists,
      ep: isWatching === 'sim' ? ep : 0,
      s: season,
      dub: dub === 'dub' ? 1 : 0,
      note,
    });
  };

  return (
    <div className="ovl open" id="ovl-flow" role="dialog" aria-modal="true" aria-label="Configurar adição">
      <div className="sheet">
        <span className="drag-handle"></span>
        <div className="sheet-hdr">
          <span className="sheet-title" id="flow-title">Adicionar</span>
          <button className="sheet-close" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <div className="flow-body">
          <div>
            <div className="flow-media-title">{apiData.title_english || apiData.title || apiData.name}</div>
            <div className="flow-sub">Configure como você quer acompanhar</div>
          </div>
          <div>
            <span className="flow-label">Você está assistindo agora?</span>
            <div className="flow-radio-group">
              <label className={`flow-radio ${isWatching === 'sim' ? 'selected' : ''}`}>
                <input type="radio" name="flow-watching" value="sim" checked={isWatching === 'sim'} onChange={() => setIsWatching('sim')} />
                ✓ Sim, já comecei
              </label>
              <label className={`flow-radio ${isWatching === 'nao' ? 'selected' : ''}`}>
                <input type="radio" name="flow-watching" value="nao" checked={isWatching === 'nao'} onChange={() => setIsWatching('nao')} />
                Não, começo do E1
              </label>
            </div>
          </div>
          {isWatching === 'sim' && (
            <div id="flow-ep-section">
              <span className="flow-label">Onde você está</span>
              <div className="flow-ep-fields">
                <div className="flow-field">
                  <label>Episódio atual</label>
                  <input className="flow-input" type="number" min="1" value={ep} onChange={(e) => setEp(parseInt(e.target.value) || 1)} />
                </div>
                <div className="flow-field">
                  <label>Temporada</label>
                  <input className="flow-input" type="number" min="1" value={season} onChange={(e) => setSeason(parseInt(e.target.value) || 1)} />
                </div>
              </div>
            </div>
          )}
          <div>
            <span className="flow-label">Áudio disponível</span>
            <div className="flow-radio-group">
              <label className={`flow-radio ${dub === 'dub' ? 'selected' : ''}`}>
                <input type="radio" name="flow-audio" value="dub" checked={dub === 'dub'} onChange={() => setDub('dub')} />
                🇧🇷 Dublado PT-BR
              </label>
              <label className={`flow-radio ${dub === 'leg' ? 'selected' : ''}`}>
                <input type="radio" name="flow-audio" value="leg" checked={dub === 'leg'} onChange={() => setDub('leg')} />
                💬 Legendado
              </label>
            </div>
          </div>
          <div>
            <span className="flow-label">Marcar também como</span>
            <div className="flow-toggle-group">
              <button className={`flow-toggle ${tags.includes('ficar') ? 'active' : ''}`} onClick={() => handleToggleTag('ficar')}><i className="ri-eye-line"></i> Ficar de olho</button>
              <button className={`flow-toggle ${tags.includes('nova') ? 'active' : ''}`} onClick={() => handleToggleTag('nova')}><i className="ri-refresh-line"></i> Nova temporada</button>
            </div>
          </div>
          <div>
            <span className="flow-label">Nota pessoal</span>
            <textarea className="flow-textarea" placeholder="T3 confirmada para Julho 2026..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
          </div>
          <div className="flow-footer">
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn-confirm" onClick={handleConfirm}>Adicionar à Watchlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowModal;
