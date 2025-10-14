import { useState, useEffect, useRef } from 'react'
import { X, Bug, Trash2, Download, ArrowDown } from 'lucide-react'

export default function DebugConsole() {
  const [isOpen, setIsOpen] = useState(false)
  const [logs, setLogs] = useState(() => {
    // Load logs from localStorage on init
    const savedLogs = localStorage.getItem('debugLogs')
    return savedLogs ? JSON.parse(savedLogs) : []
  })
  const logsEndRef = useRef(null)

  useEffect(() => {
    // Override console methods to capture logs
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn
    
    const addLog = (level, ...args) => {
      const newLog = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        message: args.join(' '),
        fullTimestamp: new Date().toISOString(),
        level: level
      }
      
      setLogs(prev => {
        const updatedLogs = [...prev, newLog]
        // Save to localStorage
        localStorage.setItem('debugLogs', JSON.stringify(updatedLogs))
        return updatedLogs
      })
    }

    console.log = (...args) => {
      originalLog(...args)
      addLog('log', ...args)
    }

    console.error = (...args) => {
      originalError(...args)
      addLog('error', ...args)
    }

    console.warn = (...args) => {
      originalWarn(...args)
      addLog('warn', ...args)
    }

    // Global error handler
    const handleError = (event) => {
      addLog('error', `Global Error: ${event.error?.message || event.message}`)
    }

    const handleUnhandledRejection = (event) => {
      addLog('error', `Unhandled Promise Rejection: ${event.reason}`)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [logs])

  const clearLogs = () => {
    setLogs([])
    localStorage.removeItem('debugLogs')
  }

  const downloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.fullTimestamp}] ${log.message}`
    ).join('\n')
    
    const blob = new Blob([logText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredLogs = logs.filter(log => 
    log.message.includes('Debug') || 
    log.message.includes('Error') || 
    log.message.includes('❌') || 
    log.message.includes('✅') || 
    log.message.includes('🔍') || 
    log.message.includes('🚀') || 
    log.message.includes('📊') || 
    log.message.includes('🌐') || 
    log.message.includes('📡') || 
    log.message.includes('🔐') || 
    log.message.includes('👤') || 
    log.message.includes('🔑') || 
    log.message.includes('🎫') || 
    log.message.includes('🔗') || 
    log.message.includes('🛣️') || 
    log.message.includes('📤') || 
    log.message.includes('📥') || 
    log.message.includes('🔒') || 
    log.message.includes('⚠️') || 
    log.message.includes('👑') || 
    log.message.includes('💾') ||
    log.message.includes('Global Error') ||
    log.message.includes('Unhandled Promise Rejection') ||
    log.level === 'error' ||
    log.level === 'warn'
  )

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
        title="Open Debug Console"
      >
        <Bug className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-gray-900 text-white rounded-lg shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Bug className="w-4 h-4" />
          <span className="font-semibold">Debug Console</span>
          <span className="text-xs bg-red-600 px-2 py-1 rounded-full">
            {filteredLogs.length}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={downloadLogs}
            className="text-gray-400 hover:text-white p-1"
            title="Download logs"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearLogs}
            className="text-gray-400 hover:text-white p-1"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="text-gray-400 hover:text-white p-1"
            title="Scroll to bottom"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white p-1"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {filteredLogs.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-4">
            No debug logs yet. Try logging in to see debug information.
          </div>
        ) : (
          filteredLogs.map(log => {
            const getLogColor = (level) => {
              switch (level) {
                case 'error': return 'text-red-400'
                case 'warn': return 'text-yellow-400'
                default: return 'text-white'
              }
            }
            
            return (
              <div key={log.id} className="text-xs">
                <span className="text-gray-400">[{log.timestamp}]</span>
                <span className={`ml-2 ${getLogColor(log.level)}`}>
                  {log.message}
                </span>
              </div>
            )
          })
        )}
        <div ref={logsEndRef} />
      </div>
    </div>
  )
}
