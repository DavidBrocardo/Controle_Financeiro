import React from 'react';
import { TrendingUp, PieChart, Info } from 'lucide-react';
import { Transaction } from '../services/api';

interface ExpenseChartProps {
  period?: string;
  transactions: Transaction[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ transactions }) => {
  // Category breakdown calculation
  const getCategoryBreakdown = () => {
    const map: { [cat: string]: number } = {};
    const gastosOnly = transactions ? transactions.filter(t => t.tipo === 'gasto') : [];
    
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
  const totalGastoCalculado = categories.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Chart Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Análise de Gastos por Categoria
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
            Visualização detalhada da distribuição por categoria no período selecionado
          </p>
        </div>

        {/* View Badge: Por Categoria */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '10px' }}>
          <PieChart size={16} color="#2563eb" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb' }}>Por Categoria</span>
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
        <div style={{ fontWeight: 600, color: '#334155' }}>
          Distribuição dos Gastos
        </div>

     
      </div>

      {/* CATEGORY BREAKDOWN VIEW ONLY */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
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
          O gráfico consome e calcula métricas em tempo real dos gastos registrados por categoria.
        </span>
      </div>
    </div>
  );
};

export default ExpenseChart;
