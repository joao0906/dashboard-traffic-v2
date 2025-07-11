// import type { CampaignData } from '@/components/campaigns/CampaignsDataTable'
// import type { DashboardKPIs, RoasData } from '@/lib/dashboard/actions'
import type { CampaignData, DashboardKPIs, RoasData } from './actions'

export const mockKPIs: DashboardKPIs = {
  totalSpend: 15420.50,
  totalSpendPrevious: 12300.00,
  averageRoas: 3.45,
  averageRoasPrevious: 2.89,
  totalConversions: 234,
  totalConversionsPrevious: 198,
  totalImpressions: 1250000,
  totalImpressionsPrevious: 980000,
}

export const mockRoasData: RoasData[] = [
  { date: '2024-01-01', roas: 2.5 },
  { date: '2024-01-02', roas: 2.8 },
  { date: '2024-01-03', roas: 3.1 },
  { date: '2024-01-04', roas: 2.9 },
  { date: '2024-01-05', roas: 3.4 },
  { date: '2024-01-06', roas: 3.7 },
  { date: '2024-01-07', roas: 3.2 },
  { date: '2024-01-08', roas: 3.8 },
  { date: '2024-01-09', roas: 4.1 },
  { date: '2024-01-10', roas: 3.9 },
  { date: '2024-01-11', roas: 4.3 },
  { date: '2024-01-12', roas: 4.0 },
  { date: '2024-01-13', roas: 3.6 },
  { date: '2024-01-14', roas: 3.8 },
  { date: '2024-01-15', roas: 4.2 },
]

export const mockCampaignsData: CampaignData[] = [
  {
    id: '1',
    name: 'Campanha de Verão 2024',
    platform: 'Meta Ads',
    status: 'Ativa',
    roas: 4.2,
    cpa: 45.50,
    spend: 2500.00,
    impressions: 150000,
    clicks: 3500,
    conversions: 55,
    sessions_ga4: 4200,
  },
  {
    id: '2',
    name: 'Black Friday Promoção',
    platform: 'Google Ads',
    status: 'Ativa',
    roas: 3.8,
    cpa: 52.30,
    spend: 3200.00,
    impressions: 185000,
    clicks: 4100,
    conversions: 61,
    sessions_ga4: 5100,
  },
  {
    id: '3',
    name: 'Lançamento Produto X',
    platform: 'TikTok Ads',
    status: 'Pausada',
    roas: 2.9,
    cpa: 68.90,
    spend: 1800.00,
    impressions: 98000,
    clicks: 2200,
    conversions: 26,
    sessions_ga4: 2800,
  },
  {
    id: '4',
    name: 'Retargeting Q1',
    platform: 'Meta Ads',
    status: 'Ativa',
    roas: 5.1,
    cpa: 38.20,
    spend: 1950.00,
    impressions: 125000,
    clicks: 2800,
    conversions: 51,
    sessions_ga4: 3200,
  },
  {
    id: '5',
    name: 'Awareness Marca',
    platform: 'Google Ads',
    status: 'Concluída',
    roas: 1.8,
    cpa: 95.40,
    spend: 5500.00,
    impressions: 450000,
    clicks: 8900,
    conversions: 58,
    sessions_ga4: 12000,
  },
] 