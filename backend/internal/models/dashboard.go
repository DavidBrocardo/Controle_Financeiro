package models

// Summary provides a simplified financial overview.
type Summary struct {
	TotalIncome  float64 `json:"total_income"`
	TotalExpense float64 `json:"total_expense"`
	Balance      float64 `json:"balance"`
	Month        string  `json:"month"`
}
