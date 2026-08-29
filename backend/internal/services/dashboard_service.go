package services

import "controle-financeiro/backend/internal/models"

type DashboardService struct{}

func NewDashboardService() *DashboardService {
	return &DashboardService{}
}

func (s *DashboardService) GetSummary(totalIncome, totalExpense float64, month string) models.Summary {
	return models.Summary{
		TotalIncome:  totalIncome,
		TotalExpense: totalExpense,
		Balance:      totalIncome - totalExpense,
		Month:        month,
	}
}
