package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthHandler returns a simple status indicating the service is up.
func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
