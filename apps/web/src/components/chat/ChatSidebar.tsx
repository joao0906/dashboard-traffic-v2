'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'
import { processUserChatMessage } from '@/app/actions/chatActions'
import { Send, MessageCircle, Loader2, Plus, Bot, User, Sparkles } from 'lucide-react'
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

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [newMessageContent])

  // Iniciar nova conversa
  const startNewConversation = () => {
    setCurrentSessionId(uuidv4())
    setMessages([])
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 w-80">
      {/* Header do Chat */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Assistente IA
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Marketing Digital
              </p>
            </div>
          </div>
          <button
            onClick={startNewConversation}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Nova conversa"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Online</span>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2 text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Carregando conversa...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Bem-vindo ao Chat IA!
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Faça perguntas sobre suas campanhas, ROAS, otimizações e muito mais.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setNewMessageContent('Como está o desempenho das minhas campanhas?')}
                className="block w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  📊 Como está o desempenho das minhas campanhas?
                </span>
              </button>
              <button
                onClick={() => setNewMessageContent('Como posso melhorar meu ROAS?')}
                className="block w-full text-left p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  🎯 Como posso melhorar meu ROAS?
                </span>
              </button>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary-600 ml-2' 
                      : 'bg-gray-600 dark:bg-gray-700 mr-2'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  {/* Mensagem */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' 
                        ? 'text-primary-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Indicador de digitação */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Nova Mensagem */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre marketing..."
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                       transition-colors duration-200 resize-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessageContent.trim()}
            className="flex-shrink-0 w-11 h-11 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                     text-white rounded-xl flex items-center justify-center
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                     disabled:cursor-not-allowed transition-all duration-200"
            title="Enviar mensagem (Enter)"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Dica */}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Pressione Enter para enviar, Shift+Enter para nova linha
        </p>
      </div>
    </div>
  )
} 