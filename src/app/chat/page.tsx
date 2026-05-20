'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  "What is Shahid's S/4HANA experience?",
  'What AI work has Shahid done?',
  'What makes Shahid different from other SAP architects?',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({
            ...message,
            content: message.content.replace(/\n\n_via (Claude|GPT-4o mini)_$/, ''),
          })),
        }),
      })

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}))
        setMessages([...nextMessages, { role: 'assistant', content: data.content ?? data.error ?? 'Something went wrong.' }])
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      setLoading(false)
      setMessages([...nextMessages, { role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages([...nextMessages, { role: 'assistant', content: accumulated }])
      }
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send(input)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 text-sm sticky top-0 bg-white z-20">
        <a href="/" className="text-gray-400 hover:text-gray-700">Home</a>
        <a href="/resume" className="text-blue-600 hover:text-blue-800">SAP Profile -&gt;</a>
        <a href="/ai" className="text-purple-600 hover:text-purple-800">AI Portfolio -&gt;</a>
        <span className="ml-auto text-gray-900 font-medium">Resume Chat</span>
      </header>

      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Talking to</p>
          <p className="text-base font-bold text-gray-900">Shahid M Syed - SAP Development Architect + AI Engineer</p>
          <p className="text-sm text-gray-500 mt-0.5">19 years SAP | S/4HANA | ABAP on HANA | BTP | MCP | RAG | Agents</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">
                  Ask anything about Shahid&apos;s experience, skills, or paste a job description to get a match score.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Try asking</p>
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => send(starter)}
                    className="block w-full text-left text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-4 py-2.5 transition-colors"
                  >
                    {starter}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setInput('Paste job description here and I will give you a match score...')
                    inputRef.current?.focus()
                    inputRef.current?.select()
                  }}
                  className="block w-full text-left text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg px-4 py-2.5 transition-colors"
                >
                  Paste a job description - get match score + strengths and gaps
                </button>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about experience, skills, or paste a job description..."
              rows={2}
              className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors"
            >
              Send
            </button>
          </div>
          <p className="mt-3 text-xs text-gray-400 text-center">
            Built with Claude API, RAG, pgvector, and Next.js as part of the{' '}
            <a href="/ai" className="text-purple-500 hover:underline">AI Career Hub</a>
          </p>
        </div>
      </div>
    </div>
  )
}
