package router

import (
	"controle-financeiro/backend/internal/config"
	"controle-financeiro/backend/internal/handler"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

// SetupRoutes registers all routes for the application, receiving a DB pool for handlers.
func SetupRoutes(r *gin.Engine, cfg config.Config, db *pgxpool.Pool) {
	// Health check
	r.GET("/health", handler.HealthHandler)

	// API group
	api := r.Group("/api")

	{
		// Gastos endpoint
		api.POST("/gastos", handler.NewGastoHandler(db).CreateGasto)
		// Entradas endpoint
		api.POST("/entradas", handler.NewEntradaHandler(db).CreateEntrada)
		// Metas endpoint
		api.GET("/metas", handler.NewMetaHandler(db).GetMeta)
		api.POST("/metas", handler.NewMetaHandler(db).UpsertMeta)
		api.POST("/prazoMetas", handler.NewMetaHandler(db).CalcularPrazoMeta)
		// Dashboard endpoint
		api.GET("/dashboard", handler.NewDashboardHandler(db).GetDashboardStats)
	}
}
