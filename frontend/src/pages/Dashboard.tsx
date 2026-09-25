import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  DollarSign, 
  RotateCcw,
  BarChart2,
  Wallet,
  TrendingDown
} from 'lucide-react';
import ExpenseChart from '../components/ExpenseChart';
import { fetchDashboardStats, Transaction } from '../services/api';

const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<string>('this_month');
  const [currency, setCurrency] = useState<string>('BRL');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState({
    totalEntradas: 0,
    totalGastos: 0,
    saldoAtual: 0,
    mediaGastos: 0,
    mediaEntradas: 0
  });

  const loadData = async () => {
    // Generate dates based on period
    const now = new Date();
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    let endDate = now;

    if (period === 'last_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else if (period === 'last_30') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 30);
    } else if (period === 'last_90') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 90);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const data = await fetchDashboardStats(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    if (data) {
      setStats({
        totalEntradas: data.totalEntradas || 0,
        totalGastos: data.totalGastos || 0,
        saldoAtual: data.saldoAtual || 0,
        mediaGastos: data.mediaGastos || 0,
        mediaEntradas: data.mediaEntradas || 0,
      });
      setTransactions(data.transactions || []);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 1. FILTER BAR (Modeled after reference screenshot) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '14px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Filters Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#334155' }}>
            <Filter size={16} color="#64748b" />
            <span>Filtros</span>
          </div>

          {/* SELETOR DE PERÍODO */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <Calendar size={16} color="#3b82f6" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontWeight: 600,
                color: '#0f172a',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <option value="this_month">Este Mês (Atual)</option>
              <option value="last_month">Mês Anterior</option>
              <option value="last_30">Últimos 30 Dias</option>
              <option value="last_90">Últimos 90 Dias</option>
              <option value="year">Ano Atual (2026)</option>
            </select>
          </div>

        

          {/* Reset Filters button */}
          <button
            onClick={() => { setPeriod('this_month'); setCurrency('BRL'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748b',
              cursor: 'pointer',
              padding: '6px 10px'
            }}
          >
            <RotateCcw size={14} />
            <span>Resetar</span>
          </button>
        </div>

        {/* Active Filter Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Filtros ativos:</span>
          <span style={{
            backgroundColor: '#f3e8ff',
            color: '#9333ea',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            Moeda: {currency} ×
          </span>
        </div>
      </div>

      {/* 2. TITLE SECTION */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Análise do Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Acompanhe suas métricas de entradas, quantidade gasta e saldo acumulado
        </p>
      </div>

      {/* 3. KPI CARDS GRID (Modeled directly after reference image) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Card 1: Total Entradas (Blue styled card) */}
        <div className="card" style={{
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderColor: '#2563eb',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#dbeafe' }}>Total Entradas</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} color="#ffffff" />
              </div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', letterSpacing: '-0.5px' }}>
              {stats.totalEntradas.toLocaleString('pt-BR', { style: 'currency', currency: currency })}
            </h2>
          </div>
        </div>

        {/* Card 2: Total Gastos / Quantidade Gasta */}
        <div className="card" style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Quantidade Gasta</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingDown size={20} color="#ef4444" />
              </div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {stats.totalGastos.toLocaleString('pt-BR', { style: 'currency', currency: currency })}
            </h2>
          </div>
        </div>

        {/* Card 3: Saldo Atual (Green Card) */}
        <div className="card" style={{
          backgroundColor: '#10b981',
          color: '#ffffff',
          borderColor: '#059669',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#d1fae5' }}>Saldo Atual</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wallet size={20} color="#ffffff" />
              </div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', letterSpacing: '-0.5px' }}>
              {stats.saldoAtual.toLocaleString('pt-BR', { style: 'currency', currency: currency })}
            </h2>
          </div>
        </div>

        {/* Card 4: Média de Gastos por Dia */}
        <div className="card" style={{
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Média de Gastos (Dia)</span>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart2 size={20} color="#9333ea" />
              </div>
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: 800, marginTop: '12px', color: '#0f172a', letterSpacing: '-0.5px' }}>
              {(stats.mediaGastos/30).toLocaleString('pt-BR', { style: 'currency', currency: currency })}
            </h2>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginTop: '18px' }}>
            Calculado com base no período de 30 dias
          </div>
        </div>
      </div>

      {/* 4. EXPENSE CHART COMPONENT */}
      <ExpenseChart period={period} transactions={transactions} />
    </div>
  );
};

export default DashboardPage;
