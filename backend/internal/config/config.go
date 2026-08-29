package config

import "time"

type Config struct {
    Env           string        `envconfig:"ENV" default:"development"`
    ServerAddress string        `envconfig:"SERVER_ADDRESS" default:":8080"`
    DatabaseURL   string        `envconfig:"DATABASE_URL"`
    // optional individual DB parts (if DATABASE_URL not set)
    DBUser        string        `envconfig:"POSTGRES_USER" default:"user"`
    DBPassword    string        `envconfig:"POSTGRES_PASSWORD" default:"password"`
    DBHost        string        `envconfig:"POSTGRES_HOST" default:"localhost"`
    DBPort        string        `envconfig:"POSTGRES_PORT" default:"5432"`
    DBName        string        `envconfig:"POSTGRES_DB" default:"finance"`
    // Derived: connection string if DatabaseURL empty
    ConnTimeout   time.Duration `envconfig:"DB_CONN_TIMEOUT" default:"5s"`
}

func (c *Config) GetDatabaseURL() string {
    if c.DatabaseURL != "" {
        return c.DatabaseURL
    }
    // Build DSN for pgx
    return "postgres://" + c.DBUser + ":" + c.DBPassword + "@" + c.DBHost + ":" + c.DBPort + "/" + c.DBName + "?sslmode=disable"
}
