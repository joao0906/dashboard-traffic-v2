# Dashboard de Gerenciamento de Tráfego Pago (Dashboard Traffic v2)

## 🎯 Visão Geral do Projeto

**Dashboard Traffic v2** é uma aplicação web moderna e robusta projetada para centralizar, visualizar e analisar métricas de campanhas de tráfego pago de múltiplas plataformas de anúncios. A solução integra Meta Ads, Google Ads, TikTok Ads e Google Analytics 4, fornecendo aos gestores de tráfego e analistas de marketing uma ferramenta poderosa com insights baseados em Inteligência Artificial.

### ✨ Principais Diferenciais

- **🤖 Chat IA Especializada**: Assistente virtual com conhecimento específico em marketing digital
- **📊 Dashboard Unificado**: Métricas consolidadas de todas as plataformas
- **🔒 Segurança Robusta**: Row Level Security (RLS) e autenticação via Supabase
- **⚡ Tempo Real**: Atualizações instantâneas via Supabase Realtime
- **🎨 Interface Moderna**: Design responsivo com Tailwind CSS
- **🚀 Performance Otimizada**: Next.js 15.3.3 com Server Components

## 🏗️ Arquitetura Tecnológica

### Frontend & API
- **Framework**: Next.js 15.3.3 (App Router, Server Components)
- **Linguagem**: TypeScript para tipagem segura
- **Estilização**: Tailwind CSS com design system consistente
- **Ícones**: Lucide React para iconografia moderna

### Backend & Dados
- **Database**: Supabase PostgreSQL com Row Level Security
- **Autenticação**: Supabase Auth (Magic Link, OAuth)
- **Realtime**: Supabase Realtime para atualizações instantâneas
- **APIs**: Integração via OAuth2 com plataformas de anúncios

### IA & Automação
- **Chat IA**: Sistema de conversação com contexto especializado
- **Insights**: Análises automatizadas e recomendações acionáveis
- **Cron Jobs**: Coleta automatizada de métricas

## 🚀 Funcionalidades Implementadas

### ✅ Fase 1: Autenticação & Scaffold
- Sistema de autenticação completo via Supabase
- Estrutura base do projeto Next.js
- Configuração de segurança e middleware

### ✅ Fase 2: Conectores de API
- **Meta Ads**: OAuth2, coleta de insights e métricas
- **Google Ads**: Integração completa com API
- **TikTok Ads**: Conectores preparados
- **Google Analytics 4**: Coleta de dados comportamentais

### ✅ Fase 3: Dashboard MVP
- **KPI Cards**: Métricas principais com comparativos
- **Gráfico ROAS**: Tendências visuais interativas
- **Tabela de Campanhas**: Dados detalhados com filtros
- **Design Responsivo**: Interface otimizada para todos os dispositivos

### ✅ Fase 4: Chat IA
- **ChatSidebar**: Interface de conversação moderna
- **IA Especializada**: Conhecimento em marketing digital
- **Tempo Real**: Mensagens instantâneas via Realtime
- **Persistência**: Histórico completo de conversas
- **Segurança**: RLS para isolamento de dados

## 📋 Requisitos

### Ferramentas Necessárias
- **Node.js**: v20.x ou superior
- **PNPM**: v9.x ou superior (gerenciador recomendado)
- **Git**: Para controle de versão

### Contas e Serviços
- **Supabase**: Para banco de dados e autenticação
- **Vercel**: Para deploy (recomendado)
- **Meta for Developers**: Para Meta Ads API
- **Google Cloud Console**: Para Google Ads e GA4 APIs
- **TikTok for Business**: Para TikTok Ads API
- **(Opcional) OpenAI**: Para IA real (atualmente usando mock)

### Opcionais
- **Supabase CLI**: Para desenvolvimento local
- **Docker**: Se usar Supabase localmente

## ⚙️ Configuração Local (Setup)

### 1. Clonagem e Instalação
```bash
# Clonar o repositório
git clone https://github.com/SEU_USUARIO/DashBoard-Trafic-v2.git
cd "DashBoard Trafic v2"

# Navegar para a aplicação web
cd apps/web

# Instalar dependências
pnpm install
```

### 2. Configuração de Variáveis de Ambiente
```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas configurações
nano .env.local  # ou seu editor preferido
```

#### Variáveis Obrigatórias:

**Supabase:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_publica
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_secreta
```

**Aplicação:**
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CRON_SECRET=seu_segredo_aleatorio_para_cron_jobs
```

