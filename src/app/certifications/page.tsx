import type { Metadata } from 'next'
import { getCertifications, type Certification } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Certifications - Shahid M Syed',
  description: 'SAP certifications, AI credentials, third-party courses, and OpenSAP achievements in one recruiter-friendly index.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/certifications' },
}

type CertificationsPageProps = {
  searchParams?: {
    track?: string
  }
}

const TRACKS = [
  { slug: 'all', label: 'All credentials' },
  { slug: 'ai', label: 'AI-focused' },
  { slug: 'sap', label: 'SAP certifications' },
  { slug: 'opensap', label: 'OpenSAP' },
  { slug: 'third-party', label: 'Third-party' },
] as const

function getTrackCount(track: string, certifications: Certification[]): number {
  return certifications.filter((certification) => matchesTrack(certification, track)).length
}

function matchesTrack(certification: Certification, track: string): boolean {
  switch (track) {
    case 'ai':
      return certification.is_ai
    case 'sap':
      return certification.issuer === 'SAP'
    case 'opensap':
      return certification.issuer === 'OpenSAP'
    case 'third-party':
      return !['SAP', 'OpenSAP'].includes(certification.issuer)
    default:
      return true
  }
}

function getTrackDescription(track: string): string {
  switch (track) {
    case 'ai':
      return 'Hands-on AI, ML, LLM, and cloud-native learning that supports the SAP + AI positioning.'
    case 'sap':
      return 'Official SAP credentials covering core platform, architecture, and product capabilities.'
    case 'opensap':
      return 'OpenSAP confirmations and records of achievement across BTP, ABAP, HANA, Fiori, AI, and related topics.'
    case 'third-party':
      return 'External courses and credentials from non-SAP providers, including broader AI and engineering learning.'
    default:
      return 'A complete view of formal certifications, third-party learning, and OpenSAP achievements.'
  }
}

function getTrackHref(track: string): string {
  return track === 'all' ? '/certifications' : `/certifications?track=${track}`
}

function metaParts(certification: Certification): string[] {
  return [
    certification.issuer,
    certification.category ?? '',
    certification.platform ?? '',
    certification.year ?? '',
    certification.code ?? '',
  ].filter(Boolean)
}

export default async function CertificationsPage({ searchParams }: CertificationsPageProps) {
  const all = await getCertifications()
  const activeTrack = TRACKS.some((track) => track.slug === searchParams?.track) ? searchParams?.track ?? 'all' : 'all'
  const visible = all.filter((certification) => matchesTrack(certification, activeTrack))

  return (
    <main className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-purple">Credentials</p>
        <div className="max-w-3xl space-y-3">
          <h1 className="text-4xl font-display font-bold tracking-tight text-text">Certifications</h1>
          <p className="text-lg text-text-subtle">
            {all.length} credentials across SAP, AI, engineering, and continuous learning.
          </p>
          <p className="text-sm text-text-subtle">{getTrackDescription(activeTrack)}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {TRACKS.map((track) => (
            <a
              key={track.slug}
              href={getTrackHref(track.slug)}
              className={`tag-sm ${activeTrack === track.slug ? '!bg-accent-purple/20 !text-accent-purple !border-accent-purple/30' : 'hover:bg-surface-200'}`}
            >
              {track.label} ({getTrackCount(track.slug, all)})
            </a>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {visible.map((certification) => {
          const cardClass =
            certification.issuer === 'SAP'
              ? 'border-accent-blue/20 bg-accent-blue/[0.02] hover:border-accent-blue/40'
              : certification.is_ai
                ? 'border-accent-purple/20 bg-accent-purple/[0.02] hover:border-accent-purple/40'
                : 'border-surface-300/40 bg-surface-100/50 hover:border-surface-400'

          return (
            <article key={certification.id} className={`rounded-2xl border p-5 transition-all duration-300 ${cardClass}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {certification.credential_url ? (
                    <a
                      href={certification.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm font-semibold leading-snug text-text hover:text-accent-blue transition-colors"
                    >
                      {certification.title}
                    </a>
                  ) : (
                    <span className="block text-sm font-semibold leading-snug text-text">{certification.title}</span>
                  )}
                  <p className="mt-2 text-xs text-text-subtle">{metaParts(certification).join(' · ')}</p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  {certification.is_ai && <span className="tag-sm !bg-accent-purple/15 !text-accent-purple !border-accent-purple/20">AI</span>}
                  {certification.issuer === 'SAP' && <span className="tag-sm !bg-accent-blue/15 !text-accent-blue !border-accent-blue/20">SAP</span>}
                  {certification.issuer === 'OpenSAP' && <span className="tag-sm !bg-surface-200 !text-text-subtle">OpenSAP</span>}
                </div>
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
