// src/services/api.ts

// Modelo de payload exato esperado pelo backend para a tabela e struct "gastos"
export interface GastoPayload {
  usuario_id: string;     // UUID do usuário
  categoria_id: string;   // UUID da categoria
  valor: number;          // Valor numérico (NUMERIC > 0)
  data: string;           // Data em formato ISO (ex: "2026-08-22T00:00:00Z")
  descricao: string;      // Descrição do gasto
}

// Modelo de payload exato esperado pelo backend para a tabela "entradas"
export interface EntradaPayload {
  usuario_id: string;     // UUID do usuário
  descricao: string;      // Descrição da entrada
  valor: number;          // Valor numérico (NUMERIC > 0)
  data: string;           // Data em formato ISO (ex: "2026-08-22T00:00:00Z")
  tipo: string;           // Tipo/Forma da entrada (ex: Pix, Dinheiro, Vale, etc.)
}

export interface Transaction {
  id: string;
  tipo: 'gasto' | 'entrada';
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  metodoPagamento?: string;
  usuario_id?: string;
  categoria_id?: string;
}

const LOCAL_STORAGE_TXNS_KEY = 'finance_flow_transactions_v1';

// Mapeamento auxiliar de Categoria para UUIDs válidos (conforme tabela categorias no backend)
export const CATEGORY_UUID_MAP: { [key: string]: string } = {
  'Alimentação & Restaurantes': '10000000-0000-0000-0000-000000000001',
  'Moradia & Contas': '10000000-0000-0000-0000-000000000002',
  'Transporte & Combustível': '10000000-0000-0000-0000-000000000003',
  'Lazer & Entretenimento': '10000000-0000-0000-0000-000000000004',
  'Saúde & Bem-estar': '10000000-0000-0000-0000-000000000005',
  'Educação & Cursos': '10000000-0000-0000-0000-000000000006',
  'Outros': '10000000-0000-0000-0000-000000000007',
};

export const DEFAULT_USER_UUID = '00000000-0000-0000-0000-000000000001';

