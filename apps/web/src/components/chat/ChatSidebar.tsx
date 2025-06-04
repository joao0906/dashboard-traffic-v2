'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { processUserChatMessage } from '@/app/actions/chatActions'
import { Send, MessageCircle, Loader2 } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

// Criar cliente Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Tipo para as mensagens do chat
interface ChatMessage {
  id: string
  client_id: string
  session_id: string
  user_id: string | null
  role: 'user' | 'assistant' | 'system'
  content: string
  metadata?: Record<string, unknown>
  created_at: string
}

interface ChatSidebarProps {
  currentClientId: string
}

export default function ChatSidebar({ currentClientId }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessageContent, setNewMessageContent] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Gerar novo session ID ao montar o componente
  useEffect(() => {
    setCurrentSessionId(uuidv4())
  }, [currentClientId])

  // Carregar mensagens históricas
  useEffect(() => {
    async function loadChatHistory() {
      if (!currentClientId) return

      setIsLoadingHistory(true)
      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('client_id', currentClientId)
          .order('created_at', { ascending: true })
          .limit(50) // Últimas 50 mensagens

        if (error) {
          console.error('Erro ao carregar histórico do chat:', error)
          return
        }

        setMessages(data || [])
      } catch (error) {
        console.error('Erro ao carregar histórico:', error)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    loadChatHistory()
  }, [currentClientId])

  // Supabase Realtime - escutar novas mensagens
  useEffect(() => {
    if (!currentClientId) return

    const channel = supabase
      .channel(`chat:${currentClientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `client_id=eq.${currentClientId}`,
        },
        (payload: { new: ChatMessage }) => {
          const newMessage = payload.new
          
          // Evitar duplicatas - não adicionar se já existe
          setMessages(current => {
            const exists = current.some(msg => msg.id === newMessage.id)
            if (exists) return current
            return [...current, newMessage]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentClientId])

  // Scroll automático quando há novas mensagens
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Enviar mensagem
  const handleSendMessage = async () => {
    if (!newMessageContent.trim() || isLoading) return

    const messageContent = newMessageContent.trim()
    setNewMessageContent('')
    setIsLoading(true)

    try {
      // Inserir mensagem do usuário
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          client_id: currentClientId,
          session_id: currentSessionId,
          role: 'user',
          content: messageContent,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single()

      if (insertError) {
        console.error('Erro ao inserir mensagem:', insertError)
        setNewMessageContent(messageContent) // Restaurar conteúdo em caso de erro
        return
      }

      // Preparar histórico para contexto da IA
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))

      // Chamar Server Action para processar mensagem com IA
      await processUserChatMessage({
        userMessageContent: messageContent,
        clientId: currentClientId,
        sessionId: currentSessionId,
        chatHistory
      })

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setNewMessageContent(messageContent) // Restaurar conteúdo em caso de erro
    } finally {
      setIsLoading(false)
    }
  }

  // Formatar data/hora
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [newMessageContent])

  // Iniciar nova conversa
  const startNewConversation = () => {
    setCurrentSessionId(uuidv4())
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 w-80">
      {/* Header do Chat */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              IA Assistant
            </h3>
          </div>
          <button
            onClick={startNewConversation}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Nova conversa
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-500">Carregando histórico...</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Inicie uma conversa com o assistente de IA
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3/4 rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'assistant'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === 'user'
                      ? 'text-blue-100'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatTime(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Indicador de carregamento quando IA está processando */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 max-w-3/4">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  IA está pensando...
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <textarea
            ref={textareaRef}
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[40px] max-h-32"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessageContent.trim() || isLoading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </div>
    </div>
  )
} 