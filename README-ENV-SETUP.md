# 🔧 Configuração das Variáveis de Ambiente

## Passo 1: Criar arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto (`apps/web/.env.local`) com o seguinte conteúdo:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Passo 2: Obter as Credenciais do Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Selecione seu projeto ou crie um novo
3. Vá em **Project Settings** → **API**
4. Copie as seguintes informações:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## Passo 3: Configurar o Banco de Dados

Após configurar as variáveis, vou usar o MCP do Supabase para:
- ✅ Criar as tabelas necessárias (clients, tokens, etc.)
- ✅ Configurar Row Level Security (RLS)
- ✅ Configurar autenticação
- ✅ Testar a conexão

## Passo 4: Testar a Configuração

Execute: `pnpm dev` e acesse `http://localhost:3000/login`

## Status Atual

✅ **Next.js 15.3.3** - Configurado  
✅ **Supabase Auth** - Implementado  
✅ **Tailwind CSS** - Configurado  
✅ **TypeScript** - Configurado  
⏳ **Variáveis de Ambiente** - Aguardando configuração  
⏳ **Banco de Dados** - Aguardando configuração  

## Próximos Passos

1. Configure as variáveis de ambiente
2. Forneça o token de acesso do Supabase para usar o MCP
3. Vou configurar automaticamente o banco de dados
4. Testar o fluxo completo de autenticação 