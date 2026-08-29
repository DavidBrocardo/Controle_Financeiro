-- 001_create_tables.sql
-- Cria as tabelas principais para o controle financeiro
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL -- exemplo: "gasto" ou "entrada"
);

CREATE TABLE gastos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id UUID NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT,
    valor NUMERIC(14,2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    descricao TEXT,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE entradas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    descricao TEXT NOT NULL,
    valor NUMERIC(14,2) NOT NULL CHECK (valor > 0),
    data DATE NOT NULL,
    tipo TEXT NOT NULL, -- Dinheiro, Vale, Pix, etc.
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE saldo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    total_entradas NUMERIC(14,2) NOT NULL DEFAULT 0,
    total_gastos NUMERIC(14,2) NOT NULL DEFAULT 0,
    saldo_atual NUMERIC(14,2) NOT NULL DEFAULT 0,
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices auxiliares
CREATE INDEX idx_gastos_usuario ON gastos(usuario_id);
CREATE INDEX idx_entradas_usuario ON entradas(usuario_id);
