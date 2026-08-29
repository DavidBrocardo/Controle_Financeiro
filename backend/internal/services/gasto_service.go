package services

import (
	"context"

	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
)

type GastoService struct {
	gastoRepo *repositories.GastoRepository
	saldoRepo *repositories.SaldoRepository
}

func NewGastoService(gastoRepo *repositories.GastoRepository, saldoRepo *repositories.SaldoRepository) *GastoService {
	return &GastoService{
		gastoRepo: gastoRepo,
		saldoRepo: saldoRepo,
	}
}

// CriarGasto valida saldo e persiste o gasto.
// Retorna repositories.ErrSaldoInsuficiente se não houver saldo.
func (s *GastoService) CriarGasto(ctx context.Context, g *models.Gasto) error {
	// Debitar já valida o saldo e faz a operação de forma atômica (transação)
	if err := s.saldoRepo.DebitarGasto(ctx, g.UsuarioID, g.Valor); err != nil {
		return err
	}
	return s.gastoRepo.Create(ctx, g)
}
