import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { fetchMetas, salvarMetas, Meta, fetchDashboardStats, calcularPrazoMeta } from '../services/api';

const MetasPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [metaGasto, setMetaGasto] = useState<number>(0);
  const [metaEconomia, setMetaEconomia] = useState<number>(0);
  const [objetivoTotal, setObjetivoTotal] = useState<number>(0);
  
  const [mediaEntrada, setMediaEntrada] = useState<number>(0);
  const [mediaGasto, setMediaGasto] = useState<number>(0);
  const [mesesReal, setMesesReal] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (objetivoTotal > 0) {
      calcularPrazoMeta({
        usuario_id: '',
        meta_gasto_mensal: metaGasto,
        meta_economia_mensal: metaEconomia,
        objetivo_economia_total: objetivoTotal,
      })
        .then((res) => {
          if (res && res.quantidade_meses !== undefined) {
            setMesesReal(res.quantidade_meses);
          }
        })
        .catch((err) => {
          console.warn("Erro ao calcular prazo no backend:", err);
          // Fallback para cálculo local se o backend estiver indisponível
          const saldoLivre = mediaEntrada - mediaGasto;
          if (saldoLivre > 0) {
            setMesesReal(Math.ceil(objetivoTotal / saldoLivre));
          }
        });
    }
  }, [objetivoTotal, metaGasto, metaEconomia, mediaEntrada, mediaGasto]);

  const loadData = async () => {
    setLoading(true);
    // Fetch user's metas
    const metas = await fetchMetas();
    if (metas) {
      setMetaGasto(metas.meta_gasto_mensal || 0);
      setMetaEconomia(metas.meta_economia_mensal || 0);
      setObjetivoTotal(metas.objetivo_economia_total || 0);
    }

    // Fetch averages (passing full previous month for accurate monthly stats)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    const stats = await fetchDashboardStats(startDate, endDate);
    
    setMediaEntrada(stats.mediaEntradas || 0);
    setMediaGasto(stats.mediaGastos || 0);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const meta: Meta = {
      usuario_id: '',
      meta_gasto_mensal: metaGasto,
      meta_economia_mensal: metaEconomia,
      objetivo_economia_total: objetivoTotal,
    };
    
    await salvarMetas(meta);
    setSaving(false);
    alert('Metas salvas com sucesso!');
  };

  const saldoLivreAtual = mediaEntrada - mediaGasto;

  let mesesMeta = 0;
  if (metaEconomia > 0 && objetivoTotal > 0) {
    mesesMeta = Math.ceil(objetivoTotal / metaEconomia);
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Metas Financeiras
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Defina seus limites de gastos e planeje sua economia futura.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* Formulário de Metas */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            <Target size={20} color="#3b82f6" />
            Suas Metas
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Meta de Gasto Mensal (Limite)</label>
              <input 
                type="number"
                value={metaGasto}
                onChange={(e) => setMetaGasto(Number(e.target.value))}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                min="0"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Meta de Economia Mensal</label>
              <input 
                type="number"
                value={metaEconomia}
                onChange={(e) => setMetaEconomia(Number(e.target.value))}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                min="0"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>Objetivo Total de Economia</label>
              <input 
                type="number"
                value={objetivoTotal}
                onChange={(e) => setObjetivoTotal(Number(e.target.value))}
                style={{ padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                min="0"
              />
            </div>

            
          </form>
        </div>

        {/* Projeções */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>
            <TrendingUp size={20} color="#10b981" />
            Projeções
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Informações Atuais */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Sua Realidade Atual</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ fontWeight: 500 }}>Média de Entradas:</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{mediaEntrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ fontWeight: 500 }}>Média de Gastos:</span>
                <span style={{ fontWeight: 700, color: '#ef4444' }}>{mediaGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px dashed #cbd5e1', paddingTop: '10px' }}>
                <span style={{ fontWeight: 500 }}>Capacidade de Poupar (Média):</span>
                <span style={{ fontWeight: 700, color: saldoLivreAtual > 0 ? '#3b82f6' : '#ef4444' }}>
                  {saldoLivreAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>

            {/* Aviso Predição */}
            {objetivoTotal > 0 && (
              <div style={{ marginTop: '10px' }}>
                <h4 style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                  Previsão para atingir {objetivoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: '#eff6ff', padding: '12px', borderRadius: '8px' }}>
                    <Calendar size={20} color="#3b82f6" style={{ marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a' }}>Se seguir a Meta de Economia</p>
                      <p style={{ fontSize: '13px', color: '#1e3a8a', opacity: 0.8 }}>
                        {mesesMeta > 0 ? `Levará ${mesesMeta} meses para atingir o objetivo (poupando ${metaEconomia.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês).` : 'A meta mensal precisa ser maior que zero.'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', backgroundColor: saldoLivreAtual > 0 ? '#f0fdf4' : '#fef2f2', padding: '12px', borderRadius: '8px' }}>
                    <AlertCircle size={20} color={saldoLivreAtual > 0 ? "#10b981" : "#ef4444"} style={{ marginTop: '2px' }} />
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: saldoLivreAtual > 0 ? '#166534' : '#991b1b' }}>Com sua Realidade Atual</p>
                      <p style={{ fontSize: '13px', color: saldoLivreAtual > 0 ? '#166534' : '#991b1b', opacity: 0.8 }}>
                        {mesesReal > 0 
                          ? `Levará ${mesesReal} meses se continuar sobrando apenas ${saldoLivreAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} por mês.` 
                          : 'Sua média de gastos está maior ou igual à de entradas. Você não conseguirá atingir o objetivo.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetasPage;
