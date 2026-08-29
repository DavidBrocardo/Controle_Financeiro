package services

import "controle-financeiro/backend/internal/models"

type TransactionService struct{}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}

func (s *TransactionService) CreateTransaction(userID, categoryID, description string, amount float64, kind models.TransactionType) models.Transaction {
	return models.Transaction{
		ID:          "txn-generated-id",
		UserID:      userID,
		CategoryID:  categoryID,
		Description: description,
		Amount:      amount,
		Type:        kind,
		OccurredAt:  "2026-08-09T00:00:00Z",
	}
}
