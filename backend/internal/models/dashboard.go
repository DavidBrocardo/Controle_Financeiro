package models

type DashboardStats struct {
	TotalEntradas       float64                 `json:"totalEntradas"`
	TotalGastos         float64                 `json:"totalGastos"`
	SaldoAtual          float64                 `json:"saldoAtual"`
	MediaGastos         float64                 `json:"mediaGastos"`
	MediaEntradas       float64                 `json:"mediaEntradas"`
	CategoryBreakdown   []CategoryBreakdown     `json:"categoryBreakdown"`
	Transactions        []DashboardTransaction  `json:"transactions"`
}

type CategoryBreakdown struct {
	Categoria  string  `json:"categoria"`
	Valor      float64 `json:"valor"`
	Percentual float64 `json:"percentual"`
	MediaValor float64 `json:"mediaValor"`
}

type DashboardTransaction struct {
	ID              string  `json:"id"`
	Tipo            string  `json:"tipo"`
	Descricao       string  `json:"descricao"`
	Valor           float64 `json:"valor"`
	Data            string  `json:"data"`
	Categoria       string  `json:"categoria"`
	MetodoPagamento string  `json:"metodoPagamento,omitempty"`
}
