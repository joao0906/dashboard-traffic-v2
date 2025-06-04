import { NextRequest, NextResponse } from 'next/server'
import { fetchMetaInsights, saveMetaMetrics } from '@/lib/meta/actions'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Verificar autorização do cron job
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`
    
    if (!authHeader || authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const results: { clientId: string; status: string; error?: string }[] = []

    // Buscar todos os clientes com tokens Meta ativos
    const { data: metaTokens, error: tokensError } = await supabase
      .from('meta_tokens')
      .select('client_id, ad_account_id, access_token, expires_at')
      .eq('is_active', true)

    if (tokensError) {
      console.error('Error fetching meta tokens:', tokensError)
      return NextResponse.json({ error: 'Failed to fetch tokens' }, { status: 500 })
    }

    if (!metaTokens || metaTokens.length === 0) {
      return NextResponse.json({ 
        message: 'No active Meta tokens found',
        results: []
      })
    }

    // Processar cada cliente
    for (const token of metaTokens) {
      try {
        // Verificar se o token não expirou
        if (token.expires_at) {
          const expiresAt = new Date(token.expires_at)
          const now = new Date()
          
          if (expiresAt <= now) {
            results.push({
              clientId: token.client_id,
              status: 'error',
              error: 'Token expired'
            })
            continue
          }
        }

        // Buscar insights dos últimos 7 dias
        const insights = await fetchMetaInsights(token.client_id, 'last_7d')
        
        if (insights.length === 0) {
          results.push({
            clientId: token.client_id,
            status: 'success',
            error: 'No insights data found'
          })
          continue
        }

        // Salvar métricas no banco
        await saveMetaMetrics(token.client_id, insights)
        
        results.push({
          clientId: token.client_id,
          status: 'success'
        })

        console.log(`Meta metrics updated for client ${token.client_id}: ${insights.length} records`)

      } catch (clientError) {
        console.error(`Error processing Meta metrics for client ${token.client_id}:`, clientError)
        results.push({
          clientId: token.client_id,
          status: 'error',
          error: clientError instanceof Error ? clientError.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      message: 'Meta metrics cron job completed',
      processedClients: results.length,
      results
    })

  } catch (error) {
    console.error('Meta metrics cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 