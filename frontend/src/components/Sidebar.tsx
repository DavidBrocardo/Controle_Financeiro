import React from 'react';
import { LayoutDashboard, Receipt, Database, Layers } from 'lucide-react';

interface SidebarProps {
  activeTab: 'registro' | 'dashboard';
  setActiveTab: (tab: 'registro' | 'dashboard') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="sidebar">
      <div>
        {/* Logo Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '28px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
          }}>
            <Layers size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', lineHeight: '1.2' }}>
              FinanceFlow
            </h2>
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Painel Financeiro
            </span>
          </div>
        </div>

        {/* Navigation Group */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '14px',
            paddingLeft: '12px'
          }}>
            NAVEGAÇÃO PRINCIPAL
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Registro */}
            <button
              onClick={() => setActiveTab('registro')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'registro' ? '#eff6ff' : 'transparent',
                color: activeTab === 'registro' ? '#2563eb' : '#475569',
                fontWeight: activeTab === 'registro' ? 700 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <Receipt size={18} color={activeTab === 'registro' ? '#2563eb' : '#64748b'} />
              <span>Registro</span>
            </button>

            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === 'dashboard' ? '#eff6ff' : 'transparent',
                color: activeTab === 'dashboard' ? '#2563eb' : '#475569',
                fontWeight: activeTab === 'dashboard' ? 700 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <LayoutDashboard size={18} color={activeTab === 'dashboard' ? '#2563eb' : '#64748b'} />
              <span>Dashboard</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Connect Data Sources Box */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '12px', fontWeight: 600 }}>
          <Database size={15} color="#3b82f6" />
          <span>CONECTAR DADOS</span>
        </div>
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#334155',
          cursor: 'pointer',
          transition: 'background 0.15s ease'
        }}>
          <span>Conectar Fontes</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
