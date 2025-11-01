import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import api from '../services/api'

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi là trợ lý làm đẹp của SkinVox. Tôi có thể giúp bạn gì về makeup, skincare, sản phẩm làm đẹp?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Prepare conversation history (last 6 messages for context)
      const historyForAI = messages.slice(-6).map(msg => ({
        sender: msg.sender,
        text: msg.text
      }))

      const response = await api.post('/api/chatbot/message', {
        message: userMessage.text,
        conversationHistory: historyForAI
      })

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
        sender: 'bot',
        timestamp: new Date(),
        provider: response.data.provider || 'fallback'
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chatbot error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const quickQuestions = [
    'Sản phẩm makeup nào phù hợp với da dầu?',
    'Cách chăm sóc da hàng ngày?',
    'Làm thế nào để chọn màu son phù hợp?',
    'Sản phẩm nào giúp che khuyết điểm tốt?'
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] max-h-[800px] min-h-[500px] sm:min-h-[600px] max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 text-white p-5 sm:p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="bg-white/25 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-white/20">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-1 tracking-tight">Trợ lý làm đẹp SkinVox</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-white/95 font-medium">Tư vấn chuyên nghiệp 24/7</p>
              <div className="flex items-center space-x-1 bg-white/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 text-white" />
                <span className="text-xs font-semibold">Online</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        <style>{`
          /* Custom scrollbar */
          .messages-container::-webkit-scrollbar {
            width: 6px;
          }
          .messages-container::-webkit-scrollbar-track {
            background: transparent;
          }
          .messages-container::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          .messages-container::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 group ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                  message.sender === 'bot'
                    ? 'bg-gradient-to-br from-rose-500 to-purple-600 text-white ring-2 ring-rose-200'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-2 ring-blue-200'
                }`}
              >
                {message.sender === 'bot' ? (
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="flex flex-col max-w-[75%] sm:max-w-[80%]">
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md transition-all duration-200 ${
                    message.sender === 'bot'
                      ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                      : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
                    {message.text}
                  </p>
                </div>
                <span className={`text-xs text-gray-500 mt-1.5 px-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg ring-2 ring-rose-200">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-md border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 sm:px-6 py-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Câu hỏi nhanh</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question)
                  inputRef.current?.focus()
                }}
                className="text-xs sm:text-sm px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:border-rose-300 hover:text-rose-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 sm:p-6 bg-white">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="w-full px-4 sm:px-5 py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder:text-gray-400 font-medium"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 sm:px-7 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white rounded-xl hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Gửi</span>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3 text-center">
          💡 Nhấn <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border border-gray-300 font-mono">Enter</kbd> để gửi
        </p>
      </form>
    </div>
  )
}
