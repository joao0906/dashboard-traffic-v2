import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MetaConnectButton from './meta/MetaConnectButton'

async function getFirstClientId() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: clients } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .limit(1)

  return clients?.[0]?.id || null
}

export default async function ConnectorsPage() {
  const clientId = await getFirstClientId()

  if (!clientId) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Conectores de API</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Você precisa criar um cliente primeiro para conectar plataformas de anúncios.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Conectores de API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Meta Ads */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Meta Ads</h3>
              <p className="text-sm text-gray-600">Facebook & Instagram</p>
            </div>
          </div>
          <Suspense fallback={<div>Carregando...</div>}>
            <MetaConnectButton clientId={clientId} />
          </Suspense>
        </div>

        {/* Google Ads - Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm opacity-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Google Ads</h3>
              <p className="text-sm text-gray-600">Em breve</p>
            </div>
          </div>
          <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Em desenvolvimento
          </button>
        </div>

        {/* TikTok Ads - Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm opacity-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.912-1.15-1.967-1.15-2.736V1.6h-3.301v14.828c0 .878-.71 1.588-1.588 1.588-.878 0-1.588-.71-1.588-1.588 0-.878.71-1.588 1.588-1.588.211 0 .414.041.598.117V11.83c-.184-.023-.371-.035-.561-.035-2.45 0-4.437 1.987-4.437 4.437S9.85 20.669 12.3 20.669s4.437-1.987 4.437-4.437V8.796c.924.454 1.973.728 3.083.728v-3.301c-.68 0-1.325-.15-1.899-.426-.36-.173-.693-.387-.986-.651-.235-.212-.446-.446-.614-.707z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">TikTok Ads</h3>
              <p className="text-sm text-gray-600">Em breve</p>
            </div>
          </div>
          <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Em desenvolvimento
          </button>
        </div>

        {/* Google Analytics 4 - Placeholder */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm opacity-50">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.84 2.9981L21.0017 1.1598c-.3668-.3668-.8734-.5734-1.396-.5734s-1.0292.2066-1.396.5734L8.396 10.9981c-.1467.1467-.24.3334-.2733.5334L7.2 15.9981c-.0533.3334.0267.6801.2267.9334.1733.2134.4267.3334.6933.3334.08 0 .16-.0067.24-.02l4.4667-.9267c.2-.0333.3867-.1266.5334-.2733l9.8133-9.8133c.7667-.7667.7667-2.0267 0-2.7934zM10.2 14.4648l.4-.08-.32-.32-.08.4zm1.6-1.6l-2.1333 2.1333.7333.7333 2.1333-2.1333-.7333-.7333zm8.24-8.24l-7.0667 7.0667.7333.7333 7.0667-7.0667-.7333-.7333z"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Google Analytics 4</h3>
              <p className="text-sm text-gray-600">Em breve</p>
            </div>
          </div>
          <button className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md cursor-not-allowed">
            Em desenvolvimento
          </button>
        </div>
      </div>

      {/* Status Messages */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Status dos Conectores</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Meta Ads</h3>
          <p className="text-blue-800 text-sm">
            ✅ Implementado - OAuth2, coleta de métricas via API e cron job automático
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
          <h3 className="font-medium text-gray-900 mb-2">Outras Plataformas</h3>
          <p className="text-gray-700 text-sm">
            🚧 Em desenvolvimento - Google Ads, TikTok Ads e Google Analytics 4
          </p>
        </div>
      </div>
    </div>
  )
} 