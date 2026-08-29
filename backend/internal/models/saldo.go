package models

import "time"

type Saldo struct {
	ID           string    `json:"id"`
	UsuarioID    string    `json:"usuario_id"`
	SaldoAtual   float64   `json:"saldo_atual"`
	AtualizadoEm time.Time `json:"atualizado_em"`
}
