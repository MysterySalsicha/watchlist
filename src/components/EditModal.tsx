
'use client';

import React, { useState, useEffect } from 'react';

interface EditModalProps {
  item: any;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
}

const EditModal = ({ item, onClose, onSave }: EditModalProps) => {
  const [formData, setFormData] = useState<any>(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const key = id.replace('edit-', '');
    setFormData({ ...formData, [key]: value });
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const key = id.replace('edit-', '');
    setFormData({ ...formData, [key]: parseInt(value) || 0 });
  };

  const handleSave = () => {
    onSave({
      ...formData,
      updatedAt: Date.now(),
    });
  };

  const handleResetProgress = () => {
    if (confirm('Deseja zerar o progresso deste item?')) {
      setFormData({
        ...formData,
        ep: 0,
        _ep: 0,
        st: 'comecar',
        _done: false,
        lists: (formData.lists || []).filter((l: string) => l !== 'meio' && l !== 'term').concat('nc')
      });
    }
  };

  return (
    <div className="ovl open" id="ovl-edit" role="dialog" aria-modal="true" aria-label="Editar mídia">
      <div className="sheet">
        <span className="drag-handle"></span>
        <div className="sheet-hdr">
          <span className="sheet-title">Editar mídia</span>
          <button className="sheet-close" onClick={onClose} aria-label="Fechar"><i className="ri-close-line" style={{fontSize:"18px"}}></i></button>
        </div>
        <div className="flow-body" id="edit-body">
          <div className="flow-field">
            <label className="flow-label">Título</label>
            <input className="flow-input" id="edit-title" type="text" value={formData.title || ''} onChange={handleChange} />
          </div>
          <div className="flow-field">
            <label className="flow-label">Link Crunchyroll / Assistir</label>
            <input className="flow-input" id="edit-cr" type="url" value={formData.cr || ''} onChange={handleChange} />
          </div>
          <div className="edit-grid-3">
            <div className="flow-field">
              <label>Ep atual</label>
              <input className="flow-input" id="edit-ep" type="number" min="0" value={formData.ep || 0} onChange={handleNumericChange} />
            </div>
            <div className="flow-field">
              <label>Total eps</label>
              <input className="flow-input" id="edit-tot" type="number" min="0" value={formData.tot || 0} onChange={handleNumericChange} />
            </div>
            <div className="flow-field">
              <label>Temp.</label>
              <input className="flow-input" id="edit-s" type="number" min="1" value={formData.s || 1} onChange={handleNumericChange} />
            </div>
          </div>
          <div className="flow-field">
            <label className="flow-label">Status</label>
            <select className="flow-input" id="edit-st" style={{height:"44px"}} value={formData.st || 'comecar'} onChange={handleChange}>
              <option value="comecar">Não comecei</option>
              <option value="continuar">Em andamento</option>
              <option value="seguir">A seguir</option>
              <option value="novamente">Assistir de novo</option>
              <option value="terminado">Terminado</option>
            </select>
          </div>
          <div>
            <span className="flow-label">Listas</span>
            <div className="edit-lists-grid" style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px"}}>
              {[
                { key: 'meio', label: 'Em andamento', icon: 'ri-play-circle-line' },
                { key: 'nc', label: 'Não comecei', icon: 'ri-time-line' },
                { key: 'nova-tp', label: 'Nova temporada', icon: 'ri-refresh-line' },
                { key: 'ficar', label: 'Ficar de olho', icon: 'ri-eye-line' },
                { key: 'term', label: 'Terminados', icon: 'ri-check-double-line' },
              ].map(list => (
                <label 
                  key={list.key}
                  className={`flow-toggle ${formData.lists?.includes(list.key) ? 'active' : ''}`}
                  onClick={() => {
                    const currentLists = formData.lists || [];
                    const newLists = currentLists.includes(list.key)
                      ? currentLists.filter((l: string) => l !== list.key)
                      : [...currentLists, list.key];
                    setFormData({ ...formData, lists: newLists });
                  }}
                >
                  <i className={list.icon}></i> {list.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flow-field">
            <label className="flow-label">Nota pessoal</label>
            <textarea className="flow-textarea" id="edit-note" value={formData.note || ''} onChange={handleChange} placeholder="Observações..."></textarea>
          </div>
          
          <button className="btn-cancel" style={{width:"100%", marginTop:"8px", color:"var(--red)", borderColor:"rgba(255,77,77,.2)"}} onClick={handleResetProgress}>
            <i className="ri-restart-line"></i> Zerar progresso
          </button>

          <div className="flow-footer" style={{marginTop:"20px"}}>
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button className="btn-confirm" onClick={handleSave}><i className="ri-save-line"></i> Salvar alterações</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
