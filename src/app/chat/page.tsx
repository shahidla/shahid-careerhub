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
    <div className="flex flex-col min-h-[calc(100vh-49px)]">
      <header className="border-b border-surface-300/30 px-6 py-3 flex items-center gap-4 text-sm sticky top-[49px] bg-surface/80 backdrop-blur-xl z-20">
        <a href="/" className="text-text-subtle hover:text-text-muted transition-colors">Home</a>
        <a href="/resume" className="text-accent-blue hover:text-accent-blue/80 transition-colors">SAP Profile {'->'}</a>
        <a href="/ai" className="text-accent-purple hover:text-accent-purple/80 transition-colors">AI Portfolio {'->'}</a>
        <span className="ml-auto text-text font-medium">Resume Chat</span>
      </header>

      <div className="border-b border-surface-300/20 px-6 py-4 bg-surface-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-1">Talking to</p>
          <p className="text-base font-bold text-text">Shahid M Syed · SAP Development Architect + AI Engineer</p>
          <p className="text-sm text-text-subtle mt-0.5">19 years SAP · S/4HANA · ABAP on HANA · BTP · MCP · RAG · Agents</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-text-subtle text-sm">
                  Ask anything about Shahid&apos;s experience, skills, or paste a job description to get a match score.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest">Try asking</p>
                {STARTERS.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => send(starter)}
                    className="block w-full text-left text-sm text-accent-blue bg-accent-blue/5 hover:bg-accent-blue/10 border border-accent-blue/20 rounded-lg px-4 py-2.5 transition-colors"
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
                  className="block w-full text-left text-sm text-accent-purple bg-accent-purple/5 hover:bg-accent-purple/10 border border-accent-purple/20 rounded-lg px-4 py-2.5 transition-colors"
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
                    ? 'bg-accent-blue text-white rounded-br-sm shadow-md shadow-accent-blue/10'
                    : 'bg-surface-100 border border-surface-300/40 text-text-muted rounded-bl-sm'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-100 border border-surface-300/40 rounded-2xl rounded-bl-sm px-4 py-3">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-surface-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-surface-300/30 px-6 py-4 bg-surface-50 mt-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about experience, skills, or paste a job description..."
              rows={2}
              className="flex-1 resize-none bg-surface-100 border border-surface-300/50 rounded-xl px-4 py-3 text-sm text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-accent-purple focus:border-transparent"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="shrink-0 bg-accent-blue hover:bg-accent-blue/80 disabled:bg-surface-300 disabled:text-text-subtle text-white text-sm font-medium px-5 py-3 rounded-xl transition-all duration-200"
            >
              Send
            </button>
          </div>
          <p className="mt-3 text-xs text-text-subtle text-center">
            Built with Claude API, RAG, pgvector, and Next.js as part of the{' '}
            <a href="/ai" className="text-accent-purple hover:underline">AI Career Hub</a>
          </p>
        </div>
      </div>
    </div>
  )
}
