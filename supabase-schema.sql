-- ======================================================
-- SCHEMA SQL PARA DASHBOARD DE TRÁFEGO - FASE 1
-- Aplicar no Supabase Dashboard > SQL Editor
-- ======================================================

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ======================================================
-- TABELA CLIENTS (Tenant/Multi-client structure)
-- ======================================================

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ======================================================
-- ROW LEVEL SECURITY (RLS) PARA CLIENTS
-- ======================================================

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to manage their own clients
CREATE POLICY "Clients are viewable and manageable by the user who created them"
    ON clients
    FOR ALL
    USING (auth.uid() = user_id);

-- Create RLS policy for service role (admin access)
CREATE POLICY "Service role has full access to clients"
    ON clients
    FOR ALL
    USING (auth.role() = 'service_role');

-- ======================================================
-- VERIFICAÇÕES E TESTES
-- ======================================================

-- Comentário: Após aplicar este SQL, você pode testar com:
-- SELECT * FROM clients; (deve retornar vazio inicialmente)
-- 
-- Para criar um cliente de teste (substitua 'your-user-uuid' pelo ID real):
-- INSERT INTO clients (user_id, client_name) 
-- VALUES ('your-user-uuid', 'Cliente Teste');
-- 
-- O sistema de RLS garantirá que cada usuário só veja seus próprios clientes. 