**APIs de Marketing (conforme necessário):**
```env
# Meta Ads
NEXT_PUBLIC_META_APP_ID=seu_meta_app_id
META_APP_SECRET=seu_meta_app_secret

# Google (Ads + GA4)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=seu_google_ads_dev_token

# TikTok Ads
NEXT_PUBLIC_TIKTOK_APP_ID=seu_tiktok_app_id
TIKTOK_APP_SECRET=seu_tiktok_app_secret

# IA (Opcional)
OPENAI_API_KEY=sua_openai_api_key
```

### 3. Configuração do Supabase

#### Opção A: Supabase Remoto (Recomendado)
1. Crie um projeto no [Supabase Dashboard](https://app.supabase.io)
2. Configure as variáveis no `.env.local` com os dados do projeto
3. Execute os schemas SQL no SQL Editor:
   ```sql
   -- Aplicar fase2-schema-completo.sql
   -- Aplicar fase4-chat-messages-schema.sql
   ```

#### Opção B: Supabase Local (Avançado)
```bash
# Login no Supabase
pnpm supabase login

# Vincular projeto remoto (opcional)
pnpm supabase link --project-ref SEU_PROJECT_REF

# Iniciar serviços locais
pnpm supabase start

# Aplicar migrações
pnpm supabase db push
```

### 4. Execução da Aplicação
```bash
# Modo desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Executar produção localmente
pnpm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🌐 Deploy (Vercel)

### 1. Configuração no Vercel
1. **Conectar Repositório**: 
   - Acesse [Vercel Dashboard](https://vercel.com)
   - Conecte seu repositório GitHub
   - O Vercel detectará automaticamente Next.js

2. **Configurar Variáveis de Ambiente**:
   - Vá para Settings → Environment Variables
   - Adicione todas as variáveis do `.env.local`
   - Use valores de produção (URLs, chaves reais)

3. **Configurar Cron Jobs**:
   - Settings → Cron Jobs
   - Adicione endpoints: `/api/cron/google-ads-metrics`, `/api/cron/meta-ads-metrics`
   - Header: `Authorization: Bearer SEU_CRON_SECRET`
   - Frequência: Diária ou conforme necessário

### 2. Processo de Deploy
- **Automático**: A cada push na branch `main`
- **Manual**: Via Vercel CLI com `vercel --prod`
- **Preview**: Branches secundárias geram deploys de preview

### 3. Variáveis de Ambiente para Produção

**Públicas (NEXT_PUBLIC_):**
- `NEXT_PUBLIC_SUPABASE_URL`: URL pública do Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima pública
- `NEXT_PUBLIC_BASE_URL`: URL de produção (ex: https://seusite.com)
- `NEXT_PUBLIC_META_APP_ID`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, etc.

**Privadas (backend only):**
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço (sensível)
- `META_APP_SECRET`, `GOOGLE_CLIENT_SECRET`, etc.
- `GOOGLE_ADS_DEVELOPER_TOKEN`: Token de desenvolvedor
- `CRON_SECRET`: Segredo para proteção de cron jobs
- `OPENAI_API_KEY`: Chave da API OpenAI (sensível)

## 📁 Estrutura do Projeto

```
DashBoard Trafic v2/
├── apps/web/                          # Aplicação Next.js principal
│   ├── src/
│   │   ├── app/                       # App Router (páginas, layouts, API)
│   │   │   ├── actions/              # Server Actions
│   │   │   │   └── chatActions.ts    # IA Chat processing
│   │   │   ├── dash/                 # Dashboard principal
│   │   │   ├── auth/                 # Autenticação
│   │   │   └── api/                  # API Routes
│   │   ├── components/               # Componentes React
│   │   │   ├── auth/                 # Componentes de autenticação
│   │   │   ├── campaigns/            # Tabelas de campanhas
│   │   │   ├── chat/                 # Chat IA
│   │   │   │   └── ChatSidebar.tsx   # Sidebar de chat
│   │   │   ├── dashboard/            # KPIs e gráficos
│   │   │   └── ui/                   # Componentes base
│   │   └── lib/                      # Lógica core e helpers
│   │       ├── dashboard/            # Actions e mock data
│   │       └── supabase/             # Cliente Supabase
│   ├── public/                       # Arquivos estáticos
│   └── ...configs                    # Configurações (next, tailwind, etc.)
├── src/                              # Código compartilhado (legacy)
├── ia_prompts/                       # Instruções para IA
│   ├── fase1_scaffold_auth/          # Fase 1: Autenticação
│   ├── fase2_conectores_api/         # Fase 2: APIs
│   ├── fase3_dashboard_mvp/          # Fase 3: Dashboard
│   ├── fase4_chat_ia/               # Fase 4: Chat IA
│   └── fase5_performance_deploy/     # Fase 5: Deploy
├── *.sql                            # Schemas de banco de dados
└── README*.md                       # Documentação por fase
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Inicia servidor de desenvolvimento
pnpm build            # Build para produção
pnpm start            # Executa build de produção
pnpm lint             # Verificação de linting
pnpm type-check       # Verificação de tipos TypeScript

# Supabase (se CLI instalado)
pnpm supabase start   # Inicia Supabase local
pnpm supabase stop    # Para Supabase local
pnpm supabase status  # Status dos serviços
```

## 🛡️ Segurança e Boas Práticas

### Row Level Security (RLS)
- **Isolamento por cliente**: Cada usuário acessa apenas seus dados
- **Políticas granulares**: Controle fino de permissões
- **Service role**: Para operações da IA e cron jobs

### Variáveis de Ambiente
- **NEXT_PUBLIC_**: Apenas para dados não sensíveis
- **Backend only**: Chaves de API e segredos
- **Validação**: Verificação de tipos e presença

### Tratamento de Erros
- **Try-catch**: Em todas as operações I/O
- **Logs úteis**: Para debugging e monitoramento
- **Feedback visual**: Estados de loading e erro

## 📊 Funcionalidades do Dashboard

### KPI Cards
- **Métricas principais**: Gasto, ROAS, Conversões, Impressões
- **Comparativos**: Período anterior com indicadores visuais
- **Formatação**: Moeda, percentuais e números

### Gráficos ROAS
- **Tendências**: Visualização de 15 dias
- **Interativo**: Tooltips e responsividade
- **Personalização**: Cores e formatação PT-BR

### Tabela de Campanhas
- **Busca global**: Filtro em tempo real
- **Ordenação**: Por qualquer coluna
- **Paginação**: Performance otimizada
- **Badges**: Status coloridos por plataforma

### Chat IA
- **Tempo real**: Mensagens instantâneas
- **Contexto**: Histórico de conversação
- **Especialização**: Marketing digital específico
- **Persistência**: Histórico completo

## 🤖 Assistente IA

### Capacidades Atuais (Mock)
- **ROAS e ROI**: Estratégias de otimização
- **CPA**: Redução de custos por aquisição
- **Meta Ads**: Práticas específicas da plataforma
- **Google Ads**: Quality Score e bidding
- **Análise geral**: Performance de campanhas

### Integração OpenAI (Preparada)
```typescript
// Código preparado para integração real
// Descomente quando OPENAI_API_KEY disponível
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});
```

## 📈 Roadmap e Próximos Passos

### Curto Prazo (1-2 semanas)
- [ ] Deploy em produção
- [ ] Configuração de domínio personalizado
- [ ] Integração OpenAI real
- [ ] Testes de usuário

### Médio Prazo (1-2 meses)
- [ ] Análise de dados reais das APIs
- [ ] Filtros avançados no dashboard
- [ ] Exportação de relatórios
- [ ] Métricas de uso

### Longo Prazo (3-6 meses)
- [ ] Suporte a Markdown no chat
- [ ] Anexos e imagens
- [ ] Notificações push
- [ ] API pública para terceiros

## 🤝 Como Contribuir

1. **Fork** do repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature: `git checkout -b feature/nova-feature`
4. **Commit** suas alterações: `git commit -m "Adiciona nova feature"`
5. **Push** para sua branch: `git push origin feature/nova-feature`
6. **Abra** um Pull Request

### Padrões de Código
- **TypeScript**: Tipagem obrigatória
- **Linting**: ESLint + Prettier configurados
- **Commits**: Mensagens claras e descritivas
- **Testes**: Onde aplicável

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE). Consulte o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas, bugs ou sugestões:

- **Issues**: [GitHub Issues](https://github.com/SEU_USUARIO/DashBoard-Trafic-v2/issues)
- **Discussões**: [GitHub Discussions](https://github.com/SEU_USUARIO/DashBoard-Trafic-v2/discussions)
- **Email**: seu-email@exemplo.com

---

**Desenvolvido com ❤️ para otimizar campanhas de tráfego pago**

*Última atualização: Dezembro 2024 - Fase 4 (Chat IA) Completa*