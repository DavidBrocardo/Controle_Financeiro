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

type EntradaHandler struct {
	service *services.EntradaService
}

// NewEntradaHandler constrói o handler injetando repositórios e service.
func NewEntradaHandler(db *pgxpool.Pool) *EntradaHandler {
	entradaRepo := repositories.NewEntradaRepository(db)
	saldoRepo := repositories.NewSaldoRepository(db)
	svc := services.NewEntradaService(entradaRepo, saldoRepo)
	return &EntradaHandler{service: svc}
}

// CreateEntrada handles POST /api/entradas
// Body: { "usuario_id", "descricao", "valor", "data" (YYYY-MM-DD), "tipo" (Dinheiro|Vale|Pix|TED|Outros) }
func (h *EntradaHandler) CreateEntrada(c *gin.Context) {
	var req struct {
		UsuarioID string  `json:"usuario_id" binding:"required"`
		Descricao string  `json:"descricao"  binding:"required"`
		Valor     float64 `json:"valor"      binding:"required,gt=0"`
		Data      string  `json:"data"       binding:"required"`
		Tipo      string  `json:"tipo"       binding:"required"`
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

	// Valida enum TipoEntrada
	tipo := models.TipoEntrada(req.Tipo)
	switch tipo {
	case models.TipoDinheiro, models.TipoVale, models.TipoPix, models.TipoTED, models.TipoOutros:
		// válido
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "tipo inválido. Use: Dinheiro, Vale, Pix, TED ou Outros"})
		return
	}

	entrada := &models.Entrada{
		UsuarioID: req.UsuarioID,
		Descricao: req.Descricao,
		Valor:     req.Valor,
		Data:      parsedDate,
		Tipo:      tipo,
	}

	if err := h.service.CriarEntrada(c.Request.Context(), entrada); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, entrada)
}
