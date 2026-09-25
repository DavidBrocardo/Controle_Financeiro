package models

import (
	"time"
)

type Meta struct {
	ID                    string    `json:"id"`
	UsuarioID             string    `json:"usuario_id"`
	MetaGastoMensal       float64   `json:"meta_gasto_mensal"`
	MetaEconomiaMensal    float64   `json:"meta_economia_mensal"`
	ObjetivoEconomiaTotal float64   `json:"objetivo_economia_total"`
	CriadoEm              time.Time `json:"criado_em"`
	AtualizadoEm          time.Time `json:"atualizado_em"`
}
