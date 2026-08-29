import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  MinusCircle, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Tag, 
  CreditCard, 
  DollarSign,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';
import { 
  registrarGastoAPI, 
  registrarEntradaAPI, 
  fetchTodasTransacoes, 
  removerTransacao, 
  Transaction 
} from '../services/api';

const RegistroPage: React.FC = () => {
  const [activeFormTab, setActiveFormTab] = useState<'gasto' | 'entrada'>('gasto');
  const [transacoes, setTransacoes] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields State
  const [valor, setValor] = useState<string>('');
  const [descricao, setDescricao] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('Alimentação & Restaurantes');
  const [dataTxn, setDataTxn] = useState<string>(new Date().toISOString().split('T')[0]);
  const [tipoPagamento, setTipoPagamento] = useState<string>('Pix');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Load registered transactions on mount
  useEffect(() => {
    setTransacoes(fetchTodasTransacoes());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSubmitGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (!valor || isNaN(valNum) || valNum <= 0) {
      alert("Por favor, insira um valor válido maior que zero.");
      return;
    }
    if (!descricao.trim()) {
      alert("Por favor, preencha a descrição do gasto.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Consumir API POST /api/gastos com a estrutura exata esperada pelo backend
      await registrarGastoAPI(
        descricao.trim(),
        valNum,
        categoria,
        dataTxn,
        tipoPagamento
      );

      showToast(`Gasto de R$ ${valNum.toFixed(2)} registrado e enviado para o backend!`);
      
      // Clear form & reload list
      setValor('');
      setDescricao('');
      setTransacoes(fetchTodasTransacoes());
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar gasto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    const valNum = parseFloat(valor);
    if (!valor || isNaN(valNum) || valNum <= 0) {
      alert("Por favor, insira um valor válido maior que zero.");
      return;
    }
    if (!descricao.trim()) {
      alert("Por favor, preencha a descrição da entrada.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Consumir API POST /api/entradas com a estrutura exata esperada pelo backend
      await registrarEntradaAPI(
        descricao.trim(),
        valNum,
        dataTxn,
        tipoPagamento
      );

      showToast(`Entrada de R$ ${valNum.toFixed(2)} registrada e enviada para o backend!`);
      
      // Clear form & reload list
      setValor('');
      setDescricao('');
      setTransacoes(fetchTodasTransacoes());
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar entrada.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    const updated = removerTransacao(id);
    setTransacoes(updated);
    showToast("Transação removida com sucesso.");
  };

  // Filter transactions by search string
  const filteredTransacoes = transacoes.filter(t => 
    t.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          zIndex: 1000,
          borderLeft: '4px solid #10b981'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>{toastMessage}</span>
        </div>
      )}

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
          Registro Financeiro
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>
          Registre gastos e entrada de valores e envie para as APIs do backend
        </p>
      </div>

      {/* FORM CARD */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        {/* Form Tab Switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button
            onClick={() => { setActiveFormTab('gasto'); setCategoria('Alimentação & Restaurantes'); }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px',
              border: 'none',
              backgroundColor: activeFormTab === 'gasto' ? '#ffffff' : 'transparent',
              color: activeFormTab === 'gasto' ? '#ef4444' : '#64748b',
              fontWeight: activeFormTab === 'gasto' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer',
              borderBottom: activeFormTab === 'gasto' ? '3px solid #ef4444' : 'none'
            }}
          >
            <ArrowDownCircle size={18} color={activeFormTab === 'gasto' ? '#ef4444' : '#64748b'} />
            <span>Registrar Gasto (Despesa)</span>
          </button>

          <button
            onClick={() => { setActiveFormTab('entrada'); setCategoria('Salário & Remuneração'); }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '16px',
              border: 'none',
              backgroundColor: activeFormTab === 'entrada' ? '#ffffff' : 'transparent',
              color: activeFormTab === 'entrada' ? '#10b981' : '#64748b',
              fontWeight: activeFormTab === 'entrada' ? 700 : 500,
              fontSize: '15px',
              cursor: 'pointer',
              borderBottom: activeFormTab === 'entrada' ? '3px solid #10b981' : 'none'
            }}
          >
            <ArrowUpCircle size={18} color={activeFormTab === 'entrada' ? '#10b981' : '#64748b'} />
            <span>Registrar Entrada (Receita)</span>
          </button>
        </div>

        {/* Form Container */}
        <form 
          onSubmit={activeFormTab === 'gasto' ? handleSubmitGasto : handleSubmitEntrada}
          style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            {/* Valor */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Valor (R$) *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                backgroundColor: '#ffffff'
              }}>
                <DollarSign size={18} color="#64748b" />
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            {/* Descrição */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Descrição *
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                backgroundColor: '#ffffff'
              }}>
                <Receipt size={18} color="#64748b" />
                <input
                  type="text"
                  placeholder={activeFormTab === 'gasto' ? "Ex: Mercado do mês, Combustível" : "Ex: Salário, Projeto Cliente X"}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  required
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>
            </div>

            {/* Categoria / Origem */}
            {activeFormTab === 'gasto' && (
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Categoria *
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  backgroundColor: '#ffffff'
                }}>
                  <Tag size={18} color="#64748b" />
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '14px',
                      color: '#0f172a',
                      backgroundColor: 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="Alimentação & Restaurantes">Alimentação & Restaurantes</option>
                    <option value="Moradia & Contas">Moradia & Contas</option>
                    <option value="Transporte & Combustível">Transporte & Combustível</option>
                    <option value="Lazer & Entretenimento">Lazer & Entretenimento</option>
                    <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                    <option value="Educação & Cursos">Educação & Cursos</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
            )}

            {/* Data */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                Data *
              </label>
              <input
                type="date"
                value={dataTxn}
                onChange={(e) => setDataTxn(e.target.value)}
                required
                style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '14px',
                  color: '#0f172a',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>

            {/* Forma de Pagamento / Tipo */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                {activeFormTab === 'gasto' ? 'Forma de Pagamento' : 'Tipo de Entrada (tipo)'}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                backgroundColor: '#ffffff'
              }}>
                <CreditCard size={18} color="#64748b" />
                <select
                  value={tipoPagamento}
                  onChange={(e) => setTipoPagamento(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '14px',
                    color: '#0f172a',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Pix">Pix</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Vale">Vale</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeFormTab === 'gasto' ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: activeFormTab === 'gasto' 
                  ? '0 4px 12px rgba(239, 68, 68, 0.25)' 
                  : '0 4px 12px rgba(16, 185, 129, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              {activeFormTab === 'gasto' ? <MinusCircle size={18} /> : <PlusCircle size={18} />}
              <span>
                {isSubmitting 
                  ? 'Enviando...' 
                  : activeFormTab === 'gasto' ? 'Salvar Gasto (POST /api/gastos)' : 'Salvar Entrada (POST /api/entradas)'}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* TRANSACTIONS LIST TABLE */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Table Header & Search Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Histórico de Lançamentos Registrados
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
              Todas as movimentações cadastradas no sistema
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#f1f5f9',
            borderRadius: '10px',
            padding: '8px 14px',
            width: '280px'
          }}>
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Filtrar por descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '13px',
                width: '100%'
              }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                <th style={{ padding: '12px 16px' }}>Tipo</th>
                <th style={{ padding: '12px 16px' }}>Descrição</th>
                <th style={{ padding: '12px 16px' }}>Categoria / Tipo</th>
                <th style={{ padding: '12px 16px' }}>Data</th>
                <th style={{ padding: '12px 16px' }}>Forma</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Valor (R$)</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransacoes.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    Nenhuma transação encontrada.
                  </td>
                </tr>
              ) : (
                filteredTransacoes.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    {/* Badge Tipo */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: item.tipo === 'entrada' ? '#d1fae5' : '#fee2e2',
                        color: item.tipo === 'entrada' ? '#047857' : '#b91c1c',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {item.tipo === 'entrada' ? '▲ Entrada' : '▼ Gasto'}
                      </span>
                    </td>

                    {/* Descrição */}
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                      {item.descricao}
                    </td>

                    {/* Categoria */}
                    <td style={{ padding: '14px 16px', color: '#475569' }}>
                      {item.categoria}
                    </td>

                    {/* Data */}
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {item.data}
                    </td>

                    {/* Forma */}
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>
                      {item.metodoPagamento || 'Pix'}
                    </td>

                    {/* Valor */}
                    <td style={{
                      padding: '14px 16px',
                      textAlign: 'right',
                      fontWeight: 800,
                      fontSize: '14px',
                      color: item.tipo === 'entrada' ? '#10b981' : '#ef4444'
                    }}>
                      {item.tipo === 'entrada' ? '+' : '-'} {item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>

                    {/* Ação */}
                    <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '6px',
                          borderRadius: '6px',
                          transition: 'color 0.15s ease'
                        }}
                        title="Remover"
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistroPage;
