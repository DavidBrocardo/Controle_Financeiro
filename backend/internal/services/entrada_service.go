package services

import (
	"context"

	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
)

type EntradaService struct {
	entradaRepo *repositories.EntradaRepository
	saldoRepo   *repositories.SaldoRepository
}

func NewEntradaService(entradaRepo *repositories.EntradaRepository, saldoRepo *repositories.SaldoRepository) *EntradaService {
	return &EntradaService{
		entradaRepo: entradaRepo,
		saldoRepo:   saldoRepo,
	}
}

// CriarEntrada persiste a entrada e credita o valor no saldo do usuário.
func (s *EntradaService) CriarEntrada(ctx context.Context, e *models.Entrada) error {
	if err := s.entradaRepo.Create(ctx, e); err != nil {
		return err
	}
	return s.saldoRepo.CreditarEntrada(ctx, e.UsuarioID, e.Valor)
}
