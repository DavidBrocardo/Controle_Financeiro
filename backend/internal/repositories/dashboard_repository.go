package repositories

import (
	"context"
	"controle-financeiro/backend/internal/models"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DashboardRepository interface {
	GetDashboardStats(ctx context.Context, usuarioID string, startDate, endDate string) (*models.DashboardStats, error)
}

type dashboardRepository struct {
	db *pgxpool.Pool
}

func NewDashboardRepository(db *pgxpool.Pool) DashboardRepository {
	return &dashboardRepository{db: db}
}

func (r *dashboardRepository) GetDashboardStats(ctx context.Context, usuarioID string, startDate, endDate string) (*models.DashboardStats, error) {
	stats := &models.DashboardStats{
		CategoryBreakdown: []models.CategoryBreakdown{},
		Transactions:      []models.DashboardTransaction{},
	}

	// 1. Total Entradas no período
	queryEntradas := `SELECT COALESCE(SUM(valor), 0) FROM entradas WHERE usuario_id = $1 AND data >= $2 AND data <= $3`
	err := r.db.QueryRow(ctx, queryEntradas, usuarioID, startDate, endDate).Scan(&stats.TotalEntradas)
	if err != nil {
		return nil, err
	}

	// 2. Total Gastos no período
	queryGastos := `SELECT COALESCE(SUM(valor), 0) FROM gastos WHERE usuario_id = $1 AND data >= $2 AND data <= $3`
	err = r.db.QueryRow(ctx, queryGastos, usuarioID, startDate, endDate).Scan(&stats.TotalGastos)
	if err != nil {
		return nil, err
	}

	stats.SaldoAtual = stats.TotalEntradas - stats.TotalGastos

	// 3. Média de Entradas (todos os meses agrupados)
	queryMediaEntradas := `
		SELECT COALESCE(AVG(mensal_total), 0) FROM (
			SELECT DATE_TRUNC('month', data), SUM(valor) as mensal_total 
			FROM entradas 
			WHERE usuario_id = $1 
			GROUP BY DATE_TRUNC('month', data)
		) sub
	`
	_ = r.db.QueryRow(ctx, queryMediaEntradas, usuarioID).Scan(&stats.MediaEntradas)

	// 4. Média de Gastos (todos os meses agrupados)
	queryMediaGastos := `
		SELECT COALESCE(AVG(mensal_total), 0) FROM (
			SELECT DATE_TRUNC('month', data), SUM(valor) as mensal_total 
			FROM gastos 
			WHERE usuario_id = $1 
			GROUP BY DATE_TRUNC('month', data)
		) sub
	`
	_ = r.db.QueryRow(ctx, queryMediaGastos, usuarioID).Scan(&stats.MediaGastos)

	// 5. Category Breakdown (no período e médias globais)
	queryCategories := `
		WITH periodo_gasto AS (
			SELECT c.nome as categoria, SUM(g.valor) as valor
			FROM gastos g
			JOIN categorias c ON g.categoria_id = c.id
			WHERE g.usuario_id = $1 AND g.data >= $2 AND g.data <= $3
			GROUP BY c.nome
		),
		medias_globais AS (
			SELECT c.nome as categoria, COALESCE(AVG(mensal_total), 0) as media_valor FROM (
				SELECT categoria_id, DATE_TRUNC('month', data) as mes, SUM(valor) as mensal_total
				FROM gastos
				WHERE usuario_id = $1
				GROUP BY categoria_id, DATE_TRUNC('month', data)
			) sub
			JOIN categorias c ON sub.categoria_id = c.id
			GROUP BY c.nome
		)
		SELECT 
			COALESCE(p.categoria, m.categoria), 
			COALESCE(p.valor, 0), 
			COALESCE(m.media_valor, 0)
		FROM periodo_gasto p
		FULL OUTER JOIN medias_globais m ON p.categoria = m.categoria
	`
	rows, err := r.db.Query(ctx, queryCategories, usuarioID, startDate, endDate)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var cat string
			var val, mediaVal float64
			if err := rows.Scan(&cat, &val, &mediaVal); err == nil {
				percentual := 0.0
				if stats.TotalGastos > 0 {
					percentual = (val / stats.TotalGastos) * 100
				}
				stats.CategoryBreakdown = append(stats.CategoryBreakdown, models.CategoryBreakdown{
					Categoria:  cat,
					Valor:      val,
					Percentual: percentual,
					MediaValor: mediaVal,
				})
			}
		}
	}

	// 6. Buscando transações recentes (entradas e gastos do período)
	queryTransacoes := `
		SELECT id, 'entrada' as tipo, descricao, valor, data, tipo as categoria, tipo as metodoPagamento
		FROM entradas WHERE usuario_id = $1 AND data >= $2 AND data <= $3
		UNION ALL
		SELECT g.id, 'gasto' as tipo, g.descricao, g.valor, g.data, c.nome as categoria, 'Desconhecido' as metodoPagamento
		FROM gastos g JOIN categorias c ON g.categoria_id = c.id
		WHERE g.usuario_id = $1 AND g.data >= $2 AND g.data <= $3
		ORDER BY data DESC
	`
	rowsTx, err := r.db.Query(ctx, queryTransacoes, usuarioID, startDate, endDate)
	if err == nil {
		defer rowsTx.Close()
		for rowsTx.Next() {
			var t models.DashboardTransaction
			var date time.Time
			if err := rowsTx.Scan(&t.ID, &t.Tipo, &t.Descricao, &t.Valor, &date, &t.Categoria, &t.MetodoPagamento); err == nil {
				t.Data = date.Format("2006-01-02")
				stats.Transactions = append(stats.Transactions, t)
			}
		}
	}

	return stats, nil
}
