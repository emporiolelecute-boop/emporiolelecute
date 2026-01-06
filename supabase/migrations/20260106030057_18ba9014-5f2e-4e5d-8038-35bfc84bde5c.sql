-- Adicionar campos de personalização na tabela products
ALTER TABLE products ADD COLUMN IF NOT EXISTS personalization_enabled BOOLEAN DEFAULT true;
ALTER TABLE products ADD COLUMN IF NOT EXISTS personalization_label TEXT DEFAULT 'Personalização';
ALTER TABLE products ADD COLUMN IF NOT EXISTS personalization_placeholder TEXT DEFAULT 'Digite o nome, data ou mensagem para personalização...';

-- Tornar campos de endereço nullable para simplificar checkout
ALTER TABLE orders ALTER COLUMN address_street DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN address_number DROP NOT NULL;
ALTER TABLE orders ALTER COLUMN address_neighborhood DROP NOT NULL;