// Transações iniciais salvas em memória local para fallback suave
const getInitialStoredTransactions = (): Transaction[] => {
  const saved = localStorage.getItem(LOCAL_STORAGE_TXNS_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return [];
};

// Health Check do Backend (/health ou /api/health)
export const checkHealth = async (): Promise<{ status: string }> => {
  try {
    const response = await fetch('/health');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Backend API /health indisponível no momento. Operando no modo local/offline:", error);
    throw error;
  }
};

// Consumo da API POST /api/gastos
export const registrarGastoAPI = async (
  descricao: string,
  valor: number,
  categoriaNome: string,
  dataString: string,
  formaPagamento: string
): Promise<{ success: boolean; data: any }> => {
  const categoriaId = CATEGORY_UUID_MAP[categoriaNome] || CATEGORY_UUID_MAP['Outros'];
  const dataISO = dataString ? new Date(dataString).toISOString() : new Date().toISOString();

  // Payload formatado EXATAMENTE como o backend Go e o banco PostgreSQL esperam
  const payload: GastoPayload = {
    usuario_id: DEFAULT_USER_UUID,
    categoria_id: categoriaId,
    valor: valor,
    data: dataISO,
    descricao: descricao,
  };

  let responseData = null;

  try {
    const response = await fetch('/api/gastos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      responseData = await response.json();
    } else {
      console.warn(`Backend respondeu com status ${response.status}`);
    }
  } catch (err) {
    console.warn("Não foi possível alcançar POST /api/gastos do backend. Salvando localmente.", err);
  }

  // Atualiza estado local
  const newTxn: Transaction = {
    id: responseData?.data?.id || `gasto-${Date.now()}`,
    tipo: 'gasto',
    descricao: payload.descricao,
    valor: payload.valor,
    data: dataString || new Date().toISOString().split('T')[0],
    categoria: categoriaNome,
    metodoPagamento: formaPagamento,
    usuario_id: payload.usuario_id,
    categoria_id: payload.categoria_id,
  };

  const current = getInitialStoredTransactions();
  const updated = [newTxn, ...current];
  localStorage.setItem(LOCAL_STORAGE_TXNS_KEY, JSON.stringify(updated));

  return {
    success: true,
    data: newTxn,
  };
};

// Consumo da API POST /api/entradas
export const registrarEntradaAPI = async (
  descricao: string,
  valor: number,
  dataString: string,
  tipo: string
): Promise<{ success: boolean; data: any }> => {
  const dataISO = dataString ? new Date(dataString).toISOString() : new Date().toISOString();

  // Payload formatado EXATAMENTE como a tabela "entradas" do PostgreSQL e backend Go esperam
  const payload: EntradaPayload = {
    usuario_id: DEFAULT_USER_UUID,
    descricao: descricao,
    valor: valor,
    data: dataISO,
    tipo: tipo, // Pix, Dinheiro, Vale, etc.
  };

  let responseData = null;

  try {
    const response = await fetch('/api/entradas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      responseData = await response.json();
    } else {
      console.warn(`Backend respondeu com status ${response.status}`);
    }
  } catch (err) {
    console.warn("Não foi possível alcançar POST /api/entradas do backend. Salvando localmente.", err);
  }

  // Atualiza estado local
  const newTxn: Transaction = {
    id: responseData?.data?.id || `entrada-${Date.now()}`,
    tipo: 'entrada',
    descricao: payload.descricao,
    valor: payload.valor,
    data: dataString || new Date().toISOString().split('T')[0],
    categoria: tipo,
    metodoPagamento: tipo,
    usuario_id: payload.usuario_id,
  };

  const current = getInitialStoredTransactions();
  const updated = [newTxn, ...current];
  localStorage.setItem(LOCAL_STORAGE_TXNS_KEY, JSON.stringify(updated));

  return {
    success: true,
    data: newTxn,
  };
};

export const fetchTodasTransacoes = (): Transaction[] => {
  return getInitialStoredTransactions();
};

export const removerTransacao = (id: string): Transaction[] => {
  const current = getInitialStoredTransactions();
  const updated = current.filter(t => t.id !== id);
  localStorage.setItem(LOCAL_STORAGE_TXNS_KEY, JSON.stringify(updated));
  return updated;
};

export interface Meta {
  id?: string;
  usuario_id: string;
  meta_gasto_mensal: number;
  meta_economia_mensal: number;
  objetivo_economia_total: number;
  quantidade_meses?: number;
}

export const fetchDashboardStats = async (startDate: string, endDate: string) => {
  try {
    const response = await fetch(`/api/dashboard?usuario_id=${DEFAULT_USER_UUID}&start_date=${startDate}&end_date=${endDate}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn("Failed to fetch dashboard stats from API, using fallback", error);
  }

  // Fallback to local storage logic if backend fails
  const txns = fetchTodasTransacoes();
  
  const totalEntradas = txns.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalGastos = txns.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.valor, 0);
  const saldoAtual = totalEntradas - totalGastos;
  const mediaGastos = totalGastos;
  const mediaEntradas = totalEntradas;

  const gastosCatMap: { [cat: string]: number } = {};
  txns.filter(t => t.tipo === 'gasto').forEach(t => {
    gastosCatMap[t.categoria] = (gastosCatMap[t.categoria] || 0) + t.valor;
  });

  const categoryBreakdown = Object.keys(gastosCatMap).map(cat => ({
    categoria: cat,
    valor: gastosCatMap[cat],
    percentual: totalGastos > 0 ? (gastosCatMap[cat] / totalGastos) * 100 : 0,
    mediaValor: 0
  }));

  return {
    totalEntradas,
    totalGastos,
    saldoAtual,
    mediaGastos,
    mediaEntradas,
    categoryBreakdown,
    transactions: txns,
  };
};

export const fetchMetas = async (): Promise<Meta | null> => {
  try {
    const response = await fetch(`/api/metas?usuario_id=${DEFAULT_USER_UUID}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch metas", error);
  }
  return null;
};

export const salvarMetas = async (meta: Meta): Promise<boolean> => {
  meta.usuario_id = DEFAULT_USER_UUID;
  try {
    const response = await fetch('/api/metas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meta),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to save metas", error);
    return false;
  }
};


export const calcularPrazoMeta = async (meta: Meta) => {
    meta.usuario_id = DEFAULT_USER_UUID; 

    try {
      // Mudei para POST, pois o backend usa c.ShouldBindJSON
      const response = await fetch('/api/prazoMetas', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: meta.usuario_id,
          objetivo_economia_total: meta.objetivo_economia_total
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular a meta');
      }
      meta.quantidade_meses = data.quantidade_meses;
      return meta; 
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
};

