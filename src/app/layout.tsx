import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const BASE_URL = 'https://shahid-careerhub.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Shahid M Syed - SAP & AI Engineer',
    template: '%s - Shahid M Syed',
  },
  description:
    'SAP Development Architect with 19 years experience, now building AI systems - RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  authors: [{ name: 'Shahid M Syed' }],
  creator: 'Shahid M Syed',
  openGraph: {
    type: 'website',
    siteName: 'Shahid M Syed',
    url: BASE_URL,
    title: 'Shahid M Syed - SAP & AI Engineer',
    description:
      'SAP Development Architect with 19 years experience, now building AI systems - RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  },
  twitter: {
    card: 'summary',
    title: 'Shahid M Syed - SAP & AI Engineer',
    description:
      'SAP Development Architect with 19 years experience, now building AI systems - RAG, agents, embeddings, MCP, and LLM integration on BTP.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
  verification: { google: 'iVerc_ENyHTDAKIwC6iLnxyv653f4nlsN-cCRuoKtoU' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-surface text-text min-h-screen flex flex-col noise-bg">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent-purple focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <div id="main" className="flex-1">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  )
}
