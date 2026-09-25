package services

import (
	"context"
	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
)

type MetaService interface {
	GetMeta(ctx context.Context, usuarioID string) (*models.Meta, error)
	UpsertMeta(ctx context.Context, meta *models.Meta) error
}

type metaService struct {
	repo repositories.MetaRepository
}

func NewMetaService(repo repositories.MetaRepository) MetaService {
	return &metaService{repo: repo}
}

func (s *metaService) GetMeta(ctx context.Context, usuarioID string) (*models.Meta, error) {
	return s.repo.GetMetaByUsuarioID(ctx, usuarioID)
}

func (s *metaService) UpsertMeta(ctx context.Context, meta *models.Meta) error {
	return s.repo.UpsertMeta(ctx, meta)
}
