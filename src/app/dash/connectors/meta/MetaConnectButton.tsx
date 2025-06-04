'use client'

import { useState, useEffect } from 'react'
import { getMetaToken } from '@/lib/meta/actions'
import { Button } from '@/components/ui/button' 
import { Facebook } from 'lucide-react'

interface MetaConnectButtonProps {
  clientId: string
}

export default function MetaConnectButton({ clientId }: MetaConnectButtonProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConnection()
  }, [clientId])

  const checkConnection = async () => {
    try {
      setIsLoading(true)
      const token = await getMetaToken(clientId)
      setIsConnected(!!token && token.is_active)
    } catch (error) {
      console.error('Error checking Meta connection:', error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnect = () => {
    // Gerar state seguro para OAuth
    const state = `${clientId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Salvar state no localStorage temporariamente
    localStorage.setItem('meta_oauth_state', JSON.stringify({
      state,
      clientId,
      timestamp: Date.now()
    }))

    // Construir URL de autorização Meta
    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth')
    authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_META_APP_ID!)
    authUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/meta/callback`)
    authUrl.searchParams.set('scope', 'ads_read,ads_management,business_management')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('response_type', 'code')

    // Redirecionar para Meta OAuth
    window.location.href = authUrl.toString()
  }

  const handleDisconnect = async () => {
    // TODO: Implementar desconexão (desativar token)
    console.log('Disconnect Meta Ads')
  }

  if (isLoading) {
    return (
      <Button disabled variant="outline" className="w-full">
        <Facebook className="mr-2 h-4 w-4" />
        Verificando conexão...
      </Button>
    )
  }

  if (isConnected) {
    return (
      <div className="space-y-2">
        <Button variant="outline" className="w-full" disabled>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Meta Ads Conectado
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={handleDisconnect}
        >
          Desconectar
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={handleConnect} className="w-full bg-blue-600 hover:bg-blue-700">
      <Facebook className="mr-2 h-4 w-4" />
      Conectar com Meta Ads
    </Button>
  )
} 