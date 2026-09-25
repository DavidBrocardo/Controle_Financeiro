-- 002_create_metas_table.sql
CREATE TABLE metas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    meta_gasto_mensal NUMERIC(14,2) NOT NULL DEFAULT 0,
    meta_economia_mensal NUMERIC(14,2) NOT NULL DEFAULT 0,
    objetivo_economia_total NUMERIC(14,2) NOT NULL DEFAULT 0,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to update atualizado_em when metas table is updated
CREATE OR REPLACE FUNCTION update_atualizado_em_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_metas_atualizado_em
    BEFORE UPDATE ON metas
    FOR EACH ROW
    EXECUTE FUNCTION update_atualizado_em_column();
