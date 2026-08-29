package services

import "controle-financeiro/backend/internal/models"

type BudgetService struct{}

func NewBudgetService() *BudgetService {
	return &BudgetService{}
}

func (s *BudgetService) CreateOrcamento(userID, categoryID, period string, amount float64) models.Orcamento {
	return models.Orcamento{
		ID:         "budget-generated-id",
		UserID:     userID,
		CategoryID: categoryID,
		Amount:     amount,
		Period:     period,
		CreatedAt:  "2026-08-09T00:00:00Z",
	}
}
