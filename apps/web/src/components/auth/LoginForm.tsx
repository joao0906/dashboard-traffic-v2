'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setIsError(false)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
      })

      if (error) {
        setMessage(error.message)
        setIsError(true)
      } else {
        setMessage('Link mágico enviado! Verifique sua caixa de entrada e spam.')
        setIsError(false)
        setEmail('')
      }
    } catch (error) {
      setMessage('Erro inesperado. Tente novamente.')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Mail className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Dashboard Traffic
          </h1>
          <p className="text-gray-300 text-lg">
            Gerencie suas campanhas de tráfego pago
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">
            Fazer Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-3">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-200"
              >
                Endereço de Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-white/20 rounded-2xl 
                           bg-white/10 backdrop-blur-sm text-white
                           placeholder-gray-300
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-300
                           disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-300" />
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       disabled:from-gray-600 disabled:to-gray-600
                       text-white font-semibold py-4 px-6 rounded-2xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent
                       disabled:cursor-not-allowed transition-all duration-300
                       flex items-center justify-center space-x-3 text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Mail className="h-6 w-6" />
                  <span>Enviar Link Mágico</span>
                </>
              )}
            </button>
          </form>

          {/* Mensagem de Feedback */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-2xl border flex items-start space-x-3 ${
                isError
                  ? 'bg-red-500/20 text-red-200 border-red-400/30 backdrop-blur-sm'
                  : 'bg-green-500/20 text-green-200 border-green-400/30 backdrop-blur-sm'
              }`}
            >
              {isError ? (
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Informação adicional */}
          <div className="mt-8 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
            <p className="text-xs text-gray-300 text-center leading-relaxed">
              Enviamos um link seguro para seu email. Clique no link para acessar o dashboard.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Dashboard Traffic v2 © 2024
          </p>
        </div>
      </div>
    </div>
  )
} 