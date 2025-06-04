import React, { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardKPIs, getRoasTrendData, getCampaignsData } from '@/lib/dashboard/actions'
import KpiCard from '@/components/dashboard/KpiCard'
import RoasTrendChart from '@/components/dashboard/RoasTrendChart'
import CampaignsDataTable from '@/components/campaigns/CampaignsDataTable'
import ChatSidebar from '@/components/chat/ChatSidebar'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Settings,
  LogOut,
  BarChart3,
  Users,
  Bell,
  MessageSquare,
  Home,
  PieChart,
  Calendar,
  Zap,
  Search
} from 'lucide-react'

// Mock Client ID para demonstração
const MOCK_CLIENT_ID = '550e8400-e29b-41d4-a716-446655440000'

// Componente de Loading para KPIs
function KpiLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-2xl animate-pulse w-24"></div>
            <div className="h-8 bg-gray-200 rounded-2xl animate-pulse w-32"></div>
            <div className="h-3 bg-gray-200 rounded-2xl animate-pulse w-20"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Componente de Loading para Gráfico
function ChartLoading() {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 rounded-2xl animate-pulse w-48"></div>
        <div 
          className="bg-gray-200 rounded-2xl animate-pulse"
          style={{ aspectRatio: 16/9 }}
        ></div>
      </div>
    </div>
  )
}

// Sidebar de Navegação
function NavigationSidebar() {
  const menuItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: BarChart3, label: 'Analytics' },
    { icon: PieChart, label: 'Campanhas' },
    { icon: Target, label: 'Conversões' },
    { icon: Calendar, label: 'Agendamentos' },
    { icon: Users, label: 'Clientes' },
  ]

  return (
    <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Traffic</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors ${
                item.active 
                  ? 'bg-violet-50 text-violet-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-100">
        <a
          href="#"
          className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm">Configurações</span>
        </a>
      </div>
    </div>
  )
}

// Header Principal
async function MainHeader() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar campanhas, métricas..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 ml-8">
            <button className="p-3 bg-gray-50 rounded-2xl text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {user?.email?.split('@')[0]}
              </span>
            </div>

            <form action="/auth/sign-out" method="post">
              <button
                type="submit"
                className="p-3 bg-red-50 rounded-2xl text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hero Banner
function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="mb-2">
          <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
            DASHBOARD TRÁFEGO
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Otimize Suas Campanhas com
        </h1>
        <h1 className="text-3xl font-bold mb-4">
          Analytics Profissionais
        </h1>
        <button className="bg-white text-violet-600 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
          <span>Ver Relatórios</span>
          <TrendingUp className="h-4 w-4" />
        </button>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
    </div>
  )
}

// Statistics Card - Clean design
function StatsCard() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Estatísticas</h3>
        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <PieChart className="h-5 w-5 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-6">
        {/* User Avatar and Progress */}
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-xs font-bold text-white">32%</span>
            </div>
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Boa Tarde João! 🔥</h4>
          <p className="text-sm text-gray-500">Continue otimizando para atingir suas metas!</p>
        </div>

        {/* Simple Chart */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">1-10 Dez</span>
            <span className="text-gray-500">11-20 Dez</span>
            <span className="text-gray-500">21-30 Dez</span>
          </div>
          <div className="flex items-end space-x-2 h-16">
            <div className="bg-gray-200 rounded-lg w-full h-8"></div>
            <div className="bg-violet-500 rounded-lg w-full h-12"></div>
            <div className="bg-violet-600 rounded-lg w-full h-16"></div>
            <div className="bg-gray-200 rounded-lg w-full h-6"></div>
          </div>
        </div>

        {/* Mentors Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Seus Especialistas</h4>
            <button className="text-violet-600 text-sm font-medium">Ver Todos</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Pedro Santos', role: 'Marketing Digital', online: true },
              { name: 'Ana Silva', role: 'Growth Hacker', online: false },
              { name: 'Carlos Lima', role: 'Analytics', online: true },
            ].map((mentor, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {mentor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  {mentor.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{mentor.name}</p>
                  <p className="text-xs text-gray-500">{mentor.role}</p>
                </div>
                <button className="text-violet-600 text-sm font-medium">Seguir</button>
              </div>
            ))}
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
        icon={<DollarSign className="h-6 w-6" />}
      />
      <KpiCard
        title="ROAS Médio"
        value={kpis.averageRoas}
        previousValue={kpis.averageRoasPrevious}
        unit="x"
        icon={<Target className="h-6 w-6" />}
      />
      <KpiCard
        title="Conversões"
        value={kpis.totalConversions}
        previousValue={kpis.totalConversionsPrevious}
        icon={<TrendingUp className="h-6 w-6" />}
      />
      <KpiCard
        title="Impressões"
        value={kpis.totalImpressions}
        previousValue={kpis.totalImpressionsPrevious}
        icon={<Eye className="h-6 w-6" />}
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
    <div className="min-h-screen bg-gray-50">
      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <NavigationSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <MainHeader />
          
          {/* Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-full mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Dashboard Content */}
                <div className="xl:col-span-3 space-y-8">
                  {/* Hero Banner */}
                  <HeroBanner />

                  {/* Quick Stats - Progress Circles */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">2/8 watched</span>
                      </div>
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <div className="w-full h-full bg-violet-100 rounded-2xl flex items-center justify-center">
                          <Eye className="h-6 w-6 text-violet-600" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">Meta Ads</h3>
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">3/8 watched</span>
                      </div>
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <div className="w-full h-full bg-pink-100 rounded-2xl flex items-center justify-center">
                          <Target className="h-6 w-6 text-pink-600" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">Google Ads</h3>
                    </div>
                    
                    <div className="text-center">
                      <div className="mb-3">
                        <span className="text-sm text-gray-500">6/12 watched</span>
                      </div>
                      <div className="w-16 h-16 mx-auto mb-3 relative">
                        <div className="w-full h-full bg-blue-100 rounded-2xl flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                    </div>
                  </div>

                  {/* KPIs Section */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Continue Analisando</h2>
                      <button className="text-violet-600 text-sm font-medium">Ver todos</button>
                    </div>
                    <Suspense fallback={<KpiLoading />}>
                      <DashboardKPIs />
                    </Suspense>
                  </div>

                  {/* Charts */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Suas Campanhas</h2>
                      <button className="text-violet-600 text-sm font-medium">Ver todas</button>
                    </div>
                    <Suspense fallback={<ChartLoading />}>
                      <RoasChart />
                    </Suspense>
                  </div>
                </div>

                {/* Stats Sidebar */}
                <div className="xl:col-span-1">
                  <StatsCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button for Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105">
          <MessageSquare className="h-7 w-7" />
        </button>
      </div>
    </div>
  )
} 