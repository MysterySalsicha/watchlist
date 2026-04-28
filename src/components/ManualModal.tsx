
'use client';

import React, { useState } from 'react';
import { uid } from '@/utils/helpers';

interface ManualModalProps {
  onClose: () => void;
  onAdd: (item: any) => void;
}

const ManualModal = ({ onClose, onAdd }: ManualModalProps) => {
  const [crunchyText, setCrunchyText] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    img: '',
    genres: '',
    synopsis: '',
    cr: '',
    ep: 0,
    tot: 0,
    s: 1,
    sns: 0,
    ept: 0,
    dub: 'dub',
    st: 'comecar',
    note: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target as any;
    const key = id.replace('man-', '');
    setFormData(prev => ({
      ...prev,
      [key]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleParser = (text: string) => {
    setCrunchyText(text);
    if (!text) return;

    // Regex para: Nome do Anime S2 E12 ou Nome do Anime Season 2 Episode 12
    const sMatch = text.match(/(.*?)[\s\-_](?:S|Season)\s?(\d+)/i);
    const eMatch = text.match(/(?:E|Episode|Ep)\s?(\d+)/i);

    let title = formData.title;
    let s = formData.s;
    let ep = formData.ep;

    if (sMatch) {
      title = sMatch[1].trim();
      s = parseInt(sMatch[2]);
    }
    if (eMatch) {
      ep = parseInt(eMatch[1]);
    }

    if (!sMatch && !eMatch && text.length > 3) {
        title = text.trim();
    }

    setFormData(prev => ({ ...prev, title, s, ep, st: ep > 0 ? 'continuar' : 'comecar' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newItem = {
      id: uid(),
      ...formData,
      genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean),
      dub: formData.dub === 'dub' ? 1 : 0,
      addedAt: Date.now(),
      updatedAt: Date.now(),
      lists: formData.ep > 0 ? ['meio'] : ['nc'],
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="ovl open" id="ovl-manual" role="dialog" aria-modal="true" aria-label="Adicionar manualmente">
      <div className="sheet">
        <span className="drag-handle"></span>
        <div className="sheet-hdr">
          <span className="sheet-title">Adicionar manualmente</span>
          <button className="sheet-close" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <form className="manual-body" onSubmit={handleSubmit}>
          <div className="manual-field" style={{background:"var(--b1)", padding:"12px", borderRadius:"12px", marginBottom:"16px"}}>
            <label style={{color:"var(--green)", fontWeight:"700", fontSize:"11px", marginBottom:"6px", display:"block"}}>MÁGICA: COLAR DA CRUNCHYROLL</label>
            <input 
              className="manual-input" 
              type="text" 
              placeholder="Ex: Jujutsu Kaisen S2 E12" 
              value={crunchyText}
              onChange={(e) => handleParser(e.target.value)}
              style={{background:"var(--b2)", border:"1px dashed var(--green)"}}
            />
          </div>

          <div className="manual-field">
            <label>Nome *</label>
            <input 
              className="manual-input" 
              id="man-title" 
              type="text" 
              placeholder="Nome da mídia" 
              autoComplete="off" 
              required
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="manual-field">
            <label>URL da imagem de capa</label>
            <input 
              className="manual-input" 
              id="man-img" 
              type="url" 
              placeholder="https://..." 
              value={formData.img}
              onChange={handleChange}
            />
            {formData.img && (
              <div className="manual-preview visible">
                <img src={formData.img} alt="" onError={(e) => (e.currentTarget as HTMLElement).style.display='none'} />
              </div>
            )}
          </div>
          <div className="manual-field">
            <label>Gêneros (separados por vírgula)</label>
            <input 
              className="manual-input" 
              id="man-genres" 
              type="text" 
              placeholder="Ação, Fantasia, Romance" 
              value={formData.genres}
              onChange={handleChange}
            />
          </div>
          <div className="manual-field">
            <label>Sinopse</label>
            <textarea 
              className="manual-textarea" 
              id="man-synopsis" 
              placeholder="Descrição da mídia..."
              value={formData.synopsis}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="manual-field">
            <label>Link Crunchyroll / plataforma</label>
            <input 
              className="manual-input" 
              id="man-cr" 
              type="url" 
              placeholder="https://crunchyroll.com/..." 
              value={formData.cr}
              onChange={handleChange}
            />
          </div>
          <div className="manual-row cols2">
            <div className="manual-field">
              <label>Ep atual</label>
              <input className="manual-input" id="man-ep" type="number" min="0" value={formData.ep} onChange={handleChange} />
            </div>
            <div className="manual-field">
              <label>Total eps temporada</label>
              <input className="manual-input" id="man-tot" type="number" min="0" value={formData.tot} onChange={handleChange} />
            </div>
          </div>
          <div className="manual-row cols3">
            <div className="manual-field">
              <label>Temp. atual</label>
              <input className="manual-input" id="man-s" type="number" min="1" value={formData.s} onChange={handleChange} />
            </div>
            <div className="manual-field">
              <label>Total temps.</label>
              <input className="manual-input" id="man-sns" type="number" min="0" value={formData.sns} onChange={handleChange} />
            </div>
            <div className="manual-field">
              <label>Eps/temp.</label>
              <input className="manual-input" id="man-ept" type="number" min="0" value={formData.ept} onChange={handleChange} />
            </div>
          </div>
          <div>
            <span className="flow-label">Áudio</span>
            <div className="manual-radio-group">
              <label className={`flow-radio ${formData.dub === 'dub' ? 'selected' : ''}`}>
                <input type="radio" name="man-audio" value="dub" checked={formData.dub === 'dub'} onChange={() => setFormData(p => ({...p, dub: 'dub'}))} /> 🇧🇷 Dublado
              </label>
              <label className={`flow-radio ${formData.dub === 'leg' ? 'selected' : ''}`}>
                <input type="radio" name="man-audio" value="leg" checked={formData.dub === 'leg'} onChange={() => setFormData(p => ({...p, dub: 'leg'}))} /> 💬 Legendado
              </label>
            </div>
          </div>
          <div className="manual-field">
            <label>Status</label>
            <select className="manual-select" id="man-st" value={formData.st} onChange={handleChange}>
              <option value="comecar">Não comecei</option>
              <option value="continuar">Em andamento</option>
              <option value="seguir">A seguir</option>
              <option value="novamente">Assistir de novo</option>
              <option value="terminado">Terminado</option>
            </select>
          </div>
          <div className="manual-field">
            <label>Nota pessoal</label>
            <textarea 
              className="manual-textarea" 
              id="man-note" 
              placeholder="Observações..."
              value={formData.note}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="flow-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-confirm">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualModal;
