package repositories

import (
	"context"
	"controle-financeiro/backend/internal/models"

	"github.com/jackc/pgx/v5/pgxpool"
)

type MetaRepository interface {
	GetMetaByUsuarioID(ctx context.Context, usuarioID string) (*models.Meta, error)
	UpsertMeta(ctx context.Context, meta *models.Meta) error
}

type metaRepository struct {
	db *pgxpool.Pool
}

func NewMetaRepository(db *pgxpool.Pool) MetaRepository {
	return &metaRepository{db: db}
}

func (r *metaRepository) GetMetaByUsuarioID(ctx context.Context, usuarioID string) (*models.Meta, error) {
	query := `
		SELECT id, usuario_id, meta_gasto_mensal, meta_economia_mensal, objetivo_economia_total, criado_em, atualizado_em
		FROM metas
		WHERE usuario_id = $1
	`
	row := r.db.QueryRow(ctx, query, usuarioID)

	var meta models.Meta
	err := row.Scan(
		&meta.ID,
		&meta.UsuarioID,
		&meta.MetaGastoMensal,
		&meta.MetaEconomiaMensal,
		&meta.ObjetivoEconomiaTotal,
		&meta.CriadoEm,
		&meta.AtualizadoEm,
	)
	if err != nil {
		return nil, err
	}

	return &meta, nil
}

func (r *metaRepository) UpsertMeta(ctx context.Context, meta *models.Meta) error {
	query := `
		INSERT INTO metas (usuario_id, meta_gasto_mensal, meta_economia_mensal, objetivo_economia_total)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (usuario_id) DO UPDATE SET
			meta_gasto_mensal = EXCLUDED.meta_gasto_mensal,
			meta_economia_mensal = EXCLUDED.meta_economia_mensal,
			objetivo_economia_total = EXCLUDED.objetivo_economia_total,
			atualizado_em = now()
	`
	_, err := r.db.Exec(ctx, query, meta.UsuarioID, meta.MetaGastoMensal, meta.MetaEconomiaMensal, meta.ObjetivoEconomiaTotal)
	return err
}
