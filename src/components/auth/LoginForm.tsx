'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

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
        setMessage('Check your email for the magic link!')
        setIsError(false)
        setEmail('')
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Entrar no Dashboard de Tráfego
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Enviando...' : 'Enviar Magic Link'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${
            isError
              ? 'bg-error-50 text-error-700 border border-error-200'
              : 'bg-success-50 text-success-700 border border-success-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
} 