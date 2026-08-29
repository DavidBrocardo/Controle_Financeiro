import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Filter, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
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
    mediaGastos: 0
  });

  const loadData = async () => {
    const data = await fetchDashboardStats(period);
    setStats({
      totalEntradas: data.totalEntradas,
      totalGastos: data.totalGastos,
      saldoAtual: data.saldoAtual,
      mediaGastos: data.mediaGastos
    });
    setTransactions(data.transactions);
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

          {/* Moeda Dropdown */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
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
              <option value="BRL">BRL (R$)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#d1fae5', marginTop: '18px' }}>
            <ArrowUpRight size={16} />
            <span>+12.5% vs mês anterior</span>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#ef4444', marginTop: '18px' }}>
            <ArrowDownRight size={16} />
            <span>-5.2% controlado vs meta</span>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#ffffff', marginTop: '18px' }}>
            <ArrowUpRight size={16} />
            <span>+15.7% de economia líquida</span>
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
              {stats.mediaGastos.toLocaleString('pt-BR', { style: 'currency', currency: currency })}
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
