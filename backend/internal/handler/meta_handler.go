package handler

import (
	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
	"controle-financeiro/backend/internal/services"
	"math"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type MetaHandler struct {
	service          services.MetaService
	dashboardService services.DashboardService
}

func NewMetaHandler(db *pgxpool.Pool) *MetaHandler {
	repo := repositories.NewMetaRepository(db)
	metaSvc := services.NewMetaService(repo)

	dashboardRepo := repositories.NewDashboardRepository(db)
	dashboardSvc := services.NewDashboardService(dashboardRepo)

	return &MetaHandler{
		service:          metaSvc,
		dashboardService: dashboardSvc,
	}
}

func (h *MetaHandler) GetMeta(c *gin.Context) {
	usuarioID := c.Query("usuario_id")
	if usuarioID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuario_id is required"})
		return
	}

	meta, err := h.service.GetMeta(c.Request.Context(), usuarioID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Metas not found"})
		return
	}

	c.JSON(http.StatusOK, meta)
}

func (h *MetaHandler) UpsertMeta(c *gin.Context) {
	var meta models.Meta
	if err := c.ShouldBindJSON(&meta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if meta.UsuarioID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuario_id is required"})
		return
	}

	if err := h.service.UpsertMeta(c.Request.Context(), &meta); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Metas saved successfully"})
}

func (h *MetaHandler) CalcularPrazoMeta(c *gin.Context) {
	var meta models.Meta
	if err := c.ShouldBindJSON(&meta); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if meta.UsuarioID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuario_id is required"})
		return
	}
	if meta.ObjetivoEconomiaTotal == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "objetivo_economia_total is required"})
		return
	}

	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" || endDate == "" {
		now := time.Now()
		startDate = time.Date(now.Year(), now.Month()-1, 1, 0, 0, 0, 0, now.Location()).Format("2006-01-02")
		endDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).Format("2006-01-02")
	}

	stats, err := h.dashboardService.GetDashboardStats(c.Request.Context(), meta.UsuarioID, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	stats.SaldoAtual = stats.TotalEntradas - stats.TotalGastos

	if stats.SaldoAtual <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "O saldo atual (entradas - gastos) é zero ou negativo. É impossível calcular o prazo de economia neste ritmo.",
		})
		return
	}

	var quantidadeMeses = math.Ceil(meta.ObjetivoEconomiaTotal / stats.SaldoAtual)

	c.JSON(http.StatusOK, gin.H{
		"quantidade_meses": int(quantidadeMeses),
		"saldo_mensal":     stats.SaldoAtual,
	})
}
