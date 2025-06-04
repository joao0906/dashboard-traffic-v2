-- Fase 4 - Chat IA: Tabela chat_messages
-- Arquivo SQL para aplicar no Supabase SQL Editor

-- 1. Criar tabela chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id BIGSERIAL PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    session_id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Criar índice para otimizar busca de mensagens de uma sessão específica
CREATE INDEX IF NOT EXISTS idx_chat_messages_client_session_created 
ON public.chat_messages (client_id, session_id, created_at);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- 4. Política RLS para leitura - Users can read their client's chat messages
CREATE POLICY "Users can read their client's chat messages" 
ON public.chat_messages FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.clients 
    WHERE clients.id = chat_messages.client_id 
    AND clients.user_id = auth.uid()
));

-- 5. Política RLS para inserção - Users can insert their own messages
CREATE POLICY "Users can insert their own messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (
    role = 'user' 
    AND user_id = auth.uid() 
    AND EXISTS (
        SELECT 1 FROM public.clients 
        WHERE clients.id = chat_messages.client_id 
        AND clients.user_id = auth.uid()
    )
);

-- 6. Política para service_role - Permitir INSERT sem restrições para IA
CREATE POLICY "Service role can insert any message" 
ON public.chat_messages FOR INSERT 
TO service_role
WITH CHECK (true);

-- 7. Política para service_role - Permitir SELECT sem restrições para IA
CREATE POLICY "Service role can read any message" 
ON public.chat_messages FOR SELECT 
TO service_role
USING (true);

-- Comentários para documentação
COMMENT ON TABLE public.chat_messages IS 'Tabela para armazenar mensagens do chat entre usuários e IA assistente';
COMMENT ON COLUMN public.chat_messages.session_id IS 'UUID para agrupar mensagens de uma mesma conversa ou sessão de chat';
COMMENT ON COLUMN public.chat_messages.role IS 'Papel da mensagem: user (usuário), assistant (IA), system (sistema)';
COMMENT ON COLUMN public.chat_messages.metadata IS 'Dados extras opcionais como fontes, IDs de referência, etc.'; 