package models

import "time"

// TipoEntrada define os tipos de fonte de entrada de dinheiro
type TipoEntrada string

const (
	TipoDinheiro TipoEntrada = "Dinheiro"
	TipoVale     TipoEntrada = "Vale"
	TipoPix      TipoEntrada = "Pix"
	TipoTED      TipoEntrada = "TED"
	TipoOutros   TipoEntrada = "Outros"
)

type Entrada struct {
	ID        string      `json:"id"`
	UsuarioID string      `json:"usuario_id"`
	Descricao string      `json:"descricao"`
	Valor     float64     `json:"valor"`
	Data      time.Time   `json:"data"`
	Tipo      TipoEntrada `json:"tipo"`
	CriadoEm time.Time   `json:"criado_em"`
}
