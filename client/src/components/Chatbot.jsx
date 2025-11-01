import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react'
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
      const response = await api.post('/api/chatbot/message', {
        message: userMessage.text
      })

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response || 'Xin lỗi, tôi không hiểu câu hỏi của bạn.',
        sender: 'bot',
        timestamp: new Date()
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
    <div className="flex flex-col h-[calc(100vh-180px)] sm:h-[calc(100vh-200px)] max-h-[800px] min-h-[500px] sm:min-h-[600px] max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Trợ lý làm đẹp SkinVox</h2>
          <p className="text-sm text-white/90">Tư vấn makeup & skincare 24/7</p>
        </div>
        <Sparkles className="w-5 h-5 ml-auto text-white/80" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                message.sender === 'bot'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {message.sender === 'bot' ? (
                <Bot className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-lg px-4 py-2 ${
                message.sender === 'bot'
                  ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <span className="text-xs opacity-60 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="px-4 py-2 bg-gray-100 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Câu hỏi nhanh:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(question)
                  inputRef.current?.focus()
                }}
                className="text-xs px-3 py-1 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-pink-300 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="border-t border-gray-200 p-4 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Gửi</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
