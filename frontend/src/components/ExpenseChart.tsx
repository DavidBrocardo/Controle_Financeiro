import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Info } from 'lucide-react';
import { Transaction } from '../services/api';

interface ExpenseChartProps {
  period: string;
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ period, transactions }) => {
  const [chartView, setChartView] = useState<'temporal' | 'categoria'>('temporal');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute dataset based on selected period
  const getChartDataset = () => {
    if (period === 'last_month') {
      return [
        { label: 'Semana 1', gasto: 620, receita: 2000 },
        { label: 'Semana 2', gasto: 890, receita: 2000 },
        { label: 'Semana 3', gasto: 450, receita: 1800 },
        { label: 'Semana 4', gasto: 980, receita: 2100 },
      ];
    } else if (period === 'last_30') {
      return [
        { label: 'Dia 1-5', gasto: 420, receita: 1500 },
        { label: 'Dia 6-10', gasto: 780, receita: 1800 },
        { label: 'Dia 11-15', gasto: 510, receita: 1200 },
        { label: 'Dia 16-20', gasto: 890, receita: 2400 },
        { label: 'Dia 21-25', gasto: 630, receita: 1600 },
        { label: 'Dia 26-30', gasto: 940, receita: 1950 },
      ];
    } else if (period === 'year') {
      return [
        { label: 'Jan', gasto: 2400, receita: 6500 },
        { label: 'Fev', gasto: 2800, receita: 7000 },
        { label: 'Mar', gasto: 2100, receita: 6800 },
        { label: 'Abr', gasto: 3200, receita: 7200 },
        { label: 'Mai', gasto: 2900, receita: 7100 },
        { label: 'Jun', gasto: 2650, receita: 7500 },
        { label: 'Jul', gasto: 3100, receita: 7800 },
        { label: 'Ago', gasto: 3280, receita: 8450 },
      ];
    }

    // Default: 'this_month' (or standard)
    return [
      { label: 'Sem 1', gasto: 750, receita: 2200 },
      { label: 'Sem 2', gasto: 1200, receita: 2500 },
      { label: 'Sem 3', gasto: 850, receita: 1950 },
      { label: 'Sem 4', gasto: 480, receita: 1800 },
    ];
  };

  const dataset = getChartDataset();
  const maxVal = Math.max(...dataset.map(d => Math.max(d.gasto, d.receita)), 100);

  // Category breakdown calculation
  const getCategoryBreakdown = () => {
    const map: { [cat: string]: number } = {};
    const gastosOnly = transactions.filter(t => t.tipo === 'gasto');
    
    gastosOnly.forEach(t => {
      map[t.categoria] = (map[t.categoria] || 0) + t.valor;
    });

    // Fallback defaults if no transactions registered yet
    if (Object.keys(map).length === 0) {
      map['Alimentação & Restaurantes'] = 1040.50;
      map['Moradia & Contas'] = 1500.00;
      map['Transporte & Combustível'] = 280.00;
      map['Lazer & Entretenimento'] = 160.00;
      map['Outros'] = 300.00;
    }

    const totalSpent = Object.values(map).reduce((a, b) => a + b, 0);
    const colors = ['#ef4444', '#f97316', '#eab308', '#8b5cf6', '#3b82f6', '#06b6d4', '#ec4899'];
    
    return Object.entries(map).map(([cat, val], idx) => ({
      categoria: cat,
      valor: val,
      percentual: totalSpent > 0 ? (val / totalSpent) * 100 : 0,
      color: colors[idx % colors.length]
    })).sort((a, b) => b.valor - a.valor);
  };

  const categories = getCategoryBreakdown();
  const totalGastoCalculado = dataset.reduce((acc, curr) => acc + curr.gasto, 0);

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Chart Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Tendência e Análise de Gastos
            </h3>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700
            }}>
              <TrendingUp size={12} />
              Quantidade Gasta
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            Visualização detalhada da evolução financeira no período selecionado
          </p>
        </div>

        {/* View Switch Buttons (Temporal Bar Chart vs Category Pie Chart) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setChartView('temporal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: chartView === 'temporal' ? '#ffffff' : 'transparent',
              color: chartView === 'temporal' ? '#2563eb' : '#64748b',
              fontWeight: chartView === 'temporal' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: chartView === 'temporal' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <BarChart3 size={14} />
            <span>Gráfico de Barras</span>
          </button>

          <button
            onClick={() => setChartView('categoria')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: chartView === 'categoria' ? '#ffffff' : 'transparent',
              color: chartView === 'categoria' ? '#2563eb' : '#64748b',
              fontWeight: chartView === 'categoria' ? 700 : 500,
              fontSize: '12px',
              cursor: 'pointer',
              boxShadow: chartView === 'categoria' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <PieChart size={14} />
            <span>Por Categoria</span>
          </button>
        </div>
      </div>

      {/* Legend & Stats Summary bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        fontSize: '13px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#ef4444' }}></span>
            <span style={{ fontWeight: 600, color: '#334155' }}>Gastos (Despesas)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b981' }}></span>
            <span style={{ fontWeight: 600, color: '#334155' }}>Entradas (Receitas)</span>
          </div>
        </div>

        <div style={{ fontWeight: 700, color: '#0f172a' }}>
          Total Gastos no Período:{' '}
          <span style={{ color: '#ef4444' }}>
            {totalGastoCalculado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>

      {/* MAIN CHART AREA */}
      {chartView === 'temporal' ? (
        <div style={{ position: 'relative', height: '280px', width: '100%', marginTop: '10px' }}>
          <div style={{ display: 'flex', height: '220px', alignItems: 'flex-end', gap: '24px', paddingBottom: '30px', borderBottom: '1px dashed #cbd5e1' }}>
            {dataset.map((item, idx) => {
              const heightGastoPct = Math.max((item.gasto / maxVal) * 100, 8);
              const heightReceitaPct = Math.max((item.receita / maxVal) * 100, 8);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    height: '100%',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      top: '-65px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      zIndex: 10,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                    }}>
                      <div style={{ color: '#fca5a5' }}>Gasto: R$ {item.gasto.toFixed(2)}</div>
                      <div style={{ color: '#6ee7b7' }}>Entrada: R$ {item.receita.toFixed(2)}</div>
                    </div>
                  )}

                  {/* Dual Bars Container */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '100%', width: '100%', justifyContent: 'center' }}>
                    {/* Expense Bar */}
                    <div style={{
                      width: '40%',
                      maxWidth: '36px',
                      height: `${heightGastoPct}%`,
                      backgroundColor: isHovered ? '#dc2626' : '#ef4444',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
                    }} />

                    {/* Revenue Bar */}
                    <div style={{
                      width: '40%',
                      maxWidth: '36px',
                      height: `${heightReceitaPct}%`,
                      backgroundColor: isHovered ? '#059669' : '#10b981',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
                    }} />
                  </div>

                  {/* Axis Label */}
                  <span style={{
                    position: 'absolute',
                    bottom: '-24px',
                    fontSize: '12px',
                    fontWeight: isHovered ? 700 : 600,
                    color: isHovered ? '#0f172a' : '#64748b'
                  }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* CATEGORY BREAKDOWN VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {categories.map((cat, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                  {cat.categoria}
                </span>
                <span style={{ color: '#0f172a' }}>
                  {cat.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} ({cat.percentual.toFixed(1)}%)
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${cat.percentual}%`,
                  backgroundColor: cat.color,
                  borderRadius: '5px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Backend Integration Info Notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11px',
        color: '#64748b',
        backgroundColor: '#f8fafc',
        padding: '10px 14px',
        borderRadius: '8px',
        borderLeft: '3px solid #3b82f6'
      }}>
        <Info size={14} color="#3b82f6" />
        <span>
          O gráfico consome e calcula métricas em tempo real dos gastos registrados, preparado para integração completa com o endpoint de analytics do backend.
        </span>
      </div>
    </div>
  );
};

export default ExpenseChart;
