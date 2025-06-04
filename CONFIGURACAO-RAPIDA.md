# 🚀 Configuração Rápida - Dashboard Traffic

## ✅ **CSS CORRIGIDO**
O problema dos estilos foi **resolvido**! O CSS foi simplificado para evitar conflitos com Tailwind v4.

## ⚠️ **CONFIGURAÇÃO NECESSÁRIA - SUPABASE**

### 🔧 **1. Criar arquivo `.env.local`**
Na pasta `apps/web/`, crie o arquivo `.env.local` com:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...SUA_CHAVE_AQUI

# Base URL for redirects  
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 🏗️ **2. Configurar Projeto Supabase**

1. **Acesse:** https://supabase.com/dashboard
2. **Crie um novo projeto** ou use um existente
3. **Vá para Settings > API**
4. **Copie:**
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon/Public Key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 📧 **3. Configurar Autenticação**

No Supabase Dashboard:
1. **Vá para Authentication > Settings**
2. **Site URL:** `http://localhost:3000`
3. **Redirect URLs:** Adicione:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3001/auth/callback`

### 🛢️ **4. Criar Tabelas Necessárias**

Execute no **SQL Editor** do Supabase:

```sql
-- Tabela para mensagens do chat
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL,
  session_id uuid NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  role text NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados
CREATE POLICY "Users can access own messages" ON chat_messages
  FOR ALL USING (auth.uid() = user_id);
```

## 🚀 **5. Testar a Aplicação**

```bash
cd apps/web
pnpm dev
```

**URLs para testar:**
- 🏠 **Dashboard:** http://localhost:3000 (ou 3001)
- 🔐 **Login:** http://localhost:3000/login

## 🎯 **Resultado Esperado**

Após essas configurações, você terá:
- ✅ **Visual clean e moderno** funcionando
- ✅ **Autenticação por magic link** operacional  
- ✅ **Design minimalista** com bordas arredondadas
- ✅ **Responsividade completa**

---

## 🆘 **Se ainda houver problemas:**

1. **Verifique o console** do navegador para erros
2. **Confirme as variáveis** no `.env.local`
3. **Reinicie o servidor** após adicionar variáveis
4. **Teste o magic link** no email

---

**Status Atual:** 🎨 **CSS Corrigido** | ⚠️ **Precisa configurar Supabase** 