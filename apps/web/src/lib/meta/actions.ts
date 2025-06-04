import { createClient } from '@/lib/supabase/server'
import { MetaToken, MetaInsightData, MetaAdAccount } from './types'

/**
 * Salva ou atualiza token Meta Ads no banco de dados
 */
export async function saveMetaToken(params: {
  clientId: string
  accessToken: string
  expiresAt?: Date
  refreshToken?: string
  adAccountId?: string
  businessId?: string
  userIdMeta?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('meta_tokens')
    .upsert({
      client_id: params.clientId,
      access_token: params.accessToken,
      expires_at: params.expiresAt?.toISOString(),
      refresh_token: params.refreshToken,
      ad_account_id: params.adAccountId,
      business_id: params.businessId,
      user_id_meta: params.userIdMeta,
      is_active: true,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Error saving meta token:', error)
    throw new Error('Failed to save Meta token')
  }

  return data
}

/**
 * Busca token Meta Ads ativo para um cliente
 */
export async function getMetaToken(clientId: string): Promise<MetaToken | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('meta_tokens')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Error fetching meta token:', error)
    return null
  }

  return data
}

/**
 * Troca código OAuth por access token de curta duração
 */
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
}> {
  const response = await fetch('https://graph.facebook.com/v19.0/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_META_APP_ID!,
      client_secret: process.env.META_APP_SECRET!,
      code,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/meta/callback`,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}

/**
 * Troca token de curta duração por token de longa duração
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string
  token_type: string
  expires_in: number
}> {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.NEXT_PUBLIC_META_APP_ID}&client_secret=${process.env.META_APP_SECRET}&fb_exchange_token=${shortLivedToken}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    throw new Error('Failed to exchange for long-lived token')
  }

  return response.json()
}

/**
 * Busca informações do usuário Meta
 */
export async function getMetaUser(accessToken: string): Promise<{
  id: string
  name?: string
  email?: string
}> {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/me?fields=id,name,email&access_token=${accessToken}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Meta user info')
  }

  return response.json()
}

/**
 * Busca contas de anúncio do usuário
 */
export async function getMetaAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  const response = await fetch(
    `https://graph.facebook.com/v19.0/me/adaccounts?fields=id,name,account_id,account_status&access_token=${accessToken}`,
    { method: 'GET' }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch Meta ad accounts')
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Busca insights de uma conta de anúncio
 */
export async function fetchMetaInsights(
  clientId: string,
  datePreset: string = 'last_7d'
): Promise<MetaInsightData[]> {
  const token = await getMetaToken(clientId)
  
  if (!token || !token.access_token || !token.ad_account_id) {
    throw new Error('No valid Meta token found for client')
  }

  const response = await fetch(
    `https://graph.facebook.com/v19.0/${token.ad_account_id}/insights?` +
    new URLSearchParams({
      fields: 'campaign_id,campaign_name,spend,impressions,clicks,actions,cost_per_action_type,cost_per_conversion,roas,cpc,cpm,ctr,date_start,date_stop',
      time_increment: '1',
      date_preset: datePreset,
      level: 'campaign',
      access_token: token.access_token
    }),
    { method: 'GET' }
  )

  if (!response.ok) {
    const errorData = await response.json()
    console.error('Meta API Error:', errorData)
    throw new Error(`Meta API Error: ${errorData.error?.message || 'Unknown error'}`)
  }

  const data = await response.json()
  return data.data || []
}

/**
 * Salva métricas na tabela metrics_daily
 */
export async function saveMetaMetrics(
  clientId: string,
  insights: MetaInsightData[]
): Promise<void> {
  const supabase = await createClient()

  const metricsData = insights.map(insight => {
    // Extrair conversões do campo actions
    const conversions = insight.actions?.find(action => 
      action.action_type === 'purchase' || action.action_type === 'complete_registration'
    )?.value || '0'

    return {
      client_id: clientId,
      metric_date: insight.date_start,
      platform: 'Meta Ads',
      campaign_id: insight.campaign_id,
      campaign_name: insight.campaign_name,
      spend: parseFloat(insight.spend || '0'),
      impressions: parseInt(insight.impressions || '0'),
      clicks: parseInt(insight.clicks || '0'),
      conversions: parseFloat(conversions),
      roas: parseFloat(insight.roas || '0'),
      cpc: parseFloat(insight.cpc || '0'),
      cpm: parseFloat(insight.cpm || '0'),
      ctr: parseFloat(insight.ctr || '0'),
      conversion_rate: parseFloat(insight.clicks || '0') > 0 
        ? parseFloat(conversions) / parseFloat(insight.clicks || '1') 
        : 0,
      custom_data: {
        cost_per_conversion: insight.cost_per_conversion,
        actions: insight.actions
      }
    }
  })

  const { error } = await supabase
    .from('metrics_daily')
    .upsert(metricsData, {
      onConflict: 'client_id,metric_date,platform,campaign_id'
    })

  if (error) {
    console.error('Error saving meta metrics:', error)
    throw new Error('Failed to save Meta metrics')
  }
} 