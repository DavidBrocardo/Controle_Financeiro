package main

import (
	"log"

	"controle-financeiro/backend/internal/config"
	"controle-financeiro/backend/internal/router"

	"github.com/gin-gonic/gin"
	"github.com/kelseyhightower/envconfig"
)

func main() {
	// Load configuration from environment variables
	var cfg config.Config
	if err := envconfig.Process("", &cfg); err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Set Gin mode based on env
	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Initialize DB pool
	dbPool, err := config.NewPool(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbPool.Close()

	r := gin.New()
	r.Use(gin.Recovery())

	// Register routes with DB pool
	router.SetupRoutes(r, cfg, dbPool)

	// Start server
	addr := cfg.ServerAddress
	if addr == "" {
		addr = ":8080"
	}
	if err := r.Run(addr); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
