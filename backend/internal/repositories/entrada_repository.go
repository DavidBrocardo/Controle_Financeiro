package repositories

import (
	"context"
	"time"

	"controle-financeiro/backend/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EntradaRepository struct {
	db *pgxpool.Pool
}

func NewEntradaRepository(db *pgxpool.Pool) *EntradaRepository {
	return &EntradaRepository{db: db}
}

// Create insere uma nova entrada no banco e preenche ID e CriadoEm.
func (r *EntradaRepository) Create(ctx context.Context, e *models.Entrada) error {
	e.ID = uuid.New().String()
	e.CriadoEm = time.Now()

	_, err := r.db.Exec(ctx,
		`INSERT INTO entradas (id, usuario_id, descricao, valor, data, tipo, criado_em)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		e.ID, e.UsuarioID, e.Descricao, e.Valor, e.Data, string(e.Tipo), e.CriadoEm,
	)
	return err
}

// ListByUsuario retorna todas as entradas de um usuário.
func (r *EntradaRepository) ListByUsuario(ctx context.Context, usuarioID string) ([]*models.Entrada, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, usuario_id, descricao, valor, data, tipo, criado_em
		 FROM entradas WHERE usuario_id = $1 ORDER BY data DESC`,
		usuarioID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entradas []*models.Entrada
	for rows.Next() {
		var e models.Entrada
		var tipo string
		if err := rows.Scan(&e.ID, &e.UsuarioID, &e.Descricao, &e.Valor, &e.Data, &tipo, &e.CriadoEm); err != nil {
			return nil, err
		}
		e.Tipo = models.TipoEntrada(tipo)
		entradas = append(entradas, &e)
	}
	return entradas, rows.Err()
}
