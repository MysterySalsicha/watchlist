
import React from 'react';

interface ConfirmModalProps {
  msg: string;
  okText?: string;
  cancelText?: string;
  danger?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ msg, okText, cancelText, danger, icon, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="ovl open" id="ovl-confirm" role="alertdialog" aria-modal="true">
      <div className="sheet confirm-sheet">
        <div className="confirm-icon" id="confirm-icon">
            {icon ? <span>{icon}</span> : <i className="ri-error-warning-line" style={{fontSize:"28px", color:"var(--amber)"}}></i>}
        </div>
        <div className="confirm-msg" id="confirm-msg">{msg}</div>
        <div className="confirm-actions">
          <button className="btn-cancel" id="confirm-cancel" style={{height:"44px"}} onClick={onCancel}>{cancelText || 'Cancelar'}</button>
          <button className={`btn-ok ${danger ? 'danger' : 'primary'}`} id="confirm-ok" onClick={onConfirm}>{okText || 'Confirmar'}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
