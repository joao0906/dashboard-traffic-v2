export interface MetaToken {
  id: string
  client_id: string
  access_token: string
  token_type: string
  expires_at?: string
  refresh_token?: string
  scope?: string
  ad_account_id?: string
  business_id?: string
  user_id_meta?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MetaAdAccount {
  id: string
  name: string
  account_id: string
  account_status: number
}

export interface MetaAction {
  action_type: string
  value: string
}

export interface MetaInsightData {
  campaign_id: string
  campaign_name: string
  spend?: string
  impressions?: string
  clicks?: string
  actions?: MetaAction[]
  cost_per_action_type?: { [key: string]: string }
  cost_per_conversion?: string
  roas?: string
  cpc?: string
  cpm?: string
  ctr?: string
  date_start: string
  date_stop: string
}

export interface MetricsDailyInsert {
  client_id: string
  metric_date: string
  platform: string
  campaign_id?: string
  campaign_name?: string
  ad_group_id?: string
  ad_group_name?: string
  ad_id?: string
  ad_name?: string
  spend: number
  impressions: number
  clicks: number
  conversions: number
  roas: number
  cpc: number
  cpm: number
  ctr: number
  conversion_rate: number
  sessions?: number
  bounce_rate?: number
  custom_data?: Record<string, any>
} 