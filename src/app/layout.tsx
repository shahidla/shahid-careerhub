import type { Metadata } from 'next'
import './globals.css'

const BASE_URL = 'https://shahid-careerhub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Shahid M Syed — SAP & AI Engineer',
    template: '%s — Shahid M Syed',
  },
  description:
    'SAP Development Architect with 19 years experience, now building AI systems — RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  authors: [{ name: 'Shahid M Syed' }],
  creator: 'Shahid M Syed',
  openGraph: {
    type: 'website',
    siteName: 'Shahid M Syed',
    url: BASE_URL,
    title: 'Shahid M Syed — SAP & AI Engineer',
    description:
      'SAP Development Architect with 19 years experience, now building AI systems — RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  },
  twitter: {
    card: 'summary',
    title: 'Shahid M Syed — SAP & AI Engineer',
    description:
      'SAP Development Architect with 19 years experience, now building AI systems — RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  verification: { google: 'iVerc_ENyHTDAKIwC6iLnxyv653f4nlsN-cCRuoKtoU' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
