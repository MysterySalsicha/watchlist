
'use client';

import React from 'react';

interface InjectModalProps {
  status: any;
  onClose: () => void;
}

const InjectModal = ({ status, onClose }: InjectModalProps) => {
  const pct = status.total > 0 ? Math.round((status.done / status.total) * 100) : 0;

  return (
    <div className="ovl open" id="ovl-inject" role="dialog" aria-modal="true">
      <div className="sheet" style={{maxWidth:"420px", borderRadius:"var(--radius-modal)!important", padding:"28px 24px 24px"}}>
        <div style={{textAlign:"center", marginBottom:"20px"}}>
          <div style={{fontSize:"13px", fontWeight:"700", textTransform:"uppercase", letterSpacing:".1em", color:"var(--t3)", marginBottom:"6px"}}>Importando watchlist</div>
          <div id="inject-item-name" style={{fontSize:"15px", fontWeight:"700", color:"var(--t1)", minHeight:"22px", marginBottom:"16px"}}>{status.currentName || 'Iniciando...'}</div>
          <div style={{height:"6px", background:"var(--b1)", borderRadius:"99px", overflow:"hidden", marginBottom:"10px"}}>
            <div id="inject-progress-bar" style={{height:"100%", background:"linear-gradient(90deg,var(--green),#7fffc4)", borderRadius:"99px", width:`${pct}%`, transition:"width .3s"}}></div>
          </div>
          <div style={{display:"flex", justifyContent:"space-between", fontSize:"12px", color:"var(--t3)"}}>
            <span id="inject-progress-text">{status.done} / {status.total}</span>
            <span id="inject-progress-pct" style={{color:"var(--green)", fontWeight:"700"}}>{pct}%</span>
          </div>
        </div>
        <div id="inject-log" style={{maxHeight:"160px", overflowY:"auto", fontSize:"11px", color:"var(--t3)", lineHeight:"2", textAlign:"center"}}>
          {status.log.map((line: string, i: number) => <div key={i}>{line}</div>)}
        </div>
        {!status.running && (
          <button className="btn-confirm" style={{marginTop:"20px", width:"100%"}} onClick={onClose}>Fechar</button>
        )}
      </div>
    </div>
  );
};

export default InjectModal;
