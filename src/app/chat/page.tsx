'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const STARTERS = [
  "What is Shahid's S/4HANA experience?",
  "What AI work has Shahid done?",
  "What makes Shahid different from other SAP architects?",
]

const ACCESS_PASSWORD = 'CHAT_PASSWORD_REMOVED'

export default function ChatPage() {
  const [unlocked, setUnlocked] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [passwordError, setPasswordError] = useState(false)

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function unlock() {
    if (passwordInput === ACCESS_PASSWORD) {
      setUnlocked(true)
      setPasswordError(false)
    } else {
      setPasswordError(true)
    }
  }

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.content }])
    } catch {
      setMessages([...next, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Resume Chat</p>
            <h1 className="text-xl font-bold text-gray-900">Shahid M Syed</h1>
            <p className="text-sm text-gray-500 mt-1">SAP Development Architect + AI Engineer</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => { setPasswordInput(e.target.value); setPasswordError(false) }}
              onKeyDown={(e) => e.key === 'Enter' && unlock()}
              placeholder="Enter access code"
              className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${passwordError ? 'border-red-300' : 'border-gray-200'}`}
              autoFocus
            />
            {passwordError && <p className="text-xs text-red-500">Incorrect access code.</p>}
            <button
              onClick={unlock}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors"
            >
              Enter
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">
            Contact <a href="mailto:shahid.la@gmail.com" className="hover:underline">shahid.la@gmail.com</a> for access
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-3 flex items-center gap-4 text-sm sticky top-0 bg-white z-20">
        <a href="/" className="text-gray-400 hover:text-gray-700">Home</a>
        <a href="/resume" className="text-blue-600 hover:text-blue-800">SAP Profile →</a>
        <a href="/ai" className="text-purple-600 hover:text-purple-800">AI Portfolio →</a>
        <span className="ml-auto text-gray-900 font-medium">Resume Chat</span>
      </header>

      {/* Identity bar */}
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Talking to</p>
          <p className="text-base font-bold text-gray-900">Shahid M Syed — SAP Development Architect + AI Engineer</p>
          <p className="text-sm text-gray-500 mt-0.5">19 years SAP · S/4HANA · ABAP on HANA · BTP · MCP · RAG · Agents</p>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {messages.length === 0 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm">Ask anything about Shahid&apos;s experience, skills, or paste a job description to get a match score.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Try asking</p>
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg px-4 py-2.5 transition-colors"
                  >
                    {s}
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
                  📋 Paste a job description — get match score + strengths &amp; gaps
                </button>
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                {m.content}
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

      {/* Input */}
      <div className="border-t border-gray-200 px-6 py-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
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
            Built with Claude API · RAG · pgvector · Next.js — part of the{' '}
            <a href="/ai" className="text-purple-500 hover:underline">AI Career Hub</a>
          </p>
        </div>
      </div>

    </div>
  )
}
