// import { createClient } from '@/lib/supabase/server'
// import type { CampaignData } from '@/components/campaigns/CampaignsDataTable'
import { mockKPIs, mockRoasData, mockCampaignsData } from './mock-data'

export interface CampaignData {
  id: string
  name: string
  platform: 'Meta Ads' | 'Google Ads' | 'TikTok Ads'
  status: 'Ativa' | 'Pausada' | 'Concluída' | 'Rascunho'
  roas?: number
  cpa?: number
  spend?: number
  impressions?: number
  clicks?: number
  conversions?: number
  sessions_ga4?: number
}

export interface DashboardKPIs {
  totalSpend: number
  totalSpendPrevious: number
  averageRoas: number
  averageRoasPrevious: number
  totalConversions: number
  totalConversionsPrevious: number
  totalImpressions: number
  totalImpressionsPrevious: number
}

export interface RoasData {
  date: string
  roas: number | null
}

/**
 * Busca KPIs principais do dashboard
 */
export async function getDashboardKPIs(clientId?: string): Promise<DashboardKPIs> {
  // TODO: Implementar lógica real com Supabase
  // Usando dados mock por enquanto
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simular loading
  return mockKPIs
}

/**
 * Busca dados de tendência ROAS dos últimos 30 dias
 */
export async function getRoasTrendData(clientId?: string): Promise<RoasData[]> {
  // TODO: Implementar lógica real com Supabase
  // Usando dados mock por enquanto
  await new Promise(resolve => setTimeout(resolve, 800)) // Simular loading
  return mockRoasData
}

/**
 * Busca dados de campanhas para a tabela
 */
export async function getCampaignsData(clientId?: string): Promise<CampaignData[]> {
  // TODO: Implementar lógica real com Supabase
  // Usando dados mock por enquanto
  await new Promise(resolve => setTimeout(resolve, 1200)) // Simular loading
  return mockCampaignsData
} 