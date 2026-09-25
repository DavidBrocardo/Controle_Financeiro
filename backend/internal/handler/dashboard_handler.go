package handler

import (
	"net/http"
	"time"
	"controle-financeiro/backend/internal/services"
	"controle-financeiro/backend/internal/repositories"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DashboardHandler struct {
	service services.DashboardService
}

func NewDashboardHandler(db *pgxpool.Pool) *DashboardHandler {
	repo := repositories.NewDashboardRepository(db)
	svc := services.NewDashboardService(repo)
	return &DashboardHandler{service: svc}
}

func (h *DashboardHandler) GetDashboardStats(c *gin.Context) {
	usuarioID := c.Query("usuario_id")
	if usuarioID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "usuario_id is required"})
		return
	}

	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	if startDate == "" || endDate == "" {
		now := time.Now()
		startDate = time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location()).Format("2006-01-02")
		endDate = now.Format("2006-01-02")
	}

	stats, err := h.service.GetDashboardStats(c.Request.Context(), usuarioID, startDate, endDate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, stats)
}
