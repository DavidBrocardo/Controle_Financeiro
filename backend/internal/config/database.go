package config

import (
    "context"
    "fmt"
    "time"

    "github.com/jackc/pgx/v5/pgxpool"
)

// NewPool creates a pgx connection pool using the configuration values.
func NewPool(cfg Config) (*pgxpool.Pool, error) {
    dbURL := cfg.GetDatabaseURL()
    if dbURL == "" {
        return nil, fmt.Errorf("database URL is not set in configuration")
    }
    poolConfig, err := pgxpool.ParseConfig(dbURL)
    if err != nil {
        return nil, fmt.Errorf("failed to parse DATABASE_URL: %w", err)
    }
    poolConfig.MaxConns = 10
    poolConfig.MinConns = 2
    poolConfig.MaxConnLifetime = time.Hour
    poolConfig.HealthCheckPeriod = 5 * time.Minute

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
    if err != nil {
        return nil, fmt.Errorf("failed to create pgx pool: %w", err)
    }
    if err := pool.Ping(ctx); err != nil {
        pool.Close()
        return nil, fmt.Errorf("cannot ping database: %w", err)
    }
    return pool, nil
}
