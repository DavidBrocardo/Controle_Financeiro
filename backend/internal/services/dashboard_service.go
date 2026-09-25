package services

import (
	"context"
	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
)

type DashboardService interface {
	GetDashboardStats(ctx context.Context, usuarioID, startDate, endDate string) (*models.DashboardStats, error)
}

type dashboardService struct {
	repo repositories.DashboardRepository
}

func NewDashboardService(repo repositories.DashboardRepository) DashboardService {
	return &dashboardService{repo: repo}
}

func (s *dashboardService) GetDashboardStats(ctx context.Context, usuarioID, startDate, endDate string) (*models.DashboardStats, error) {
	return s.repo.GetDashboardStats(ctx, usuarioID, startDate, endDate)
}
