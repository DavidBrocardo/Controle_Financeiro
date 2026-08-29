import React, { useEffect, useState } from 'react';
import { Search, Bell, LogOut, Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { checkHealth } from '../services/api';

const Header: React.FC = () => {
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyApi = async () => {
      try {
        await checkHealth();
        setApiOnline(true);
      } catch {
        setApiOnline(false);
      }
    };
    verifyApi();
  }, []);

  return (
    <header className="header">
      {/* Search Input Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: '#f1f5f9',
        borderRadius: '10px',
        padding: '10px 16px',
        width: '440px',
        border: '1px solid transparent',
        transition: 'all 0.15s ease'
      }}>
        <Search size={18} color="#64748b" />
        <input
          type="text"
          placeholder="Buscar transações, contas e categorias..."
          style={{
            border: 'none',
            background: 'transparent',
            outline: 'none',
            width: '100%',
            fontSize: '13px',
            color: '#0f172a'
          }}
        />
      </div>

      {/* Header Actions Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Backend Integration Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 600,
          backgroundColor: apiOnline ? '#d1fae5' : '#fef3c7',
          color: apiOnline ? '#065f46' : '#92400e',
          border: `1px solid ${apiOnline ? '#a7f3d0' : '#fde68a'}`
        }}>
          {apiOnline ? <CheckCircle2 size={13} color="#059669" /> : <AlertCircle size={13} color="#d97706" />}
          <span>{apiOnline ? 'API Conectada' : 'Modo Standalone / API'}</span>
        </div>

        {/* Notifications Bell */}
        <button style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#64748b'
        }} title="Notificações">
          <Bell size={18} />
        </button>

        {/* Primary Action Button */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#9333ea',
          color: '#ffffff',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 18px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 6px rgba(147, 51, 234, 0.25)',
          transition: 'all 0.15s ease'
        }}>
          <Wallet size={16} />
          <span>Conectar Conta</span>
        </button>

        {/* Exit Demo Button */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#ffffff',
          color: '#475569',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '10px 16px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>
          <LogOut size={15} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
