package models

import "time"

type Gasto struct {
    ID         string    `json:"id"`
    UsuarioID  string    `json:"usuario_id"`
    CategoriaID string   `json:"categoria_id"`
    Valor      float64   `json:"valor"`
    Data       time.Time `json:"data"`
    Descricao  string    `json:"descricao,omitempty"`
    CriadoEm   time.Time `json:"criado_em"`
}
