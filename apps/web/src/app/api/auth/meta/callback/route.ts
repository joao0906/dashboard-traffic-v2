import { NextRequest, NextResponse } from 'next/server'
import { 
  exchangeCodeForToken, 
  exchangeForLongLivedToken, 
  getMetaUser, 
  getMetaAdAccounts, 
  saveMetaToken 
} from '@/lib/meta/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Verificar se há erro na resposta do Meta
    if (error) {
      console.error('Meta OAuth Error:', error)
      return NextResponse.redirect(
        new URL('/dash/connectors?error=meta_auth_denied', request.url)
      )
    }

    // Verificar se code e state estão presentes
    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/dash/connectors?error=meta_missing_params', request.url)
      )
    }

    // Extrair clientId do state (formato: clientId_timestamp_random)
    const [clientId] = state.split('_')
    if (!clientId) {
      return NextResponse.redirect(
        new URL('/dash/connectors?error=meta_invalid_state', request.url)
      )
    }

    // Passo 1: Trocar code por access token de curta duração
    const shortTokenData = await exchangeCodeForToken(code)
    
    // Passo 2: Trocar por token de longa duração
    const longTokenData = await exchangeForLongLivedToken(shortTokenData.access_token)
    
    // Passo 3: Buscar informações do usuário Meta
    const metaUser = await getMetaUser(longTokenData.access_token)
    
    // Passo 4: Buscar contas de anúncio
    const adAccounts = await getMetaAdAccounts(longTokenData.access_token)
    
    // Selecionar primeira conta ativa ou a primeira disponível
    const activeAccount = adAccounts.find(acc => acc.account_status === 1) || adAccounts[0]
    
    if (!activeAccount) {
      return NextResponse.redirect(
        new URL('/dash/connectors?error=meta_no_ad_accounts', request.url)
      )
    }

    // Passo 5: Calcular data de expiração (tokens Meta de longa duração duram ~60 dias)
    const expiresAt = new Date()
    expiresAt.setSeconds(expiresAt.getSeconds() + longTokenData.expires_in)

    // Passo 6: Salvar token no banco de dados
    await saveMetaToken({
      clientId,
      accessToken: longTokenData.access_token,
      expiresAt,
      adAccountId: activeAccount.id,
      userIdMeta: metaUser.id
    })

    // Redirecionar para página de sucesso
    return NextResponse.redirect(
      new URL('/dash/connectors?status=meta_success', request.url)
    )

  } catch (error) {
    console.error('Meta OAuth Callback Error:', error)
    return NextResponse.redirect(
      new URL('/dash/connectors?error=meta_callback_failed', request.url)
    )
  }
} 