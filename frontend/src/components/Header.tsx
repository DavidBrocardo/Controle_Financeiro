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

      
    </header>
  );
};

export default Header;
