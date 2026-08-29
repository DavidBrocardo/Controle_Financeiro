package repositories

import (
	"context"
	"time"

	"controle-financeiro/backend/internal/models"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type GastoRepository struct {
	db *pgxpool.Pool
}

func NewGastoRepository(db *pgxpool.Pool) *GastoRepository {
	return &GastoRepository{db: db}
}

// Create insere um novo gasto no banco e preenche ID e CriadoEm no struct.
func (r *GastoRepository) Create(ctx context.Context, g *models.Gasto) error {
	g.ID = uuid.New().String()
	g.CriadoEm = time.Now()

	_, err := r.db.Exec(ctx,
		`INSERT INTO gastos (id, usuario_id, categoria_id, valor, data, descricao, criado_em)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		g.ID, g.UsuarioID, g.CategoriaID, g.Valor, g.Data, g.Descricao, g.CriadoEm,
	)
	return err
}

// ListByUsuario retorna todos os gastos de um usuário.
func (r *GastoRepository) ListByUsuario(ctx context.Context, usuarioID string) ([]*models.Gasto, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, usuario_id, categoria_id, valor, data, descricao, criado_em
		 FROM gastos WHERE usuario_id = $1 ORDER BY data DESC`,
		usuarioID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var gastos []*models.Gasto
	for rows.Next() {
		var g models.Gasto
		if err := rows.Scan(&g.ID, &g.UsuarioID, &g.CategoriaID, &g.Valor, &g.Data, &g.Descricao, &g.CriadoEm); err != nil {
			return nil, err
		}
		gastos = append(gastos, &g)
	}
	return gastos, rows.Err()
}
