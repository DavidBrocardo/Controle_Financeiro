package repositories

import (
	"context"
	"errors"
	"time"

	"controle-financeiro/backend/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

var ErrSaldoInsuficiente = errors.New("saldo insuficiente")

type SaldoRepository struct {
	db *pgxpool.Pool
}

func NewSaldoRepository(db *pgxpool.Pool) *SaldoRepository {
	return &SaldoRepository{db: db}
}

// GetByUsuario retorna o saldo do usuário; cria um registro zerado se não existir.
func (r *SaldoRepository) GetByUsuario(ctx context.Context, usuarioID string) (*models.Saldo, error) {
	var s models.Saldo
	err := r.db.QueryRow(ctx,
		`SELECT id, usuario_id, saldo_atual, atualizado_em FROM saldo WHERE usuario_id = $1`,
		usuarioID,
	).Scan(&s.ID, &s.UsuarioID, &s.SaldoAtual, &s.AtualizadoEm)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Cria saldo zerado automaticamente
			return r.criarSaldoZerado(ctx, usuarioID)
		}
		return nil, err
	}
	return &s, nil
}

func (r *SaldoRepository) criarSaldoZerado(ctx context.Context, usuarioID string) (*models.Saldo, error) {
	s := &models.Saldo{
		ID:           uuid.New().String(),
		UsuarioID:    usuarioID,
		SaldoAtual:   0,
		AtualizadoEm: time.Now(),
	}
	_, err := r.db.Exec(ctx,
		`INSERT INTO saldo (id, usuario_id, saldo_atual, atualizado_em) VALUES ($1, $2, $3, $4)`,
		s.ID, s.UsuarioID, s.SaldoAtual, s.AtualizadoEm,
	)
	if err != nil {
		return nil, err
	}
	return s, nil
}

// DebitarGasto desconta o valor do saldo usando transação com lock (FOR UPDATE).
// Retorna ErrSaldoInsuficiente se o saldo for menor que o valor.
func (r *SaldoRepository) DebitarGasto(ctx context.Context, usuarioID string, valor float64) error {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	var saldoAtual float64
	err = tx.QueryRow(ctx,
		`SELECT saldo_atual FROM saldo WHERE usuario_id = $1 FOR UPDATE`,
		usuarioID,
	).Scan(&saldoAtual)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrSaldoInsuficiente
		}
		return err
	}

	if saldoAtual < valor {
		return ErrSaldoInsuficiente
	}

	_, err = tx.Exec(ctx,
		`UPDATE saldo SET saldo_atual = saldo_atual - $1, atualizado_em = $2 WHERE usuario_id = $3`,
		valor, time.Now(), usuarioID,
	)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// CreditarEntrada soma o valor ao saldo do usuário.
func (r *SaldoRepository) CreditarEntrada(ctx context.Context, usuarioID string, valor float64) error {
	// Garante que existe um registro de saldo
	_, err := r.GetByUsuario(ctx, usuarioID)
	if err != nil {
		return err
	}

	_, err = r.db.Exec(ctx,
		`UPDATE saldo SET saldo_atual = saldo_atual + $1, atualizado_em = $2 WHERE usuario_id = $3`,
		valor, time.Now(), usuarioID,
	)
	return err
}
