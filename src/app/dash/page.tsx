import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardKPIs, getRoasTrendData, getCampaignsData } from '@/lib/dashboard/actions'
import KpiCard from '@/components/dashboard/KpiCard'
import RoasTrendChart from '@/components/dashboard/RoasTrendChart'
import CampaignsDataTable from '@/components/campaigns/CampaignsDataTable'
import ChatSidebar from '@/components/chat/ChatSidebar'
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Settings,
  LogOut
} from 'lucide-react'

// Mock Client ID para demonstração
const MOCK_CLIENT_ID = '550e8400-e29b-41d4-a716-446655440000'

// Componente de Loading para KPIs
function KpiLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <KpiCard key={i} title="" value={0} isLoading={true} />
      ))}
    </div>
  )
}

// Componente de Loading para Gráfico
function ChartLoading() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-48 mb-4"></div>
      <div 
        className="bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
        style={{ aspectRatio: 16/9 }}
      ></div>
    </div>
  )
}

// Componente de Loading para Tabela
function TableLoading() {
  return <CampaignsDataTable data={[]} isLoading={true} />
}

// Componente de Header com ações
async function DashboardHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white shadow">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard de Tráfego
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Bem-vindo, {user?.email}
            </span>
            <a
              href="/dash/connectors"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Conectores
            </a>
            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de KPIs com dados
async function DashboardKPIs() {
  const kpis = await getDashboardKPIs()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Gasto Total"
        value={kpis.totalSpend}
        previousValue={kpis.totalSpendPrevious}
        formatAsCurrency={true}
        icon={<DollarSign className="h-5 w-5 text-gray-400" />}
      />
      <KpiCard
        title="ROAS Médio"
        value={kpis.averageRoas}
        previousValue={kpis.averageRoasPrevious}
        unit="x"
        icon={<Target className="h-5 w-5 text-gray-400" />}
      />
      <KpiCard
        title="Conversões"
        value={kpis.totalConversions}
        previousValue={kpis.totalConversionsPrevious}
        icon={<TrendingUp className="h-5 w-5 text-gray-400" />}
      />
      <KpiCard
        title="Impressões"
        value={kpis.totalImpressions}
        previousValue={kpis.totalImpressionsPrevious}
        icon={<Eye className="h-5 w-5 text-gray-400" />}
      />
    </div>
  )
}

// Componente de Gráfico ROAS com dados
async function RoasChart() {
  const roasData = await getRoasTrendData()

  return <RoasTrendChart data={roasData} />
}

// Componente de Tabela de Campanhas com dados
async function CampaignsTable() {
  const campaignsData = await getCampaignsData()

  return <CampaignsDataTable data={campaignsData} />
}

// Página principal do Dashboard
export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      {/* Layout principal com dashboard + chat sidebar */}
      <div className="flex">
        {/* Conteúdo principal do dashboard */}
        <div className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* KPIs Section */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Visão Geral
              </h2>
              <Suspense fallback={<KpiLoading />}>
                <DashboardKPIs />
              </Suspense>
            </div>

            {/* ROAS Trend Chart */}
            <div>
              <Suspense fallback={<ChartLoading />}>
                <RoasChart />
              </Suspense>
            </div>

            {/* Campaigns Table */}
            <div>
              <Suspense fallback={<TableLoading />}>
                <CampaignsTable />
              </Suspense>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 h-screen sticky top-0">
          <ChatSidebar currentClientId={MOCK_CLIENT_ID} />
        </div>
      </div>
    </div>
  )
} 