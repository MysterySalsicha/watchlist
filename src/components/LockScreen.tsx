
'use client';

import React, { useState } from 'react';

interface LockScreenProps {
  correctPin: string;
  onUnlock: () => void;
}

const LockScreen = ({ correctPin, onUnlock }: LockScreenProps) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === correctPin) {
      onUnlock();
    } else {
      setError('Senha incorreta');
      setPin('');
    }
  };

  return (
    <div id="lock-screen">
      <div className="lock-card">
        <div className="lock-logo"><span className="w">Watch</span><span className="g">list</span></div>
        <div className="lock-tagline">Digite a senha para continuar</div>
        <form className="lock-input-wrap" onSubmit={handleSubmit}>
          <input 
            className={`lock-input ${error ? 'error' : ''}`}
            type={showPin ? "text" : "password"} 
            placeholder="Senha" 
            autoComplete="off" 
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(''); }}
            autoFocus
          />
          <button type="button" className="lock-eye" onClick={() => setShowPin(!showPin)} aria-label="Mostrar/ocultar senha">
            <i className={showPin ? "ri-eye-off-line" : "ri-eye-line"} style={{fontSize:"18px"}}></i>
          </button>
        </form>
        <button className="lock-btn" onClick={handleSubmit}>Entrar</button>
        <div className="lock-error">{error}</div>
      </div>
    </div>
  );
};

export default LockScreen;
