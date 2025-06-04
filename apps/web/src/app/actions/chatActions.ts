'use server'

import { createClient } from '@supabase/supabase-js'

// Criar cliente Supabase com service_role para bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tipos para as mensagens
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ProcessChatMessageParams {
  userMessageContent: string
  clientId: string
  sessionId: string
  chatHistory?: ChatMessage[]
}

/**
 * Server Action para processar mensagens do chat com IA
 */
export async function processUserChatMessage({
  userMessageContent,
  clientId,
  sessionId
}: ProcessChatMessageParams) {
  try {
    // Simular resposta da IA por enquanto (substituir por OpenAI depois)
    const assistantResponse = await generateMockAIResponse(userMessageContent)

    // Inserir resposta do assistente na tabela usando service_role
    const { error: insertError } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        client_id: clientId,
        session_id: sessionId,
        role: 'assistant',
        content: assistantResponse,
        user_id: null,
        metadata: {
          model: 'mock-ai',
          timestamp: new Date().toISOString()
        }
      })

    if (insertError) {
      console.error('Erro ao inserir resposta do assistente:', insertError)
      return { success: false, error: 'Erro ao salvar resposta da IA' }
    }

    return { success: true, message: assistantResponse }

  } catch (error) {
    console.error('Erro ao processar mensagem do chat:', error)
    return { success: false, error: 'Erro interno do servidor' }
  }
}

/**
 * Função mock para simular resposta da IA
 * TODO: Substituir por integração real com OpenAI quando disponível
 */
async function generateMockAIResponse(
  userMessage: string
): Promise<string> {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 1500))

  const lowerMessage = userMessage.toLowerCase()

  // Respostas baseadas em palavras-chave
  if (lowerMessage.includes('roas') || lowerMessage.includes('retorno')) {
    return `Analisando seu ROAS, vejo que você está perguntando sobre retorno do investimento. Para melhorar o ROAS, considere:

1. **Otimizar Segmentação**: Foque em públicos que já converteram
2. **Testar Criativos**: Rotacione anúncios frequentemente  
3. **Ajustar Lances**: Use estratégias de lance automático para conversões
4. **Landing Pages**: Melhore a experiência pós-clique

Precisa de análise específica de alguma campanha?`
  }

  if (lowerMessage.includes('cpa') || lowerMessage.includes('custo')) {
    return `Para reduzir o CPA (Custo Por Aquisição), recomendo:

• **Palavras-chave negativas**: Exclua termos irrelevantes
• **Horários de pico**: Concentre orçamento nos melhores horários
• **Qualidade do Score**: Melhore relevância dos anúncios
• **Funil de conversão**: Otimize cada etapa do processo

Qual é seu CPA atual vs. meta desejada?`
  }

  if (lowerMessage.includes('meta ads') || lowerMessage.includes('facebook')) {
    return `Para Meta Ads, focarei em estratégias específicas da plataforma:

**Otimizações Recomendadas:**
- Use eventos personalizados do Pixel
- Teste campanhas de Advantage+
- Implemente Lookalike Audiences
- Monitore Relevance Score

**Métricas Importantes:**
- CPM, CTR, CPC, ROAS
- Frequency (evite fadiga)
- Cost per Result

Quer analisar alguma campanha específica do Meta?`
  }

  if (lowerMessage.includes('google ads') || lowerMessage.includes('google')) {
    return `Para Google Ads, vamos focar em performance:

**Principais Ações:**
- Otimize Quality Score (relevância + experiência)
- Use extensões de anúncio (sitelinks, callouts)
- Implemente Smart Bidding strategies
- Analise Search Terms Report

**KPIs Essenciais:**
- Impression Share, CTR, Conv. Rate
- Search Lost IS (budget/rank)

Precisa de ajuda com palavras-chave ou estrutura de conta?`
  }

  if (lowerMessage.includes('campanha') || lowerMessage.includes('performance')) {
    return `Vou te ajudar a analisar a performance da campanha:

**Checklist de Performance:**
✓ Métricas principais: ROAS, CPA, CTR
✓ Orçamento vs. gasto real  
✓ Segmentação e exclusões
✓ Criatividade e copy dos anúncios

**Próximos Passos:**
1. Compartilhe dados específicos da campanha
2. Defina objetivos claros (vendas, leads, etc.)
3. Identifique benchmarks do setor

Qual aspecto você gostaria de focar primeiro?`
  }

  // Resposta padrão
  return `Olá! Sou seu assistente de marketing digital. Posso te ajudar com:

📊 **Análise de Performance**: ROAS, CPA, CTR e outras métricas
🎯 **Otimização de Campanhas**: Meta Ads, Google Ads, TikTok Ads  
📈 **Estratégias de Crescimento**: Segmentação, criativos, orçamento
💡 **Insights Personalizados**: Baseado nos seus dados

Como posso te ajudar hoje? Compartilhe detalhes sobre suas campanhas ou dúvidas específicas.`
}

/**
 * Função para integração real com OpenAI (para implementação futura)
 * Descomente quando OPENAI_API_KEY estiver configurada
 */
/*
import OpenAI from 'openai'

async function generateOpenAIResponse(
  messages: ChatMessage[]
): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    max_tokens: 500,
    temperature: 0.7,
  })

  return completion.choices[0]?.message?.content || "Desculpe, não consegui processar sua mensagem."
}
*/ 