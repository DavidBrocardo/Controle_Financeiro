package handler

import (
	"net/http"
	"time"

	"controle-financeiro/backend/internal/models"
	"controle-financeiro/backend/internal/repositories"
	"controle-financeiro/backend/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
)

type GastoHandler struct {
	service *services.GastoService
}

// NewGastoHandler constrói o handler injetando repositórios e service.
func NewGastoHandler(db *pgxpool.Pool) *GastoHandler {
	gastoRepo := repositories.NewGastoRepository(db)
	saldoRepo := repositories.NewSaldoRepository(db)
	svc := services.NewGastoService(gastoRepo, saldoRepo)
	return &GastoHandler{service: svc}
}

// CreateGasto handles POST /api/gastos
// Body: { "usuario_id", "categoria_id", "valor", "data" (YYYY-MM-DD), "descricao" }
func (h *GastoHandler) CreateGasto(c *gin.Context) {
	var req struct {
		UsuarioID   string  `json:"usuario_id"   binding:"required"`
		CategoriaID string  `json:"categoria_id" binding:"required"`
		Valor       float64 `json:"valor"        binding:"required,gt=0"`
		Data        string  `json:"data"         binding:"required"`
		Descricao   string  `json:"descricao"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	parsedDate, err := time.Parse("2006-01-02", req.Data)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "formato de data inválido, use YYYY-MM-DD"})
		return
	}

	gasto := &models.Gasto{
		UsuarioID:   req.UsuarioID,
		CategoriaID: req.CategoriaID,
		Valor:       req.Valor,
		Data:        parsedDate,
		Descricao:   req.Descricao,
	}

	if err := h.service.CriarGasto(c.Request.Context(), gasto); err != nil {
		if err == repositories.ErrSaldoInsuficiente {
			c.JSON(http.StatusUnprocessableEntity, gin.H{"error": "saldo insuficiente"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gasto)
}
