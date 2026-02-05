import { useState, useRef, useEffect } from 'react'
import { Button } from '@misabio/core-ui'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch response')
      }

      const data = await response.json()

      // Handle the response format based on what backend returns
      // Currently backend returns { results: ... }
      // We might need to adjust this depending on exact backend response shape
      const answer = typeof data.results === 'string'
        ? data.results
        : JSON.stringify(data.results, null, 2)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer || 'No results found.',
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request.',
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto border rounded-lg bg-background shadow-sm overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
            <Bot className="h-12 w-12 mb-2" />
            <p>Start a conversation with your documents</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>

            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
            <div className="flex gap-3 justify-start">
                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
            </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/10">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 min-h-[40px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
