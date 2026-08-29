package models

// Orcamento representa um limite de gasto mensal para uma categoria.
type Orcamento struct {
	ID         string  `json:"id"`
	UserID     string  `json:"user_id"`
	CategoryID string  `json:"category_id"`
	Amount     float64 `json:"amount"`
	Period     string  `json:"period"`
	CreatedAt  string  `json:"created_at,omitempty"`
}
