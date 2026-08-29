package models

// Type defines the kind of financial movement.
type TransactionType string

const (
	Income  TransactionType = "income"
	Expense TransactionType = "expense"
)

// Transaction stores an income or expense operation.
type Transaction struct {
	ID          string          `json:"id"`
	UserID      string          `json:"user_id"`
	CategoryID  string          `json:"category_id"`
	Amount      float64         `json:"amount"`
	Type        TransactionType `json:"type"`
	Description string          `json:"description"`
	OccurredAt  string          `json:"occurred_at"`
}
